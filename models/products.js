const mongoose = require ('mongoose')
const Schema = mongoose.Schema;

const productSchema=new Schema({
    productName:String,
    description:String,
    price:Number,
    discount:Number,
    stock:Number,
    color:String,
    Subcategory:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Subcategory',
        require:true
    },
    Category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'category',
        require:true
    },
    Brand:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'brand',
        require:true
    },
    Image:{
        type:Array
    }

})
const product=mongoose.model('product',productSchema)
module.exports=product