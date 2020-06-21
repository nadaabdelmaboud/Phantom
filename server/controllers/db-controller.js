const path=require('path')
const mongoose=require('mongoose')
const multer=require('multer')
const crypto=require('crypto')
const GridFsStorage=require('multer-gridfs-storage')
const Grid=require('gridfs-stream')
mongoose.Promise = global.Promise;
global.gfs=undefined;
 function dbConnection() {
    if (process.env.CONNECTION_STRING) {
        mongoose.connect(String(process.env.CONNECTION_STRING), { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
        mongoose.connection.once('open', () => {
            
            gfs=Grid(mongoose.connection.db,mongoose.mongo)
            gfs.collection('images')
            console.log("connection is made   ",process.env.CONNECTION_STRING);
           
        }).on('error', function(error) {
            console.log("connection got error : ", error);
        });
    } else console.log("connection string is require in .env file")

};
module.exports =dbConnection