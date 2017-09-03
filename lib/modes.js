/**
 * Throws an error if an invalid mode is provided.
 *
 * @param  {*} buildMode
 */
function validateMode (buildMode) {
  if (
    buildMode !== "MODE_DEFAULT" &&
    buildMode !== "MODE_MODULAR" &&
    buildMode !== "MODE_WEBPACK"
  ) {
    throw new Error("Invalid configuration: `buildMode` is set to an unknown value `"+buildMode+"`.  Expected `MODE_DEFAULT`, `MODE_MODULAR` or `MODE_WEBPACK`.");
  }
}

module.exports = {
  MODE_DEFAULT: "MODE_DEFAULT",
  MODE_MODULAR: "MODE_MODULAR",
  MODE_WEBPACK: "MODE_WEBPACK",
  validateMode: validateMode,
};