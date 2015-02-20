var Request = require('./request');

var internals = {};


/**
 * Create new instance of Handler.
 */
exports = module.exports = internals.Handler = function () {

  if (!(this.constructor === internals.Handler)) throw new Error('Call with new');
}


/**
 * Handles all requests to the HTTP2 server
 * @param  {Object} request
 * @param  {Object} response
 * @public
 */
internals.Handler.prototype.onRequest = function (request, response) {

  var request = new Request(request, response, this);
  return request;
}