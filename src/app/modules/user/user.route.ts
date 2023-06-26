import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { UsersController } from './user.controller';

const router = express.Router();

router.get('/:id', auth(ENUM_USER_ROLE.ADMIN), UsersController.getSingleUser);
router.get('/my-profile', UsersController.getUserProfile);
router.patch('/:id', auth(ENUM_USER_ROLE.ADMIN), UsersController.updateUser);
router.delete('/:id', auth(ENUM_USER_ROLE.ADMIN), UsersController.deleteUser);
router.get('/', auth(ENUM_USER_ROLE.ADMIN), UsersController.getAllUsers);

export const UserRoutes = router;
