const mongoose = require ('mongoose')
const Schema = mongoose.Schema;

const SubcategorySchema = new Schema({
    Subcategory:String,
    category:{
        Subcategory:String, 
        type:mongoose.Schema.Types.ObjectId,
        ref:'category'
    },
})
const Subcategory=mongoose.model('Subcategory',SubcategorySchema)
module.exports=Subcategory