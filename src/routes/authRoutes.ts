import express from 'express';
import * as authController from '../controllers/authControllers'
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Fix auth
router.post('/signup', /*authenticateToken*/ authController.signup);

router.post('/login', authController.login);

export default router;