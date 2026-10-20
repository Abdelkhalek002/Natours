import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is loaded from project root
dotenv.config({ path: path.join(__dirname, '../../.env') });

const config = Object.freeze({
  env: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  port: Number(process.env.PORT) || 8000,

  db: {
    uri: process.env.DATABASE
      ? process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
      : process.env.DATABASE_LOCAL,
    isAtlas: Boolean(process.env.DATABASE),
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '90d',
    cookieExpiresInDays: Number(process.env.JWT_COOKIE_EXPIRES_IN) || 90,
  },

  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
  },

  email: {
    from: process.env.EMAIL_FROM || 'Natours Admin <admin@natours.io>',
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
    sendgridUsername: process.env.SENDGRID_USERNAME,
    sendgridPassword: process.env.SENDGRID_PASSWORD,
  },
});

export default config;
