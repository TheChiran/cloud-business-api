const request = require('supertest');
const app = require('./../../app/app');
const httpStatus = require('http-status');
const setupTestDB = require('../../configs/setupTestDB');
const { faker } = require('@faker-js/faker');
const {
  categoryOne,
  categoryTwo,
  categoryThree,
  categoryFour,
  insertCategoryList,
} = require('./../fixtures/productCategory.fixture');

const defaultURL = `/api/v1/category`;
const testingUrlList = {
  url: `${defaultURL}`,
};
const mongoose = require('mongoose');

setupTestDB();

describe('Product category test cases', () => {
  describe('Method: POST /api/v1/category', () => {
    let newCategory;

    beforeEach(() => {
      newCategory = {
        name: faker.name.fullName(),
      };
    });

    it('should return status 201 and successfully category if requested data is ok', async () => {
      let expectedData = {
        status: 'success',
        data: expect.anything(),
      };

      const response = await request(app)
        .post(testingUrlList.url)
        .send(newCategory)
        .expect(httpStatus.CREATED);

      expect(response.body).toMatchObject(expectedData);
    });

    it('should return status value of success, code 201 and isActive true', async () => {
      newCategory.isActive = true;

      const response = await request(app)
        .post(testingUrlList.url)
        .send(newCategory)
        .expect(httpStatus.CREATED);

      expect(response.body.data.doc.isActive).toEqual(true);
    });

    it('should return status 400 if name is empty', async () => {
      newCategory.name = '';

      const response = await request(app)
        .post(testingUrlList.url)
        .send(newCategory)
        .expect(httpStatus.UNPROCESSABLE_ENTITY);

      expect(response.body).toMatchObject({
        status: 'error',
        errors: expect.anything(),
      });
    });
  });

  describe('Method: GET /api/v1/category', () => {
    it('should return status code 200 and status value success', async () => {
      await insertCategoryList([
        categoryOne,
        categoryTwo,
        categoryThree,
        categoryFour,
      ]);

      const res = await request(app)
        .get(testingUrlList.url)
        .expect(httpStatus.OK);

      expect(res.body).toMatchObject({
        status: 'success',
        data: {
          docs: expect.anything(),
        },
      });
    });

    it('should return status code 200 with value of success and match object of category one', async () => {
      await insertCategoryList([
        categoryOne,
        categoryTwo,
        categoryThree,
        categoryFour,
      ]);

      const res = await request(app)
        .get(`${testingUrlList.url}/${categoryOne._id}`)
        .expect(httpStatus.OK);

      expect(res.body).toMatchObject({
        status: 'success',
        data: {
          data: expect.anything(),
        },
      });
    });

    it('should return status code 400 ', async () => {
      await insertCategoryList([
        categoryOne,
        categoryTwo,
        categoryThree,
        categoryFour,
      ]);

      const res = await request(app).get(
        `${testingUrlList.url}/${mongoose.Types.ObjectId()}}`
      );

      if (process.env === 'development') {
        expect(res.status).toEqual(httpStatus.INTERNAL_SERVER_ERROR);
      } else if (process.env === 'production') {
        expect(res.status).toEqual(httpStatus.BAD_REQUEST);
      }
    });
  });

  describe('Method: DELETE /api/v1/category/:id', () => {
    it('should return status 204 if id exists', async () => {
      await insertCategoryList([
        categoryOne,
        categoryTwo,
        categoryThree,
        categoryFour,
      ]);

      await request(app)
        .delete(`${testingUrlList.url}/${categoryOne._id}`)
        .expect(httpStatus.NO_CONTENT);

      const categoryList = await request(app).get(`${testingUrlList.url}`);
      expect(categoryList.body.results).toBe(3);
    });

    it('should return status 404 if id does not exists', async () => {
      await insertCategoryList([
        categoryOne,
        categoryTwo,
        categoryThree,
        categoryFour,
      ]);

      await request(app)
        .delete(`${testingUrlList.url}/${mongoose.Types.ObjectId()}`)
        .expect(httpStatus.NOT_FOUND);
    });

    it('should return status 400 if id is not valid mongoose object id', async () => {
      await insertCategoryList([
        categoryOne,
        categoryTwo,
        categoryThree,
        categoryFour,
      ]);

      const res = await request(app).delete(`${testingUrlList.url}/123`);

      if (process.env === 'development') {
        expect(res.status).toEqual(httpStatus.INTERNAL_SERVER_ERROR);
      } else if (process.env === 'production') {
        expect(res.status).toEqual(httpStatus.BAD_REQUEST);
      }
    });
  });
});
