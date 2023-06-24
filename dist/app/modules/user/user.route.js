'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require('express'));
const user_controller_1 = require('./user.controller');
const router = express_1.default.Router();
router.get('/:id', user_controller_1.UsersController.getSingleUser);
router.patch('/:id', user_controller_1.UsersController.updateUser);
router.delete('/:id', user_controller_1.UsersController.deleteUser);
// router.post('/signup', UsersController.createUser);
router.get('/', user_controller_1.UsersController.getAllUsers);
exports.UserRoutes = router;
