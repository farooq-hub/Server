const Provider = require('../models/provider')
const sha256 = require('js-sha256');
let errMsg,msg;

const signup =async (req,res) => {
    try {
        const { name, email, phone, password,services,places } = req.body;
        const lowerCaseName = name.toLowerCase();
        const exsistingProvider = await Provider.findOne({ $or: [{ name }, { phone }] });
        if(exsistingProvider) return res.status(400).json({errMsg:'Provider alredy exsist'})
    
        const newProvider =await new Provider({
            name: lowerCaseName,
            phone,
            email,
            password: sha256(password + process.env.PASSWORD_SALT),
            services,
            places,
        }).save()
        res.status(200).json({msg:'REgistration Success'});
    } catch (error) {        
        res.status(500).json({ errMsg: 'Something went wrong' })
    }
}

const providerList =async (req,res)=>{
    try {
        const providerData = await Provider.find().populate('services').sort({isUpgraded:-1});
        res.status(200).json({providerData});
    } catch (error) {
        res.status(504).json({ errMsg: "Gateway time-out" });
    }
}


const blockProvider =async (req,res)=>{
    try {
        const { providerId } = req.params;
        const provider = await Provider.findById(providerId);
        if (!provider) return res.status(400).json({ errMsg: 'Provider Not Found' })

        provider.isBanned = true;
        await provider.save();

        res.status(200).json({ msg: 'Unblocked Successfully' })
    } catch (error) {
        res.status(504).json({ errMsg: "Gateway time-out" });
    }
}


const unBlockProvider =async (req,res)=>{
    try {
        const { providerId } = req.params;
        const provider = await Provider.findById(providerId);
        if (!provider) return res.status(400).json({ errMsg: 'Provider Not Found' })

        provider.isBanned = false;
        await provider.save();

        res.status(200).json({ msg: 'Unblocked Successfully' })
    } catch (error) {
        res.status(504).json({ errMsg: "Gateway time-out" });
    }
}

module.exports = {
    signup,
    providerList,
    blockProvider,
    unBlockProvider
}