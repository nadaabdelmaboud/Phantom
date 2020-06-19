const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


 function dbConnection() {
    if (process.env.CONNECTION_STRING) {
        mongoose.connect(String(process.env.CONNECTION_STRING), { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
        mongoose.connection.once('open', () => {
           
            console.log("connection is made   ",process.env.CONNECTION_STRING);
           
        }).on('error', function(error) {
            console.log("connection got error : ", error);
        });
    } else console.log("connection string is require in .env file")

};
module.exports =dbConnection