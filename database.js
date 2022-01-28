const mongoose = require('mongoose')
const mongooseUri = "mongodb://localhost:27017/keepNotes?readPreference=primary&appname=MongoDB%20Compass&ssl=false"

const connectingToMongoose = ()=>{
    mongoose.connect(mongooseUri, ()=>{console.log("successfully")})
}

module.exports = connectingToMongoose;