function updateToViewName(hookConfig, dataModel, currentViewData) {
  currentViewData.name = [
    currentViewData.other.name.value[0],
  ].join(' ');
}

module.exports = function initialize() {
  Simput.registerHook('caseNameToView', updateToViewName);
};
