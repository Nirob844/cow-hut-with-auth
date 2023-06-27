import express from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from './../../../enums/user';
import { AdminController } from './admin.controller';

const router = express.Router();

router.post('/create-admin', AdminController.createAdmin);
router.post('/login', AdminController.loginAdmin);
router.post('/refresh-token', AdminController.refreshToken);
router.get(
  '/my-profile',
  auth(ENUM_USER_ROLE.ADMIN),
  AdminController.getAdminProfile
);
router.patch(
  '/my-profile',
  auth(ENUM_USER_ROLE.ADMIN),
  AdminController.updateAdminProfile
);

export const AdminRoutes = router;
