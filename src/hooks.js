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

function pushMaterialsToExternalHook(hookConfig, dataModel, currentViewData) {
  const external = getExternal(dataModel);

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
        external.materialEnum[name] = id;
      }
    }
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

function updateMaterialUsed(hookConfig, dataModel, currentViewData) {
  const mats = dataModel.data.Materials;
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
    mats[i].noDelete = mats[i].id in usedMats;
  }
  for (let i = 0; i < fuels.length; i++) {
    fuels[i].noDelete = fuels[i].id in usedMats;
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
  Simput.registerHook('materialsToExternal', pushMaterialsToExternalHook);
  Simput.registerHook('fuelsToExternal', pushFuelsToExternalHook);
  Simput.registerHook('cellsToExternal', pushCellsToExternalHook);
  Simput.registerHook('updateMaterialUsed', updateMaterialUsed);
  Simput.registerHook('updateCellUsed', updateCellUsed);
  Simput.registerHook('updateRodUsed', updateRodUsed);
  Simput.registerHook('addNextView', addNextView);
  Simput.registerHook('rodsToExternal', pushRodsToExternalHook);
  Simput.registerHook('mapsToExternal', mapsToExternal);
  Simput.registerHook('coreToExternal', coreToExternal);
};
