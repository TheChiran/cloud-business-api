const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({
  path: './config.env',
});

/**
 * @Title {Mongodb database connection}
 * */
let DB;
if (process.env.NODE_ENV === 'development') {
  DB = process.env.DATABASE_LOCAL;
} else if (process.env.NODE_ENV === 'production') {
  DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
  );
}

// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD
// );

// Async await based mongoose connect
const connectDB = async () => {
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    console.log('DB connection successful!');
  } catch (err) {
    console.log('Failed to connect to MongoDB', err);
  }
};
//  connectDB();
// Promise based mongoose connect
// mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//   })
//   .then(() => console.log('DB connection successful!'));

module.exports = {
  connectDB,
};
