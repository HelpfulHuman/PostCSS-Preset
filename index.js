var filters       = require("pleeease-filters");
var autoprefixer  = require("autoprefixer");
var cssnano       = require("cssnano");
var pixrem        = require("pixrem");

/**
 * Set the mode constants.
 */
const MODE_DEFAULT  = "MODE_DEFAULT";
const MODE_MODULAR  = "MODE_MODULAR";
const MODE_WEBPACK  = "MODE_WEBPACK";

/**
 * Throws an error if an invalid mode is provided.
 *
 * @param  {*} buildMode
 */
function validateMode (buildMode) {
  if (
    buildMode !== MODE_DEFAULT &&
    buildMode !== MODE_MODULAR &&
    buildMode !== MODE_WEBPACK
  ) {
    throw new Error("Invalid configuration: `buildMode` is set to an unknown value `"+buildMode+"`.  Expected `MODE_DEFAULT`, `MODE_MODULAR` or `MODE_WEBPACK`.");
  }
}

/**
 * Omit keys from the object based on the given array of keys.
 *
 * @param  {String[]} keys
 * @param  {Object} obj
 * @return {Object}
 */
function omit (keys, obj) {
  var out = {};
  for (var k in obj) {
    if (keys.indexOf(k) === -1) {
      out[k] = obj[k];
    }
  }
  return out;
}

/**
 * Returns true if the legacy browsers are to be supported based on the
 * given config.
 *
 * TODO: Scan config.browsers for older browsers
 *
 * @param  {Object} config
 * @return {Bool}
 */
function supportsLegacyBrowsers (config) {
  return config.legacyBrowsers;
}

/**
 * Returns the given config with defaults, specifically for building plugins.
 *
 * @param  {Object} config
 * @return {Object}
 */
function getPluginDefaults (config) {
  var browsers = (config.browsers || ["last 2 version", "ie >= 10"]);
  var useLegacy = supportsLegacyBrowsers(config);

  return Object.assign({
    autoreset: null,
    baseFontSize: 16,
    buildMode: MODE_DEFAULT,
    browsers: browsers,
    dontConvertPx: false,
    enableShortRules: true,
    optimize: (process.env.NODE_ENV === "production"),
    pesudoFallbacks: useLegacy,
    nextCSS: true,
    remFallback: useLegacy,
    rgbaFallback: useLegacy,
  }, config);
}

/**
 * Returns an array containing all of the preset's configured plugins based
 * on the given options.
 *
 * @param  {Object} config
 * @return {Array}
 */
function buildPlugins (config) {
  // Get config with defaults
  config = getPluginDefaults(config);

  // Validate the build mode
  validateMode(config.buildMode);

  // Prepare the array that will contain the outputted plugins
  var plugins = [];

  // Helper for loading and instantiating postcss-specific plugins
  var loadPlugin = function (plugin, options) {
    plugins.push(require("postcss-"+plugin)(options));
  }

  if (config.buildMode === MODE_DEFAULT) {
    loadPlugin("easy-import");
  }

  if (config.autoreset !== null) {
    loadPlugin("autoreset");
  }

  if (config.enableShortRules === true) {
    loadPlugin("short");
  }

  if (config.nextCSS === true) {
    loadPlugin("custom-properties");
    loadPlugin("apply");
    loadPlugin("calc");
    loadPlugin("custom-media");
    loadPlugin("media-min-max");
    loadPlugin("custom-selectors");
    loadPlugin("nesting");
    loadPlugin("image-set-polyfill");
    loadPlugin("attribute-case-insensitive");
    loadPlugin("color-hwb");
    loadPlugin("color-hsl");
    loadPlugin("color-rgb");
    loadPlugin("color-gray");
    loadPlugin("color-hex-alpha");
    loadPlugin("color-function");
    loadPlugin("font-family-system-ui");
    loadPlugin("font-variant");
    plugins.push(filters());
    loadPlugin("initial");
  }

  if (config.pseudoFallbacks === true) {
    loadPlugin("pseudoelements", {
      single: true,
      elements: [
        "before",
        "after",
        "first-letter",
        "first-line",
        "hover",
        "focus",
        "active",
        "not",
        "first-child",
        "last-child",
      ],
    });
  }

  if (config.nextCSS === true) {
    loadPlugin("selector-matches");
    loadPlugin("selector-not");
    loadPlugin("pseudo-class-any-link");
    loadPlugin("replace-overflow-wrap");
  }

  if (config.rgbaFallback === true) {
    loadPlugin("color-rgba-fallback");
  }

  if (config.dontConvertPx !== true) {
    loadPlugin("px-to-em", { base: config.baseFontSize });
  }

  if (config.remFallback === true) {
    plugins.push(pixrem());
  }

  if (Array.isArray(config.browsers)) {
    plugins.push(autoprefixer({ browsers: config.browsers }));
  }

  if (config.optimize === true) {
   plugins.push(cssnano({ preset: "default" }));
  }

  return plugins;
}

/**
 * Returns a PostCSS configuration with preset plugins set on top.
 *
 * @param  {Object|Function} config
 * @return {Object|Function}
 */
function buildConfig (config) {
  if (typeof config !== "function") {
    if ( ! config) config = {};
    return Object.assign(config, {
      plugins: buildPlugins(config),
    });
  }

  return function (ctx) {
    config = config(ctx);
    return Object.assign(config, {
      plugins: buildPlugins(config),
    });
  };
}

module.exports = {
  MODE_DEFAULT: MODE_DEFAULT,
  MODE_MODULAR: MODE_MODULAR,
  MODE_WEBPACK: MODE_WEBPACK,
  buildPlugins: buildPlugins,
  buildConfig: buildConfig,
};