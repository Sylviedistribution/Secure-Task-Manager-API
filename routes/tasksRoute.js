const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/protect');
const taskController = require('../controllers/taskController');

router
  .route('/')
  .get(protect, taskController.getTasks)
  .post(protect, taskController.createTask);

router.route('/:id').delete(protect, taskController.deleteTask);

module.exports = router;