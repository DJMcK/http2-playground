var internals = {};
var Readable = require('stream').Readable;
var Response = require('./response');

internals.Cache = require('../cache');

/**
 * Create new request handler
 * @param {Object} request
 * @param {Object} response
 * @public
 */
exports = module.exports = internals.Request = function (request, response) {

  if (!(this.constructor === internals.Request)) throw new Error('Call with new');

  this.request = request;
  this.response = response;

  return this._onRequest(request, response);
}


/**
 * Handles all requests to the HTTP2 server
 * @param  {Object} request
 * @param  {Object} response
 * @private
 */
internals.Request.prototype._onRequest = function (request, response) {

  this.path = (request.url === '/') ? '/index.html' : request.url;

  return internals.Cache.get(this.path, this._cacheCallback.bind(this));
}


/**
 * [_cacheCallback description]
 * @param  {Object} err
 * @param  {Object} data Cache file object
 */
internals.Request.prototype._cacheCallback = function (err, data) {

  if (err) throw err;

  return this._createPrimaryStream(data);
}


/**
 * Create the primary stream (request.url asset)
 * @param  {Object} data
 * @private
 */
internals.Request.prototype._createPrimaryStream = function (data) {

  var response = new Response(this.response, this.raw);
  var self = this;

  var stream = response.create({
    data: data.content
  });

  if (self.request.url === '/' && self.response.push) {
    return self._getApplicationAssets(
      ['/application.js', '/application.css'],
      function getApplicationAssetsCallback (err) {

        return stream.send();
      })
  }

  return stream.send();
}


/**
 * Retrieves all application assets to be pushed
 * @param  {Array}    assets
 * @param  {Function} callback
 * @private
 */
internals.Request.prototype._getApplicationAssets = function (assets, callback) {

  var self = this;
  var countAsync = 0;

  for (var i = 0, il = assets.length; i < il; ++i) {

    internals.Cache.get(assets[i], (function getCachedAssetCallback () {

      var asset = assets[i];

      return function createAssetPushStreams (err, data) {

        if (err) callback(err);

        var response = new Response(self.response, self.raw);

        var stream = response.create({
          push: true,
          data: data.content,
          path: asset
        });

        if (countAsync >= assets.length - 1) return callback(null);
        return ++countAsync;
      }
    })());
  }
}