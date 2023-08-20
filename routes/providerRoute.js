const express = require('express');
const { serviceList} = require('../controllers/service');
const { signup,login, confirmProvider } = require('../controllers/provider');


const providerRoute= express.Router();

providerRoute.post('/register',signup);
providerRoute.post('/login',login);

providerRoute.get('/serviceList',serviceList);



module.exports = providerRoute;