'use strict';

var postcss = require('postcss');

module.exports = postcss.plugin('postcss-hexrgba', function () {
  return function (css) {

    /**
     * Hex to RGB converter
     * @param  {string} hex hexidecimal string
     * @return {array} RGB values
     */
    var hexRgb = function(hex){

      // Strip the #
      var stripped = hex.split('');
      stripped.shift();
      hex = stripped.join('');

      // If given shorthand, expand it
      var shorthandCheck = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandCheck, function(m, r, g, b) {
          return r + r + g + g + b + b;
      });

      // Convert it
      var convert = parseInt(hex, 16);
      var red = convert >> 16 & 255;
      var green = convert >> 8 & 255;
      var blue = convert & 255;

      // Throw the results into an array
      hex = [red, green, blue];

      return hex;

    };

    /**
     * CSS rule handler
     * @param  {string} decl CSS delcaration
     */
    var ruleHandler = function(decl) {

      var input = decl.value;
      var output = '';

      // Strip out surrounding css property and throw the values in an array
      var rgba = input.split('(')[1].split(')')[0];
      rgba = rgba.split(',');

      // Only process rgba values with 2 arguments (hex + alpha)
      if (rgba.length > 2){
        return;
      }

      // Store the alpha value for safe keeping
      var a = rgba[1];

      // And strip any trailing spaces
      a = a.replace(/\s/g, '');

      // Rip out the alpha and turn array into hex string
      var hex = rgba.splice(0, 1);
      hex = hex.toString();

      // Feed it to our converter
      var rgb = hexRgb(hex);

      // Add the alpha back in
      rgb.push(a);

      // Convert the whole thing to a string again and add back in css wrapper
      output = rgb.toString();
      output = 'rgba(' + output + ')';

      // Create the new declaration value
      decl.value = output;

    };

    // Loop through each css rule and declaration, and run our plugin through them
    css.eachDecl(function(decl) {

      // Only process rgba declaration values
      if (decl.value.indexOf('rgba') === -1) {
        return;
      }

      // Pass the relevant decls to our rule handler
      ruleHandler(decl);

    });

  };
});
