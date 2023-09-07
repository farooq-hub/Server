const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    providerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'provider',
        required: true
    },

    postImages:{
        type: Array,
        required:true
    },
    caption:{
        type:String,
        required:true
    },
    tagline:{
        type:String
    },
    comments:[{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        content: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now()
        }
}],
    likes:{
        type:Array,
        ref:'users',
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    isBanned: { type: Boolean, default: false },
    reports : [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'users',
    }]
});


const post = mongoose.model('posts', postSchema);
module.exports = post;

