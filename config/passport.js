// Import Passport.js core and the Google OAuth strategy
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel'); // Import your Mongoose User model

// Serialize the user: store only the user ID in the session cookie
passport.serializeUser((user, done) => {
    done(null, user.id); // only store MongoDB _id in session
});

// Deserialize the user: retrieve full user object from DB using stored ID
passport.deserializeUser((id, done) => {
    User.findById(id)
        .then((user) => done(null, user)) // attach user to req.user
        .catch((err) => done(err, null));
});

// Configure the Google OAuth Strategy
passport.use(
    new GoogleStrategy(
        {
            // These values are loaded from .env
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,

            // This is the route Google will redirect to after successful login
            // Mounted under /api/auth in server, so callback should match that path
            callbackURL: '/api/auth/google/callback' // Do NOT include domain/port, only the path
        },

        // This async function is called when Google sends back user profile
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user with this provider and ID already exists
                const existingUser = await User.findOne({
                    provider: 'google',
                    providerId: profile.id
                });

                if (existingUser) {
                    return done(null, existingUser); // Proceed with the existing user
                }

                // If not, create a new user using data from Google
                const newUser = new User({
                    provider: 'google',
                    providerId: profile.id,
                    name: profile.displayName,
                    email: profile.emails?.[0]?.value // Optional chaining in case email is missing
                });

                await newUser.save(); // Save to DB
                return done(null, newUser); // Proceed with the newly created user

            } catch (err) {
                return done(err, null); // On error, pass null user
            }
        }
    )
);