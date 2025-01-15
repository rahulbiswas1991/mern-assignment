const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRouterApi = require('./router/userRouterApi');
const productRouterApi = require('./router/productRouterApi');

app.set('views', path.join(__dirname, 'views'));
// app.use(express.static(path.join(__dirname, 'public')));

// Static Files Folder
app.use('/assets', express.static('./public'));

// cookie middleware
app.use(cookieParser());

// body parser middleware
app.use(bodyParser.urlencoded({ 
    extended: true,
    limit: "2mb"
 }));
// parse application/json
app.use(bodyParser.json({
    limit: "2mb"
}));
// use json
app.use(express.json());
app.use(cors());
// set api routesq3
 app.use('/api/v1/users',userRouterApi);
 app.use('/api/v1/products',productRouterApi);

 app.use((err, req, res,next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    res.status(err.statusCode).json({
        status: err.status,
        massage: err.message
    })
})
module.exports = app;
