const request = require('supertest');
const app = require('../app');
const db = require('../db');

jest.setTimeout(15000);

let authToken;
let userId;

beforeAll(async () => {
  process.env.JWT_SECRET = 'test-secret-key-12345';
  await new Promise(resolve => setTimeout(resolve, 500));

  // Create a test user and get auth token
  const testUser = {
    username: 'taskuser' + Date.now(),
    email: 'task' + Date.now() + '@example.com',
    password: 'Task123!'
  };

  const signupResponse = await request(app)
    .post('/api/signup')
    .send(testUser);

  authToken = signupResponse.body.token;
  userId = signupResponse.body.user.id;
  
  console.log('Test user created with token:', !!authToken);
});

afterAll(async () => {
  return new Promise((resolve) => {
    db.close(() => {
      resolve();
    });
  });
});

describe('Tasks API', () => {
  describe('POST /api/tasks', () => {
    test('should create a new task with valid data', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ text: 'Test Task' })
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.text).toBe('Test Task');
    });

    test('should reject task creation without auth token', async () => {
      await request(app)
        .post('/api/tasks')
        .send({ text: 'Test Task' })
        .expect(401);
    });
  });

  describe('GET /api/tasks', () => {
    test('should get all tasks for authenticated user', async () => {
      // Create a task first
      await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ text: 'Task 1' });

      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    test('should reject request without auth token', async () => {
      await request(app)
        .get('/api/tasks')
        .expect(401);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    test('should update task successfully', async () => {
      // Create a task first
      const createResponse = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ text: 'Original Task' });

      const taskId = createResponse.body.id;

      // Update the task
      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ text: 'Updated Task' })
        .expect(200);

      expect(response.body.text).toBe('Updated Task');
    });

    test('should reject update of non-existent task', async () => {
      await request(app)
        .put('/api/tasks/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ text: 'Updated' })
        .expect(404);
    });
  });

  describe('POST /api/tasks/:id/toggle', () => {
    test('should toggle task completion', async () => {
      // Create a task first
      const createResponse = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ text: 'Toggle Task' });

      const taskId = createResponse.body.id;

      // Toggle the task
      const response = await request(app)
        .post(`/api/tasks/${taskId}/toggle`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(typeof response.body.completed).toBe('boolean');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    test('should delete task successfully', async () => {
      // Create a task first
      const createResponse = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ text: 'Delete Task' });

      const taskId = createResponse.body.id;

      // Delete the task
      await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify task is deleted
      await request(app)
        .get(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    test('should reject deletion without auth', async () => {
      await request(app)
        .delete('/api/tasks/1')
        .expect(401);
    });
  });
});