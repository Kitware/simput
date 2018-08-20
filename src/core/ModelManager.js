import clone from 'simput/src/core/clone';

import LocalizedData from 'simput/src/core/LocalizedData';
import HookManager from 'simput/src/core/HookManager';

const ALWAYS_SHOW = () => true;

const UI_KEYS = [
  'id',
  'size',
  'layout',
  'domain',
  'default',
  'type',
  'label',
  'propType',
];

// used to update vue's reactivity system
function assignObjKey(obj, key, data) {
  return Object.assign({}, obj, { [key]: data });
}

// ----------------------------------------------------------------------------
// ModelManager
// ----------------------------------------------------------------------------

export default class ModelManager {
  constructor(module, simputModel) {
    this.module = module;
    this.model = module.model;

    this.hideViews = simputModel.hideViews || [];
    // used in hooks
    this.fullData = simputModel;
    this.type = simputModel.type;

    this.localizedData = new LocalizedData(module);

    this.cache = {
      ui: {},
      show: {},
      parameter: {},
    };

    this.activeViewName = null;
    this.activeViewIndex = 0;
    this.collapseState = {};
    this.listeners = [];
    this.nextViewId = 0;
  }

  get data() {
    return this.fullData.data;
  }

  set data(value) {
    this.fullData.data = value;
  }

  get external() {
    return this.fullData.external;
  }

  set external(value) {
    this.fullData.external = value;
  }

  // -------- Public methods ------------

  subscribe(callback) {
    const id = this.listeners.length;
    this.listeners.push(callback);
    const unsubscribe = () => {
      this.listeners[id] = null;
      while (
        this.listeners.length &&
        this.listeners[this.listeners.length - 1]
      ) {
        this.listeners.pop();
      }
    };
    const run = () => {
      if (this.listeners[id]) {
        this.listeners[id]();
      }
    };
    return {
      unsubscribe,
      run,
    };
  }

  // --------

  getOutput() {
    const fullModel = {
      data: this.data,
      hideViews: this.hideViews,
      external: this.external,
      type: this.type,
    };
    const result = this.module.convert(fullModel);
    if (
      result.errors && Array.isArray(result.errors)
        ? result.errors.length
        : result.errors
    ) {
      // FIXME expose errors to UI
      console.error(result.errors);
    }
    return result;
  }

  // --------

  activateView(name, index = 0) {
    this.activeViewName = name;
    this.activeViewIndex = index;
  }

  // --------

  isCollapsed(viewName, viewIndex) {
    const key = `${viewName}::${viewIndex}`;
    return this.collapseState[key];
  }

  // --------

  toggleCollapse(viewName, viewIndex) {
    const key = `${viewName}::${viewIndex}`;
    this.collapseState[key] = !this.collapseState[key];
  }

  // --------

  addView(viewName) {
    const viewList = this.data[viewName] || [];
    const index = viewList.length;
    const name = `${this.localizedData.getView(viewName)} ${index}`;

    viewList.push({ name, id: this.nextViewId++ });
    this.data = assignObjKey(this.data, viewName, viewList);
    this.activateView(viewName, index);
  }

  // --------

  deleteView(viewName, index) {
    this.data[viewName].splice(index, 1);

    if (this.activeViewName === viewName) {
      if (this.data[viewName].length) {
        const newIndex = this.activeViewIndex === index ? index - 1 : index;
        this.activateView(viewName, newIndex);
      } else {
        this.activateView(null, -1);
      }
    } else {
      this.activateView(viewName, -1);
    }
  }

  // --------

  getActiveViewData() {
    if (this.activeViewName && this.activeViewIndex > -1) {
      return this.data[this.activeViewName][this.activeViewIndex];
    }
    return {};
  }

  // --------

  updateViewData(newData) {
    if (this.activeViewName && this.activeViewIndex > -1) {
      const viewData = this.data[this.activeViewName][this.activeViewIndex];
      const keypath = newData.id.split('.');
      const attrName = keypath.shift();
      viewData[attrName][keypath.join('.')] = assignObjKey(
        viewData[attrName][keypath.join('.')],
        'value',
        newData.value
      );

      const hooks = this.model.views[this.activeViewName].hooks || [];
      hooks.forEach((hook) =>
        HookManager.applyHook(hook, this.fullData, viewData, this.model)
      );

      this.invokeListeners();
    }
  }

