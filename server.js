var internals = {};

var Server = require('./server/');

if (!module.parent) {
  var server = new Server();
  server.listen(process.env.PORT || 8000);
}

module.exports = Server;