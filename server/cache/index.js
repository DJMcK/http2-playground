var Path = require('path');
var Fs = require('fs');

var internals = {};

// Instantiate cache store
internals.cache = {};

// Path to WWW root
internals.publicPath = Path.join(__dirname, '../public');


/**
 * Called to retrieve an asset
 * @param  {String}   path     Relative path from WWW root
 * @param  {Function} callback
 * @public
 */
internals.get = function (path, callback) {

  var publicPath = Path.join(internals.publicPath, path);

  return internals._get(publicPath, callback);
};


/**
 * Internal function used to retrieve file data
 * @param  {String}   path     Absolute path for system
 * @param  {Function} callback
 * @private
 */
internals._get = function (path, callback) {

  if (internals.cache[path]) {
    return callback(null, internals.cache[path]);
  }

  return internals._check(path, callback);
};


/**
 * Checks file exists and passes to cache
 * @param  {String}   path
 * @param  {Function} callback
 * @private
 */
internals._check = function (path, callback) {

  internals._check.exists(path, function existsCallback (state) {

    if (!state) callback(new Error('File does not exist'));

    return internals._check.stat(path, function isFileCallback (err, stat) {

      if (err) callback(err);
      return internals._cacheFile(path, stat, callback);
    });
  });
};


/**
 * @param  {String}   path
 * @param  {Function} callback
 * @private
 */
internals._check.exists = function (path, callback) {

  return Fs.exists(path, callback);
};


/**
 * @param  {String}   path
 * @param  {Function} callback
 * @private
 */
internals._check.stat = function (path, callback) {

  return Fs.stat(path, callback);
};


/**
 * Reads file contents and pushes into cache store
 * @param  {String}   path
 * @param  {Object}   stat     General file information
 * @param  {Function} callback
 * @private
 */
internals._cacheFile = function (path, stat, callback) {

  return Fs.readFile(path, 'utf8', function readCallback (err, data) {

    if (err) callback(err)

    var cacheData = {
      stat: stat,
      content: data
    }

    internals.cache[path] = cacheData;

    return internals._get(path, callback);
  });
};


exports.get = internals.get;