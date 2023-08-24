const express = require('express');
const { signup,login, otpLogin,profileDetails,editUser} = require('../controllers/user');
const { verifyTokenUser } = require('../middlewares/auth');


const   userRouter = express.Router();

userRouter.post('/signup',signup);
userRouter.post('/login',login);
userRouter.post('/otpLogin',otpLogin);
userRouter.get('/profile',verifyTokenUser,profileDetails);

userRouter.post('/editProfile',verifyTokenUser,editUser)




module.exports = userRouter;