import express from 'express';
import authController from '../controllers/auth';

const authRouter = express.Router();

authRouter.post('/signup', authController.signup);

authRouter.post('/login', authController.login);

authRouter.post('/logout', authController.logout);

export default authRouter;