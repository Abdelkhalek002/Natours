# Natours

A full-stack tour booking platform built with Node.js, Express, MongoDB, and Pug.

This project includes:

- Server-rendered pages for browsing tours and managing user accounts
- REST API for tours, users, reviews, and bookings
- JWT authentication with role-based authorization
- Stripe checkout flow for bookings
- Image upload and processing for users/tours
- Security middleware for common web threats

## Tech Stack

- Backend: Node.js, Express
- Database: MongoDB + Mongoose
- Views: Pug templates
- Auth: JWT + HTTP-only cookies
- Payments: Stripe
- Media processing: Multer + Sharp
- Email: Nodemailer (SMTP / SendGrid style config)
- Frontend bundling: Parcel

## Project Structure

```text
Natours/
  controllers/        # Route handlers and business logic
  models/             # Mongoose models
  routes/             # API and view routes
  views/              # Pug templates
  public/             # Static assets (CSS/JS/images)
  utils/              # Helpers (errors, email, API features)
  dev-data/           # Seed/import data and template helpers
  app.js              # Express app config and middleware
  server.js           # App bootstrap and DB connection
  config.env          # Environment variables (local)
```

## Features

- Authentication:
  - Sign up, login, logout
  - Password reset via email
  - Update current password
- Authorization:
  - Roles: `user`, `guide`, `lead-guide`, `admin`
  - Route-level restrictions by role
- Tours:
  - CRUD operations
  - Geo queries (`tours-within`, distances)
  - Monthly plans/stats for privileged roles
- Reviews:
  - Authenticated users can create/manage reviews
  - Nested route support under tours
- Bookings:
  - Stripe checkout session creation
  - Booking persistence after successful payment redirect
- User account:
  - Update profile data
  - Update profile photo
  - View personal bookings
- Security:
  - `helmet`, `express-rate-limit`, `express-mongo-sanitize`, `hpp`

## Prerequisites

- Node.js 18+ (recommended for modern dependencies)
- MongoDB running locally (or adjust connection for hosted DB)
- Stripe account/keys for checkout
- SMTP provider (or SendGrid credentials) for emails

## Installation

```bash
npm install
```

## Environment Variables

Create `config.env` in the project root (or update existing one) with values similar to:

```env
NODE_ENV=development
PORT=8000

DATABASE_LOCAL=mongodb://127.0.0.1:27017/natours
# Optional hosted DB style variables used in commented code:
# DATABASE=your_connection_string_with_<PASSWORD>
# DATABASE_PASSWORD=your_password

JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

STRIPE_SECRET_KEY=sk_test_xxx

EMAIL_FROM=Your Name <noreply@example.com>
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USERNAME=your_smtp_username
EMAIL_PASSWORD=your_smtp_password

# Optional production-style mail provider variables:
SENDGRID_USERNAME=apikey
SENDGRID_PASSWORD=your_sendgrid_api_key
```

## Available Scripts

- `npm run start` - Start server with nodemon
- `npm run start:prod` - Start in production mode via `cross-env`
- `npm run watch:js` - Watch and bundle frontend JS with Parcel
- `npm run build:js` - Build frontend JS bundle for production

## Run the Project

1. Start MongoDB
2. Start the backend:

```bash
npm run start
```

3. In a second terminal (optional during development), watch frontend JS:

```bash
npm run watch:js
```

4. Open:

- App: `http://localhost:8000`
- API base: `http://localhost:8000/api/v1`

## API Overview

### Tours

- `GET /api/v1/tours`
- `GET /api/v1/tours/:id`
- `POST /api/v1/tours` (admin/lead-guide)
- `PATCH /api/v1/tours/:id` (admin/lead-guide)
- `DELETE /api/v1/tours/:id` (admin/lead-guide)

### Users & Auth

- `POST /api/v1/users/signup`
- `POST /api/v1/users/login`
- `GET /api/v1/users/logout`
- `POST /api/v1/users/forgotPassword`
- `PATCH /api/v1/users/resetPassword/:token`
- `PATCH /api/v1/users/updateMyPassword` (protected)
- `PATCH /api/v1/users/updateMe` (protected)

### Reviews

- `GET /api/v1/reviews`
- `POST /api/v1/reviews` (user)
- Nested: `POST /api/v1/tours/:tourId/reviews` (user)

### Bookings

- `GET /api/v1/bookings/checkout-session/:tourID` (protected)
- `GET /api/v1/bookings` (admin/lead-guide)

## Notes

- `server.js` currently connects using `DATABASE_LOCAL`.
- `helmet` is enabled in production mode.
- Request logs via `morgan` are enabled in development mode.

## Author

Abdelkhalek Mahmoud
