'use strict';

var postcss = require('postcss');

module.exports = postcss.plugin('postcss-hexrgba', function () {

  // Expand shorthand form (e.g. "#03F") to full form (e.g. "#0033FF")
  var shorthandRegex = /^#([a-f\d])([a-f\d])([a-f\d])$/i;

  // Extract full hex notation (e.g "#0033FF") into an array (e.g ["00", "33", "FF"])
  var rgbRegex = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

  return function (css) {
    // build hex -> converter (returns array)
    var hexRgb = function(hex){
      var result = hex
        .replace(/^\s+|\s+$/g, '')
        .replace(shorthandRegex, function(m, r, g, b) {
          return '#' + r + r + g + g + b + b;
        })
        .match(rgbRegex);

      // If the result can’t be parsed, fallback to black as rgb
      result = result || [null, '00', '00', '00'];

      return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      ] : [0, 0, 0];
    };

    // build our plugin handler
    var ruleHandler = function(decl) {

      var input = decl.value;
      var output = '';

      // only process rgba declaration values
      if (input.indexOf('rgba') === -1) {
        return false;
      }

      // strip out surrounding css property and throw the values in an array
      var rgba = input.split('(')[1].split(')')[0];
      rgba = rgba.split(',');

      // only process rgba values with 2 arguments (hex + alpha)
      if (rgba.length > 2){
        return false;
      }

      // store the alpha value for safe keeping
      var a = rgba[1];

      // and strip any trailing spaces
      a = a.replace(/\s/g, '');

      // rip out the alpha and turn array into hex string
      var hex = rgba.splice(0, 1);
      hex = hex.toString();

      // feed it to our converter
      var rgb = hexRgb(hex);

      // add the alpha back in
      rgb.push(a);

      // convert the whole thing to a string again and add back in css wrapper
      output = rgb.toString();
      output = 'rgba(' + output + ')';

      // create the new declaration value
      decl.value = output;

    };

    // loop through each css rule and declaration, and run our plugin through them
    css.eachRule(function(rule) {
      rule.each(ruleHandler);
    });

  };
});
