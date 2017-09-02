var filters = require("pleeease-filters");
var autoprefixer = require("autoprefixer");
var cssnano = require("cssnano");
var pixrem = require("pixrem");

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

  // Prepare the array that will contain the outputted plugins
  var plugins = [];

  // Helper for loading and instantiating postcss-specific plugins
  var loadPlugin = function (plugin, options) {
    plugins.push(require("postcss-"+plugin)(options));
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
 * Returns the given config with defaults, specifically for building a PostCSS config.
 *
 * @param  {Object} config
 * @return {Object}
 */
function getConfigDefaults (config) {
  return Object.assign({
    // TODO: add config defaults
  }, config);
}

/**
 * Returns a PostCSS configuration with preset plugins.
 *
 * @param  {Object} config
 * @return {Object}
 */
function buildConfig (config) {
  config = getConfigDefaults(config);

  return {
    plugins: buildPlugins(config),
  };
}

module.exports = {
  buildPlugins: buildPlugins,
  buildConfig: buildConfig,
};