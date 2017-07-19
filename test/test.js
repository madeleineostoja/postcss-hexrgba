/*eslint no-unused-expressions: 0*/

var postcss = require('postcss'),
    expect = require('chai').expect,
    fs = require('fs'),
    path = require('path'),
    plugin = require('../');

var test = function(fixture, opts, done) {
  var input = fixture + '.css',
      expected = fixture + '.expected.css';

  input = fs.readFileSync(path.join(__dirname, 'fixtures', input), 'utf8');
  expected = fs.readFileSync(path.join(__dirname, 'fixtures', expected), 'utf8');

  postcss([ plugin(opts) ])
    .process(input)
    .then(function (result) {
      expect(result.css).to.eql(expected);
      expect(result.warnings()).to.be.empty;
    done();
  }).catch(function (error) {
    done(error);
  });

};

describe('postcss-hexrgba', function() {

  it('handles standard hex', function(done) {
    test('standard', {}, done);
  });

  it('handles shorthand hex', function(done) {
    test('shorthand', {}, done);
  });

  it('handles hex in multiple attributes', function(done) {
    test('multiple', {}, done);
  });

  it('handles complex statements', function(done) {
    test('complex', {}, done);
  });


});
