function updateViewName(hookConfig, dataModel, currentViewData) {
  currentViewData.name = currentViewData[hookConfig.from].name.value[0];
}

module.exports = function initialize() {
  Simput.registerHook('nameToView', updateViewName);
};
