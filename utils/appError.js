// Define a class that extends the built-in Error object
class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // Call the parent class constructor with the error message
    this.statusCode = statusCode; // Set HTTP status code (e.g., 404, 400, 500)
    this.isOperational = true;    // Mark this as an expected, handled error
    // Captures the exact location of the error in the stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = AppError;