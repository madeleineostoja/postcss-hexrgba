'use strict';

const postcss = require('postcss');
const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');
const plugin = require('../');

function test(fixture, opts, done) {
  let input = fixture + '.css',
      expected = fixture + '.expected.css';

  input = fs.readFileSync(path.join(__dirname, 'fixtures', input), 'utf8');
  expected = fs.readFileSync(path.join(__dirname, 'fixtures', expected), 'utf8');

  postcss([ plugin(opts) ])
    .process(input)
    .then(result => {
      expect(result.css).to.eql(expected);
      expect(result.warnings()).to.be.empty;
      done();
    }).catch(error => done(error));
}

describe('postcss-hexrgba', () => {

  it('handles standard hex', done => test('standard', {}, done));

  it('handles shorthand hex', done => test('shorthand', {}, done));

  it('handles hex in multiple attributes', done => test('multiple', {}, done));

  it('handles complex statements', done => test('complex', {}, done));

  it('preservers !important', done => test('important', {}, done));

});
