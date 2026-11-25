# Natours

Full-stack tour booking platform built with Node.js (ES Modules), Express, MongoDB/Mongoose, Pug templates, and Parcel.

## Tech Stack

- **Runtime & Module System**: Node.js with `"type": "module"` (ESM)
- **Backend**: Express 4, Mongoose 9 (MongoDB)
- **Views**: Pug (`src/views/`)
- **Auth & Security**: JWT + HTTP-only cookies (`cookie-parser`), `bcryptjs`, `helmet` (production), `express-rate-limit` (`/api`), `express-mongo-sanitize`, `hpp`
- **Payments, Media & Email**: Stripe, Multer + Sharp, Nodemailer
- **Frontend Bundling**: Parcel 2 (`public/js/index.js` -> `public/js/bundle.js`, `esmodule` target)

## Project Structure

```text
src/
  config/           # Centralized env config (index.js)
  controllers/      # Route handlers, viewsController, and handlerFactory.js
  middlewares/      # authMiddleware.js, errorMiddleware.js, uploadMiddleware.js
  models/           # Mongoose schemas (tour, user, review, booking)
  routes/           # API routes (/api/v1/*) and Pug view routes (/)
  utils/            # apiFeatures.js, appError.js, catchAsync.js, email.js
  views/            # Pug templates and email templates (views/emails/)
  app.js            # Express app setup, global middleware, route mounting
  server.js         # DB connection, HTTP server startup, process error handlers
public/             # Static assets (css/, img/, js/)
dev-data/           # Seed data and import/delete script
```

## Common Commands

- `npm run dev` (or `npm run watch`) — Run backend (`nodemon src/server.js`) and Parcel JS watcher concurrently
- `npm run start` — Start backend with `nodemon src/server.js`
- `npm run start:prod` — Start backend with `NODE_ENV=production`
- `npm run watch:js` — Watch and bundle `public/js/index.js` with Parcel
- `npm run build:js` — Production bundle for frontend JS
- `npm run data:import` / `npm run data:delete` — Seed or clear database via `dev-data/data/import-dev-data.js`

## Code Conventions & Patterns

- **ES Modules**: Always include explicit `.js` extensions on relative imports (e.g., `import AppError from '../utils/appError.js';`). Derive `__dirname` via `fileURLToPath(import.meta.url)` when needed.
- **Configuration**: Access environment variables through `src/config/index.js` rather than `process.env` directly. `DATABASE` (Atlas, with `<PASSWORD>` placeholder) takes precedence over `DATABASE_LOCAL`. See `.env.example` for required keys.
- **API & Controllers**:
  - Wrap async route handlers with `catchAsync` (`src/utils/catchAsync.js`).
  - Forward operational errors using `next(new AppError(message, statusCode))` (`src/utils/appError.js`) so `globalErrorHandler` (`src/middlewares/errorMiddleware.js`) formats the response.
  - Reuse `src/controllers/handlerFactory.js` (`getAll`, `getOne`, `createOne`, `updateOne`, `deleteOne`) and `APIFeatures` (`src/utils/apiFeatures.js`) for standard CRUD endpoints.
- **Routes**:
  - Views: `/` (`viewsRoutes.js`)
  - API v1: `/api/v1/auth`, `/api/v1/tours`, `/api/v1/users`, `/api/v1/reviews`, `/api/v1/bookings`
- **Code Style**: Follow `.eslintrc.json` (`airbnb`, `prettier`, `plugin:node/recommended`) and `.prettierrc` (`singleQuote: true`).
