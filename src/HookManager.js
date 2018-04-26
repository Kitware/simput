const HOOKS = {};

function noOpHook(
  hookConfiguration,
  fullDataModel,
  localViewDataModel,
  model
) {}

function registerHook(name, fn) {
  HOOKS[name] = fn;
}

function applyHook(hookConfig, fullDataModel, viewDataModel, model) {
  const hookFn = HOOKS[hookConfig.type] || noOpHook;
  hookFn(hookConfig, fullDataModel, viewDataModel, model);
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

// ----------------------------------------------------------------------------

function paramToViewName(hookConfig, dataModel, currentViewData) {
  const [attributeName, parameterId] = hookConfig.attribute.split('.');
  if (
    currentViewData[attributeName] &&
    currentViewData[attributeName][parameterId]
  ) {
    currentViewData.name = currentViewData[attributeName][parameterId].value[0];
  }
}

// ----------------------------------------------------------------------------

function copy(hookConfig, dataModel, currentViewData) {
  const { src, dst } = hookConfig;
  let value = dataModel;
  const [attributeName, parameterId] = dst.split('.');
  const tokens = src.split('.');
  while (tokens.length) {
    const token = tokens.shift();
    value = value[token];
  }
  if (
    currentViewData[attributeName] &&
    currentViewData[attributeName][parameterId]
  ) {
    currentViewData[attributeName][parameterId].value[0] = value;
  }
}

// ----------------------------------------------------------------------------
// Generic hooks registration
// ----------------------------------------------------------------------------

registerHook(
  'copyViewNameToAttributeParameter',
  copyViewNameToAttributeParameter
);

registerHook('copyParameterToViewName', paramToViewName);
registerHook('copy', copy);
