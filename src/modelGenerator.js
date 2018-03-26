import clone from 'mout/src/lang/clone';

/* eslint-disable no-new-func */

const uiCache = {};
const showCache = {};
const parameterCache = {};
const alwaysShow = () => true;
const uiPropTypeMapping = {
  checkbox: 'Checkbox',
  enum: 'Enum',
  map: 'Map',
};

// --- Helpers ---

function getParameter(model, attrName, paramId) {
  if (!parameterCache[attrName]) {
    parameterCache[attrName] = {};
  }
  if (!parameterCache[attrName][paramId]) {
    model.definitions[attrName].parameters.forEach((param) => {
      parameterCache[attrName][param.id] = param;
    });
  }
  return parameterCache[attrName][paramId];
}

// --- UI handling ---

function generateUI(parameter, label, help, external, modelExternal) {
  // FIXME !!!!
  const ui = {
      propType: 'Cell',
      componentLabels: [],
    },
    allowedKey = ['id', 'size', 'layout', 'domain', 'default', 'type'];

  Object.keys(parameter).forEach((key) => {
    if (allowedKey.indexOf(key) !== -1) {
      ui[key] = clone(parameter[key]);
    }
  });

  if (parameter.domain && parameter.domain.external) {
    const externalKey = parameter.domain.external;
    delete ui.domain.external;
    if (external && external[externalKey]) {
      ui.domain = external[externalKey];
    } else if (modelExternal && modelExternal[externalKey]) {
      ui.domain = modelExternal[externalKey];
    } else {
      ui.domain = {
        [`${externalKey} not found`]: `${externalKey}-not-found`,
      };
    }
  }

  if (parameter.ui) {
    ui.propType = uiPropTypeMapping[parameter.ui];
  }

  if (label) {
    ui.label = label;
  }

  if (help) {
    ui.help = help;
  }

  return ui;
}

function getUI(model, attrName, paramId, labels, help, external) {
  if (!uiCache[attrName]) {
    uiCache[attrName] = {};
  }

  if (!uiCache[attrName][paramId]) {
    let uiLabels = null,
      uiHelp = null;

    if (
      labels[attrName] &&
      labels[attrName].parameters &&
      labels[attrName].parameters[paramId]
    ) {
      uiLabels = labels[attrName].parameters[paramId];
    }

    if (help && help[attrName] && help[attrName][paramId]) {
      uiHelp = help[attrName][paramId];
    }

    const newUI = generateUI(
      getParameter(model, attrName, paramId, external, model.external),
      uiLabels,
      uiHelp,
      external,
      model.external
    );
    uiCache[attrName][paramId] = newUI;

    return newUI;
  }

  return uiCache[attrName][paramId];
}

// --- DATA handling ---

function getData(
  model,
  fullData,
  selectedViewId,
  viewIdx,
  attrName,
  parameterId,
  external
) {
  if (!fullData[selectedViewId]) {
    fullData[selectedViewId] = [];
  }
  while (fullData[selectedViewId].length <= viewIdx) {
    fullData[selectedViewId].push({});
  }
  const containerData = fullData[selectedViewId][viewIdx];

  if (!containerData[attrName]) {
    containerData[attrName] = {};
  }

  if (!containerData[attrName][parameterId]) {
    const paramDef = getParameter(model, attrName, parameterId);
    if (paramDef.default) {
      containerData[attrName][parameterId] = {
        id: `${attrName}.${parameterId}`,
        value: [].concat(clone(paramDef.default)),
      };
    } else if (paramDef.domain && paramDef.domain.external) {
      // external param (no default)
      let externalObj;

      if (external && external[paramDef.domain.external]) {
        externalObj = external[paramDef.domain.external];
      } else if (model.external && model.external[paramDef.domain.external]) {
        externalObj = model.external[paramDef.domain.external];
      } else {
        externalObj = {
          [`${paramDef.domain.external} not found`]: `${
            paramDef.domain.external
          }-not-found`,
        };
      }

      const val = externalObj[Object.keys(externalObj)[0]];

      containerData[attrName][parameterId] = {
        id: `${attrName}.${parameterId}`,
        value: [].concat(clone(val)),
      };
    } else if (paramDef.domain) {
      // const val = paramDef.domain[Object.keys(paramDef.domain)[0]];
      containerData[attrName][parameterId] = {
        id: `${attrName}.${parameterId}`,
        value: [].concat(clone(null)),
      };
    } else {
      containerData[attrName][parameterId] = {
        id: `${attrName}.${parameterId}`,
        value: [],
      };
    }
  }

  return containerData[attrName][parameterId];
}

