const mongoose = require ('mongoose')
const Schema = mongoose.Schema

const userSchema=new Schema({
   
        name:{
                type:String,
                required:true
                }, 
        // address:String,
        phone:{
                type:String,
                required:true
                 },
        email:{
               type:String,
               required:true
                },
        password:{
                type:String,
                required:true
                 },
        block:{
                type:Boolean,
                 },
        address:{
                fname:String,
                lname:String,
                house:String,
                city:String,
                district:String,
                state:String,
                pincode:Number, 
                email:String,
                mobile:String,
                address:String
            },

})
const User=mongoose.model('user',userSchema)
module.exports=User