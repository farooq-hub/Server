const express = require('express');
const { serviceList} = require('../controllers/service');
const { signup,login, profileDetails, editProvider } = require('../controllers/provider');
const { verifyTokenProvider } = require('../middlewares/auth');

const multer = require('../config/multer');
const { postsList, addPost, deletePost } = require('../controllers/posts');
const upload = multer.createMulter();
const providerRoute= express.Router();

providerRoute.post('/register',signup);
providerRoute.post('/login',login);

providerRoute.get('/serviceList',serviceList);
providerRoute.get('/profile',verifyTokenProvider,profileDetails);
providerRoute.patch('/editProfile',verifyTokenProvider,upload.fields([{ name: 'profilePic' }, { name: 'coverPic' }]),editProvider)

providerRoute.get('/post',verifyTokenProvider,postsList)
providerRoute.post('/post',verifyTokenProvider,upload.array("postImages", 10),addPost)
providerRoute.delete('/Post/:postId',verifyTokenProvider,deletePost)
providerRoute.delete('/post-details',verifyTokenProvider)






module.exports = providerRoute;