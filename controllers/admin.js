
const { generateToken } = require('../middlewares/auth');
const Admin = require('../models/admin');
const sha256 = require('js-sha256');

const login = async (req,res)=>{
    try {
        const { phone, password } = req.body;
        const admin = await Admin.findOne({ phone }).populate({
            path: 'walletHistory.from',
            select: 'name'
        });
        if(phone&&password){
            if (!admin) return res.status(401).json({ errMsg: "Admin not found" });
            const passwordCheck =  admin.password == sha256(password + process.env.PASSWORD_SALT);
            if (!passwordCheck) return res.status(401).json({ errMsg: "Password doesn't match" });
            const token = generateToken(admin._id,'admin')
            console.log(admin);
    
            res.status(200).json({ msg: 'Login succesfull',  adminData:admin, token, role: 'admin' })
        }else{
            return res.status(402).json({errMsg:"Fill the form"});
        }
    } catch (error) {
        res.status(504).json({ errMsg: "Gateway time-out" });
    }
}

const profileDetails = async (req, res) => {
    try {

        const admin = await Admin.findOne({_id:req.payload.id }).populate({
            path: 'walletHistory.from',
            select: 'name'
        });
        if (admin)res.status(200).json({adminData: admin })
        else res.status(400).json({ errMsg: 'somthig Wrong'})
    } catch (error) {
        res.status(504).json({ errMsg: "Gateway time-out" });
    }
}



module.exports = {
    login,
    profileDetails
}