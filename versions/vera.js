/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js-exposed");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../../node_modules/babel-loader/lib/index.js??ref--12-0!./src/index.js":
/*!****************************************************************************************************!*\
  !*** /Users/seb/Documents/code/Web/simput/node_modules/babel-loader/lib??ref--12-0!./src/index.js ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nmodule.exports = {\n    type: 'vera',\n    model: __webpack_require__(/*! ./model.js */ \"./src/model.js\"),\n    lang: {},\n    convert: __webpack_require__(/*! ./convert.js */ \"./src/convert.js\"),\n    hooks: __webpack_require__(/*! ./hooks.js */ \"./src/hooks.js\"),\n    parse: null\n};\n\n//# sourceURL=webpack:///./src/index.js?/Users/seb/Documents/code/Web/simput/node_modules/babel-loader/lib??ref--12-0");

/***/ }),

/***/ "../../node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\nvar g;\n\n// This works in non-strict mode\ng = function () {\n\treturn this;\n}();\n\ntry {\n\t// This works if eval is allowed (see CSP)\n\tg = g || Function(\"return this\")() || (1, eval)(\"this\");\n} catch (e) {\n\t// This works if the window reference is available\n\tif ((typeof window === \"undefined\" ? \"undefined\" : _typeof(window)) === \"object\") g = window;\n}\n\n// g can still be undefined, but nothing to do about it...\n// We return undefined, instead of nothing here, so it's\n// easier to handle this case. if(!global) { ...}\n\nmodule.exports = g;\n\n//# sourceURL=webpack:///(webpack)/buildin/global.js?");

/***/ }),

/***/ "./src/convert.js":
/*!************************!*\
  !*** ./src/convert.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nmodule.exports = function (dataModel) {\n  return { results: {}, model: dataModel };\n};\n\n//# sourceURL=webpack:///./src/convert.js?");

/***/ }),

