
require('dotenv/config'); // to use env variable 
const connection =require('./controllers/db-controller')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyparser = require('body-parser');
const logger = require('morgan');
var pins=require('./routes/pin-route');
var images=require('./routes/image-route');

var authentication = require('./routes/authentication-route');
const methodOverride=require('method-override')


app.use(cors());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(logger('dev'));
app.use(methodOverride('_method'));
app.use('/api',images);
app.use('/api',pins);
app.use('/api',authentication);



const API_PORT = process.env.PORT || 3000;

app.use(function(error, req, res, next) {
    res.status(500);
    res.send({ error: error.message });

});
app.listen(process.env.port || API_PORT, function() {
    console.log('listening for a request');
});

module.exports = app;