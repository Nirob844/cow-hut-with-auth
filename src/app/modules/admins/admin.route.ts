import express from 'express';
import { AdminController } from './admin.controller';

const router = express.Router();

// router.get('/:id', AdminController.getSingleAdmin);
// router.patch('/:id', AdminController.updateAdmin);
// router.delete('/:id', AdminController.deleteAdmin);
router.post('/create-admin', AdminController.createAdmin);
router.post('/login', AdminController.loginAdmin);
//router.post('/refresh-token', AdminController.refreshToken);
//router.get('/', AdminController.getAllAdmin);

export const AdminRoutes = router;
