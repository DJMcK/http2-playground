var Http2 = require('http2');
var Handler = require('./handler');

var internals = {};


internals.logger = require('./logger');


/**
 * Called to create HTTP2 Instance
 * @return {[type]} [description]
 */
exports = module.exports = internals.Server = function () {

  if (!(this.constructor === internals.Server)) throw new Error('Call with new');

  var Cert = require('./cert');
  var handler = new Handler();

  internals.logger.info('Creating new HTTP2 instance');

  return Http2.createServer({
    log: internals.logger,
    key: Cert.key,
    cert: Cert.crt
  }, handler.onRequest);
};