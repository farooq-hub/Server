const User = require('../models/user');
const sha256 = require('js-sha256');
const { generateToken } = require('../middlewares/auth');

let msg, errMsg;

const signup = async(req,res) =>{
    try {
        const { name, email, phone, password,referalCode } = req.body;
        const exsistingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (exsistingUser) return res.status(409).json({ errMsg: "User already found" });

        if(referalCode){
            const referealUser = await User.findOne({referalNumber:referalCode});
            if(!referealUser) return res.status(200).json({errMsg:"Invalid referal code"});

            referealUser.wallet += 50;
            await referealUser.save()
        }

        const timestamp = Date.now();
        const randomNum = Math.floor(Math.random() * 1000);

        const timestampPart = timestamp.toString().slice(-4);
        const randomNumPart = randomNum.toString().padStart(3, '0');
        const referalNumber = `#${timestampPart}${randomNumPart}`;
        console.log(exsistingUser,'ddfjfjfjdfjdj');
        const newUser = new User({
            name,
            phone,
            email,
            password: sha256(password + process.env.PASSWORD_SALT),
            referalNumber
        })
        await newUser.save();

        res.status(200).json({ msg: "Registration Success" });
    } catch (error) {
        res.status(504).json({ msg: "Gateway time-out" });
    }
} 

const login = async (req,res)=>{
    try {
        const { phone, password } = req.body;
        const user = await User.findOne({ phone});
        if (!user) return res.status(401).json({ errMsg: "User not found" });
        const passwordCheck =  user.password == sha256(password + process.env.PASSWORD_SALT);
        if (!passwordCheck) return res.status(401).json({ errMsg: "Password doesn't match" });
        if(user.isBanned) return res.status(401).json({errMsg:"You are blocked"});
        const token = generateToken(user._id,'user')

        res.status(200).json({ msg: 'Login succesfull', name: user?.name, token, role: 'user' })
    } catch (error) {
        res.status(504).json({ errMsg: "Gateway time-out" });
    }
}

module.exports = {
    signup,
    login
}