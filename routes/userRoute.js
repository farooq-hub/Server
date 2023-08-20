const express = require('express');
const { signup,login, otpLogin,} = require('../controllers/user');


const   userRouter = express.Router();

userRouter.post('/signup',signup);
userRouter.post('/login',login);
userRouter.post('/otpLogin',otpLogin);



module.exports = userRouter;