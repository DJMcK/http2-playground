var Fs = require('fs');
var Path = require('path');

var internals = {};


/**
 * @param  {String} path
 * @return {String}        Raw buffer from file
 */
internals.readFileSync = function (path) {
  return Fs.readFileSync(
                        Path.join(__dirname, path),
                        'utf8')
}


exports.crt = internals.readFileSync('/localhost.crt');
exports.key = internals.readFileSync('/localhost.key');