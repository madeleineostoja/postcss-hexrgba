# PostCSS HexRGBa
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

[PostCSS] plugin that adds shorthand hex methods to rbga() values.

```css
.foo {
  color: rgba(#663399, 0.8)
}

.bar {
  color: rgba(#fff, .5); 
}
```

```css
.foo {
  color: rgba(102,51,153,.8)
}

.bar {
  color: rgba(255,255,255,.5)
}
```

--

### Usage

```js
postcss([ require('postcss-hexrgba') ])
```

See [PostCSS] docs for examples for your environment.

--

### License

MIT © [Sean King](https://twitter.com/seaneking)

[npm-image]: https://badge.fury.io/js/postcss-hexrgba.svg
[npm-url]: https://npmjs.org/package/postcss-hexrgba
[travis-image]: https://travis-ci.org/seaneking/postcss-hexrgba.svg?branch=master
[travis-url]: https://travis-ci.org/seaneking/postcss-hexrgba
[daviddm-image]: https://david-dm.org/seaneking/postcss-hexrgba.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/seaneking/postcss-hexrgba
[PostCSS]: https://github.com/postcss/postcss