/***/ "./src/hooks.js":
/*!**********************!*\
  !*** ./src/hooks.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nfunction getExternal(dataModel) {\n  if (!dataModel.external) {\n    dataModel.external = {};\n  }\n  return dataModel.external;\n}\n\nfunction pushMaterialsToExternalHook(hookConfig, dataModel, currentViewData) {\n  var external = getExternal(dataModel);\n\n  // Fill materials\n  if (dataModel.data.Materials) {\n    (function () {\n      var mats = dataModel.data.Materials;\n      external.materials = {};\n      external.materialNames = {};\n\n      var _loop = function _loop(i) {\n        var name = mats[i].name;\n        var id = mats[i].id;\n        var currentMaterial = { name: name };\n        // Gather material fields\n        if (mats[i].material) {\n          Object.keys(mats[i].material).forEach(function (key) {\n            currentMaterial[key] = mats[i].material[key].value;\n          });\n\n          // save to external\n          external.materials[id] = currentMaterial;\n          external.materialNames[name] = id;\n        }\n      };\n\n      for (var i = 0; i < mats.length; i++) {\n        _loop(i);\n      }\n    })();\n  }\n}\n\nfunction pushCellsToExternalHook(hookConfig, dataModel, currentViewData) {\n  var external = getExternal(dataModel);\n\n  // Fill cells\n  if (dataModel.data.Cells) {\n    (function () {\n      var cells = dataModel.data.Cells;\n      external.cells = {};\n\n      var _loop2 = function _loop2(i) {\n        var name = cells[i].name;\n        var id = cells[i].id;\n        var currentCell = { name: name };\n        // Gather cell fields\n        if (cells[i].cell) {\n          Object.keys(cells[i].cell).forEach(function (key) {\n            currentCell[key] = cells[i].cell[key].value;\n          });\n\n          // save to external\n          external.cells[id] = currentCell;\n        }\n      };\n\n      for (var i = 0; i < cells.length; i++) {\n        _loop2(i);\n      }\n    })();\n  }\n}\n\nfunction pushRodsToExternalHook(hookConfig, dataModel, currentViewData) {\n  var external = getExternal(dataModel);\n\n  // Fill rods\n  if (dataModel.data.Rods) {\n    var rods = dataModel.data.Rods;\n    external.rods = {};\n    external.rodsNames = { '0': '-' };\n    external.rodsColors = { '0': 'white' };\n    for (var i = 0; i < rods.length; i++) {\n      var _rods$i = rods[i],\n          _id = _rods$i.id,\n          _name = _rods$i.name;\n\n      external.rods[_id] = rods[i];\n      external.rodsNames[_id] = _name;\n      external.rodsColors[_id] = 'rgb(' + rods[i].rodInfo.color.value.map(function (rgb) {\n        return Math.floor(rgb * 255);\n      }).join(',') + ')';\n    }\n  }\n}\n\nfunction mapsToExternal(hookConfig, dataModel, currentViewData) {\n  var external = getExternal(dataModel);\n\n  // Fill maps\n  if (dataModel.data.Maps) {\n    var maps = dataModel.data.Maps;\n    external.mapNames = { '0': '-' };\n    external.mapColors = { '0': 'white' };\n    for (var i = 0; i < maps.length; i++) {\n      var _maps$i = maps[i],\n          _id2 = _maps$i.id,\n          _name2 = _maps$i.name;\n\n      external.mapNames[_id2] = _name2;\n      external.mapColors[_id2] = 'rgb(' + maps[i].mapInfo.color.value.map(function (rgb) {\n        return Math.floor(rgb * 255);\n      }).join(',') + ')';\n    }\n  }\n}\n\nfunction updateMaterialUsed(hookConfig, dataModel, currentViewData) {\n  var mats = dataModel.data.Materials;\n  var usedMats = {};\n\n  if (dataModel.data.Cells) {\n    var cells = dataModel.data.Cells;\n\n    for (var i = 0; i < cells.length; i++) {\n      cells[i].cell.cell.value[0].mats.forEach(function (m) {\n        usedMats[m] = true;\n      });\n\n      // detect if cells have no materials\n      cells[i].invalid = null;\n      if (cells[i].cell.cell.value[0].mats.length === 0) {\n        cells[i].invalid = 'Cell has no materials';\n      }\n    }\n  }\n\n  for (var _i = 0; _i < mats.length; _i++) {\n    mats[_i].noDelete = mats[_i].id in usedMats;\n  }\n}\n\nfunction updateCellUsed(hookConfig, dataModel, currentViewData) {\n  var cells = dataModel.data.Cells;\n  var usedCells = {};\n\n  if (dataModel.data.Rods) {\n    var rods = dataModel.data.Rods;\n    for (var i = 0; i < rods.length; i++) {\n      rods[i].rodStack.rod.value[0].stack.forEach(function (layer) {\n        usedCells[layer.cell] = true;\n      });\n\n      // detect if rods have no cells\n      rods[i].invalid = null;\n      if (rods[i].rodStack.rod.value[0].stack.length === 0) {\n        rods[i].invalid = 'Rod has no cells';\n      }\n    }\n  }\n\n  for (var _i2 = 0; _i2 < cells.length; _i2++) {\n    cells[_i2].noDelete = cells[_i2].id in usedCells;\n  }\n}\n\nfunction updateRodUsed(hookConfig, dataModel, currentViewData) {\n  var rods = dataModel.data.Rods;\n  var usedRods = {};\n\n  if (dataModel.data.Maps) {\n    var maps = dataModel.data.Maps;\n    for (var i = 0; i < maps.length; i++) {\n      maps[i].rodMap.map.value[0].grid.forEach(function (id) {\n        usedRods[id] = true;\n      });\n    }\n  }\n\n  for (var _i3 = 0; _i3 < rods.length; _i3++) {\n    rods[_i3].noDelete = rods[_i3].id in usedRods;\n  }\n}\n\nfunction addNextView(hookConfig, dataModel, currentViewData, model) {\n  var viewName = hookConfig.viewName,\n      nextViewName = hookConfig.nextViewName;\n\n  if (dataModel.data[viewName].length) {\n    if (model.order.indexOf(nextViewName) === -1) {\n      var insertIndex = 1 + model.order.indexOf(viewName);\n      model.order.splice(insertIndex, 0, nextViewName);\n    }\n  } else {\n    // remove view\n    var indexToDelete = model.order.indexOf(nextViewName);\n    if (indexToDelete !== -1) {\n      model.order.splice(indexToDelete, 1);\n    }\n  }\n}\n\nmodule.exports = function initialize() {\n  Simput.registerHook('materialsToExternal', pushMaterialsToExternalHook);\n  Simput.registerHook('cellsToExternal', pushCellsToExternalHook);\n  Simput.registerHook('updateMaterialUsed', updateMaterialUsed);\n  Simput.registerHook('updateCellUsed', updateCellUsed);\n  Simput.registerHook('updateRodUsed', updateRodUsed);\n  Simput.registerHook('addNextView', addNextView);\n  Simput.registerHook('rodsToExternal', pushRodsToExternalHook);\n  Simput.registerHook('mapsToExternal', mapsToExternal);\n};\n\n//# sourceURL=webpack:///./src/hooks.js?");

/***/ }),

