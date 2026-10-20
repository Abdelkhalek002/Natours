import mongoose from 'mongoose';
import config from './config/index.js';

// HANDLING EXCEPTIONS
process.on('uncaughtException', (err) => {
  console.log('UNHANDLED EXCEPTION! ⚠️, Shutting down...');
  console.log(err);
  process.exit(1);
});

import app from './app.js';

async function connectDB() {
  if (!config.db.uri) {
    console.error(
      'Error: No database connection string found in .env (specify DATABASE or DATABASE_LOCAL)',
    );
    process.exit(1);
  }
  await mongoose.connect(config.db.uri);
  const dbType = config.db.isAtlas ? 'Cloud (Atlas)' : 'Local';
  console.log(`${dbType} Database connection successful!`);
}
connectDB();

const port = config.port;

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
