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
    test('a{ color: rgba(#ffffff,0.8); }',
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

  it('handles shade hex', function (done) {
    test('a{ color: rgba(#555555, .5 ); }',
         'a{ color: rgba(85,85,85,.5); }', { }, done);
  });

  it('handles color hex', function (done) {
    test('a{ color: rgba(#28d120, .5 ); }',
         'a{ color: rgba(40,209,32,.5); }', { }, done);
  });

  it('handles invalid hex as default value', function (done) {
    test('a{ color: rgba(#214dd, .5 ); }',
         'a{ color: rgba(0,0,0,.5); }', { }, done);
  });

});
