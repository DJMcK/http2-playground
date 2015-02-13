var Path = require('path');
var Fs = require('fs');

var internals = {};

// Instantiate cache store
// internals.cache = {};

// Path to WWW root
internals.publicPath = Path.join(__dirname, '../public');


/**
 * Constructor for cache
 * @public
 */
exports = module.exports = internals.Cache = function () {

  if (!(this.constructor === internals.Cache)) throw new Error('Call with new');

  this.cache = {};

  return {
    get: this.get.bind(this)
  }
}


/**
 * Called to retrieve an asset
 * @param  {String}   path     Relative path from WWW root
 * @param  {Function} callback
 * @public
 */
internals.Cache.prototype.get = function (path, callback) {

  var publicPath = Path.join(internals.publicPath, path);

  return this._get(publicPath, callback);
};


/**
 * Internal function used to retrieve file data
 * @param  {String}   path     Absolute path for system
 * @param  {Function} callback
 * @private
 */
internals.Cache.prototype._get = function (path, callback) {

  if (this.cache[path]) {
    return callback(null, this.cache[path]);
  }

  return this._check(path, callback);
};


/**
 * Checks file exists and passes to cache
 * @param  {String}   path
 * @param  {Function} callback
 * @private
 */
internals.Cache.prototype._check = function (path, callback) {
  var self = this;

  this._check.exists(path, function existsCallback (state) {

    if (!state) callback(new Error('File does not exist'));

    return self._check.stat(path, function isFileCallback (err, stat) {

      if (err) callback(err);
      return self._cacheFile(path, stat, callback);
    });
  });
};


/**
 * @param  {String}   path
 * @param  {Function} callback
 * @private
 */
internals.Cache.prototype._check.exists = function (path, callback) {

  return Fs.exists(path, callback);
};


/**
 * @param  {String}   path
 * @param  {Function} callback
 * @private
 */
internals.Cache.prototype._check.stat = function (path, callback) {

  return Fs.stat(path, callback);
};


/**
 * Reads file contents and pushes into cache store
 * @param  {String}   path
 * @param  {Object}   stat     General file information
 * @param  {Function} callback
 * @private
 */
internals.Cache.prototype._cacheFile = function (path, stat, callback) {
  var self = this;

  return Fs.readFile(path, 'utf8', function readCallback (err, data) {

    if (err) callback(err)

    var cacheData = {
      stat: stat,
      content: data
    }

    self.cache[path] = cacheData;

    return self._get(path, callback);
  });
};