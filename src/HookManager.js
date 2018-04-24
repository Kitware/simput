const HOOKS = {};

function noOpHook(hookConfiguration, fullDataModel, localViewDataModel) {}

function registerHook(name, fn) {
  HOOKS[name] = fn;
}

function applyHook(hookConfig, fullDataModel, viewDataModel) {
  const hookFn = HOOKS[hookConfig.type] || noOpHook;
  hookFn(hookConfig, fullDataModel, viewDataModel);
}

export default {
  applyHook,
  registerHook,
};

// ----------------------------------------------------------------------------
// Generic hooks
// ----------------------------------------------------------------------------

function copyViewNameToAttributeParameter(
  hookConfiguration,
  fullDataModel,
  localViewDataModel
) {
  const name = localViewDataModel.name;
  const [attributeName, parameterId] = hookConfiguration.attribute.split('.');
  localViewDataModel[attributeName][parameterId].value = [name];
}

function paramToViewName(hookConfig, dataModel, currentViewData) {
  const [attributeName, parameterId] = hookConfig.attribute.split('.');
  currentViewData.name = currentViewData[attributeName][parameterId].value[0];
}

// ----------------------------------------------------------------------------
// Generic hooks registration
// ----------------------------------------------------------------------------

registerHook(
  'copyViewNameToAttributeParameter',
  copyViewNameToAttributeParameter
);

registerHook('copyParameterToViewName', paramToViewName);
