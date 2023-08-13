const Services = require('../models/service')
const cloudinary = require('../config/cloudinary')
const mime = require("mime-types");
const fs = require("fs");
const { log } = require('console');


let msg,errMsg;


const serviceList =async (req,res)=>{
    try {
        console.log('sksjdx');
        const serviceList = await Services.find({});
        res.status(200).json({ serviceList });

    } catch (error) {
        res.status(504).json({ errMsg: "Gateway time-out" });
    }
}

const addService = async (req, res) => {
    
    const { file, body: { name } } = req;
    try {
        let serviceName = name.toUpperCase()
        let image;
        console.log(serviceName,file);
        if(!file) return res.status(400).json({errMsg : 'Image needed'})
        if(!name) return res.status(400).json({errMsg : 'Name needed'})  

        const exsistingService = await Services.find({serviceName})
        if(exsistingService.length) return res.status(400).json({errMsg : 'service already exist'})
        
        const mimeType = mime.lookup(file.originalname);
        if(mimeType && mimeType.includes("image/")) {
            console.log(process.env.CLOUDINARY_API_KEY);
            const upload = await cloudinary.uploader.upload(file?.path)
            image = upload.secure_url;
            fs.unlinkSync(file.path)
        }else{
            fs.unlinkSync(file.path)
            if(exsistingService) return res.status(400).json({errMsg : 'This file not a image',status:false})
        }
        const newService =await new Services({
            serviceName,
            serviceImage:image       
        }).save()

        res.status(200)?.json({ newService});

   } catch (error) {
        console.log(error);
        res.status(500).json({errMsg:'Server Error'});
       fs.unlinkSync(file?.path);
   }
}


module.exports = {
    serviceList,
    addService
}