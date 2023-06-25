import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { CowController } from './cow.controller';

const router = express.Router();

router.get(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.BUYER),
  CowController.getSingleCow
);
router.patch('/:id', auth(ENUM_USER_ROLE.SELLER), CowController.updateCow);
router.delete('/:id', auth(ENUM_USER_ROLE.SELLER), CowController.deleteCow);
router.post('/', auth(ENUM_USER_ROLE.SELLER), CowController.createCow);
router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.BUYER),
  CowController.getAllCows
);

export const CowRoutes = router;
