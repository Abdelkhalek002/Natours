import mongoose from 'mongoose';
import config from '../src/config/index.js';
import app from '../src/app.js';

let connectPromise = null;

/**
 * Vercel serverless entrypoint: reuse a single Mongoose connection across invocations.
 */
export default async function handler(req, res) {
  if (mongoose.connection.readyState !== 1) {
    if (!connectPromise) {
      connectPromise = mongoose.connect(config.db.uri).catch((err) => {
        connectPromise = null;
        throw err;
      });
    }
    await connectPromise;
  }

  return app(req, res);
}
