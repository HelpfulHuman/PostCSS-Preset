var pkg = require("../package.json");
var isArray = require("lodash/isArray");
var camelcase = require("lodash/camelcase");
var omit = require("lodash/omit");

/**
 * Will automatically prefix the moduleName with postcss- if the
 * package can't be found without it in the package dependencies.  If
 * a tuple is given, then the first value will be used.
 *
 * @param  {String} moduleName
 * @return {Function}
 */
function requirePlugin (moduleName) {
  if (isArray(moduleName)) {
    moduleName = moduleName[0];
  }
  if (!pkg.dependencies[moduleName]) {
    moduleName = ("postcss-" + moduleName);
  }
  return require(moduleName);
}

/**
 * Returns a camelCase version of the given plugin name and removes
 * the postcss- prefix if it exists.  If the given moduleName is a tuple,
 * then the second value will be used as the plugin name as-is.
 *
 * @param  {String} moduleName
 * @param  {Object} aliases
 * @return {String}
 */
function getPluginName (moduleName) {
  var val = [].concat(moduleName);
  return (val.length > 1 ? val[1] : val[0]);
}

/**
 * Handles a given predicate and config.
 *
 * @param  {Function|Bool} predicate
 * @param  {Object} config
 * @return {Bool}
 */
function testPredicate (predicate, config) {
  if (typeof predicate === "function") {
    return predicate(config);
  }
  return !!predicate;
}

/**
 * Merges 2 configs together and returns the result.
 *
 * @param  {Object} sudo
 * @param  {Object} modifier
 * @return {Object}
 */
function mergeConfig (sudo, modifier) {
  if (!modifier) {
    return sudo
  } else if (typeof modifier === "function") {
    return modifier(sudo);
  } else if (typeof modifier === "function") {
    return Object.assign({}, sudo, modifier);
  }
}

/**
 * Loads, configures and initializes a plugin if the predicate for
 * the plugin passes based on the given config.
 *
 * @param  {String} moduleName
 * @param  {Function|Bool} predicate
 * @param  {Function} modifyConfig
 * @return {Function}
 */
function createAddPlugin (plugins, config) {
  return function addPlugin (moduleName, predicate, modifyConfig) {
    var init = requirePlugin(moduleName);
    var name = getPluginName(moduleName);
    var sudo = (config.$sudo[name] | {});
    if (testPredicate(predicate, config) || sudo.forceEnable) {
      plugins.push(init(mergeConfig(sudo, modifyConfig)));
    }
  };
}

module.exports = createAddPlugin;