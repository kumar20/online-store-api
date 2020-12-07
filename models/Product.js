const mongoose=require('mongoose')
const productSchema={
    _id:mongoose.Schema.Types.ObjectId,
    name:{type:String,require:true},
    price:{type:Number,require:true},
    productImage:{type:String,required:true}
}
module.exports = mongoose.model('Product',productSchema)