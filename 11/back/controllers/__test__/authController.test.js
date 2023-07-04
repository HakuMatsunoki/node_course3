const request = require('supertest');

const app = require('../../index');

describe('POST /auth/login', () => {
  beforeAll(() => {
    console.log('before all');
  });

  beforeEach(() => {
    console.log('before each');
  });

  afterEach(() => {
    console.log('after each');
  });

  afterAll(() => {
    console.log('after all');
  });

  it('should return unauth error', async () => {
    const testData = {
      email: 'mikeqweqwe@example.com',
    };

    const res = await request(app).post('/auth/login').send(testData);

    expect(res.statusCode).toBe(401);
  });

  it('should return unauth error', async () => {
    const testData = {
      email: 'mikeqweqwe@example.com',
      password: 'Pass&1234',
    };

    const res = await request(app).post('/auth/login').send(testData);

    expect(res.statusCode).toBe(401);
  });

  it('should return token and user', async () => {
    const testData = {
      email: 'mike@example.com',
      password: 'Pass&1234',
    };

    const res = await request(app).post('/auth/login').send(testData);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
        user: expect.any(Object),
      })
    );
  });
});