// --- Get the full list

function getParameterData(
  model,
  input,
  selectedViewId,
  viewIdx,
  attrName,
  parameterId,
  labels,
  help
) {
  const ui = getUI(model, attrName, parameterId, labels, help, input.external),
    data = getData(
      model,
      input.data,
      selectedViewId,
      viewIdx,
      attrName,
      parameterId,
      input.external
    );

  return { ui, data, show: alwaysShow };
}

// ---- Show functions ----

function getShowFunction(model, attrName, orAttr) {
  if (!showCache[attrName]) {
    showCache[attrName] = {};
  }

  if (!showCache[attrName][orAttr]) {
    const attrList = [attrName].concat(
        Object.keys(model.definitions[attrName].children)
      ),
      boolExpr = model.definitions[attrName].children[orAttr],
      funcTemplate = [
        `var global = {};
            for (var attr in viewData) {
                global[attr] = {};
                for (var key in viewData[attr]) {
                    global[attr][key] = viewData[attr][key].value;
                }
            }`,
      ];

    attrList.forEach((attr) => {
      funcTemplate.push(
        `var ${attr.replace(/-|\./g, '')} = global['${attr}'];`
      ); // `attr1 = global.attr1,`
    });
    funcTemplate.push(`return ${boolExpr.replace(/ /g, '')};`);
    showCache[attrName][orAttr] = new Function(
      'viewData',
      funcTemplate.join('\n')
    );
  }

  return showCache[attrName][orAttr];
}

function getShowParamFunction(model, attrName, boolExpr) {
  var funcTemplate = [];
  model.definitions[attrName].parameters.forEach((param) => {
    funcTemplate.push(
      `var ${param.id.replace(/-|\./g, '')} = viewData['${attrName}']['${
        param.id
      }'].value`
    );
  });

  funcTemplate.push(`return ${boolExpr};`);
  return new Function('viewData', funcTemplate.join('\n'));
}

// ---- Public API ----

export default function generateDataModel(
  model,
  input,
  selectedViewId,
  viewIdx,
  labels,
  help
) {
  var propertyList = [],
    viewData = input.data[selectedViewId][viewIdx],
    viewAttrs = model.views[selectedViewId].attributes || [];

  // FIXME should add attribute separator + or management
  viewAttrs.forEach((attrName) => {
    const attr = { title: labels[attrName].title },
      contents = [];
    model.definitions[attrName].parameters.forEach((paramAttr, idx) => {
      if (Array.isArray(paramAttr)) {
        // OR prop
        paramAttr.forEach((orAttr) => {
          model.definitions[orAttr].parameters.forEach((param) => {
            var prop = getParameterData(
              model,
              input,
              selectedViewId,
              viewIdx,
              orAttr,
              param.id,
              labels,
              help
            );
            prop.viewData = viewData;
            if (model.definitions[attrName].children[orAttr]) {
              prop.show = getShowFunction(model, attrName, orAttr);
            }
            contents.push(prop);
          });
        });
      } else {
        const prop = getParameterData(
          model,
          input,
          selectedViewId,
          viewIdx,
          attrName,
          paramAttr.id,
          labels,
          help
        );
        prop.viewData = viewData;
        if (paramAttr.show) {
          prop.show = getShowParamFunction(model, attrName, paramAttr.show);
        }
        contents.push(prop);
      }
    });
    attr.contents = contents;
    propertyList.push(attr);
  });

  return propertyList;
}
