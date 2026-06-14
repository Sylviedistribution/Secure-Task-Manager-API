require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const { clean: xssClean } = require('xss-clean/lib/xss');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimiter = require('./middlewares/rateLimiter');


const connectDB = require('./config/config');

// Chargement de la stratégie Google OAuth
require('./config/passport');

// Routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/tasksRoute');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Database Connection                                                        

connectDB();


// Global Middlewares                                                       

// Parse JSON requests
app.use(express.json());

// Parse cookies
app.use(cookieParser());

// Enable CORS and allow cookies
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));


// Session Middleware                                                         
// Nécessaire pour Passport Google OAuth                                      

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    })
);


//Passport Initialization                                                    
app.use(passport.initialize());
app.use(passport.session());

// Security middlewares
app.use(helmet());

//
const rateLimiter = require('./middlewares/rateLimiter');
app.use(rateLimiter);

// Sanitize req.body and req.params only to avoid assigning to read-only req.query
app.use((req, res, next) => {
    try {
        if (req.body) req.body = xssClean(req.body);
        if (req.params) req.params = xssClean(req.params);
    } catch (e) {
        // ignore sanitization errors
    }
    next();
});
app.use(mongoSanitize());

//Routes

// Health check
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Secure Task Manager API is running'
    });
});

// Authentication Routes
app.use('/api/auth', authRoutes);

// User Routes
app.use('/api/users', userRoutes);

// Task Routes
app.use('/api/tasks', taskRoutes);



app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    console.error('Global error handler:', err.stack || err);
    res.status(err.statusCode).json({ status: err.status, message: `Le message d'erreur est ${err.message}` });
});

/*                                                                         
| ------------------------------------------------------------------------
| Start Server                                                               
| ------------------------------------------------------------------------
| */
const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
