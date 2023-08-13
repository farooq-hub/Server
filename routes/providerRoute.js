const express = require('express');
const { serviceList} = require('../controllers/service');
const { signup } = require('../controllers/provider');


const providerRoute= express.Router();

providerRoute.post('/register',signup);
providerRoute.get('/serviceList',serviceList);



module.exports = providerRoute;