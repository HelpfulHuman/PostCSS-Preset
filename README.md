# Helpful Human's PostCSS Presets

This library provides a default set of PostCSS plugins and configurations based on the internal standards employed at [Helpful Human](http://helpfulhuman.com).

## Getting Started

Install via `npm`:

```
npm install --save-dev @helpfulhuman/postcss-preset
```

## Usage

The `buildConfig()` method allows you to quickly create the entire config needed for PostCSS.

### Standard PostCSS Config

If you're using PostCSS directly with `postcss-cli` command line tool, you can create a `postcss.config.js` file and export the results of the `buildConfig()` method.  This approach is likely the best solution for adding PostCSS support to codebases where modern tools like Webpack are not available or not needed.

> **Note:** The [postcss-partial-import plugin](https://npmjs.com/package/postcss-partial-import) is added when using the default `buildMode`.  This means you can use `@import` with relative filepaths or globs to include files in your bundled file, like you would with SASS or Stylus.

```js
var preset = require("@helpfulhuman/postcss-preset");

// no arguments are required
module.exports = preset.buildConfig({
  variables: {
    bodyFont: "Helvetica Neue, Arial, sans-serif",
    brandColor: "#CC3300",
  },
});
```

Now you can the `postcss` command line utility to build your CSS.

```
postcss src/index.css --map --output public/main.css
```

### Plugins Only

Alternatively, if you're in a situation where you don't need a full configuration for PostCSS, you can get an array of just the configured plugins using the `buildPlugins()` method.

> **Note:** `buildConfig()` invokes this function under the hood.

```js
var preset = require("@helpfulhuman/postcss-preset");

var plugins = preset.buildPlugins({ /* options */ });
```

## Options

Name | Type | Description
-----|------|------------
**autoreset** | `Object` | Enables the [autoreset plugin](https://github.com/maximkoretskiy/postcss-autoreset) when a configuration object is provided, and the plugin is disabled when set to `null`. Recommended for use with CSS modules. _Defaults to `null`._
**browsers** | `String[]` | An array of strings used for automatically adding vendor prefixes.  See [autoprefixer's `browser` documentation](https://github.com/postcss/autoprefixer#browsers) for more information.  _Defaults to `["last 2 version", "ie >= 10"]`_
**enableShortRules** | `Bool` | Enables the use of [short rule notation](https://www.npmjs.com/package/postcss-short) when set to `true`.  _Defaults to `true`._
**legacyBrowsers** | `Bool` | Enables broadstroke legacy browser support (like IE9) when set to `true`. _Defaults to `false`._
**buildMode** | `Enum` | Must be set to a value of `MODE_DEFAULT`, `MODE_MODULES` or `MODE_WEBPACK`.  _Defaults to `MODE_DEFAULT`._
**nextCSS** | `Bool` | When `true`, enables polyfills for [future CSS features](http://cssnext.io/) including [custom properties, `var()`](https://npmjs.com/package/postcss-custom-properties), [`@apply`](https://npmjs.com/package/postcss-apply), [variable `calc()`](https://npmjs.com/package/postcss-calc), [`@custom-media`](https://npmjs.com/package/postcss-custom-media), [`@media` ranges](https://npmjs.com/package/postcss-media-min-max), [`@custom-selector`](https://npmjs.com/package/postcss-custom-selectors), [element nesting](https://npmjs.com/package/postcss-nesting), [`image-set`](https://npmjs.com/package/postcss-image-set-polyfill), [case-insensitive attributes](https://npmjs.com/package/postcss-attribute-case-insensitive), [`hwb()`](https://npmjs.com/package/postcss-color-hwb), Level-4 [`hsl()`](https://www.npmjs.com/package/postcss-color-hsl) and [`rgb()`](https://www.npmjs.com/package/postcss-color-rgb), [`gray()`](https://npmjs.com/package/postcss-color-gray), [RGBA hexadecimal color notations](https://npmjs.com/package/postcss-color-hex-alpha), [`color()`](https://npmjs.com/package/postcss-color-function), [`system-ui` fonts](https://npmjs.com/package/postcss-font-family-system-ui), [`font-variant`](https://npmjs.com/package/postcss-font-variant), [`filter()` (for SVGs)](https://npmjs.com/package/pleeease-filters), [`:matches`](https://npmjs.com/package/postcss-selector-matches), [Level-4 `:not`](https://npmjs.com/package/postcss-selector-not), [`:any-link`](https://npmjs.com/package/postcss-pseudo-class-any-link), and [`overflow-wrap`](https://www.npmjs.com/package/postcss-replace-overflow-wrap). _Defaults to `true`._
**optimize** | `Bool` | Optimizes the final output for production releases.  _Defaults to `true` when the `NODE_ENV` is set to `production`._
**preCSS** | `String[]` | Enable various preprocessor features by providing an array of features to enable. _Defaults to all options: `["@import", "@mixin", "@at-root", "@lookup", "@extend"]`._
**pseudoFallbacks** | `Bool` | Provides single colon fallbacks for `::pseudo` elements including `before`, `after`, `first-letter`, `first-line`, `first-child`, `last-child`, `hover`, `focus`, and `active` in order to support older browsers when set to `true`. _Defaults to `legacyBrowsers`' value._
**remFallback** | `Bool` | Helps support older browsers by automatically adding a `px` fallback for rules using `rem` units.  _Defaults to `legacyBrowsers`' value._
**rgbaFallback** | `Bool` | Enables `rgba()` to `rgb()` fallback to be added for legacy browsers when set to `true`. _Defaults to `legacyBrowsers`' value._
**variables** | `Object` | Provide an object literal of variables to be injected and made globally available in your stylesheets.

## `$sudo` Options

> **Warning:** It is recommended that you don't touch these unless absolutely necessary.

Not listed in the options table above is the `$sudo` field that allows you to manually provide configurations to each individual plugin used by this library.  Along with the standard options that each plugin supports individually, a `forceEnable` feature is also available to ensure that the plugin is included with your configuration (despite the settings above).

##### Example

```js
var preset = require("@helpfulhuman/postcss-preset");

module.exports = preset.buildConfig({
  $sudo: {
    autoreset: {
      reset: {
        margin: 0,
        padding: 0,
        borderRadius: 0,
      },
    },
    customProperties: {
      preserve: true,
    },
  },
});
```

Below is a list of all of the plugins you can configure and their corresponding key name.

Key | Plugin
----|-------
**partialImport** | [postcss-partial-import](https://npmjs.com/package/postcss-partial-import)
**advancedVars** | [postcss-advanced-variables](https://npmjs.com/package/postcss-advanced-variables)
**autoreset** | [postcss-autoreset](https://npmjs.com/package/postcss-autoreset)
**short** | [postcss-short](https://npmjs.com/package/postcss-short)
**customProps** | [postcss-custom-properties](https://npmjs.com/package/postcss-custom-properties)
**apply** | [postcss-apply](https://npmjs.com/package/postcss-apply)
**calc** | [postcss-calc](https://npmjs.com/package/postcss-calc)
**customMedia** | [postcss-custom-media](https://npmjs.com/package/postcss-custom-media)
**mediaMinMax** | [postcss-media-minmax](https://npmjs.com/package/postcss-media-minmax)
**customSelectors** | [postcss-custom-selectors](https://npmjs.com/package/postcss-custom-selectors)
**nesting** | [postcss-nesting](https://npmjs.com/package/postcss-nesting)
**imageSet** | [postcss-image-set-polyfill](https://npmjs.com/package/postcss-image-set-polyfill)
**attributeCaseInsensitive** | [postcss-attribute-case-insensitive](https://npmjs.com/package/postcss-attribute-case-insensitive)
**colorHwb** | [postcss-color-hwb](https://npmjs.com/package/postcss-color-hwb)
**colorHsl** | [postcss-color-hsl](https://npmjs.com/package/postcss-color-hsl)
**colorRgb** | [postcss-color-rgb](https://npmjs.com/package/postcss-color-rgb)
**colorGray** | [postcss-color-gray](https://npmjs.com/package/postcss-color-gray)
**colorHexAlpha** | [postcss-color-hex-alpha](https://npmjs.com/package/postcss-color-hex-alpha)
**colorFunction** | [postcss-color-function](https://npmjs.com/package/postcss-color-function)
**fontFamilySystemUi** | [postcss-font-family-system-ui](https://npmjs.com/package/postcss-font-family-system-ui)
**fontVariant** | [postcss-font-variant](https://npmjs.com/package/postcss-font-variant)
**filters** | [pleeease-filters](https://npmjs.com/package/pleeease-filters)
**initial** | [postcss-initial](https://npmjs.com/package/postcss-initial)
**pseudoElements** | [postcss-pseudoelements](https://npmjs.com/package/postcss-pseudoelements)
**selectorMatches** | [postcss-selector-matches](https://npmjs.com/package/postcss-selector-matches)
**selectorNot** | [postcss-selector-not](https://npmjs.com/package/postcss-selector-not)
**psudoClassAnyLink** | [postcss-pseudo-class-any-link](https://npmjs.com/package/postcss-pseudo-class-any-link)
**replaceOverflowWrap** | [postcss-replace-overflow-wrap](https://npmjs.com/package/postcss-replace-overflow-wrap)
**colorRgbaFallback** | [postcss-color-rgba-fallback](https://npmjs.com/package/postcss-color-rgba-fallback)
**pixrem** | [pixrem](https://npmjs.com/package/pixrem)
**autoprefixer** | [autoprefixer](https://npmjs.com/package/autoprefixer)
**cssnano** | [cssnano](https://npmjs.com/package/cssnano)