  // --------

  getPropertyList() {
    const propertyList = [];

    if (!this.activeViewName || this.activeViewIndex === -1) {
      return propertyList;
    }

    // Create containers if missing
    if (!this.data[this.activeViewName]) {
      this.data = assignObjKey(this.data, this.activeViewName, []);
    }
    if (!this.data[this.activeViewName][this.activeViewIndex]) {
      this.data[this.activeViewName].splice(this.activeViewIndex, 1, {});
    }

    const viewData = this.data[this.activeViewName][this.activeViewIndex];
    const viewAttrs = this.model.views[this.activeViewName].attributes || [];

    // FIXME should add attribute separator + or management
    viewAttrs.forEach((attrName) => {
      const attr = {
        title: this.localizedData.getAttribute(attrName),
      };
      const contents = [];
      const attrChildren = [];
      this.model.definitions[attrName].parameters.forEach((paramAttr, idx) => {
        if (Array.isArray(paramAttr)) {
          // OR prop
          paramAttr.forEach((orAttr) => {
            const keepTitle =
              this.model.definitions[attrName].parameters.length - 1 === idx;
            const orCtx = {
              show: this.getShowFunction(attrName, orAttr),
              contents,
              title: this.localizedData.getAttribute(orAttr),
            };
            if (keepTitle) {
              orCtx.contents = [];
            }
            this.model.definitions[orAttr].parameters.forEach((param) => {
              const prop = this.getParameterData(orAttr, param.id);
              prop.viewData = viewData;
              if (this.model.definitions[attrName].children[orAttr]) {
                prop.show = orCtx.show;
              }
              orCtx.contents.push(prop);
            });

            if (keepTitle) {
              attrChildren.push(orCtx);
            }
          });
        } else {
          const prop = this.getParameterData(attrName, paramAttr.id);
          prop.viewData = viewData;
          if (paramAttr.show) {
            prop.show = this.getShowParamFunction(attrName, paramAttr.show);
          }
          contents.push(prop);
        }
      });
      attr.contents = contents;
      propertyList.push(attr);

      for (let i = 0; i < attrChildren.length; i++) {
        propertyList.push(attrChildren[i]);
      }
    });

    return propertyList;
  }

  // --------

  getMenuList() {
    const menu = [];
    this.model.order.forEach((id) => {
      if (this.hideViews.indexOf(id) === -1) {
        const node = {
          id,
          label: this.localizedData.getView(id),
          bullet: this.isCollapsed(id, 0)
            ? 'collapsedBullet'
            : 'expendedBullet',
          index: 0,
        };
        const { size, children } = this.model.views[id];
        const childCount = (this.data[id] && this.data[id].length) || 0;

        // Flags
        node.addChildButton = size === -1;
        node.active =
          this.activeViewName === id && childCount < 2 && !node.addChildButton;

        // Children
        const nodeChildren = [];
        if (node.addChildButton) {
          if (!(id in this.data)) {
            this.data[id] = [];
          }
          this.data[id].forEach((viewItem, idx) => {
            const child = {
              id,
              label: viewItem.name || node.label,
              bullet: this.isCollapsed(id, idx)
                ? 'collapsedBullet'
                : 'expendedBullet',
              index: idx,
              active:
                this.activeViewName === id && this.activeViewIndex === idx,
              noDelete: this.model.views[id].noDelete || viewItem.noDelete,
              readOnly: this.model.views[id].readOnly || viewItem.readOnly,
            };
            nodeChildren.push(child);
          });
        } else if (children) {
          children.forEach((subViewId, idx) => {
            const viewItem = this.model.views[subViewId];
            const child = {
              id: subViewId,
              label: viewItem.name || this.localizedData.getView(subViewId),
              bullet: this.isCollapsed(subViewId, idx)
                ? 'collapsedBullet'
                : 'expendedBullet',
              index: idx,
              active:
                this.activeViewName === subViewId &&
                this.activeViewIndex === idx,
              noDelete: true,
              readOnly: true,
            };
            nodeChildren.push(child);
          });
        }

        // Add children if any
        if (nodeChildren.length) {
          node.children = nodeChildren;
        }

        menu.push(node);
      }
    });
    return menu;
  }

