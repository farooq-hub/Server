
const { generateToken } = require('../middlewares/auth');

const login = async (req,res)=>{
    try {
        const {phone,password} = req.body;
        console.log(req.body);
        if (phone.trim() !== process.env.ADMIN_NUMBER.trim()) return res.status(401).json({errMsg:"Number incorrect"});
       
        if (process.env.ADMIN_PASSWORD.trim() !== password.trim()) {
            return res.status(401).json({errMsg:"Password incorrect"});
        };

        const token = generateToken(phone,'admin');
        res.status(200).json({msg:'login succesfull',name:'Farooq',token,role:'admin'});
    } catch (error) {
        res.status(504).json({ errMsg: "Gateway time-out" });
    }
}


module.exports = {
    login
}