const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, birthdate } = req.body;
  const newUser = await User.create({ name, email, password, birthdate });
  if (newUser.password) newUser.password = undefined;
  res.status(201).json({ status: 'success', data: { user: newUser } });

});

const getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select('-password');
  res.status(200).json({ status: 'success', results: users.length, data: { users } });

});

const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');
  // if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' });
  if (!user) return next(
    new AppError("User not found", 404)
  );
  res.status(200).json({ status: 'success', data: { user } });

});

const editUser = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
    return res.status(403).json({ status: 'fail', message: 'Not authorized' });
  }
  const { name, email, password, birthdate } = req.body;
  const user = await User.findById(req.params.id);
  // if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' });
  if (!user) return next(
    new AppError("User not found", 404)
  );
  await user.save();

  res.status(200).json({
    status: 'success',
    data: {
      task
    }
  });

});

const deleteUser = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
    return res.status(403).json({ status: 'fail', message: 'Not authorized' });
  }
  const user = await User.findById(req.params.id);
  // if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' });
  if (!user) return next(
    new AppError("User not found", 404)
  );
  await User.findByIdAndDelete(req.params.id);
  res.status(204).json({ status: 'success', data: null });

});

module.exports = { createUser, getUsers, getUser, editUser, deleteUser };