  // -------- Internal methods ------------

  invokeListeners() {
    for (let i = 0; i < this.listeners.length; i++) {
      if (this.listeners[i]) {
        this.listeners[i]();
      }
    }
  }

  // --------

  getParameter(attributeName, parameterId) {
    if (!this.cache.parameter[attributeName]) {
      this.cache.parameter[attributeName] = {};
    }
    if (!this.cache.parameter[attributeName][parameterId]) {
      this.model.definitions[attributeName].parameters.forEach((param) => {
        this.cache.parameter[attributeName][param.id] = param;
      });
    }
    return this.cache.parameter[attributeName][parameterId];
  }

  // --------

  getNextViewId() {
    let nextId = 0;
    const viewNames = Object.keys(this.data);
    while (viewNames.length) {
      const views = this.data[viewNames.pop()];
      for (let i = 0; i < views.length; i++) {
        if (views[i].id) {
          nextId = Math.max(nextId, views[i].id);
        }
      }
    }
    return nextId + 1;
  }

  // --------

  generateUI(attributeName, parameter) {
    const ui = {
      componentLabels: [],
    };

    // Clone parameters into UI
    Object.keys(parameter).forEach((key) => {
      if (UI_KEYS.indexOf(key) !== -1) {
        ui[key] = clone(parameter[key]);
      }
    });

    // Generate domain from external fields
    if (parameter.domain && parameter.domain.external) {
      if (Array.isArray(parameter.domain.external)) {
        ui.domain = {};
        for (let i = 0; i < parameter.domain.external.length; i++) {
          const key = parameter.domain.external[i];
          if (this.external && this.external[key]) {
            ui.domain[key] = this.external[key];
          } else if (this.module.external && this.module.external[key]) {
            ui.domain[key] = this.module.external[key];
          }
        }
      } else {
        const externalKey = parameter.domain.external;
        delete ui.domain.external;
        if (this.external && this.external[externalKey]) {
          ui.domain = this.external[externalKey];
        } else if (this.module.external && this.module.external[externalKey]) {
          ui.domain = this.module.external[externalKey];
        } else {
          console.log(
            `no domain found for external (${externalKey})`,
            this.external,
            this.module.external
          );
          ui.domain = {
            [`${externalKey} not found`]: `${externalKey}-not-found`,
          };
        }
      }
    }

    if (parameter.domain && parameter.domain.dynamic) {
      ui.dynamic = true;
    }

    // Widget selection
    ui.propType = parameter.ui || parameter.propType || 'cell';
    if (parameter.type === 'enum') {
      ui.propType = 'enum';
    }

    // Label
    ui.label = parameter.label || parameter.name;
    if (this.localizedData) {
      ui.label =
        this.localizedData.getParameter(attributeName, parameter.id) ||
        ui.label;
    }

    // Help
    ui.help = parameter.help;
    if (this.localizedData) {
      ui.help =
        this.localizedData.getHelp(attributeName, parameter.id) || ui.help;
    }

    return ui;
  }

  // --------

  getUI(attributeName, parameterId) {
    if (!this.cache.ui[attributeName]) {
      this.cache.ui[attributeName] = {};
    }
    if (!this.cache.ui[attributeName][parameterId]) {
      const newUI = this.generateUI(
        attributeName,
        this.getParameter(attributeName, parameterId)
      );
      if (!newUI.dynamic) {
        this.cache.ui[attributeName][parameterId] = newUI;
      }
      return newUI;
    }
    return this.cache.ui[attributeName][parameterId];
  }

  // --------

