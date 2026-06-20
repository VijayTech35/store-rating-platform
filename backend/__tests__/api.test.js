const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/database');

let adminToken, userToken, ownerToken;

beforeAll(() => {
  db.prepare('DELETE FROM ratings').run();
  db.prepare('DELETE FROM stores').run();
  db.prepare('DELETE FROM users').run();
});

afterAll(() => {
  db.close();
});

describe('Auth', () => {
  test('POST /api/auth/signup - creates user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'Test User Twenty Char', email: 'test@example.com', password: 'Testpass1!', address: '123 Test St' });
    expect(res.status).toBe(201);
    expect(res.body.user).toHaveProperty('id');
    userToken = res.body.token;
  });

  test('POST /api/auth/signup - rejects duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'Another User Twenty Char', email: 'test@example.com', password: 'Testpass1!', address: '456 Test Ave' });
    expect(res.status).toBe(409);
  });

  test('POST /api/auth/login - valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'Testpass1!' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('POST /api/auth/login - invalid password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrongpass' });
    expect(res.status).toBe(401);
  });
});

describe('Health', () => {
  test('GET /api/health', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('Protected Routes', () => {
  test('GET /api/admin/dashboard - no token', async () => {
    const res = await request(app).get('/api/admin/dashboard');
    expect(res.status).toBe(401);
  });

  test('GET /api/admin/dashboard - non-admin token', async () => {
    const res = await request(app).get('/api/admin/dashboard').set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(403);
  });
});

describe('Admin CRUD', () => {
  let storeId, ownerId;

  test('creates admin and owner users', async () => {
    await request(app).post('/api/auth/signup').send({ name: 'Admin User Twenty Char', email: 'admin@test.com', password: 'Adminpass1!', address: '1 Admin Lane', role: 'admin' });
    const login = await request(app).post('/api/auth/login').send({ email: 'admin@test.com', password: 'Adminpass1!' });
    adminToken = login.body.token;

    await request(app).post('/api/auth/signup').send({ name: 'Store Owner Twenty Char', email: 'owner@test.com', password: 'Ownerpass1!', address: '2 Owner Lane', role: 'store_owner' });
    const ownerLogin = await request(app).post('/api/auth/login').send({ email: 'owner@test.com', password: 'Ownerpass1!' });
    ownerId = ownerLogin.body.user.id;
    ownerToken = ownerLogin.body.token;
  });

  test('GET /api/admin/dashboard', async () => {
    const res = await request(app).get('/api/admin/dashboard').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('totalUsers');
  });

  test('GET /api/admin/users', async () => {
    const res = await request(app).get('/api/admin/users').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.users.length).toBeGreaterThan(0);
  });

  test('POST /api/admin/stores', async () => {
    const res = await request(app).post('/api/admin/stores').set('Authorization', `Bearer ${adminToken}`).send({ name: 'Test Store', email: 'store@test.com', address: '1 Store St', owner_id: ownerId });
    expect(res.status).toBe(201);
    storeId = res.body.store.id;
  });

  test('PUT /api/admin/stores/:id', async () => {
    const res = await request(app).put(`/api/admin/stores/${storeId}`).set('Authorization', `Bearer ${adminToken}`).send({ name: 'Updated Store' });
    expect(res.status).toBe(200);
    expect(res.body.store.name).toBe('Updated Store');
  });

  test('DELETE /api/admin/stores/:id', async () => {
    const res = await request(app).delete(`/api/admin/stores/${storeId}`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
  });
});

describe('Profile', () => {
  test('PUT /api/auth/profile', async () => {
    const res = await request(app).put('/api/auth/profile').set('Authorization', `Bearer ${userToken}`).send({ name: 'Updated Name Twenty Char' });
    expect(res.status).toBe(200);
    expect(res.body.user.name).toBe('Updated Name Twenty Char');
  });
});
