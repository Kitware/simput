const {
  defaultMaterialNameFromId,
  addDefaultMaterials,
} = require('./matModel');

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

function checkDefaultMaterials(hookConfig, dataModel, currentViewData) {
  addDefaultMaterials(dataModel);
}

function pushMaterialsToExternalHook(hookConfig, dataModel, currentViewData) {
  const external = getExternal(dataModel);
  if (!external.viz.materials) {
    external.viz.materials = {};
  }

  // Fill materials
  if (dataModel.data.Materials) {
    const mats = dataModel.data.Materials;
    external.materialEnum = {};
    external.viz.types.materials = [];
    for (let i = 0; i < mats.length; i++) {
      const { id, name, material } = mats[i];

      if (material) {
        // save to external
        external.viz.types.materials.push(id);
        external.viz.names[id] = name;
        external.viz.colors[id] = material.color.value;
        external.viz.materials[id] = {
          density: material.density.value[0],
          thexp: material.thexp ? material.thexp.value[0] : undefined,
          fractions: material.fractions.value.slice(),
        };
        // must be a string, so default material string IDs are OK in ui: enum.
        external.materialEnum[name] = String(id);
      }
    }
  }
  // defaults come from a standard library in VERAin
  if (dataModel.data.DefaultMaterials) {
    const mats = dataModel.data.DefaultMaterials[0].defaultMaterial;
    if (!dataModel.data.Materials) {
      external.materialEnum = {};
      external.viz.types.materials = [];
    }
    Object.keys(mats).forEach((key) => {
      if (key.endsWith('_color')) return;
      const { id, value } = mats[key];

      // true if the material is enabled.
      if (value[0]) {
        const name = defaultMaterialNameFromId(key);
        const color = mats[`${key}_color`]
          ? mats[`${key}_color`].value
          : [204 / 255, 235 / 255, 197 / 255];
        // save to external
        external.viz.types.materials.push(id);
        external.viz.names[id] = name;
        external.viz.colors[id] = color;
        external.materialEnum[name] = id;
      }
    });
  }
}

function pushFuelsToExternalHook(hookConfig, dataModel, currentViewData) {
  const external = getExternal(dataModel);

  // Fill materials
  if (dataModel.data.Fuels) {
    const mats = dataModel.data.Fuels;
    // external.materialEnum = {};
    external.viz.types.fuels = [];
    for (let i = 0; i < mats.length; i++) {
      const { id, name, fuel } = mats[i];

      if (fuel) {
        // save to external
        external.viz.types.fuels.push(id);
        external.viz.names[id] = name;
        external.viz.colors[id] = fuel.color.value;
        // external.materialEnum[name] = id;
      }
    }
  }
}

function pushCellsToExternalHook(hookConfig, dataModel, currentViewData) {
  const external = getExternal(dataModel);

  // Fill cells
  if (dataModel.data.Cells) {
    const cells = dataModel.data.Cells;
    external.viz.cells = {};
    external.viz.types.cells = [];
    for (let i = 0; i < cells.length; i++) {
      const { id, name, cell } = cells[i];

      // Gather cell fields
      if (cell) {
        // Extract layers
        const { mats, radii } = cell.cell.value[0];
        const layers = [];
        for (let lIdx = 0; lIdx < mats.length; lIdx++) {
          layers.push({
            material: mats[lIdx],
            radius: radii[lIdx],
          });
        }

        // save to external
        external.viz.types.cells.push(id);
        external.viz.names[id] = name;
        external.viz.colors[id] = cells[i].cell.color.value;
        external.viz.cells[id] = layers;
      }
    }
  }
}

function pushRodsToExternalHook(hookConfig, dataModel, currentViewData) {
  const external = getExternal(dataModel);

  // Fill rods
  if (dataModel.data.Rods) {
    const rods = dataModel.data.Rods;
    external.viz.rods = {};
    external.viz.types.rods = [];
    for (let i = 0; i < rods.length; i++) {
      const { id, name, rodInfo, rodStack } = rods[i];

      if (rodInfo && rodStack) {
        external.viz.types.rods.push(id);
        external.viz.names[id] = name;
        external.viz.colors[id] = rodInfo.color.value;
        external.viz.rods[id] = {
          offset: rodInfo.offset.value[0],
          length: rodInfo.height.value[0],
          type: rodInfo.type.value[0],
          cells: rodStack.rod.value[0].stack,
        };
      }
    }
  }
}

