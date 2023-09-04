const express = require('express');
const { signup,login, otpLogin,profileDetails,editUser} = require('../controllers/user');
const { verifyTokenUser } = require('../middlewares/auth');

const multer = require('../config/multer');
const { providerList } = require('../controllers/provider');
const upload = multer.createMulter();

const   userRouter = express.Router();

userRouter.post('/signup',signup);
userRouter.post('/login',login);
userRouter.post('/otpLogin',otpLogin);
userRouter.get('/profile',verifyTokenUser,profileDetails);
userRouter.get('/providersList',providerList)

userRouter.patch('/editProfile',verifyTokenUser,upload.single('file'),editUser)




module.exports = userRouter;