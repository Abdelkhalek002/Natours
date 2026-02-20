import dotenv from 'dotenv';
dotenv.config({ path: './config.env', debug: false });
import mongoose from 'mongoose';
import fs from 'fs';
import Tour from '../../models/tourModel.js';
import User from '../../models/userModel.js';
import Review from '../../models/reviewModel.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/*const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);*/

const DB = process.env.DATABASE_LOCAL;

(async function connectDB() {
  try {
    await mongoose.connect(DB);
    console.log('✅ Database connection successful!');
  } catch (error) {
    console.error('❌ Connection to database failed:', error);
  }
})();

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
//const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'),
);

const importData = async () => {
  try {
    await Tour.create(tours);
    //await User.create(users, { validateBeforeSave: false });
    //await Review.create(reviews);
    console.log('data successfully loaded!');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    //await User.deleteMany();
    //await Review.deleteMany();
    console.log('data successfully deleted!');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