function mapsToExternal(hookConfig, dataModel, currentViewData) {
  const external = getExternal(dataModel);
  const pitch = dataModel.data.Specifications[0].assemblySpec.pitch.value[0];
  const size = dataModel.data.Specifications[0].assemblySpec.grid.value[0];

  // Fill maps
  if (dataModel.data.Maps) {
    const maps = dataModel.data.Maps;
    external.viz.assembly = {};
    external.viz.types.assembly = [];
    for (let i = 0; i < maps.length; i++) {
      const { id, name, rodMap, mapInfo } = maps[i];
      if (mapInfo && rodMap) {
        const { grid } = rodMap.map.value[0];
        const type = mapInfo.type.value[0];
        const labels =
          mapInfo.stateMapLabels && mapInfo.stateMapLabels.value
            ? mapInfo.stateMapLabels.value.filter((l) => l.length)
            : [];

        external.viz.types.assembly.push(id);
        external.viz.names[id] = name;
        external.viz.colors[id] = mapInfo.color.value;
        external.viz.assembly[id] = { grid, size, pitch, type, labels };
      }
    }
  }
}

function coreToExternal(hookConfig, dataModel, currentViewData) {
  const external = getExternal(dataModel);
  const pitch = dataModel.data.Specifications[0].coreSpec.apitch.value[0];
  const size = dataModel.data.Specifications[0].coreSpec.grid.value[0];
  if (!external.viz.core) {
    external.viz.core = {};
  }
  external.viz.core.size = size;
  external.viz.core.pitch = pitch;
  external.viz.core.types = {};

  // Fill maps
  if (dataModel.data.CoreAssemblyMap) {
    external.viz.core.types[dataModel.data.CoreAssemblyMap[0].id] = [
      'assembly',
    ];
    external.viz.core[dataModel.data.CoreAssemblyMap[0].id] =
      dataModel.data.CoreAssemblyMap[0].coreMap.map.value[0].grid;
  }
  if (dataModel.data.CoreControlInsertMap) {
    external.viz.core.types[dataModel.data.CoreControlInsertMap[1].id] = [
      'control',
      'insert',
    ];
    external.viz.core[dataModel.data.CoreControlInsertMap[1].id] =
      dataModel.data.CoreControlInsertMap[1].coreMap.map.value[0].grid;
  }
  if (dataModel.data.CoreDetectorMap) {
    external.viz.core.types[dataModel.data.CoreDetectorMap[2].id] = [
      'detector',
    ];
    external.viz.core[dataModel.data.CoreDetectorMap[2].id] =
      dataModel.data.CoreDetectorMap[2].coreMap.map.value[0].grid;
  }
}

function coreDefToExternal(hookConfig, dataModel, currentViewData) {
  const external = getExternal(dataModel);
  const coreDefinition = dataModel.data.CoreDefinition;

  if (!external.viz.core) {
    external.viz.core = {};
  }

  if (coreDefinition && coreDefinition.length) {
    const {
      baffleSpec,
      vesselSpec,
      lowerPlateSpec,
      upperPlateSpec,
      padSpec,
    } = coreDefinition[0];

    Object.assign(external.viz.core, {
      baffleSpec: {
        gap: baffleSpec.gap.value[0],
        material: baffleSpec.material.value[0],
        thick: baffleSpec.thick.value[0],
      },
      vesselSpec: {
        name: vesselSpec.cell.value[0].name,
        mats: vesselSpec.cell.value[0].mats,
        radii: vesselSpec.cell.value[0].radii,
      },
      lowerPlateSpec: {
        material: lowerPlateSpec.material.value[0],
        thick: lowerPlateSpec.thick.value[0],
        volfrac: lowerPlateSpec.volfrac.value[0],
      },
      upperPlateSpec: {
        material: lowerPlateSpec.material.value[0],
        thick: lowerPlateSpec.thick.value[0],
        volfrac: lowerPlateSpec.volfrac.value[0],
      },
      padSpec: {
        material: padSpec.material.value[0],
        innerDiameter: padSpec.params.value[0],
        outerDiameter: padSpec.params.value[1],
        arc: padSpec.params.value[2],
        angles: padSpec.positions.value.slice(),
      },
    });
  }
}

function gridsToExternal(hookConfig, dataModel, currentViewData) {
  const external = getExternal(dataModel);
  const grids = dataModel.data.Grids;
  if (!external.viz.grids) {
    external.viz.grids = {};
  }

  if (grids && grids.length) {
    for (let i = 0; i < grids.length; i++) {
      const grid = grids[i];
      external.viz.grids[grid.name] = {
        id: grid.id,
        mat: grid.spacer.material.value[0],
        mass: grid.spacer.mass.value[0],
        height: grid.spacer.height.value[0],
        elevations: grid.spacer.axisPositions.value.slice(),
      };
    }
  }
}

