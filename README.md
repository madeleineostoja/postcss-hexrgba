# PostCSS HexRGBA
[![NPM version][npm-badge]][npm-url] [![Downloads][downloads-badge]][npm-url] [![Build Status][travis-badge]][travis-url]

[PostCSS][PostCSS] plugin that adds shorthand hex methods to rgba() values.

_Part of [Rucksack - CSS Superpowers](https://www.rucksackcss.org/)_

**Input**

```css
.foo {
  color: rgba(#0fab53, 0.8);
}

.bar {
  background: linear-gradient(rgba(#fff, .1), rgba(#fff, .2));
}
```

**Output**

```css
.foo {
  color: rgba(15,171,83, 0.8);
}

.bar {
  background: linear-gradient(rgba(255,255,255, .1), rgba(255,255,255, .2));
}
```

## Usage

```js
postcss([ require('postcss-hexrgba') ])
```

### Options

#### `colorFunctionNotation`

Specify the color function notation to use. There are two options: `'modern'` and `'legacy'`.
The default is `'legacy'`.

```js
postcss([ require('postcss-hexrgba')({ colorFunctionNotation: 'modern' }) ])
```

[Modern](https://www.w3.org/TR/css-color-4/#rgb-functions) notation:

```css
.foo {
  color: rgba(15 171 83 / 80%);
}
```

[Legacy](https://www.w3.org/TR/css-color-4/#legacy-color-syntax) notation:

```css
.foo {
  color: rgba(15,171,83, 0.8);
}
```

See [PostCSS][PostCSS] docs for examples for your environment.

***

MIT © [Sean King](https://twitter.com/seaneking)

[npm-badge]: https://badge.fury.io/js/postcss-hexrgba.svg
[npm-url]: https://npmjs.org/package/postcss-hexrgba
[downloads-badge]: https://img.shields.io/npm/dm/postcss-hexrgba.svg
[travis-badge]: https://travis-ci.org/seaneking/postcss-hexrgba.svg?branch=master
[travis-url]: https://travis-ci.org/seaneking/postcss-hexrgba
[PostCSS]: https://github.com/postcss/postcss
