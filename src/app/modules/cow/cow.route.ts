import express from 'express';
import { CowController } from './cow.controller';

const router = express.Router();

router.get('/:id', CowController.getSingleCow);
router.patch('/:id', CowController.updateCow);
router.delete('/:id', CowController.deleteCow);
router.post('/', CowController.createCow);
router.get('/', CowController.getAllCows);

export const CowRoutes = router;
