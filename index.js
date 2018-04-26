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
    let input = decl.value,
        output = input,
        hexes = [];

    // Get the raw hex values out of the decl value and put them in an array
    input.replace(/rgba\(#(.*?),/g, (a, b) => hexes.push(b));

    // If there are no hexes in the value, exit
    if (!hexes.length) {
      return;
    }

    // Convert each hex to RGB
    hexes.forEach(hex => {
      let rgb = hexRgb(hex),
          matchHex = new RegExp('#' + hex);

      // If conversion fails, warn and exit
      if (!rgb) {
        result.warn('not a valid hex', { node: decl });
        return;
      }

      rgb = rgb.toString();

      // Replace hex values in output string
      output = output.replace(matchHex, rgb);
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
