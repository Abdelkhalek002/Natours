import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import mongoose from 'mongoose';
import fs from 'fs';
import Tour from '../../src/models/tourModel.js';
import User from '../../src/models/userModel.js';
import Review from '../../src/models/reviewModel.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB = process.env.DATABASE
  ? process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
  : process.env.DATABASE_LOCAL;

const connectDB = async () => {
  try {
    if (!DB) {
      console.error(
        'No database connection string found in .env (specify DATABASE or DATABASE_LOCAL)',
      );
      process.exit(1);
    }
    await mongoose.connect(DB);
    console.log('Database connection successful!');
  } catch (error) {
    console.error('Connection to database failed:', error);
    process.exit(1);
  }
};

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const egyTours = JSON.parse(
  fs.readFileSync(`${__dirname}/EGY-tours.json`, 'utf-8'),
);
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'),
);

const importData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();

    await Tour.create(egyTours);

    const preparedUsers = users.map((u) => ({
      ...u,
      _id: new mongoose.Types.ObjectId(u._id),
    }));
    await User.collection.insertMany(preparedUsers);

    await Review.create(reviews);
    console.log('Data successfully loaded!');
    process.exit(0);
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data successfully deleted!');
    process.exit(0);
  } catch (error) {
    console.error('Error deleting data:', error);
    process.exit(1);
  }
};

const run = async () => {
  await connectDB();
  if (process.argv[2] === '--import') {
    await importData();
  } else if (process.argv[2] === '--delete') {
    await deleteData();
  } else {
    console.log('Please specify --import or --delete');
    process.exit(0);
  }
};

run();
