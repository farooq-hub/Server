const express = require('express');
const { serviceList} = require('../controllers/service');
const { signup,login, profileDetails, editProvider } = require('../controllers/provider');
const { verifyTokenProvider } = require('../middlewares/auth');

const multer = require('../config/multer');
const { postsList, addPost, deletePost, postLike, commentList, addComment, likeComment, deleteComment, updatePost, postReport } = require('../controllers/posts');
const { addOption } = require('../controllers/option');
const upload = multer.createMulter();
const providerRoute= express.Router();

providerRoute.post('/register',signup);
providerRoute.post('/login',login);

providerRoute.get('/serviceList',serviceList);
providerRoute.get('/profile',verifyTokenProvider,profileDetails);
providerRoute.patch('/editProfile',verifyTokenProvider,upload.fields([{ name: 'profilePic' }, { name: 'coverPic' }]),editProvider)

providerRoute.route('/post')
    .get(verifyTokenProvider,postsList)
    .post(verifyTokenProvider,upload.array("postImages", 10),addPost)
    .patch(verifyTokenProvider,updatePost)
    .delete(verifyTokenProvider,deletePost)

providerRoute.route('/comment')
    .get(verifyTokenProvider,commentList)
    .post(verifyTokenProvider,addComment)
    .patch(verifyTokenProvider,likeComment)
    .delete(verifyTokenProvider,deleteComment)

providerRoute.route('/option')
    .get(verifyTokenProvider)
    .post(verifyTokenProvider,addOption)
    // .patch(verifyTokenProvider,likeComment)
    // .delete(verifyTokenProvider,deleteComment)

providerRoute.patch('/post/like',verifyTokenProvider,postLike)

    






module.exports = providerRoute;