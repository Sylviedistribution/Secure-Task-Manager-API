# Secure Task Manager API

A secure REST API built with Node.js, Express, MongoDB, JWT Authentication, and Google OAuth 2.0. The API allows users to manage their personal tasks while applying modern security best practices such as HTTP-only cookies, rate limiting, input sanitization, and centralized error handling.

---

## Features

### Authentication

* User Signup with Email and Password
* User Login with JWT Authentication
* Google OAuth 2.0 Authentication using Passport.js
* JWT stored in HTTP-only secure cookies
* Protected routes using authentication middleware

### Task Management

Authenticated users can:

* Create tasks
* View their own tasks
* Delete their own tasks

Access control ensures that users can only access and delete their own tasks.

### Security

* Helmet for securing HTTP headers
* XSS protection using xss-clean
* NoSQL Injection protection using express-mongo-sanitize
* Rate limiting to prevent brute-force attacks
* Password hashing using bcryptjs
* JWT Authentication

### Error Handling

* Custom AppError class
* Centralized error handling middleware
* Async error wrapper using catchAsync utility

## Challenges Encountered

During development, several technical challenges were encountered and resolved:

* **Mongoose Middleware:** Updated password hashing middleware to use modern async syntax, removing deprecated `next()` usage in async hooks.
* **Express 5 Compatibility:** Some security packages such as `xss-clean` and `express-mongo-sanitize` caused compatibility issues with Express 5 and required alternative implementations or adjustments.
* **Model Compilation:** Resolved `OverwriteModelError` by preventing Mongoose from recompiling existing models.
* **Multiple Authentication Methods:** Adapted the User model to support both local JWT authentication and Google OAuth users.
* **Secure Authentication:** Implemented JWT storage in HTTP-only cookies for improved security.
* **Access Control:** Ensured users can only manage their own tasks through ownership verification.
* **Brute-Force Protection:** Added rate limiting to sensitive authentication routes.
* **Error Handling:** Centralized application error management using `AppError`, `catchAsync`, and a global error handler.

--------------

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* Passport.js
* Google OAuth 2.0
* JWT
* bcryptjs
* Helmet
* express-rate-limit
* express-mongo-sanitize
* xss-clean

---

## Project Structure

```bash
Secure-Task-Manager-API
│
├── config
│   ├── config.js
│   └── passport.js
│
├── controllers
│   ├── authController.js
│   ├── taskController.js
│   └── userController.js
│
├── middlewares
│   ├── protect.js
│   └── rateLimiter.js
│
├── models
│   ├── userModel.js
│   └── taskModel.js
│
├── routes
│   ├── authRoutes.js
│   ├── taskRoutes.js
│   └── userRoutes.js
│
├── utils
│   ├── AppError.js
│   ├── catchAsync.js
│   └── jwt.js
│
├── .env
├── server.js
└── package.json
```

---

## Installation

### Clone the repository

```bash
git clone https://github.com/your-username/secure-task-manager-api.git

cd secure-task-manager-api
```

### Install dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the root directory.

```env
PORT=5000

NODE_ENV=development

MONGO_URI=mongodb://localhost:27017/task-manager

JWT_SECRET=your_jwt_secret

SESSION_SECRET=your_session_secret

GOOGLE_CLIENT_ID=your_google_client_id

GOOGLE_CLIENT_SECRET=your_google_client_secret

CLIENT_URL=http://localhost:3000
```

---

## Running the Application

Start MongoDB locally:

```bash
mongod
```

Start the server:

```bash
npm start
```

or

```bash
node server.js
```

The API will run on:

```text
http://localhost:5000
```

---

## Authentication Routes

### Signup

```http
POST /api/auth/signup
```

Request Body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "birthdate": "1995-01-01"
}
```

---

### Login

```http
POST /api/auth/login
```

Request Body:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

A JWT token is generated and stored in an HTTP-only cookie.

---

### Google Authentication

```http
GET /api/auth/google
```

After successful authentication, Google redirects to:

```http
/api/auth/google/callback
```

and a JWT cookie is automatically created.

---

## Task Routes

All task routes require authentication.

### Create Task

```http
POST /api/tasks
```

Request Body:

```json
{
  "name": "Finish Project",
  "description": "Complete the Secure Task Manager API"
}
```

---

### Get My Tasks

```http
GET /api/tasks
```

Returns only tasks belonging to the authenticated user.

---

### Delete Task

```http
DELETE /api/tasks/:id
```

Users can only delete their own tasks.

---

## Security Features

### JWT Authentication

JWT tokens are stored in secure HTTP-only cookies.

### Password Encryption

Passwords are hashed using bcryptjs before being stored in MongoDB.

### Rate Limiting

The login route is protected against brute-force attacks.

### Input Sanitization

Protection against:

* XSS attacks
* NoSQL Injection attacks

### Secure Headers

Helmet adds several security-related HTTP headers.

---

## Error Handling

The project uses:

### AppError

Custom error class used for operational errors.

### catchAsync

Utility function that automatically forwards asynchronous errors to the global error handler.

### Global Error Handler

Centralized error management for consistent API responses.

---

## Author

Sylvestre IBOMBO GAKOSSO
