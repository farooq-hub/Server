const Post = require('../models/post')
const cloudinary = require('../config/cloudinary')
const mime = require("mime-types");
const fs = require("fs");

let msg,errMsg;


const postsList =async (req,res)=>{
    try {
        const postsList = await Post.find({});
        res.status(200).json({ postsList });

    } catch (error) {
        res.status(504).json({ errMsg: "Gateway time-out" });
    }
}


const addPost = async (req, res) => {
        console.log(req.body,'sjhshsh');
        const { files, body: { providerId,caption,tagline } } = req;
    try {
        // let images = [];
        // // console.log(providerId,caption,tagline,file);
        // if(!files.length == 0) return res.status(400).json({errMsg : 'Image needed'})
        // if(!caption) return res.status(400).json({errMsg : 'caption needed'})  

        // const mimeType = mime.lookup(files.originalname);
        // if(mimeType && mimeType.includes("image/")) {
        // //     console.log(process.env.CLOUDINARY_API_KEY);
        //     for(let i=0 ;i<=files.length ;i++){
        //         const upload = await cloudinary.uploader.upload(files[i]?.path)
        //         images.push(upload.secure_url)
        //         if (fs.existsSync(files[i].path))fs.unlinkSync(files[i].path);
        //     }
        // }else{
        //     // fs.unlinkSync(file.path)
        //     if(exsistingService) return res.status(400).json({errMsg : 'This file not a image',status:false})
        // }
        // // const newService =await new Services({
        // //     serviceName,
        // //     serviceImage:image       
        // // }).save()

        // // res.status(200)?.json({ newService});

   } catch (error) {
        console.log(error);
        res.status(500).json({errMsg:'Server Error'});
    //    fs.unlinkSync(file?.path);
   }
}


const deletePost =async (req,res)=>{
    try {
        const { postId } = req.params;
        const removePost = await Post.deleteOne({_id:postId}) 
        removePost ? res.status(200).json({postId ,msg:'Post deleted sucssesfully'}):res.status(401).json({postId ,errMsg:"Post did'nt delete, something wrong"})
    } catch (error) {
        console.log(error);
        res.status(500).json({errMsg:'Server Error'});
    }
}

module.exports={
    postsList,
    addPost,
    deletePost
}