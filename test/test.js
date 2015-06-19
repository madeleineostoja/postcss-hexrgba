/*eslint no-unused-expressions: 0*/
'use strict';

var postcss = require('postcss'),
    expect = require('chai').expect,
    plugin = require('../');

var test = function (input, output, opts, done) {
  postcss([ plugin(opts) ]).process(input).then(function (result) {
    expect(result.css).to.eql(output);
    expect(result.warnings()).to.be.empty;
    done();
  }).catch(function (error) {
    done(error);
  });
};

describe('postcss-hexrgba', function () {

  it('handles standard hex', function (done) {
    test('a{ color: rgba(#fffff,0.8); }',
         'a{ color: rgba(255,255,255,0.8); }', { }, done);
  });

  it('handles shorthand hex', function (done) {
    test('a{ color: rgba(#fff,1); }',
         'a{ color: rgba(255,255,255,1); }', { }, done);
  });

  it('handles spaces in rgba', function (done) {
    test('a{ color: rgba( #fff , .5 ); }',
         'a{ color: rgba(255,255,255,.5); }', { }, done);
  });

});
