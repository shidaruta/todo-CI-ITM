const request = require('supertest');
const app = require('../app');
const db = require('../db');

jest.setTimeout(15000); // Increase timeout to 15 seconds

beforeAll(async () => {
  process.env.JWT_SECRET = 'test-secret-key-12345';
  await new Promise(resolve => setTimeout(resolve, 500));
});

afterAll(async () => {
  return new Promise((resolve) => {
    db.close(() => {
      resolve();
    });
  });
});

describe('Authentication API', () => {
  test('POST /api/signup should create a new user with valid data', async () => {
    const validUser = {
      username: 'testuser' + Date.now(),
      email: 'test' + Date.now() + '@example.com',
      password: 'SecurePass123!'
    };

    const response = await request(app)
      .post('/api/signup')
      .send(validUser)
      .expect(200);

    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user.username).toBe(validUser.username);
  });

  test('POST /api/signup should reject signup with existing email', async () => {
    const uniqueEmail = 'duplicate' + Date.now() + '@example.com';
    const user = {
      username: 'newuser' + Date.now(),
      email: uniqueEmail,
      password: 'SecurePass123!'
    };

    // Create first user
    await request(app).post('/api/signup').send(user);

    // Try to create another with same email
    const response = await request(app)
      .post('/api/signup')
      .send({
        username: 'different' + Date.now(),
        email: uniqueEmail,
        password: 'SecurePass123!'
      })
      .expect(400);

    expect(response.body).toHaveProperty('message');
  });

  test('POST /api/signup should reject signup with missing fields', async () => {
    const response = await request(app)
      .post('/api/signup')
      .send({ email: 'test@example.com' })
      .expect(400);

    expect(response.body).toHaveProperty('message');
  });

  test('POST /api/login should login with correct credentials', async () => {
    const testUser = {
      username: 'loginuser' + Date.now(),
      email: 'login' + Date.now() + '@example.com',
      password: 'SecurePass123!'
    };

    // Create user first
    await request(app).post('/api/signup').send(testUser);
    
    // Small delay to ensure user is written to DB
    await new Promise(resolve => setTimeout(resolve, 100));

    // Login
    const response = await request(app)
      .post('/api/login')
      .send({
        username: testUser.username,
        password: testUser.password
      })
      .expect(200);

    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
  });

  test('POST /api/login should reject login with incorrect password', async () => {
    const testUser = {
      username: 'wrongpass' + Date.now(),
      email: 'wrongpass' + Date.now() + '@example.com',
      password: 'SecurePass123!'
    };

    // Create user
    await request(app).post('/api/signup').send(testUser);
    
    await new Promise(resolve => setTimeout(resolve, 100));

    // Try with wrong password
    const response = await request(app)
      .post('/api/login')
      .send({
        username: testUser.username,
        password: 'WrongPassword123!'
      })
      .expect(400);

    expect(response.body).toHaveProperty('message');
  });

  test('POST /api/login should reject login with non-existent email', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({
        username: 'nonexistent',
        password: 'SecurePass123!'
      })
      .expect(400);

    expect(response.body).toHaveProperty('message');
  });

  test('POST /api/login should reject login with missing credentials', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ username: 'testuser' })
      .expect(400);

    expect(response.body).toHaveProperty('message');
  });
});