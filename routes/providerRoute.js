const express = require('express');
const { serviceList} = require('../controllers/service');
const { signup,login, profileDetails, editProvider } = require('../controllers/provider');
const { verifyTokenProvider } = require('../middlewares/auth');

const multer = require('../config/multer');
const upload = multer.createMulter();
const providerRoute= express.Router();

providerRoute.post('/register',signup);
providerRoute.post('/login',login);

providerRoute.get('/serviceList',serviceList);
providerRoute.get('/profile',verifyTokenProvider,profileDetails);
providerRoute.patch('/editProfile', upload.fields([{ name: 'profilePic' }, { name: 'coverPic' }]),verifyTokenProvider,editProvider)




module.exports = providerRoute;