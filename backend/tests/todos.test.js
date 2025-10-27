describe('Todos API', () => {
  let server;
  let authToken;
  let userId;

  beforeAll(async () => {
    server = app.listen(4002);
    
    // Create a test user and get token
    const signupResponse = await request(app)
      .post('/api/signup')
      .send({
        username: 'todouser',
        email: 'todo@example.com',
        password: 'Todo123!'
      });
    
    authToken = signupResponse.body.token;
    userId = signupResponse.body.user.id;
  });

  afterAll((done) => {
    server.close(done);
  });

  describe('POST /api/todos', () => {
    it('should create a new todo with valid data', async () => {
      const response = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Todo',
          description: 'Test Description',
          priority: 'medium'
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Test Todo');
      expect(response.body.completed).toBe(false);
      expect(response.body.userId).toBe(userId);
    });

    it('should reject todo creation without auth token', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({
          title: 'Test Todo'
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject todo with invalid priority', async () => {
      const response = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Todo',
          priority: 'invalid'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/todos', () => {
    beforeAll(async () => {
      // Create some test todos
      await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Todo 1', priority: 'high' });
      
      await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Todo 2', priority: 'low' });
    });

    it('should get all todos for authenticated user', async () => {
      const response = await request(app)
        .get('/api/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('title');
    });

    it('should filter todos by completion status', async () => {
      const response = await request(app)
        .get('/api/todos?completed=false')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach(todo => {
        expect(todo.completed).toBe(false);
      });
    });

    it('should reject request without auth token', async () => {
      await request(app)
        .get('/api/todos')
        .expect(401);
    });
  });

  describe('PUT /api/todos/:id', () => {
    let todoId;

    beforeAll(async () => {
      const response = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Todo to Update' });
      
      todoId = response.body.id;
    });

    it('should update todo successfully', async () => {
      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Todo',
          completed: true
        })
        .expect(200);

      expect(response.body.title).toBe('Updated Todo');
      expect(response.body.completed).toBe(true);
    });

    it('should reject update of non-existent todo', async () => {
      await request(app)
        .put('/api/todos/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated' })
        .expect(404);
    });
  });

  describe('DELETE /api/todos/:id', () => {
    let todoId;

    beforeAll(async () => {
      const response = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Todo to Delete' });
      
      todoId = response.body.id;
    });

    it('should delete todo successfully', async () => {
      await request(app)
        .delete(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify todo is deleted
      await request(app)
        .get(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject deletion without auth', async () => {
      await request(app)
        .delete(`/api/todos/${todoId}`)
        .expect(401);
    });
  });
});