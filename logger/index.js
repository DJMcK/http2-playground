var Bunyan = require('bunyan');

var internals = {};


exports = module.exports = internals.Logger = function () {

  if (!(this.constructor === internals.Logger)) throw new Error('Call with new');
}

/**
 * Creates instance of Bunyan
 * @param  {String} name  Name to be assigned to log instance
 * @param  {String} level Level to be pushed to console
 * @return {Object}       Bunyan
 */
internals.Logger.prototype.createLogger = function (name, level, stream) {

  return Bunyan.createLogger({
    name: name,
    stream: stream || internals._defaultOutput,
    level: level || internals._defaultLevel,
    serializers: require('http2').serializers
  });
};


// Default stream output
internals._defaultOutput = process.stdout;

// Default stream level
internals._defaultLevel = 'info';