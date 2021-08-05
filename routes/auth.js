const express = require('express');
const authController = require('../controllers/auth');

const authRouter = express.Router();

authRouter.post('/signup', authController.signup);

authRouter.post('/login', authController.login);

authRouter.post('/logout', authController.logout);

module.exports = authRouter;