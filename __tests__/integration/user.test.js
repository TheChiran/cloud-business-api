const request = require('supertest');
const app = require('./../../app/app');
const httpStatus = require('http-status');
const setupTestDB = require('../../configs/setupTestDB');
const { faker } = require('@faker-js/faker');

const defaultURL = `/api/v1/users`;
const testingUrlList = {
  signUp: `${defaultURL}/signup`,
};

setupTestDB();

describe('User authentication / authorization test cases', () => {
  describe('POST /api/v1/users/signup', () => {
    let newUser;

    beforeEach(() => {
      newUser = {
        name: faker.name.fullName(),
        email: faker.internet.email(),
        password: 'abcdTest1234',
        passwordConfirm: 'abcdTest1234',
      };
    });
    it('should return status 201 and successfully register user if requested data is ok', async () => {
      const response = await request(app)
        .post(testingUrlList.signUp)
        .send(newUser)
        .expect(httpStatus.CREATED);

      expect(response.body.status).toEqual('success');
      expect(response.body.token).not.toBe(undefined);
      expect(Object.keys(response.body.data).length).not.toBe(0);
    });

    it('should return status error and status code 422 if email is empty', async () => {
      newUser.email = '';

      const res = await request(app)
        .post(testingUrlList.signUp)
        .send(newUser)
        .expect(httpStatus.UNPROCESSABLE_ENTITY);

      expect(res.body.status).toEqual('error');
      expect(res.body.errors.length).toEqual(1);
    });

    it('should return status error and status code 422 if name is empty', async () => {
      newUser.name = '';

      const res = await request(app)
        .post(testingUrlList.signUp)
        .send(newUser)
        .expect(httpStatus.UNPROCESSABLE_ENTITY);

      expect(res.body.status).toEqual('error');
      expect(res.body.errors.length).toEqual(2);
    });

    it('should return status error and status code 422 if password is empty', async () => {
      newUser.password = '';

      const res = await request(app)
        .post(testingUrlList.signUp)
        .send(newUser)
        .expect(httpStatus.UNPROCESSABLE_ENTITY);

      expect(res.body.status).toEqual('error');
      expect(res.body.errors.length).toEqual(3);
    });

    it('should return status error and status code 422 if passwordConfirm is empty', async () => {
      newUser.passwordConfirm = '';

      const res = await request(app)
        .post(testingUrlList.signUp)
        .send(newUser)
        .expect(httpStatus.UNPROCESSABLE_ENTITY);

      expect(res.body.status).toEqual('error');
      expect(res.body.errors.length).toEqual(2);
    });

    it('should return status error and status code 422 if full body is empty with error length of 4', async () => {
      newUser = {
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
      };

      const res = await request(app)
        .post(testingUrlList.signUp)
        .send(newUser)
        .expect(httpStatus.UNPROCESSABLE_ENTITY);

      expect(res.body.status).toEqual('error');
      expect(res.body.errors.length).toEqual(6);
    });
  });
});
