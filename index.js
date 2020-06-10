'use strict';

const postcss = require('postcss');
const valueParser = require('postcss-value-parser');

const rgbShorthandRegex = /^([a-f\d])([a-f\d])([a-f\d])$/i;
const rgbRegex = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

/**
 * Hex to RGB converter
 * @param  {string} hex hexadecimal string without #
 * @return {array} RGB values
 */
function hexRgb(hex){
  hex = hex.replace(rgbShorthandRegex, (m, r, g, b) => {
    return r + r + g + g + b + b;
  });

  const rgb = hex.match(rgbRegex);

  // Convert it
  return rgb ? [
    parseInt(rgb[1], 16),
    parseInt(rgb[2], 16),
    parseInt(rgb[3], 16)
  ] : false;
}

/**
 * CSS rule handler
 * @param  {string} decl CSS declaration
 */
function ruleHandler(decl, result) {
  const value = valueParser(decl.value).walk(node => {
    if (node.type !== 'function' || node.value !== 'rgba') {
      return;
    }

    const nodes = node.nodes;
    // Check for the hex value
    if (nodes[0].type !== 'word' || nodes[0].value.indexOf('#') !== 0) {
      return;
    }

    const hex = nodes[0].value.replace('#', '');
    const rgb = hexRgb(hex);

    // If conversion fails, emit a warning
    if (!rgb) {
      result.warn('not a valid hex', { node: decl });
      return;
    }

    // Replace hex value with rgb
    nodes[0].value = rgb;
  }).toString();

  decl.value = value;
}

module.exports = postcss.plugin('postcss-hexrgba', () => {
  return (css, result) => {
    css.walkDecls(decl => {
      if (decl.value.indexOf('rgba') === -1) {
        return;
      }

      ruleHandler(decl, result);
    });
  };
});
