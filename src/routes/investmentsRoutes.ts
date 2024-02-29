import express from 'express';
import * as investmentController from '../controllers/investmentController';

const router = express.Router();


router.get('/', investmentController.getAllInvestments)
router.get('/:userId', investmentController.getInvestmentsByUserId)
router.post('/create', investmentController.createInvestment)
router.post('/update/:id', investmentController.update)
export default router;
