const express = require('express');
const { signup,login, otpLogin,profileDetails,editUser} = require('../controllers/user');
const { verifyTokenUser } = require('../middlewares/auth');

const multer = require('../config/multer');
const { providerList } = require('../controllers/provider');
const { postsList, postLike, commentList, addComment, likeComment, deleteComment, postReport, allPost } = require('../controllers/posts');
const { getOptionList } = require('../controllers/option');
const { paymentModeHandle, paymentStatusHandle, getOrderLists, getOrderData, cancelOrder } = require('../controllers/order');
const upload = multer.createMulter();

const   userRouter = express.Router();

userRouter.post('/signup',signup);
userRouter.post('/login',login);
userRouter.post('/otpLogin',otpLogin);
userRouter.get('/profile',verifyTokenUser,profileDetails);
userRouter.get('/providersList',providerList)

userRouter.patch('/editProfile',verifyTokenUser,upload.single('file'),editUser)
userRouter.get('/all-Post',allPost)
userRouter.route('/post')
    .get(postsList)
    .patch(verifyTokenUser,postLike)

userRouter.route('/comment')
    .get(commentList)
    .post(verifyTokenUser,addComment)
    .patch(verifyTokenUser,likeComment)
    .delete(verifyTokenUser,deleteComment)

userRouter.patch('/post/report',verifyTokenUser,postReport)
userRouter.get('/option',verifyTokenUser,getOptionList)
userRouter.get('/order/:id',verifyTokenUser,getOrderData)

userRouter.route('/payment')
    .get(paymentStatusHandle)
    .post(verifyTokenUser,paymentModeHandle)

userRouter.route('/orders')
    .get(verifyTokenUser,getOrderLists)
    .post(verifyTokenUser,paymentModeHandle)
    .patch(verifyTokenUser,cancelOrder)








module.exports = userRouter;