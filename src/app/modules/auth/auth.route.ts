import express from 'express';
import { UsersController } from '../user/user.controller';

const router = express.Router();

router.post('/signup', UsersController.createUser);

export const AuthRoutes = router;
