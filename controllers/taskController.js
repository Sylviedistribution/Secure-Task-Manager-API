const Task = require('../models/taskModel');
const bcrypt = require("bcryptjs");
const { signToken } = require("../utils/jwt");
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const createTask = catchAsync(async (req, res, next) => {

    const { name, description } = req.body;
    // 1. Create task

    const newTask = await Task.create({ name, description, owner: req.user._id });
    res.status(201).json({ status: 'success', data: { task: newTask } });

});

const getTasks = catchAsync(async (req, res, next) => {
    const tasks = await Task.find({ owner: req.user._id });
    res.status(200).json({ status: 'success', results: tasks.length, data: { tasks } });

});

const editTask = catchAsync(async (req, res, next) => {

    const { name, description } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
        return next(
            new AppError("Task not found", 404)
        );
    }

    if (!task.owner.equals(req.user._id)) {
        return next(
            new AppError("Not authorized", 403)
        );
    }

    task.name = name;
    task.description = description;

    await task.save();

    res.status(200).json({
        status: 'success',
        data: {
            task
        }
    });

});

const deleteTask = catchAsync(async (req, res, next) => {

    const task = await Task.findById(req.params.id);
    // if (!task) return res.status(404).json({ status: 'fail', message: 'Task not found' });
    if (!task) return next(
        new AppError("Task not found", 404))

    // if (!task.owner.equals(req.user._id)) return res.status(403).json({ status: 'fail', message: 'Not authorized' });
    if (!task.owner.equals(req.user._id)) return next(
        new AppError("Not authorized", 403))

    await Task.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: null });

});

module.exports = { createTask, getTasks, editTask, deleteTask };