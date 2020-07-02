const path=require('path')
const mongoose=require('mongoose')
const multer=require('multer')
const crypto=require('crypto')
const GridFsStorage=require('multer-gridfs-storage')
const Grid=require('gridfs-stream')
const bodyparser=require('body-parser')
const methodOverRide=require('method-override');
var storage = new GridFsStorage({
    url: process.env.CONNECTION_STRING,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        if(file.mimetype!="image/jpg"&&file.mimetype!="image/jpeg"&&file.mimetype!="iamge/png"&&file.mimetype!="image/bmp"){
          return reject(Error("file should be an image"));
        }
        
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }  
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'images',
    
          };
          resolve(fileInfo);
        });
      });
    }
  });
  const upload = multer({ storage });
  module.exports=upload;