import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import mongoose from 'mongoose';

//HANDLING EXCEPTIONS
process.on('uncaughtException', (err) => {
  console.log('UNHANDLED EXECPTION! ⚠️, Shutting down...');
  //console.log(`Error: ${err.name}, Message:( ${err.message} )`);
  console.log(err);
  process.exit(1);
});

const { default: app } = await import('./app.js'); // es modules are hoisted (did this to solve .env load before app.js)
//import app from './app.js';

const db = process.env.DATABASE
  ? process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
  : process.env.DATABASE_LOCAL;

async function connectDB() {
  if (!db) {
    console.error(
      'Error: No database connection string found in .env (specify DATABASE or DATABASE_LOCAL)',
    );
    process.exit(1);
  }
  await mongoose.connect(db);
  const dbType = process.env.DATABASE ? 'Cloud (Atlas)' : 'Local';
  console.log(`${dbType} Database connection successful!`);
}
connectDB();

const port = process.env.PORT || 8000;

const server = app.listen(port, 'localhost', () => {
  console.log(`🚀 App is running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! ⚠️, Shutting down...');
  console.log(`Error: ${err.name}, Message:( ${err.message} )`);
  server.close(() => {
    process.exit(1);
  });
});
