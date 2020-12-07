const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../../models/Order')
const Product=require('../../models/Product')
const authorization=require('../../api/routes/middleware/authenticate')
router.get('/',authorization ,function (req, res, next) {
    Order.find()
        .populate('product' ,'name')
        .exec()
        .then(result => {
           const response={
               count:result.length,
               placedOrders:result
           }
            res.status(200).json(response)
        })
        .catch(err => { 
            res.status(200).json({
                 error: err }) })

});

router.post('/',authorization, function (req, res, next) {
    Product.findById(req.body.productId)
    .exec()
    .then(result=>{
        const order = new Order({
            _id: new mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        })
        order.save()
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                res.status(400).json({ error: err })
            })
    
    
    })
    .catch(err=>{
        res.status(400).json({
            error:err,
            message:"product not found"
        })
    })
    })
   
router.put('/:orderId', authorization,function (req, res, next) {
    const id = req.params.orderId
    const updateOperation = {}
    for (const ops of req.body) {
        updateOperation[ops.propName] = ops.value
    }
    Order.update({ _id: id }, { $set: updateOperation })
        .exec()
        .then(docs => {
            res.status(200).json(docs)
        })
        .catch(err => {
            res.status(400).json({ error: err })
        })

});
router.get('/:orderId', authorization,function (req, res, next) {
    Order.findById(req.params.orderId)
        .exec()
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(400).json({
                error: err
            })
        })
})
router.delete('/:orderId', authorization,function (req, res, next) {
    const id =req.params.orderId
    Order.remove({_id:id})
        .exec()
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(400).json({
                error: err
            })
        })
})
module.exports = router