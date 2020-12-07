const jwt = require('jsonwebtoken');



module.exports=function(req,res,next){
    var token;
    if(req.headers[token]){
        token=req.headers.token
    }
    if(req.headers['authorization']){
        token=req.headers['authorization']
    }
    if(req.headers['x-access-token']){
        token=req.headers['x-access-token']
    }
    if(token){
        jwt.verify(token,process.env.JWT_PW,function(err,decoded){
            if(err){
                return next(err);
            }
            console.log('decoded..',decoded)
            return next()
        })
    }
    else{
        json({
            message:"Token not provided"
        })
    }
}