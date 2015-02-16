var internals = {};
var Readable = require('stream').Readable;


/**
 * Create new response handler
 * @param {Object} response
 * @public
 */
exports = module.exports = internals.Response = function (response) {

  if (!(this.constructor === internals.Response)) throw new Error('Call with new');

  this.response = response;

  return {
    create: this.create.bind(this)
  }
}


/**
 * Create stream, can be a push stream if flagged
 * @param  {Object}   options  Data required
 * @param  {Function} callback
 * @return {Object}   Send property, note the failure if a push stream
 * @public
 */
internals.Response.prototype.create = function(options) {

  if (!options.data) throw new Error('No content to stream');

  this.push = options.push || false;
  this.path = options.path;

  this.response.writeHead(options.status || '200');
  this._createStream(options.data);

  return {
    send: this.pipeStrean.bind(this)
  };
};


/**
 * Creates the data stream
 * @param  {String} content Raw buffer data to be piped
 * @private
 */
internals.Response.prototype._createStream = function(content) {

  this.stream = new Readable;
  this.stream.push(content);
  this.stream.push(null);

  if (this.push) {
    var push = this.response.push(this.path);
    push.writeHead(200);

    return this.stream.pipe(push);
  }
};


/**
 * Called to begin piping stream to client
 */
internals.Response.prototype.pipeStrean = function () {

  if (this.push) throw new Error('Push stream, no need to send - piped with response.');
  return this.stream.pipe(this.response);
}