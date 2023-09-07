const Post = require('../models/post')
const cloudinary = require('../config/cloudinary')
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
    const { files, body: { caption, tagline } } = req;
    const { id } = req.payload;
    console.log(files,caption,tagline);

    try {
        let postImages = [];
        if(!files) return res.status(400).json({errMsg : 'Image needed'})
        if(!caption) return res.status(400).json({errMsg : 'caption needed'})  
        if(files){
            for await (const file of files){
                const upload = await cloudinary.uploader.upload(file.path)
                postImages.push(upload.secure_url)
                if (fs.existsSync(file.path))fs.unlinkSync(file.path);
            }
        }
        const newPost = new Post({
            providerId: id,
            caption,
            tagline,
            postImages,       
        })
        console.log(newPost);
        await newPost.save();
        res.status(200)?.json({ newPost ,msg:"post upload successfully"});
    } catch (error) {
        if(files){
            for await (const file of files)if (fs.existsSync(file.path))fs.unlinkSync(file.path);
        }
        console.log(error);
        res.status(500).json({errMsg:'Server Error'});
   }
}


const postDetails = async (req, res) => {

    const { postId } = req.query;
    console.log(postId);

    try {
        let postImages = [];
        if(!files) return res.status(400).json({errMsg : 'Image needed'})
        if(!caption) return res.status(400).json({errMsg : 'caption needed'})  
        if(files){
            for await (const file of files){
                const upload = await cloudinary.uploader.upload(file.path)
                postImages.push(upload.secure_url)
                if (fs.existsSync(file.path))fs.unlinkSync(file.path);
            }
        }
        const newPost = new Post({
            providerId: id,
            caption,
            tagline,
            postImages,       
        })
        console.log(newPost);
        await newPost.save();
        res.status(200)?.json({ newPost ,msg:"post upload successfully"});
    } catch (error) {
        if(files){
            for await (const file of files)if (fs.existsSync(file.path))fs.unlinkSync(file.path);
        }
        console.log(error);
        res.status(500).json({errMsg:'Server Error'});
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