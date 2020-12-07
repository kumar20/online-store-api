const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const mongoose = require('mongoose');
const User = require('../../models/Users')
const jwt=require('jsonwebtoken')




router.post('/signup', function (req, res, next) {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                res.status(409).json({
                    message: "email already exists"
                })
            }
            else {

                bcrypt.hash(req.body.password, 10, function (err, hash) {
                    if (err) {
                        res.status(500).json({
                            error: err
                        })
                    }
                    else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        })
                        user.save()
                            .then(result => {
                                res.status(200).json({
                                    message: "user created"
                                })
                                console.log(result)
                            })
                            .catch(err => {
                                res.status(400).json({
                                    error: err,
                                    message: "failed to create"
                                })

                            })
                    }
                })
            }
        })
})
router.post("/login",function(req,res,next){
    User.find({email:req.body.email})
    .exec()
    .then(user=>{
        if(user.length<1){
            return res.status(404).json({
                message:"Invalid Credentials for login"
            })
        }
        bcrypt.compare(req.body.password, user[0].password, function(err,result){
            if(err){
                return res.status(404).json({
                    message:"Invalid Credentials for login"
                })
            }
            if(result){
                const token=jwt.sign(
                    {
                    email:user[0].email,
                    userId:user[0]._id
                },
                process.env.JWT_PW,
                {
                    expiresIn:"1h"
                }
                )
                return res.status(200).json({
                    message:"Authorization success",
                    token:token
                })
            }
            return res.status(404).json({
                message:"Invalid Credentials for login"
            })
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        });
    })
})

router.delete('/:userId', function (req, res, next) {
    User.deleteOne({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "user deleted"
            })

        })

        .catch(err => {
            res.status(404).json({
                error: err
            })
        })

})
module.exports = router





