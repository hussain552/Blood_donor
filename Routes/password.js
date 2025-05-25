import express from 'express';
// import { registerUser, loginUser } from '../controllers/authController.js';
import {forgotPassword,resetPassword} from '../controllers/passwordController.js'
const router = express.Router();

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);


export default router;
