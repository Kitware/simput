import { defaultSoilNameFromId, addDefaultSoils } from './soilModel';

function getExternal(dataModel) {
  if (!dataModel.external) {
    dataModel.external = {};
  }
  if (!dataModel.external.viz) {
    dataModel.external.viz = {};
  }
  if (!dataModel.external.viz.names) {
    dataModel.external.viz.names = {};
  }
  if (!dataModel.external.viz.colors) {
    dataModel.external.viz.colors = {};
  }
  if (!dataModel.external.viz.types) {
    dataModel.external.viz.types = {};
  }

  // Provide name for 0
  dataModel.external.viz.names[0] = '-';
  dataModel.external.viz.colors[0] = [1, 1, 1];

  return dataModel.external;
}

function checkDefaultSoils(hookConfig, dataModel, currentViewData) {
  addDefaultSoils(dataModel);
}

function pushSoilsToExternalHook(hookConfig, dataModel, currentViewData) {
  const external = getExternal(dataModel);
  if (!external.viz.soils) {
    external.viz.soils = {};
  }

  // Fill soils
  if (dataModel.data.Soils) {
    const soils = dataModel.data.Soils;
    external.soilEnum = {};
    external.viz.types.soils = [];
    for (let i = 0; i < soils.length; i++) {
      const { id, name, soil } = soils[i];

      if (soil) {
        // save to external
        external.viz.types.soils.push(id);
        external.viz.names[id] = name;
        external.viz.colors[id] = soil.color.value;
        external.viz.soils[id] = {
        	porosity: soil.porosity.value[0],
        	permeability: soil.permeability.value[0],
        	relativePermAlpha: soil.relativePermAlpha.value[0],
        	relativePermN: soil.relativePermN.value[0],
        	saturationAlpha: soil.saturationAlpha.value[0],
        	saturationN: soil.saturationN.value[0],
        	saturationSRes: soil.saturationSRes.value[0],
          saturationSSat: soil.saturationSSat.value[0],
        };
        // must be a string, so default soil string IDs are OK in ui: enum.
        external.soilEnum[name] = String(id);
      }
    }
  }
  // defaults come from CONUS simulation
  if (dataModel.data.DefaultSoils) {
    const soils = dataModel.data.DefaultSoils[0].defaultSoil;
    if (!dataModel.data.Soils) {
      external.soilEnum = {};
      external.viz.types.soils = [];
    }
    Object.keys(soils).forEach((key) => {
      if (key.endsWith('_color')) return;
      const { id, value } = soils[key];

      // true if the soil is enabled.
      if (value[0]) {
        const name = defaultSoilNameFromId(key);
        const color = soils[`${key}_color`]
          ? soils[`${key}_color`].value
          : [204 / 255, 235 / 255, 197 / 255];
        // save to external
        external.viz.types.soils.push(id);
        external.viz.names[id] = name;
        external.viz.colors[id] = color;
        external.soilEnum[name] = id;
      }
    });
  }
}

module.exports = function initialize() {
	Simput.registerHook('checkDefaultSoils', checkDefaultSoils);
	Simput.registerHook('soilsToExternal', pushSoilsToExternalHook);
};
