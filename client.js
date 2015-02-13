var internals = {};

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var Client = require('./client/');

if (!module.parent) {
  var url = process.argv.pop();
  var client = new Client();

  client.request(url, function done () {
    process.exit();
  });
}

module.exports = Client;