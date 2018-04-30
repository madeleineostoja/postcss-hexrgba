'use strict';

const postcss = require('postcss');

module.exports = postcss.plugin('postcss-hexrgba', () => {

  /**
   * Hex to RGB converter
   * @param  {string} hex hexidecimal string without #
   * @return {array} RGB values
   */
  function hexRgb(hex){
    let shorthandCheck = /^([a-f\d])([a-f\d])([a-f\d])$/i,
        rgbRegex = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i,
        rgb;

    hex = hex.replace(shorthandCheck, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });

    rgb = hex.replace(/^\s+|\s+$/g, '').match(rgbRegex);

    // Convert it
    return rgb ? [
      parseInt(rgb[1], 16),
      parseInt(rgb[2], 16),
      parseInt(rgb[3], 16)
    ] : false;
  }

  /**
   * CSS rule handler
   * @param  {string} decl CSS delcaration
   */
  function ruleHandler(decl, result) {
    let input = decl.value;

    // Get the raw hex values and replace them
    let output = input.replace(/rgba\(#(.*?),/g, (match, hex) => {
      let rgb = hexRgb(hex),
          matchHex = new RegExp('#' + hex);
        
      // If conversion fails, emit a warning
      if (!rgb) {
        result.warn('not a valid hex', { node: decl });
        return match;
      }

      rgb = rgb.toString();
      
      return match.replace(matchHex, rgb);
    });

    decl.replaceWith({
      prop: decl.prop,
      value: output,
      important: decl.important
    });
  }

  return function(css, result) {
    css.walkDecls(decl => {
      if (typeof decl.value === 'undefined' || decl.value.indexOf('rgba') === -1) {
        return;
      }

      ruleHandler(decl, result);
    });
  };
});
