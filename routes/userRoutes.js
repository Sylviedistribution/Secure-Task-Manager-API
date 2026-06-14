const app = require("express");
const router = app.Router();
const userController = require('../controllers/userController');
const protect = require('../middlewares/protect').protect;

router.route('/')
  .get(protect, userController.getUsers)
  .post(protect, userController.createUser)

router.route('/:id')
  .get(protect, userController.getUser)
  .put(protect, userController.updateUser)
  .delete(protect, userController.deleteUser)


module.exports = router;