/*!
 * template-deprecate <https://github.com/jonschlinkert/template-deprecate>
 *
 * Copyright (c) 2015 Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

/* deps:mocha */
var should = require('should');
var Template = require('template');
var deprecate = require('./');
var template;

describe('deprecate', function () {
  beforeEach(function() {
    template = new Template();
    template.engine('hbs', require('engine-handlebars'));
  });

  it('should throw an error when the given regex is matched:', function (done) {
    var re = /\{{>\s*body\s*}}/;
    var msg = 'LAYOUT SYNTAX ERROR: use `{% body %}` instead of `{{> body }}`.\n';
    template.onLoad(/./, deprecate(template, {regex: re, message: msg}), function (err, file, next) {
      err.message.should.match(/0\| abc {{> body }} xyz/);
    });
    template.page('foo.hbs', {content: 'abc {{> body }} xyz'});
    template.render('foo.hbs', function (err, res) {
      done();
    });
  });
});

describe('errors', function () {
  beforeEach(function() {
    template = new Template();
  });

  it('should throw an error when regex is missing', function () {
    (function () {
      deprecate(template, {});
    }).should.throw('template-deprecate expects `options.regex` to be a regex.');
  });

  it('should throw an error when message is missing', function () {
    (function () {
      deprecate(template, {regex: /./});
    }).should.throw('template-deprecate expects `options.message` to be a string.');
  });
});
