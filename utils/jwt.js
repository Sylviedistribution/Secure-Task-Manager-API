const jwt = require('jsonwebtoken');

// Generate a signed JWT for the given user ID
exports.signToken = (userId) => {
  return jwt.sign(
    { id: userId }, // payload (data to encode)
    process.env.JWT_SECRET, // secret key from .env
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' } // token expiry
  );
};