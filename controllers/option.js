const Option = require('../models/options')
const cloudinary = require('../config/cloudinary')
const fs = require("fs");
const mime = require("mime-types");


let msg,errMsg;


const getOptionList =async (req,res) => {
    try {
        // const { skip } = req.query;
        // const noPost = false
        // if(skip%10 == 0 ||skip == 0){
        //     const postsList = await Post.find({isBanned:false}).populate('providerId').skip(skip).limit(10).sort({ _id:-1 });
        //     console.log(postsList);
        //     if(postsList.length == 0) noPost =true
        //     res.status(200).json({ postsList ,noPost});
        // }else res.status(200).json({ noPost:true });

    } catch (error) {
        res.status(504).json({ errMsg: "Gateway time-out" });
    }
}

const addOption = async (req, res) => {
    const { files, body: { title, description,price,service,priceOption } } = req;
    const { id } = req.payload;
    let createdAt =new Date
    console.log(files, title, description,price,service,priceOption,createdAt);
    if(!files||!title||!description||!price||!service||!priceOption )return res.status(400).json({errMsg : 'Form not filled'})
    else{
        try {
            // let optionImages = [];
            // if(!files) return res.status(400).json({errMsg : 'Images needed'})
            // if(!title) return res.status(400).json({errMsg : 'Title needed'})
            // if(!description) return res.status(400).json({errMsg : 'caption needed'})  
            // if (files) {
            //     for await (const file of files) {
            //         const mimeType = mime.lookup(file.originalname);
            //         if (mimeType && mimeType.includes("image/")) {
            //             const upload = await cloudinary.uploader.upload(file.path);
            //             optionImages.push(upload.secure_url);
            //             fs.unlinkSync(file.path);
            //         };
            //     };
            // };
            // const newOption = new Option({
            //     providerId: id,
            //     serviceId:service,
            //     description,
            //     price,
            //     priceOption,
            //     optionImages,createdAt       
            // })
            // await newOption.save();
            // res.status(200)?.json({ newOption ,msg:"post upload successfully"});
        } catch (error) {
            if(files){
                for await (const file of files)if (fs.existsSync(file.path))fs.unlinkSync(file.path);
            }
            console.log(error);
            res.status(500).json({errMsg:'Server Error'});
        }
    }
}


module.exports={
    getOptionList,
    addOption
}