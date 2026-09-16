const request = require('supertest');
const app = require('../server');

describe('Auth & API Health Endpoints', () => {
  it('GET /api/health should return online status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('online');
  });

  it('POST /api/auth/signup validation should reject missing fields', async () => {
    const res = await request(app).post('/api/auth/signup').send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });
});
