const mongoose= require('mongoose')

const mongoDB = "mongodb://127.0.0.1:27017/Event"


const connectDB = async()=>{
    try {
        const conn =await mongoose.connect(mongoDB)
            console.log('mongoDB connected')
    } catch (error) {
        console.log(error);
    }
}


module.exports = connectDB