import clone from 'simput/src/core/clone';

import LocalizedData from 'simput/src/core/LocalizedData';

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

// ----------------------------------------------------------------------------
// ModelManager
// ----------------------------------------------------------------------------

export default class ModelManager {
  constructor(module, simputModel) {
    this.module = module;

    this.hideViews = simputModel.hideViews || [];
    this.data = simputModel.data;
    this.external = simputModel.external;
    this.type = simputModel.type;

    this.localizedData = new LocalizedData(module); // FIXME should be handled via module

    this.cache = {
      ui: {},
      show: {},
      parameter: {},
    };

    this.activeViewName = null;
    this.activeViewIndex = 0;
    this.collapseState = {};
  }

  // -------- Public methods ------------

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

    viewList.push({ name });
    this.data = Object.assign({}, this.data, { [viewName]: viewList });
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

  getPropertyList() {
    const propertyList = [];
    const viewData = this.data[this.activeViewName][this.activeViewIndex];
    const viewAttrs = this.module.views[this.activeViewName].attributes || [];

    // FIXME should add attribute separator + or management
    viewAttrs.forEach((attrName) => {
      const attr = {
        title: this.localizedData.getAttribute(attrName),
      };
      const contents = [];
      const attrChildren = [];
      this.module.definitions[attrName].parameters.forEach((paramAttr, idx) => {
        if (Array.isArray(paramAttr)) {
          // OR prop
          paramAttr.forEach((orAttr) => {
            const keepTitle =
              this.module.definitions[attrName].parameters.length - 1 === idx;
            const orCtx = {
              show: this.getShowFunction(attrName, orAttr),
              contents,
              title: this.localizedData.getAttribute(orAttr),
            };
            if (keepTitle) {
              orCtx.contents = [];
            }
            this.module.definitions[orAttr].parameters.forEach((param) => {
              const prop = this.getParameterData(orAttr, param.id);
              prop.viewData = viewData;
              if (this.module.definitions[attrName].children[orAttr]) {
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
    this.module.model.order.forEach((id) => {
      if (this.hideViews.indexOf(id) === -1) {
        const node = {
          id,
          label: this.localizedData.getView(id),
          bullet: this.isCollapsed(id, 0)
            ? 'collapsedBullet'
            : 'expendedBullet',
          index: 0,
        };
        const { size, children } = this.module.model.views[id];
        const childCount = this.data[id] && this.data[id].length;

        // Flags
        node.addChildButton = size === -1;
        node.active =
          this.activeViewName === id && childCount < 2 && !node.addChildButton;

        // Children
        const nodeChildren = [];
        if (node.addChildButton) {
          if (!(id in this.data)) {
            this.addView(id);
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
              noDelete:
                this.module.model.views[id].noDelete || viewItem.noDelete,
              readOnly:
                this.module.model.views[id].readOnly || viewItem.readOnly,
            };
            nodeChildren.push(child);
          });
        } else if (children) {
          children.forEach((subViewId, idx) => {
            const viewItem = this.data[subViewId][id] || {};
            const child = {
              id: subViewId,
              label: viewItem.name || node.label,
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

  getParameter(attributeName, parameterId) {
    if (!this.cache.parameter[attributeName]) {
      this.cache.parameter[attributeName] = {};
    }
    if (!this.cache.parameter[attributeName][parameterId]) {
      this.module.definitions[attributeName].parameters.forEach((param) => {
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
    ui.propType = parameter.ui || parameter.propType || 'TextField';

    // Label
    ui.label = parameter.label || parameter.name;
    if (
      this.localizedData &&
      this.localizedData.getParameter(attributeName, parameter.id)
    ) {
      ui.label = this.localizedData.getParameter(attributeName, parameter.id);
    }

    // Help
    ui.help = parameter.help;
    if (
      this.localizedData &&
      this.localizedData.getHelp(attributeName, parameter.id)
    ) {
      ui.help = this.localizedData.getHelp(attributeName, parameter.id);
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
      this.data[this.activeViewName] = [];
    }
    while (this.data[this.activeViewName].length <= this.activeViewIndex) {
      this.data[this.activeViewName].push({});
    }
    const containerData = this.data[this.activeViewName][this.activeViewIndex];

    // Fill attribute
    if (!containerData[attributeName]) {
      containerData[attributeName] = {};
    }

    if (!containerData[attributeName][parameterId]) {
      const paramDef = this.getParameter(attributeName, parameterId);
      if (paramDef.default !== undefined) {
        containerData[attributeName][parameterId] = {
          id: `${attributeName}.${parameterId}`,
          value: [].concat(clone(paramDef.default)),
        };
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

        containerData[attributeName][parameterId] = {
          id: `${attributeName}.${parameterId}`,
          value: [].concat(clone(val)),
        };
      } else if (paramDef.domain) {
        // const val = paramDef.domain[Object.keys(paramDef.domain)[0]];
        containerData[attributeName][parameterId] = {
          id: `${attributeName}.${parameterId}`,
          value: [].concat(clone(null)),
        };
      } else {
        containerData[attributeName][parameterId] = {
          id: `${attributeName}.${parameterId}`,
          value: [],
        };
      }
    }

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
        Object.keys(this.module.definitions[attributeName].children)
      );
      const boolExpr = this.module.definitions[attributeName].children[
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
    this.module.definitions[attributeName].parameters.forEach((param) => {
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
