'use strict';

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
 * @typedef {{ colorFunctionNotation: 'legacy' | 'modern' }} Options
 */

/**
 * CSS rule handler
 * @param  {string} decl CSS declaration
 * @param  {any} result PostCSS result
 * @param  {Options} options
 */
function ruleHandler(decl, result, options) {
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
    nodes[0].value = options.colorFunctionNotation === 'modern' ? rgb.join(' ') : rgb.join(',');
  }).toString();

  decl.value = value;
}

/**
 * @param {Options} [options]
 */
module.exports = (options = {}) => {
  const colorFunctionNotation = options.colorFunctionNotation || 'legacy';

  return {
    postcssPlugin: 'postcss-hexrgba',

    Declaration(decl, { result }) {
      if (!decl.value.includes('rgba')) {
        return;
      }

      ruleHandler(decl, result, { colorFunctionNotation });
    },
  };
};

module.exports.postcss = true;
