const mongoose = require ('mongoose')
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    user_Id:{type:mongoose.Schema.Types.ObjectId,
        ref:'users'},
        total:{type:Number,default:0},
    products:[{
        pro_Id:{type:mongoose.Schema.Types.ObjectId,
        ref:'product'},
        price:{type:Number},
        quantity:{type:Number,default: 1},
        subtotal:{type:Number,default:0}   
}]
    
})
const cart=mongoose.model('cart',cartSchema)
module.exports=cart
    