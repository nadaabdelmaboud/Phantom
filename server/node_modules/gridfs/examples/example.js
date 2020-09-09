var fs = require('fs');
var mongo = require('mongodb');
var Grid = require('../index');

var yourMongoURI = 'mongodb://localhost:27017/gridfs-example'

mongo.MongoClient.connect(yourMongoURI, function(err, db) {
  var gfs = Grid(db, mongo);

  var source = './example.txt';
  gfs.fromFile({filename: 'hello.txt'}, source, function (err, file) {
    console.log('saved %s to GridFS file %s', source, file._id);
    gfs.readFile({_id: file._id}, function (err, data) {
      console.log('read file %s: %s', file._id, data.toString());
    });
  });

  var contents = 'world';
  var target = './out.txt';
  gfs.writeFile({filename: 'world.txt'}, contents, function (err, file) {
    console.log('wrote "%s" to GridFS file %s', contents, file._id);
    gfs.toFile({_id: file._id}, target, function (err) {
      var fileContents = fs.readFileSync('./out.txt').toString();
      console.log('wrote file %s to %s: %s', file._id, target, fileContents);
    });
  });

  setTimeout(gfs.list.bind(gfs, function (err, filenames) {
    console.log('filenames: ' + filenames); // hello.txt, world.txt
  }), 100);
});
