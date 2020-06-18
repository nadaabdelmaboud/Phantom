require('dotenv/config') 
var express=require('express')
var app=express();
var pins=require('./routes/pin-route');
var bodyparser=require('body-parser');
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use('/api',pins)



const API_PORT = process.env.PORT || 3000;

app.use(function(error, req, res, next) {
    res.status(500);
    res.send({ error: error.message });

});
app.listen(process.env.port || API_PORT, function() {
    console.log('listening for a request');
});

module.exports = app;