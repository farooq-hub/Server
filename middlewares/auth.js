const jwt = require('jsonwebtoken');
const User = require('../models/user')
let errMsg;

const generateToken = (id,role) => {
    const token = jwt.sign({ id, role }, process.env.TOKEN_SECRT);
    return token
}

const verifyTokenAdmin = async (req, res, next) => {
    try {        
        let token = req.headers['authorization'];
        if (!token) {
            return res.status(403).json({ errMsg: "Access Denied" });
        }          
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length).trimLeft();
        }
        const verified = jwt.verify(token, process.env.TOKEN_SECRT);
      
        req.payload = verified;
        if (req.payload.role === 'admin') {
            next()

        } else {
            return res.status(403).json({ errMsg: "Access Denied" });
        }
    } catch (err) {
        console.log("p");
        res.status(500).json({ errMsg: "Server Down" });
    }
}

module.exports = {
    generateToken,
    verifyTokenAdmin
}