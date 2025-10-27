const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');

describe('Authentication API', () => {
  let server;

  beforeAll(() => {
    server = app.listen(4001);
  });

  afterAll((done) => {
    server.close(done);
  });

  describe('POST /api/signup', () => {
    const validUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Test123!'
    };

    it('should create a new user with valid data', async () => {
      const response = await request(app)
        .post('/api/signup')
        .send(validUser)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(validUser.email);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should reject signup with existing email', async () => {
      await request(app)
        .post('/api/signup')
        .send(validUser);

      const response = await request(app)
        .post('/api/signup')
        .send(validUser)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject signup with invalid email', async () => {
      const response = await request(app)
        .post('/api/signup')
        .send({ ...validUser, email: 'invalid-email' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject signup with weak password', async () => {
      const response = await request(app)
        .post('/api/signup')
        .send({ ...validUser, password: '123' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject signup with missing fields', async () => {
      const response = await request(app)
        .post('/api/signup')
        .send({ email: 'test@example.com' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/login', () => {
    const testUser = {
      username: 'loginuser',
      email: 'login@example.com',
      password: 'Login123!'
    };

    beforeAll(async () => {
      await request(app)
        .post('/api/signup')
        .send(testUser);
    });

    it('should login with correct credentials', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      
      const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET);
      expect(decoded).toHaveProperty('userId');
    });

    it('should reject login with incorrect password', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword123!'
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123!'
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject login with missing credentials', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({ email: testUser.email })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });
});