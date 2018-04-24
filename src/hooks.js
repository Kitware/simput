function updateToViewName(hookConfig, dataModel, currentViewData) {
  currentViewData.name = [
    currentViewData.person.lastName.value[0],
    currentViewData.person.firstName.value[0],
  ].join(' ');
}

module.exports = function initialize() {
  Simput.registerHook('personNameToView', updateToViewName);
};
