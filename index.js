'use strict';

var postcss = require('postcss');

module.exports = postcss.plugin('postcss-hexrgba', function () {
    /**
     * Hex to RGB converter
     * @param  {string} hex hexidecimal string
     * @return {array} RGB values
     */
    var hexRgb = function(hex){
      // If given shorthand, expand it
      var shorthandCheck = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandCheck, function(m, r, g, b) {
          return '#' + r + r + g + g + b + b;
      });

      // Extract full hex into an array
      var rgbRegex = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
      var rgb = hex
        .replace(/^\s+|\s+$/g, '')
        .match(rgbRegex);

      // Convert it
      return rgb ? [
        parseInt(rgb[1], 16),
        parseInt(rgb[2], 16),
        parseInt(rgb[3], 16)
      ] : false;

    };

    /**
     * CSS rule handler
     * @param  {string} decl CSS delcaration
     */
    var ruleHandler = function(decl, result) {

      var input = decl.value;
      var output = '';
      var prefix = input.match(/(.+) rgba\(.+\)/);
      var suffix = input.match(/rgba\(.+\) (.+)/);

      // Strip out surrounding css property and throw the values in an array
      var rgba = input.split('(')[1].split(')')[0];
      rgba = rgba.split(',');

      // Only process rgba values with 2 arguments (hex + alpha)
      if (rgba.length > 2){
        return;
      }

      // Store the alpha value for safe keeping and strip trailing spaces
      var a = rgba[1];
      a = a.replace(/\s/g, '');

      // Rip out the alpha and turn array into hex string
      var hex = rgba.splice(0, 1);
      hex = hex.toString();

      // Feed it to our converter
      var converted = hexRgb(hex);

      // Add the alpha back in
      if (!converted) {
        result.warn('not a valid hex', { node: decl });
        return;
      }

      converted.push(a);


      // Convert the whole thing to a string again and add back in css wrapper
      output = converted.toString();
      output = 'rgba(' + output + ')';

      // Prepend the output with the beginning of the value before the conversion without the rgba part, if it exists
      if (prefix) {
        output = prefix[1] + ' ' + output;
      }

      // PAppend the output with the end of the value before the conversion without the rgba part, if it exists
      if (suffix) {
        output = output + ' ' + suffix[1];
      }

      // Create the new declaration value
      decl.value = output;

    };

    //  Do it!
    return function(css, result) {

      css.eachDecl(function(decl) {

        // Only process rgba declaration values
        if (decl.value.indexOf('rgba') === -1) {
          return;
        }

        ruleHandler(decl, result);

      });

  };
});
