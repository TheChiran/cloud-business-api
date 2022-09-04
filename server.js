const dotenv = require('dotenv');
const { connectDB } = require('./configs/setupDB');

// Handle uncaught error exceptions
process.on('uncaughtException', (error) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(error.name, error.message);
  process.exit(1);
});

dotenv.config({
  path: './config.env',
});

const app = require('./app/app');

connectDB();
// SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}...`);
});

/**
 * @Title {To handle unhandled rejections}
 */
process.on('unhandledRejection', (error) => {
  console.log(error.name, error.message);
  console.log('UNHANDLED REJECTION! Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
