'use strict';

var postcss = require('postcss');

module.exports = postcss.plugin('postcss-hexrgba', function () {
  return function (css) {

    // build hex -> converter (returns array)
    var hexRgb = function(hex){

      // strip the #
      var stripped = hex.split('');
      stripped.shift();
      hex = stripped.join('');

      // if given a shorthand decleration, expand it
      var shorthandCheck = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandCheck, function(m, r, g, b) {
          return r + r + g + g + b + b;
      });

      // convert it
      var convert = parseInt(hex, 16);
      var red = convert >> 16 & 255;
      var green = convert >> 8 & 255;
      var blue = convert & 255;

      // throw the results into an array
      hex = [red, green, blue];

      return hex;

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
      var rgb = hexRgb('#ffffff');

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