  getData(attributeName, parameterId) {
    if (!this.activeViewName) {
      console.error('No active view');
      return {}; // FIXME
    }

    // Create active view container if not yet available
    if (!this.data[this.activeViewName]) {
      this.data = assignObjKey(this.data, this.activeViewName, []);
    }
    while (this.data[this.activeViewName].length <= this.activeViewIndex) {
      this.data[this.activeViewName].push({});
    }

    const views = this.data[this.activeViewName];

    // Fill attribute
    if (!views[this.activeViewIndex][attributeName]) {
      // let vue's reactivity system do its thing
      views.splice(
        this.activeViewIndex,
        1,
        assignObjKey(views[this.activeViewIndex], attributeName, {})
      );
    }

    const containerData = views[this.activeViewIndex];

    if (!containerData[attributeName][parameterId]) {
      const paramDef = this.getParameter(attributeName, parameterId);
      if (paramDef.default !== undefined) {
        // let vue's reactivity system work
        containerData[attributeName] = assignObjKey(
          containerData[attributeName],
          parameterId,
          {
            id: `${attributeName}.${parameterId}`,
            value: [].concat(clone(paramDef.default)),
          }
        );
      } else if (paramDef.domain && paramDef.domain.external) {
        // external param (no default)
        let externalObj;

        if (this.external && this.external[paramDef.domain.external]) {
          externalObj = this.external[paramDef.domain.external];
        } else if (
          this.module.external &&
          this.module.external[paramDef.domain.external]
        ) {
          externalObj = this.module.external[paramDef.domain.external];
        } else {
          externalObj = {
            [`${paramDef.domain.external} not found`]: `${
              paramDef.domain.external
            }-not-found`,
          };
        }

        const val = externalObj[Object.keys(externalObj)[0]];

        containerData[attributeName] = assignObjKey(
          containerData[attributeName],
          parameterId,
          {
            id: `${attributeName}.${parameterId}`,
            value: [].concat(clone(val)),
          }
        );
      } else if (paramDef.domain) {
        // const val = paramDef.domain[Object.keys(paramDef.domain)[0]];
        containerData[attributeName] = assignObjKey(
          containerData[attributeName],
          parameterId,
          {
            id: `${attributeName}.${parameterId}`,
            value: [].concat(clone(null)),
          }
        );
      } else {
        containerData[attributeName] = assignObjKey(
          containerData[attributeName],
          parameterId,
          {
            id: `${attributeName}.${parameterId}`,
            value: [],
          }
        );
      }
    }

    // update data for vue
    this.data[this.activeViewName].splice(
      this.activeViewIndex,
      1,
      containerData
    );

    return containerData[attributeName][parameterId];
  }

  // --------

  getParameterData(attributeName, parameterId) {
    return {
      ui: this.getUI(attributeName, parameterId),
      data: this.getData(attributeName, parameterId),
      show: ALWAYS_SHOW,
    };
  }

  // --------

  getShowFunction(attributeName, orAttribute) {
    if (!this.cache.show[attributeName]) {
      this.cache.show[attributeName] = {};
    }

    if (!this.cache.show[attributeName][orAttribute]) {
      const attrList = [attributeName].concat(
        Object.keys(this.model.definitions[attributeName].children)
      );
      const boolExpr = this.model.definitions[attributeName].children[
        orAttribute
      ];
      const funcTemplate = [
        `
        var global = {};
        for (var attr in viewData) {
             global[attr] = {};
             for (var key in viewData[attr]) {
                 global[attr][key] = viewData[attr][key].value;
             }
        }
      `,
      ];

      attrList.forEach((attr) => {
        funcTemplate.push(
          `var ${attr.replace(/-|\./g, '')} = global['${attr}'];`
        ); // `attr1 = global.attr1,`
      });
      funcTemplate.push(`return ${boolExpr.replace(/ /g, '')};`);

      /* eslint-disable no-new-func */
      this.cache.show[attributeName][orAttribute] = new Function(
        'viewData',
        funcTemplate.join('\n')
      );
      /* eslint-enable no-new-function */
    }

    return this.cache.show[attributeName][orAttribute];
  }

  // --------

  getShowParamFunction(attributeName, boolExpr) {
    const funcTemplate = [];
    this.model.definitions[attributeName].parameters.forEach((param) => {
      if (!Array.isArray(param)) {
        funcTemplate.push(
          `var ${param.id.replace(
            /-|\./g,
            ''
          )} = viewData['${attributeName}']['${param.id}'].value`
        );
      }
    });

    funcTemplate.push(`return ${boolExpr};`);
    return new Function('viewData', funcTemplate.join('\n'));
  }
}
