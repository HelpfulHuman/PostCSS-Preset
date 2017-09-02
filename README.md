# Helpful Human PostCSS Preset

This library provides a default set of PostCSS plugins and configurations based on the internal standards employed at [Helpful Human](http://helpfulhuman.com).

**Included plugins:**

- Support for [automatic vendor prefixing](https://github.com/postcss/autoprefixer).
- Automatic conversion of [`px` to `em`](https://github.com/macropodhq/postcss-px-to-em).
- Optimize the build for production by discarding comments and duplicates, consolidating rules and elements and more using [cssnano](http://cssnano.co/).

## How To Use

Install via `npm`:

```
npm install --save-dev @helpfulhuman/postcss-preset
```

## `postcss.config.js` Usage

The `buildConfig()` method allows you to quickly create the entire config needed for PostCSS.  Just create a `postcss.config.js` file with the following code:

```js
var preset = require("@helpfulhuman/postcss-preset");

module.exports = preset.buildConfig({ /* buildConfig options */ });
```

### `buildConfig()` Options

> **Note:** `buildConfig()` supports all of the listed [plugin options]() as well.

Name | Type | Description
-----|------|------------
**dest** | `String` | The filepath to where the final CSS file should be saved.  _Defaults to `{cwd}/public/main.css`._

## Plugins Only Usage

Alternatively, if you're in a situation where you don't need a full configuration for PostCSS, you can get an array of just the configured plugins using the `buildPlugins()` method.

```js
var preset = require("@helpfulhuman/postcss-preset");

var plugins = preset.buildPlugins({ /* buildPlugin options */ })
```

### `buildPlugins()` Options

Name | Type | Description
-----|------|------------
**browsers** | `String[]` | An array of strings used for adding vendor prefixes automatically.  See [autoprefixer's `browser` documentation](https://github.com/postcss/autoprefixer#browsers) for more information.  _Defaults to `["last 2 version", "ie >= 10"]`_
**optimize** | `Bool` | Optimizes the final output for production releases.  _Defaults to `true` when the `NODE_ENV` is set to `production`._