'use strict';

/**
 * Module dependencies
 */

var rethrow = require('rethrow');

/**
 * Warn or throw when the deprecated template syntax is used.
 */

module.exports = function (app, options) {
  options = options || {};
  var re = options.regex;

  if (!(re instanceof RegExp)) {
    throw new Error('template-deprecate expects `options.regex` to be a regex.');
  }
  if (typeof options.message !== 'string') {
    throw new Error('template-deprecate expects `options.message` to be a string.');
  }

  return function (file, next) {
    if (!re.test(file.content)) return next();

    var err = new SyntaxError(options.message);
    next(error(err, file.path, file.content, re));
  };
};

function error(err, fp, str, re) {
  var lines = str.split('\n');
  var len = lines.length, i = 0;
  var res = '';

  while (len--) {
    var line = lines[i++];
    if (re.test(line)) {
      rethrow(err, fp, i, str);
    }
  }
}
