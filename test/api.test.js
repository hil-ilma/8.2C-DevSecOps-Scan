const request = require('supertest');
const app     = require('../app');

describe('GET /', () => {
  it('responds with 200 OK', done => {
    request(app).get('/').expect(200, done);
  });
});
