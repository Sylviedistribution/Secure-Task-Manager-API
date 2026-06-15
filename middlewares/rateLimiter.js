const rateLimit = require('express-rate-limit');

// Basic limiter: 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 	// 15 minutes
  max: 100,                 			// limit each IP to 100 requests
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
module.exports = limiter;