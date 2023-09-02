const express = require('express');
const { signup,login, otpLogin,profileDetails,editUser} = require('../controllers/user');
const { verifyTokenUser } = require('../middlewares/auth');

const multer = require('../config/multer');
const upload = multer.createMulter();

const   userRouter = express.Router();

userRouter.post('/signup',signup);
userRouter.post('/login',login);
userRouter.post('/otpLogin',otpLogin);
userRouter.get('/profile',verifyTokenUser,profileDetails);

userRouter.patch('/editProfile',upload.single('file'),verifyTokenUser,editUser)




module.exports = userRouter;