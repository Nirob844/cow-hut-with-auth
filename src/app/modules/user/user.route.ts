import express from 'express';
import { UsersController } from './user.controller';

const router = express.Router();

router.get('/:id', UsersController.getSingleUser);
router.patch('/:id', UsersController.updateUser);
router.delete('/:id', UsersController.deleteUser);
// router.post('/signup', UsersController.createUser);
router.get('/', UsersController.getAllUsers);

export const UserRoutes = router;
