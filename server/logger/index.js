var internals = {};
var Logger = require('../../logger');

/**
 * Create new instance of logger
 * @type {Object}
 */
internals.logger = new Logger().createLogger('Server');

module.exports = internals.logger;