const jwt = require('jsonwebtoken');
const User = require('../models/user')
let errMsg;

const generateToken = (id,role) => {
    const token = jwt.sign({ id, role }, process.env.TOKEN_SECRT);
    return token
}

module.exports = {
    generateToken
}