function updateMaterialUsed(hookConfig, dataModel, currentViewData) {
  const mats = dataModel.data.Materials || [];
  const fuels = dataModel.data.Fuels;
  const usedMats = {};

  if (dataModel.data.Cells) {
    const cells = dataModel.data.Cells;

    for (let i = 0; i < cells.length; i++) {
      cells[i].cell.cell.value[0].mats.forEach((m) => {
        usedMats[m] = true;
      });

      // detect if cells have no materials
      cells[i].invalid = null;
      if (cells[i].cell.cell.value[0].mats.length === 0) {
        cells[i].invalid = 'Cell has no materials';
      }
    }
  }

  for (let i = 0; i < mats.length; i++) {
    // Moderator is special, always mark.
    mats[i].noDelete = mats[i].id in usedMats || mats[i].name === 'mod';
  }
  if (fuels) {
    for (let i = 0; i < fuels.length; i++) {
      fuels[i].noDelete = fuels[i].id in usedMats;
    }
  }
}

function updateCellUsed(hookConfig, dataModel, currentViewData) {
  const cells = dataModel.data.Cells;
  const usedCells = {};

  if (dataModel.data.Rods) {
    const rods = dataModel.data.Rods;
    for (let i = 0; i < rods.length; i++) {
      rods[i].rodStack.rod.value[0].stack.forEach((layer) => {
        usedCells[layer.cell] = true;
      });

      // detect if rods have no cells
      rods[i].invalid = null;
      if (rods[i].rodStack.rod.value[0].stack.length === 0) {
        rods[i].invalid = 'Rod has no cells';
      }
    }
  }

  for (let i = 0; i < cells.length; i++) {
    cells[i].noDelete = cells[i].id in usedCells;
  }
}

function updateRodUsed(hookConfig, dataModel, currentViewData) {
  const rods = dataModel.data.Rods;
  const usedRods = {};

  if (dataModel.data.Maps) {
    const maps = dataModel.data.Maps;
    for (let i = 0; i < maps.length; i++) {
      maps[i].rodMap.map.value[0].grid.forEach((id) => {
        usedRods[id] = true;
      });
    }
  }

  for (let i = 0; i < rods.length; i++) {
    rods[i].noDelete = rods[i].id in usedRods;
  }
}

const mapConfig = [
  {
    type: 'assembly',
    coreMapKey: 'CoreAssemblyMap',
    coreMapName: 'assm_map',
    index: 0,
  },
  {
    type: 'insert',
    coreMapKey: 'CoreControlInsertMap',
    coreMapName: 'insert_map',
    index: 1,
  },
  // {
  //   type: 'control',
  //   coreMapKey: 'CoreControlInsertMap',
  //   coreMapName: 'crd_map',
  //   index: 1,
  // },
  {
    type: 'detector',
    coreMapKey: 'CoreDetectorMap',
    coreMapName: 'det_map',
    index: 2,
  },
];

function updateRodmapUsed(hookConfig, dataModel, currentViewData) {
  const rodmaps = dataModel.data.Maps;
  const usedRodmaps = {};

  mapConfig.forEach((config) => {
    if (dataModel.data[config.coreMapKey]) {
      const map = dataModel.data[config.coreMapKey];
      map[config.index].coreMap.map.value[0].grid.forEach((id) => {
        usedRodmaps[id] = true;
      });
    }
  });
  for (let i = 0; i < rodmaps.length; i++) {
    rodmaps[i].noDelete = rodmaps[i].id in usedRodmaps;
  }
}

function addNextView(hookConfig, dataModel, currentViewData, model) {
  const { viewName, nextViewName, insertAfter } = hookConfig;
  if (dataModel.data[viewName].length) {
    if (model.order.indexOf(nextViewName) === -1) {
      const insertIndex = 1 + model.order.indexOf(insertAfter || viewName);
      model.order.splice(insertIndex, 0, nextViewName);
    }
  } else {
    // remove view
    const indexToDelete = model.order.indexOf(nextViewName);
    if (indexToDelete !== -1) {
      model.order.splice(indexToDelete, 1);
    }
  }
}

module.exports = function initialize() {
  Simput.registerHook('checkDefaultMaterials', checkDefaultMaterials);
  Simput.registerHook('materialsToExternal', pushMaterialsToExternalHook);
  Simput.registerHook('fuelsToExternal', pushFuelsToExternalHook);
  Simput.registerHook('cellsToExternal', pushCellsToExternalHook);
  Simput.registerHook('updateMaterialUsed', updateMaterialUsed);
  Simput.registerHook('updateCellUsed', updateCellUsed);
  Simput.registerHook('updateRodUsed', updateRodUsed);
  Simput.registerHook('updateRodmapUsed', updateRodmapUsed);
  Simput.registerHook('addNextView', addNextView);
  Simput.registerHook('rodsToExternal', pushRodsToExternalHook);
  Simput.registerHook('mapsToExternal', mapsToExternal);
  Simput.registerHook('coreToExternal', coreToExternal);
  Simput.registerHook('coreDefToExternal', coreDefToExternal);
  Simput.registerHook('gridsToExternal', gridsToExternal);
};
