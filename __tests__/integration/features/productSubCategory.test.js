const request = require('supertest');
const app = require('../../../app/app');
const httpStatus = require('http-status');
const setupTestDB = require('../../../configs/setupTestDB');
const { faker } = require('@faker-js/faker');
const {
  categoryOne,
  insertCategoryList,
} = require('../../fixtures/productCategory.fixture');
const {
  subCategoryOne,
  subCategoryTwo,
  subCategoryThree,
  subCategoryFour,
  insertSubCategoryList,
} = require('../../fixtures/productSubCategory.fixtures');

const defaultURL = `/api/v1/sub-category`;
const testingUrlList = {
  url: `${defaultURL}`,
};

const mongoose = require('mongoose');
const {
  adminAccessToken,
  userOneAccessToken,
} = require('../../fixtures/token.fixture');
const { insertUsers, admin, userOne } = require('../../fixtures/user.fixture');

setupTestDB();

describe('Product sub category test cases', () => {
  beforeEach(async () => {
    await insertUsers([admin, userOne]);
  });

  describe('Method: POST /api/v1/sub-category', () => {
    it('should return status 201 and successfully category if requested data is ok', async () => {
      let expectedData = {
        status: 'success',
        data: expect.anything(),
      };

      const response = await request(app)
        .post(testingUrlList.url)
        .set('Authorization', `Bearer ${adminAccessToken().token}`)
        .send(subCategoryOne)
        .expect(httpStatus.CREATED);

      expect(response.body).toMatchObject(expectedData);
      expect(response.body.data.doc.category).toEqual(expect.anything());
    });

    it('should return status 401 with message unauthorized if access token is not present', async () => {
      await request(app)
        .post(testingUrlList.url)
        .send(subCategoryOne)
        .expect(httpStatus.UNAUTHORIZED);
    });

    it('should return status 401 with message unauthorized if user role is not admin', async () => {
      await request(app)
        .post(testingUrlList.url)
        .set('Authorization', `Bearer ${userOneAccessToken().token}`)
        .send(subCategoryOne)
        .expect(httpStatus.FORBIDDEN);
    });

    it('should return status value of success, code 201 and isActive false', async () => {
      subCategoryOne.isActive = false;

      const response = await request(app)
        .post(testingUrlList.url)
        .set('Authorization', `Bearer ${adminAccessToken().token}`)
        .send(subCategoryOne)
        .expect(httpStatus.CREATED);

      expect(response.body.data.doc.isActive).toEqual(false);
    });

    it('should return status 400 if name is empty', async () => {
      let subCategory = { ...subCategoryOne };
      subCategory.name = '';

      const response = await request(app)
        .post(testingUrlList.url)
        .send(subCategory)
        .set('Authorization', `Bearer ${adminAccessToken().token}`)
        .expect(httpStatus.UNPROCESSABLE_ENTITY);

      expect(response.body).toMatchObject({
        status: 'error',
        errors: expect.anything(),
      });
    });
  });

  describe('Method: GET /api/v1/sub-category', () => {
    it('should return status code 200 and status value success', async () => {
      await insertSubCategoryList([
        subCategoryOne,
        subCategoryTwo,
        subCategoryThree,
        subCategoryFour,
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

    it('should return status code 200 with value of success', async () => {
      await insertSubCategoryList([
        subCategoryOne,
        subCategoryTwo,
        subCategoryThree,
        subCategoryFour,
      ]);

      const res = await request(app)
        .get(`${testingUrlList.url}/${subCategoryOne._id}`)
        .expect(httpStatus.OK);

      expect(res.body).toMatchObject({
        status: 'success',
        data: {
          data: expect.anything(),
        },
      });
    });

    it('should return status code 400 ', async () => {
      await insertSubCategoryList([
        subCategoryOne,
        subCategoryTwo,
        subCategoryThree,
        subCategoryFour,
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

  describe('Method: DELETE /api/v1/sub-category/:id', () => {
    it('should return status 204 if id exists', async () => {
      await insertSubCategoryList([
        subCategoryOne,
        subCategoryTwo,
        subCategoryThree,
        subCategoryFour,
      ]);

      await request(app)
        .delete(`${testingUrlList.url}/${subCategoryOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken().token}`)
        .expect(httpStatus.NO_CONTENT);

      const subCategoryList = await request(app).get(`${testingUrlList.url}`);
      expect(subCategoryList.body.results).toBe(3);
    });

    it('should return status 403 access token is from role user', async () => {
      await insertSubCategoryList([
        subCategoryOne,
        subCategoryTwo,
        subCategoryThree,
        subCategoryFour,
      ]);

      await request(app)
        .delete(`${testingUrlList.url}/${subCategoryOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken().token}`)
        .expect(httpStatus.FORBIDDEN);
    });

    it('Should return status 403(UNAUTHORIZED) if bearer token is not provided', async () => {
      await insertSubCategoryList([
        subCategoryOne,
        subCategoryTwo,
        subCategoryThree,
        subCategoryFour,
      ]);

      await request(app)
        .delete(`${testingUrlList.url}/${subCategoryOne._id}`)
        .expect(httpStatus.UNAUTHORIZED);
    });

    it('should return status 404 if id does not exists', async () => {
      await insertSubCategoryList([
        subCategoryOne,
        subCategoryTwo,
        subCategoryThree,
        subCategoryFour,
      ]);

      await request(app)
        .delete(`${testingUrlList.url}/${mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${adminAccessToken().token}`)
        .expect(httpStatus.NOT_FOUND);
    });

    it('should return status 400 if id is not valid mongoose object id', async () => {
      await insertSubCategoryList([
        subCategoryOne,
        subCategoryTwo,
        subCategoryThree,
        subCategoryFour,
      ]);

      const res = await request(app)
        .delete(`${testingUrlList.url}/123`)
        .set('Authorization', `Bearer ${adminAccessToken().token}`);

      if (process.env === 'development') {
        expect(res.status).toEqual(httpStatus.INTERNAL_SERVER_ERROR);
      } else if (process.env === 'production') {
        expect(res.status).toEqual(httpStatus.BAD_REQUEST);
      }
    });
  });

  describe('METHOD: PATCH /api/v1/sub-category/:id', () => {
    it('should return status success and status code 200 if id is ok and data is updated', async () => {
      await insertSubCategoryList([
        subCategoryOne,
        subCategoryTwo,
        subCategoryThree,
        subCategoryFour,
      ]);

      const res = await request(app)
        .patch(`${testingUrlList.url}/${subCategoryOne._id}`)
        .send({ isActive: false })
        .set('Authorization', `Bearer ${adminAccessToken().token}`)
        .expect(httpStatus.OK);

      expect(res.body.status).toEqual('success');
      expect(res.body.data.doc.isActive).toEqual(false);
    });

    it('should return status 403 access token is from role user', async () => {
      await insertSubCategoryList([
        subCategoryOne,
        subCategoryTwo,
        subCategoryThree,
        subCategoryFour,
      ]);

      await request(app)
        .patch(`${testingUrlList.url}/${subCategoryOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken().token}`)
        .expect(httpStatus.FORBIDDEN);
    });

    it('should return status success and status code 200 if id is ok and data is updated', async () => {
      await insertSubCategoryList([
        subCategoryOne,
        subCategoryTwo,
        subCategoryThree,
        subCategoryFour,
      ]);

      await request(app)
        .patch(`${testingUrlList.url}/${subCategoryOne._id}`)
        .expect(httpStatus.UNAUTHORIZED);
    });
  });
});
