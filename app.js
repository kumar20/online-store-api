const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
mongoose.Promise = global.Promise;

const productRoute = require('./api/routes/products')
const orderRoute = require('./api/routes/orders')
const userRoute=require('./api/routes/users')

mongoose.connect('mongodb+srv://my-shop:' + process.env.MONGO_ATLAS_PW + '@my-shope-djqyk.mongodb.net/test?retryWrites=true&w=majority', { useUnifiedTopology: true , useNewUrlParser: true})
mongoose.set('useCreateIndex', true)
app.use(morgan('dev'));

app.use('/uploads',express.static('uploads'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origine,X-Requested-With,Content-Type,Authorization")
    if (req.method === 'OPTIONS') {
        res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET")
        return res.status(200).json({})
    }
    next();
})

app.use('/products', productRoute);
app.use('/orders', orderRoute);
app.use('/users',userRoute);

app.use(function (req, res, next) {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})
app.use(function (error, req, res, next) {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }

    })
})


module.exports = app;
