const mongoose = require("mongoose")

const profileSchema = new mongoose.Schema({
           user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
           },
           refresh_token:{
            type:String,
            required:true
           }
},{timestamps:true})


// 

const model = mongoose.model("Profile",profileSchema)
module.exports= model