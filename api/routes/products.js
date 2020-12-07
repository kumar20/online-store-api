const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const multer = require('multer')
const autherization=require('../../api/routes/middleware/authenticate')
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploads/');
    },
    filename:function(req,file,cb){
        cb(null, Date.now()+ '-' + file.originalname)
    }
})
const fileFilter =(req,file,cb)=>{
    if(file.mimetype ==='image/jpeg' || file.mimetype==='image/jpg' || file.mimetype==='image/png'){
        cb(null,true)
    }
    else{
        cb(new Error("not an image format"),false)
    }
}

const upload=multer({
    storage:storage,
    limits:{
        fileSize:1024*1024*5
    },    
    fileFilter:fileFilter
})
const Product = require('../../models/Product')

router.get('/', function (req, res, next) {
    Product
    .find()
    .select("name price productImage")
        .exec()
        .then(doc => {
            const response={
                count:doc.length,
                products:doc.map(doc=>{
                    return{
                        name:doc.name,
                        price:doc.price,
                        _id:doc._id,
                        productImage:doc.productImage
                    }
                })
            }
            res.status(200).json(response)
        })
        .catch(err => {
            console.log(err)
            res.status(404).json({
                message: "Items not found"
            })
        })
})
router.post('/',autherization,upload.single('productImage'), function (req, res, next) {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage:req.file.path
    })
    product.save()
        .then(result =>
            console.log(result)
        )
        .catch(err => console.log(err))
    res.status(200).json({
        message: "product fetched",
        product
    })
})
router.get('/:productId', function (req, res, next) {
    const id = req.params.productId
    Product.findById(id)
        .exec()
        .then(doc => {
            console.log(doc)
            res.status(200).json(doc)
        })
        .catch(err => {
            console.log("error", err)
            res.status(500).json({ error: err })
        })
})
router.put('/:productId',autherization, function (req, res, next) {
    const id = req.params.productId
    const updateOperation = {}
    for (const ops of req.body) {
        updateOperation[ops.propName] = ops.value
    }
    Product.update({ _id: id }, { $set: updateOperation })
        .exec()
        .then(docs => {
            res.status(200).json(docs)
        })
        .catch(err => {
            res.status(400).json({ error: err })
        })

});
router.delete('/:productId',autherization, function (req, res, next) {
    const id = req.params.productId
    Product.remove({ _id: id })
        .exec()
        .then(doc => {
            res.status(200).json(doc)
        })
        .catch(err => {
            res.status(400).json({
                error: err

            })
        })
})
module.exports = router