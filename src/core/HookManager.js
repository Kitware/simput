import defaultHooks from 'simput/src/hooks';

const HOOKS = {};

// ----------------------------------------------------------------------------

function noOpHook(
  hookConfiguration,
  fullDataModel,
  localViewDataModel,
  model
) {}

// ----------------------------------------------------------------------------

function registerHook(name, fn) {
  HOOKS[name] = fn;
}

// ----------------------------------------------------------------------------

function applyHook(hookConfig, fullDataModel, viewDataModel, model) {
  const hookFn = HOOKS[hookConfig.type] || noOpHook;
  hookFn(hookConfig, fullDataModel, viewDataModel, model);
}

// ----------------------------------------------------------------------------

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

export default {
  applyHook,
  registerHook,
  applyAll,
};

// ----------------------------------------------------------------------------
// Generic hooks registration
// ----------------------------------------------------------------------------

Object.keys(defaultHooks).forEach((name) => {
  registerHook(name, defaultHooks[name]);
});
