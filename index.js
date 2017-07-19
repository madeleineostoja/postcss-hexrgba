var postcss = require('postcss');

module.exports = postcss.plugin('postcss-hexrgba', function () {

    /**
     * Hex to RGB converter
     * @param  {string} hex hexidecimal string without #
     * @return {array} RGB values
     */
    var hexRgb = function(hex){

      // If given shorthand, expand it
      var shorthandCheck = /^([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandCheck, function(m, r, g, b) {
          return r + r + g + g + b + b;
      });

      // Extract full hex into an array
      var rgbRegex = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
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

      var input = decl.value,
          output = input,
          hexes = [];

      // Get the raw hex values out of the decl value and put them in an array
      input.replace(/rgba\(\#(.*?)\,/g, function(a, b){
        hexes.push(b);
      });

      // If there are no hexes in the value, exit
      if (!hexes.length) {
        return;
      }

      // Convert each hex to RGB
      hexes.forEach(function(hex) {
        var rgb = hexRgb(hex);

        // If conversion fails, warn and exit
        if (!rgb) {
          result.warn('not a valid hex', { node: decl });
          return;
        }

        rgb = rgb.toString();

        // Replace hex values in output string
        var matchHex = new RegExp('#' + hex);
        output = output.replace(matchHex, rgb);

      });

      decl.replaceWith({prop: decl.prop, value: output });

    };

    //  Do it!
    return function(css, result) {

      css.walkDecls(function(decl) {

        // Only process rgba declaration values
        if (typeof decl.value === 'undefined' || decl.value.indexOf('rgba') === -1) {
          return;
        }

        ruleHandler(decl, result);

      });

  };
});
