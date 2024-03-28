import express from 'express';
import * as investmentController from '../controllers/investmentController';

const router = express.Router();


router.get('/', investmentController.getAllInvestments)

router.get('/ethereumPrice', investmentController.getEthereumPrice)
router.get('/poundsToUsdt', investmentController.getUsdtToPounds)

router.get('/:userId', investmentController.getInvestmentsByUserId)
router.post('/create', investmentController.createInvestment)
router.post('/update/:id', investmentController.update)

router.post('/getLiteSlot', investmentController.getLiteSlot)
router.post('/getProSlot', investmentController.getProSlot)
router.post('/getMaxSlot', investmentController.getMaxSlot)

router.put('/updateLiteSlot', investmentController.updateLiteSlot)
router.put('/updateProSlot', investmentController.updateProSlot)
router.put('/updateMaxSlot', investmentController.updateMaxSlot)
export default router;
