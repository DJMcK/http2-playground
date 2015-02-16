var internals = {};

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var Client = require('./client/');

if (!module.parent) {
  var url = process.argv.pop();
  var client = new Client();

  console.time('HTTP/2');

  client.request(url, function done () {
    console.timeEnd('HTTP/2');
    process.exit();
  });
}

module.exports = Client;