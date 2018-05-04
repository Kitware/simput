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

function applyAll(fullDataModel, model) {
  if (fullDataModel && fullDataModel.data) {
    Object.keys(fullDataModel.data).forEach((viewId) => {
      const hooks = model.views[viewId].hooks || [];
      const views = fullDataModel.data[viewId];
      for (let viewIdx = 0; viewIdx < views.length; viewIdx++) {
        const viewDataModel = views[viewIdx];
        for (let hookIdx = 0; hookIdx < hooks.length; hookIdx++) {
          applyHook(hooks[hookIdx], fullDataModel, viewDataModel, model);
        }
      }
    });
  }
}

function getExternal(dataModel) {
  if (!dataModel.external) {
    dataModel.external = {};
  }
  return dataModel.external;
}

export default {
  applyHook,
  registerHook,
  applyAll,
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
  while (tokens.length && value) {
    const token = tokens.shift();
    value = value[token];
  }
  if (
    value !== undefined &&
    currentViewData[attributeName] &&
    currentViewData[attributeName][parameterId]
  ) {
    currentViewData[attributeName][parameterId].value[0] = value;
  }
}

// ----------------------------------------------------------------------------

function copyToExternal(hookConfig, dataModel, currentViewData) {
  const { src, dst } = hookConfig;

  // src
  let value = dataModel;
  const srcTokens = src.split('.');
  while (srcTokens.length && value) {
    const token = srcTokens.shift();
    value = value[token];
  }

  // dst
  const dstTokens = dst.split('.');
  const lastKey = dstTokens.pop();
  let container = getExternal(dataModel);
  while (dstTokens.length && value) {
    const token = dstTokens.shift();
    if (!container[token]) {
      container[token] = {};
    }
    container = container[token];
  }
  container[lastKey] = value;
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
registerHook('copyToExternal', copyToExternal);
