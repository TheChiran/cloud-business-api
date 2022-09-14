const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({
  path: './config.env',
});

const setupTestDB = () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_LOCAL_TEST, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
  });

  beforeEach(async () => {
    await Promise.all(
      Object.values(mongoose.connection.collections).map(async (collection) =>
        collection.deleteMany()
      )
    );
  });

  afterAll(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany();
    }
    await mongoose.disconnect();
  });
};

module.exports = setupTestDB;
