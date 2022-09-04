const request = require('supertest');
const app = require('./../../app/app');
const httpStatus = require('http-status');

describe('Check if app is running correctly', () => {
  it(`should return status to success and status code to ${httpStatus.OK} and data.message to "Welcome"`, async () => {
    const res = await request(app).get('/api/v1/test');

    expect(res.statusCode).toEqual(httpStatus.OK);
    expect(res.body.status).toEqual('success');
    expect(Object.keys(res.body.data).length).toEqual(1);
    expect(res.body.data.message).toEqual('Welcome');
  });
});
