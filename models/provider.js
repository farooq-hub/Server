const mongoose = require('mongoose');


const providerSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
        trim: true,
    },
    phone: {
        required: true,
        type: Number,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        required: true,
        type: String,
        trim: true,
    },
    places: {
        required: true,
        type: Array,
    },
    services: {
        type: Array,
        ref: 'services',
        required: true,
    },
    wallet: {
        type: Number,
        default: 0,
    },
    isBanned: { type: Boolean, default: false },
    adminConfirmed: { type: Boolean, default: false },
    profilePic: { type: String },
    coverPic: { type: String },
    description: { type: String },
    isUpgraded: {
        type: Boolean,
        default: false
    },
});

const providerModel = mongoose.model('provider', providerSchema);
module.exports = providerModel;