var Grid = require('gridfs-stream');
var stream = require('stream');
var fs = require('fs');

function streamToBuffer(source, cb) {
  var chunks = [];
  var buffer = new stream.Writable();

  buffer._write = function (chunk, enc, done) {
    chunks.push(chunk);
    done();
  };

  source.on('end', function () {
    cb(null, Buffer.concat(chunks));
  });

  source.on('error', cb);

  source.pipe(buffer);
}

Grid.prototype.fromFile = function (options, source, cb) {
  var ws = this.createWriteStream(options);
  var rs = typeof source === 'string' ? fs.createReadStream(source) : source;

  ws.on('close', function (file) {
    return cb(null, file);
  });

  ws.on('error', cb);

  rs.pipe(ws);
  return ws;
};

Grid.prototype.toFile = function (options, target, cb) {
  var rs = this.createReadStream(options);
  var ws = typeof target === 'string' ? fs.createWriteStream(target) : target;

  ws.on('close', function () {
    cb(null);
  });

  ws.on('error', cb);

  rs.pipe(ws);
};

Grid.prototype.readFile = function (options, cb) {
  streamToBuffer(this.createReadStream(options), cb);
};

Grid.prototype.writeFile = function (options, data, cb) {
  data = data instanceof Buffer ? data : data.toString();
  var ws = this.createWriteStream(options);

  ws.on('close', function (file) {
    cb(null, file);
  });

  ws.on('error', cb);

  ws.end(data);
};

Grid.prototype.list = function (cb) {
  return this.mongo.GridStore.list(this.db, cb);
};

module.exports = exports = Grid;
