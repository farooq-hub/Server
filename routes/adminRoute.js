const express = require('express');
const { login} = require('../controllers/admin');
const { verifyTokenAdmin } = require('../middlewares/auth');
const { serviceList,addService ,editServices  } = require('../controllers/service');
const { allUsers,blockUser,unBlockUser } = require('../controllers/user');
const { providerList, blockProvider, unBlockProvider, confirmProvider } = require('../controllers/provider');


const multer = require('../config/multer');
const upload = multer.createMulter();



const adminRoute = express.Router();

adminRoute.post('/login',login);
adminRoute.get('/userList',verifyTokenAdmin,allUsers);
adminRoute.patch('/blockUser/:userId',verifyTokenAdmin,blockUser);
adminRoute.patch('/unBlockUser/:userId',verifyTokenAdmin,unBlockUser);
adminRoute.get('/serviceList',verifyTokenAdmin,serviceList);
adminRoute.post('/addService', upload.single('file'), verifyTokenAdmin,addService);
adminRoute.patch('/services', upload.single('file'), verifyTokenAdmin,editServices);
// adminRoute.patch('/flagSarvices',verifyTokenAdmin,flagServices)

adminRoute.get('/providerList',verifyTokenAdmin,providerList);
adminRoute.patch('/confirmProvider/:providerId',verifyTokenAdmin,confirmProvider);
adminRoute.patch('/blockProvider/:providerId', verifyTokenAdmin, blockProvider);
adminRoute.patch('/unBlockProvider/:providerId', verifyTokenAdmin, unBlockProvider);




module.exports = adminRoute;