/***/ "./src/index.js-exposed":
/*!******************************!*\
  !*** ./src/index.js-exposed ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* WEBPACK VAR INJECTION */(function(global) {if(!global[\"Simput\"]) global[\"Simput\"] = {};\nif(!global[\"Simput\"][\"types\"]) global[\"Simput\"][\"types\"] = {};\nmodule.exports = global[\"Simput\"][\"types\"][\"vera\"] = __webpack_require__(/*! -!/Users/seb/Documents/code/Web/simput/node_modules/babel-loader/lib??ref--12-0!./index.js */ \"../../node_modules/babel-loader/lib/index.js??ref--12-0!./src/index.js\");\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/webpack/buildin/global.js */ \"../../node_modules/webpack/buildin/global.js\")))\n\n//# sourceURL=webpack:///./src/index.js-exposed?");

/***/ }),

/***/ "./src/model.js":
/*!**********************!*\
  !*** ./src/model.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n// ----------------------------------------------------------------------------\n// Color palettes\n// ----------------------------------------------------------------------------\n\nvar materialPalette = ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd', '#ccebc5', '#ffed6f', '#51574a', '#447c69', '#74c493', '#8e8c6d', '#e4bf80', '#e9d78e', '#e2975d', '#f19670', '#e16552', '#c94a53', '#be5168', '#a34974', '#993767', '#65387d', '#4e2472', '#9163b6', '#e279a3', '#e0598b', '#7c9fb0', '#5698c4', '#9abf88'];\n\nvar cellPalette = ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d', '#666666'];\n\nvar rodPalette = ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'];\n\nvar mapPalette = ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'];\n\n// ----------------------------------------------------------------------------\n// Model definition\n// ----------------------------------------------------------------------------\n\nmodule.exports = {\n  scripts: [\n  // 'https://unpkg.com/@doe-casl/verain-view@1.1.1/dist/simput-external-vera.js',\n  'simput-external-vera.js'],\n  defaultActiveView: 'Specifications',\n  order: ['Specifications', 'Materials'],\n  views: {\n    Specifications: {\n      label: 'Specifications',\n      attributes: ['coreSpec', 'assemblySpec', 'baffleSpec'],\n      hooks: [{\n        type: 'copyToExternal',\n        src: 'data.Specifications.0.assemblySpec.grid.value.0',\n        dst: 'assemblySize'\n      }, {\n        type: 'copyToExternal',\n        src: 'data.Specifications.0.assemblySpec.pitch.value.0',\n        dst: 'assemblyPitch'\n      }, {\n        type: 'copyToExternal',\n        src: 'data.Specifications.0.coreSpec.grid.value.0',\n        dst: 'coreSize'\n      }]\n    },\n    Materials: {\n      label: 'Materials',\n      attributes: ['material'],\n      size: -1,\n      readOnly: true,\n      hooks: [{ type: 'copyParameterToViewName', attribute: 'material.name' }, { type: 'specsToExternal' }, { type: 'materialsToExternal' }, { type: 'addNextView', viewName: 'Materials', nextViewName: 'Cells' }]\n    },\n    Cells: {\n      label: 'Cells',\n      attributes: ['cell'],\n      hooks: [{ type: 'copyParameterToViewName', attribute: 'cell.name' }, { type: 'cellsToExternal' }, { type: 'updateMaterialUsed' }, { type: 'addNextView', viewName: 'Cells', nextViewName: 'Rods' }, {\n        type: 'copy',\n        src: 'data.Specifications.0.assemblySpec.pitch.value.0',\n        dst: 'cell.pitch'\n      }],\n      size: -1,\n      readOnly: true\n    },\n    Rods: {\n      label: 'Rods',\n      attributes: ['rodInfo', 'rodStack'],\n      size: -1,\n      readOnly: true,\n      hooks: [{ type: 'copyParameterToViewName', attribute: 'rodInfo.name' }, { type: 'updateCellUsed' }, {\n        type: 'copy',\n        src: 'data.Specifications.0.coreSpec.height.value.0',\n        dst: 'rodInfo.height'\n      }, { type: 'rodsToExternal' }, { type: 'addNextView', viewName: 'Rods', nextViewName: 'Maps' }]\n    },\n    Maps: {\n      label: 'Rod maps',\n      attributes: ['mapInfo', 'rodMap'],\n      size: -1,\n      readOnly: true,\n      hooks: [{ type: 'updateRodUsed' }, { type: 'mapsToExternal' }, { type: 'copyParameterToViewName', attribute: 'mapInfo.name' }, { type: 'addNextView', viewName: 'Maps', nextViewName: 'Core' }]\n    },\n    Core: {\n      label: 'Core map',\n      children: ['CoreAssemblyMap', 'CoreControlInsertMap', 'CoreDetectorMap']\n    },\n    CoreAssemblyMap: {\n      label: 'Assemblies',\n      attributes: ['coreMap']\n    },\n    CoreControlInsertMap: {\n      label: 'Controls and Inserts',\n      attributes: ['coreMap']\n    },\n    CoreDetectorMap: {\n      label: 'Detectors',\n      attributes: ['coreMap']\n    }\n  },\n  definitions: {\n    coreSpec: {\n      label: 'Core Specifications',\n      parameters: [{\n        id: 'grid',\n        type: 'int',\n        size: 1,\n        default: 15,\n        label: 'Size',\n        help: 'Size of the grid for the core'\n      }, {\n        id: 'height',\n        type: 'float',\n        size: 1,\n        default: 400,\n        label: 'Core height',\n        help: 'Height of the core in cm.'\n      }]\n    },\n    assemblySpec: {\n      label: 'Assembly Specifications',\n      parameters: [{\n        id: 'grid',\n        type: 'int',\n        size: 1,\n        default: 17,\n        label: 'Size',\n        help: 'Size of the grid for an assembly'\n      }, {\n        id: 'pitch',\n        type: 'float',\n        size: 1,\n        default: 1.26,\n        label: 'Cell pitch',\n        help: 'Default cell pitch in assemblies'\n      }]\n    },\n    baffleSpec: {\n      label: 'Baffle Specifications',\n      parameters: [{\n        id: 'thick',\n        type: 'float',\n        size: 1,\n        default: 0,\n        label: 'Thickness'\n      }, {\n        id: 'gap',\n        type: 'float',\n        size: 1,\n        default: 0,\n        label: 'Gap'\n      }, {\n        id: 'material',\n        type: 'int',\n        size: 1,\n        ui: 'enum',\n        domain: {\n          dynamic: true,\n          external: 'materialNames'\n        },\n        label: 'Material'\n      }]\n    },\n    material: {\n      label: 'Material definition',\n      parameters: [{\n        id: 'name',\n        type: 'string',\n        size: 1,\n        default: 'New Material',\n        label: 'Name'\n      }, {\n        id: 'color',\n        propType: 'Color',\n        label: 'Associated color',\n        default: [204 / 255, 235 / 255, 197 / 255],\n        domain: {\n          palette: materialPalette\n        }\n      }, {\n        id: 'density',\n        type: 'float',\n        size: 1,\n        default: 1,\n        label: 'Density'\n      }, {\n        id: 'thexp',\n        type: 'float',\n        size: 1,\n        default: 1,\n        label: 'Thermal Expansion Coefficient'\n      }, {\n        id: 'fractions',\n        ui: 'map',\n        label: 'Material fractions (material:fraction)'\n      }]\n    },\n    cell: {\n      label: 'Cell definition',\n      parameters: [{\n        id: 'name',\n        type: 'string',\n        size: 1,\n        default: 'New Cell',\n        label: 'Name'\n      }, {\n        id: 'pitch',\n        type: 'float',\n        size: 1,\n        default: 0,\n        label: 'Contact radius/pitch',\n        domain: {\n          readOnly: true\n        }\n      }, {\n        id: 'color',\n        propType: 'Color',\n        label: 'Associated color',\n        default: [204 / 255, 235 / 255, 197 / 255],\n        domain: {\n          palette: cellPalette\n        }\n      }, {\n        id: 'cell',\n        propType: 'CellEditor',\n        size: 1,\n        default: {\n          name: 'Cell name',\n          radii: [],\n          mats: []\n        },\n        domain: {\n          dynamic: true,\n          external: 'materials'\n        },\n        label: 'Cell'\n      }]\n    },\n    rodInfo: {\n      label: 'Rod description',\n      parameters: [{\n        id: 'name',\n        type: 'string',\n        size: 1,\n        default: 'New Rod',\n        label: 'Name'\n      }, {\n        id: 'color',\n        propType: 'Color',\n        label: 'Associated color',\n        default: [204 / 255, 235 / 255, 197 / 255],\n        domain: {\n          palette: rodPalette\n        }\n      }, {\n        id: 'height',\n        type: 'string',\n        size: 1,\n        default: '',\n        label: 'Rod height',\n        domain: {\n          readOnly: true\n        }\n      }]\n    },\n    rodStack: {\n      label: 'Axial definition',\n      parameters: [{\n        id: 'rod',\n        propType: 'RodEditor',\n        size: 1,\n        default: {\n          stack: []\n        },\n        domain: {\n          dynamic: true,\n          external: ['cells', 'materials']\n        },\n        label: 'Rod'\n      }]\n    },\n    mapInfo: {\n      label: 'Rod map',\n      parameters: [{\n        id: 'name',\n        type: 'string',\n        size: 1,\n        default: 'Assembly',\n        label: 'Name'\n      }, {\n        id: 'color',\n        propType: 'Color',\n        label: 'Associated color',\n        default: [204 / 255, 235 / 255, 197 / 255],\n        domain: {\n          palette: mapPalette\n        }\n      }]\n    },\n    rodMap: {\n      label: 'Layout definition',\n      parameters: [{\n        id: 'map',\n        propType: 'AssemblyEditor',\n        size: 1,\n        default: {\n          config: {\n            names: 'rodsNames',\n            colors: 'rodsColors',\n            size: 'assemblySize'\n          },\n          emptyItem: '0',\n          grid: []\n        },\n        domain: {\n          dynamic: true,\n          external: ['assemblyPitch', 'assemblySize', 'rodsNames', 'rodsColors', 'rods', 'cells', 'materials']\n        },\n        label: 'Rod Map'\n      }]\n    },\n    coreMap: {\n      label: 'Layout',\n      parameters: [{\n        id: 'map',\n        propType: 'MapEditor',\n        size: 1,\n        default: {\n          config: {\n            names: 'mapNames',\n            colors: 'mapColors',\n            size: 'coreSize'\n          },\n          emptyItem: '0',\n          grid: []\n        },\n        domain: {\n          dynamic: true,\n          external: ['coreSize', 'mapNames', 'mapColors']\n        }\n      }]\n    }\n  }\n};\n\n//# sourceURL=webpack:///./src/model.js?");

/***/ })

/******/ });