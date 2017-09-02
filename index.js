var autoprefixer = require("autoprefixer");
var px2em = require("postcss-px-to-em");
var cssnano = require("cssnano");

/**
 * Returns the given config with defaults, specifically for building plugins.
 *
 * @param  {Object} config
 * @return {Object}
 */
function getPluginDefaults (config) {
  return Object.assign({
    browsers: ["last 2 version", "ie >= 10"],
    optimize: (process.env.NODE_ENV === "production"),
  }, config);
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
 * Returns an array containing all of the preset's configured plugins based
 * on the given options.
 *
 * @param  {Object} config
 * @return {Array}
 */
function buildPlugins (config) {
  var plugins = [];
  config = getPluginDefaults(config);

  plugins.push(px2em({ base: 16 }));
  plugins.push(autoprefixer({ browsers: config.browsers }));

  if (config.optimize === true) {
   plugins.push(cssnano({ preset: "default" }));
  }

  return plugins;
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