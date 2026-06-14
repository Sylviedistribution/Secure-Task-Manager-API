const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const { signToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const createSendToken = (user, res, statusCode = 200) => {
    const token = signToken(user._id);
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        maxAge: process.env.JWT_COOKIE_EXPIRES_MS ? parseInt(process.env.JWT_COOKIE_EXPIRES_MS) : 24 * 60 * 60 * 1000
    };
    res.cookie('token', token, cookieOptions);
    // Remove password from output
    if (user.password) user.password = undefined;
    // Send only user in body; token is set in HTTP-only cookie
    res.status(statusCode).json({ status: 'success', user });
};

//TRY CATCH METHOD
// const signup =async (req, res, next) => {
//     try {
//         const { name, email, password, birthdate } = req.body;
//         const newUser = await User.create({ name, email, password, birthdate });
//         createSendToken(newUser, res, 201);
//     } catch (err) {
//         res.status(400).json({ status: 'fail', message: err.message });
//     }
// };

// const login = catchAsync(async (req, res, next) => {
//     try {
//         const { email, password } = req.body;
//         // if (!email || !password) {
//         //     return res.status(400).json({ status: 'fail', message: 'Please provide email and password' });
//         // }
//         if (!email || !password) {
//             return next(
//                 new AppError(
//                     'Please provide email and password',
//                     400
//                 )
//             );
//         }
//         const user = await User.findOne({ email }).select('+password');
//         // if (!user) return res.status(401).json({ status: 'fail', message: 'Invalid credentials' });

//         const isMatch = await bcrypt.compare(password, user.password);
//         // if (!isMatch) return res.status(401).json({ status: 'fail', message: 'Invalid credentials' });
//         if (!user || !isMatch) {
//             return next(
//                 new AppError(
//                     'Invalid credentials',
//                     401
//                 )
//             );
//         }
//         createSendToken(user, res, 200);
//     } catch (err) {
//         res.status(500).json({ status: 'error', message: err.message });
//     }
// });

//catchAsync
const signup = catchAsync(async (req, res, next) => {
    const { name, email, password, birthdate } = req.body;
    const newUser = await User.create({ name, email, password, birthdate });
    createSendToken(newUser, res, 201);

});



const login = catchAsync(async (req, res, next) => {

    const { email, password } = req.body;
    // if (!email || !password) {
    //     return res.status(400).json({ status: 'fail', message: 'Please provide email and password' });
    // }
    if (!email || !password) {
        return next(
            new AppError(
                'Please provide email and password',
                400
            )
        );
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return next(
            new AppError(
                'Invalid credentials',
                401
            )
        );
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return next(
            new AppError(
                'Invalid credentials',
                401
            )
        );
    }
    createSendToken(user, res, 200);

});

module.exports = { signup, login };