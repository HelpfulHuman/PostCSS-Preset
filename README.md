# Helpful Human's PostCSS Presets

This library provides a default set of PostCSS plugins and configurations based on the internal standards employed at [Helpful Human](http://helpfulhuman.com).

## How To Use

Install via `npm`:

```
npm install --save-dev @helpfulhuman/postcss-preset
```

### As PostCSS Config

The `buildConfig()` method allows you to quickly create the entire config needed for PostCSS.  Just create a `postcss.config.js` file with the following code:

```js
var preset = require("@helpfulhuman/postcss-preset");

module.exports = preset.buildConfig({ /* buildConfig options */ });
```

#### `buildConfig()` Options

> **Note:** `buildConfig()` supports all of the listed [plugin options](#buildplugins-options) as well.

Name | Type | Description
-----|------|------------
**dest** | `String` | The filepath to where the final CSS file should be saved.  _Defaults to `{cwd}/public/main.css`._

### Plugins Only

Alternatively, if you're in a situation where you don't need a full configuration for PostCSS, you can get an array of just the configured plugins using the `buildPlugins()` method.

> **Note:** `buildConfig()` invokes this function under the hood.

```js
var preset = require("@helpfulhuman/postcss-preset");

var plugins = preset.buildPlugins({ /* buildPlugin options */ });
```

#### `buildPlugins()` Options

Name | Type | Description
-----|------|------------
**autoreset** | `Object` | Enables the [autoreset plugin](https://github.com/maximkoretskiy/postcss-autoreset) when a configuration object is provided and ignored when set to `null`. Recommended for use with CSS modules. _Defaults to `null`._
**browsers** | `String[]` | An array of strings used for automatically adding vendor prefixes.  See [autoprefixer's `browser` documentation](https://github.com/postcss/autoprefixer#browsers) for more information.  _Defaults to `["last 2 version", "ie >= 10"]`_
**dontConvertPx** | `Bool` | Disables the [px-to-em plugin](https://npmjs.com/package/postcss-px-to-em) from performing automatic conversion of `px` units to `em`.  _Defaults to `false`._
**enableShortRules** | `Bool` | Enables the use of [short rule notation](https://www.npmjs.com/package/postcss-short) when set to `true`.  _Defaults to `true`._
**legacyBrowsers** | `Bool` | Enables broadstroke legacy browser support (like IE9) when set to `true`. _Defaults to `false`._
**nextCSS** | `Bool` | When `true`, enables polyfills for [future CSS features](http://cssnext.io/) including [custom properties, `var()`](https://npmjs.com/package/postcss-custom-properties), [`@apply`](https://npmjs.com/package/postcss-apply), [variable `calc()`](https://npmjs.com/package/postcss-calc), [`@custom-media`](https://npmjs.com/package/postcss-custom-media), [`@media` ranges](https://npmjs.com/package/postcss-media-min-max), [`@custom-selector`](https://npmjs.com/package/postcss-custom-selectors), [element nesting](https://npmjs.com/package/postcss-nesting), [`image-set`](https://npmjs.com/package/postcss-image-set-polyfill), [case-insensitive attributes](https://npmjs.com/package/postcss-attribute-case-insensitive), [`hwb()`](https://npmjs.com/package/postcss-color-hwb), Level-4 [`hsl()`](https://www.npmjs.com/package/postcss-color-hsl) and [`rgb()`](https://www.npmjs.com/package/postcss-color-rgb), [`gray()`](https://npmjs.com/package/postcss-color-gray), [RGBA hexadecimal color notations](https://npmjs.com/package/postcss-color-hex-alpha), [`color()`](https://npmjs.com/package/postcss-color-function), [`system-ui` fonts](https://npmjs.com/package/postcss-font-family-system-ui), [`font-variant`](https://npmjs.com/package/postcss-font-variant), [`filter()` (for SVGs)](https://npmjs.com/package/pleeease-filters), [`:matches`](https://npmjs.com/package/postcss-selector-matches), [Level-4 `:not`](https://npmjs.com/package/postcss-selector-not), [`:any-link`](https://npmjs.com/package/postcss-pseudo-class-any-link), and [`overflow-wrap`](https://www.npmjs.com/package/postcss-replace-overflow-wrap). _Defaults to `true`._
**optimize** | `Bool` | Optimizes the final output for production releases.  _Defaults to `true` when the `NODE_ENV` is set to `production`._
**pseudoFallbacks** | `Bool` | Provides single colon fallbacks for `::pseudo` elements including `before`, `after`, `first-letter`, `first-line`, `first-child`, `last-child`, `hover`, `focus`, and `active` in order to support older browsers when set to `true`. _Defaults to `legacyBrowsers`' value._
**remFallback** | `Bool` | Helps support older browsers by automatically adding a `px` fallback for rules using `rem` units.  _Defaults to `legacyBrowsers`' value._
**rgbaFallback** | `Bool` | Enables `rgba()` to `rgb()` fallback to be added for legacy browsers when set to `true`. _Defaults to `legacyBrowsers`' value._