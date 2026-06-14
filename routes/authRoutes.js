const express = require('express');
const router = express.Router();
const passport = require('passport');
const { signup, login } = require('../controllers/authController');
const { protect } = require('../middlewares/protect');
const { signToken } = require('../utils/jwt');
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts. Try again in 10 minutes.'
});

// Public routes
router.post('/signup', signup);
router.post('/login', loginLimiter,login );

// Protected route example
router.get('/me', protect, (req, res) => {
  res.json({ message: 'You have access!', user: req.user });
});

// Google OAuth routes (Passport strategy is configured in config/passport.js)
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL || '/login'}` }),
  (req, res) => {
    // On success, sign a JWT and set it as an HTTP-only cookie, then redirect
    const token = signToken(req.user._id);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 24 * 60 * 60 * 1000
    });
    res.redirect(process.env.CLIENT_URL || '/');
  }
);

module.exports = router;