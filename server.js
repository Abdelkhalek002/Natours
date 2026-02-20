import dotenv from 'dotenv';
dotenv.config({ path: './config.env', debug: false });

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

/*const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);*/

const db = process.env.DATABASE_LOCAL;

async function connectDB() {
  await mongoose.connect(db);
  console.log('✅ Local Database connection successful!');
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
