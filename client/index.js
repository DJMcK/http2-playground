var internals = {};

/**
 * Create new instance of logger for client
 * @type {Object}
 */

// Dependencies
internals.Fs = require('fs');
internals.Path = require('path');
internals.Http2 = require('http2');
internals.Logger = require('../logger');


/**
 * Constructor for client
 * @public
 */
exports = module.exports = internals.Client = function () {

  if (!(this.constructor === internals.Client)) throw new Error('Call with new');

  this.logger = new internals.Logger().createLogger('Client');
}


/**
 * Request a HTTP2 URL
 * @param  {String}   url
 * @param  {Function} callback
 * @public
 */
internals.Client.prototype.request = function (url, callback) {

  this.logger.info('Client requesting', url);

  // Raw or no
  var request = process.env.HTTP2_PLAIN ?
                  internals.Http2.raw.get(url) :
                  internals.Http2.get(url);

  this._callback = callback;
  this.url = url;

  request.on('response', this._onResponse.bind(this));
  request.on('push', this._onPushRequest.bind(this));

  return this;
};


/**
 * Handles primary response streams
 * @param  {Object} response
 * @private
 */
internals.Client.prototype._onResponse = function (response) {

  this.logger.info('Response httpVersion header:', response.httpVersion);

  var filename = internals.Path.join(__dirname, '/tmp/push-primary.tmp');

  this.logger.info('Receiving primary response: ' + this.url + ' -> ' + filename);

  // Pipe response stream to file
  response.pipe(internals.Fs.createWriteStream(filename));

  return response.on('end', this._finish.bind(this));
}


/**
 * Handles push request streams
 * @param  {Object} pushRequest
 * @private
 */
internals.Client.prototype._onPushRequest = function (pushRequest) {

  this.logger.info('Server is requesting to push', pushRequest.url);
  this._push_count += 1;

  pushRequest.on('response', function onPushResponse (pushResponse) {

    var filename = internals.Path.join(__dirname, '/tmp' +  pushRequest.url + '.tmp');

    this.logger.info('Receiving pushed response: ' + pushRequest.url + ' -> ' + filename);

    // Pipe push response stream to file
    pushResponse.pipe(
      internals
        .Fs.createWriteStream(filename))
        .on('finish', this._finish.bind(this));
  }.bind(this));
}


// Set counters
internals.Client.prototype._push_count = 0;
internals.Client.prototype._finished = 0;


/**
 * Called at end of each response stream to check if all done
 * @private
 */
internals.Client.prototype._finish = function () {

  this._finished += 1;
  if (this._finished === (1 + this._push_count)) {
    this.logger.info('Finished closing connection with server');
    return this._callback();
  }
}
