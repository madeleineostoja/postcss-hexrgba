# PostCSS HexRGBa
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

[PostCSS][PostCSS] plugin that adds shorthand hex methods to rbga() values.

Part of [Rucksack - CSS Superpowers](http://simplaio.github.io/rucksack).

```css
.foo {
  color: rgba(#0fab53, 0.8)
}

.bar {
  background: linear-gradient(rgba(#fff, .1), rgba(#fff, .2));
}
```

```css
.foo {
  color: rgba(15,171,83, 0.8)
}

.bar {
  background: linear-gradient(rgba(255,255,255, .1), rgba(255,255,255, .2));
}
```

--

### Usage

```js
postcss([ require('postcss-hexrgba') ])
```

See [PostCSS][PostCSS] docs for examples for your environment.

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
