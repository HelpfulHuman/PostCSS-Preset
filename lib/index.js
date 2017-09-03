var f = require("lodash/fp");
var pick = require("lodash/pick");
var isArray = require("lodash/isArray");
var modes = require("./modes");
var createAddPlugin = require("./createAddPlugin");

/*
 * Returns the given config with defaults, specifically for building plugins.
 *
 * @param  {Object} config
 * @return {Object}
 */
function getConfigWithDefaults (config) {
  var browsers = (config.browsers || ["last 2 version", "ie >= 10"]);
  var useLegacy = config.legacyBrowsers; // TODO: determine this automatically

  return Object.assign({
    $sudo: {},
    autoreset: false,
    buildMode: modes.MODE_DEFAULT,
    browsers: browsers,
    // dontConvertPx: false,
    enableShortRules: true,
    nextCSS: true,
    optimize: (process.env.NODE_ENV === "production"),
    pesudoFallbacks: useLegacy,
    preCSS: ["@import", "@mixin", "@at-root", "@lookup", "@extend"],
    remFallback: useLegacy,
    rgbaFallback: useLegacy,
    variables: {},
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
  config = getConfigWithDefaults(config);
  modes.validateMode(config.buildMode);

  var plugins = [];

  var addPlugin = createAddPlugin(plugins, config);
  var hasPreRule  = f.contains(f, config.preCSS);

  addPlugin("partial-import", hasPreRule("@import"));
  addPlugin("mixins", hasPreRule("@mixin"));
  addPlugin(["advanced-variables","advancedVars"], true, pick(config, ["variables"]));
  addPlugin("autoreset", config.autoreset);
  addPlugin("short", config.enableShortRules);
  addPlugin(["custom-properties", "customProps"], config.nextCSS);
  addPlugin("apply", config.nextCSS);
  addPlugin("calc", config.nextCSS);
  addPlugin("custom-media", config.nextCSS);
  addPlugin(["media-minmax", "mediaMinMax"], config.nextCSS);
  addPlugin("custom-selectors", config.nextCSS);
  addPlugin("nesting", config.nextCSS);
  addPlugin(["atroot", "atRoot"], hasPreRule("@at-root"));
  addPlugin("property-lookup", hasPreRule("@lookup"));
  addPlugin("extend", hasPreRule("@extend"));
  addPlugin(["image-set-polyfill", "imageSet"], config.nextCSS);
  addPlugin("attribute-case-insensitive", config.nextCSS);
  addPlugin("color-hwb", config.nextCSS);
  addPlugin("color-hsl", config.nextCSS);
  addPlugin("color-rgb", config.nextCSS);
  addPlugin("color-gray", config.nextCSS);
  addPlugin("color-hex-alpha", config.nextCSS);
  addPlugin("color-function", config.nextCSS);
  addPlugin("font-family-system-ui", config.nextCSS);
  addPlugin("font-variant", config.nextCSS);
  addPlugin(["pleeease-filters", "filters"], config.nextCSS);
  addPlugin("initial", config.nextCSS);
  addPlugin(["pseudoelements", "pseudoElements"], config.pseudoFallbacks, f.merge({
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
  }));
  addPlugin("selector-matches", config.nextCSS);
  addPlugin("selector-not", config.nextCSS);
  addPlugin("pseudo-class-any-link", config.nextCSS);
  addPlugin("replace-overflow-wrap", config.nextCSS);
  addPlugin("color-rgba-fallback", config.rgbaFallback);
  addPlugin("pixrem", config.remFallback);
  addPlugin("autoprefixer", isArray(config.browsers), pick(config, "browsers"));
  addPlugin("cssnano", config.optimize, { preset: "default" });

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
  MODE_DEFAULT: modes.MODE_DEFAULT,
  MODE_MODULAR: modes.MODE_MODULAR,
  MODE_WEBPACK: modes.MODE_WEBPACK,
  buildPlugins: buildPlugins,
  buildConfig:  buildConfig,
};