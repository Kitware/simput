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
  return dataModel.external;
}

function pushMaterialsToExternalHook(hookConfig, dataModel, currentViewData) {
  const external = getExternal(dataModel);

  // Fill materials
  if (dataModel.data.Materials) {
    const mats = dataModel.data.Materials;
    external.materials = {};
    external.materialNames = {};
    for (let i = 0; i < mats.length; i++) {
      const name = mats[i].name;
      const id = mats[i].id;
      const currentMaterial = { name };
      // Gather material fields
      if (mats[i].material) {
        Object.keys(mats[i].material).forEach((key) => {
          currentMaterial[key] = mats[i].material[key].value;
        });

        // save to external
        external.materials[id] = currentMaterial;
        external.materialNames[name] = id;
        external.viz.colors[id] = mats[i].material.color.value;
        external.viz.names[id] = name;
      }
    }
  }
}

function pushCellsToExternalHook(hookConfig, dataModel, currentViewData) {
  const external = getExternal(dataModel);

  // Fill cells
  if (dataModel.data.Cells) {
    const cells = dataModel.data.Cells;
    external.cells = {};
    external.viz.cells = {};
    for (let i = 0; i < cells.length; i++) {
      const name = cells[i].name;
      const id = cells[i].id;
      const currentCell = { name };
      const layers = [];

      external.viz.names[id] = name;

      // Gather cell fields
      if (cells[i].cell) {
        Object.keys(cells[i].cell).forEach((key) => {
          currentCell[key] = cells[i].cell[key].value;
        });

        // Extract layers
        const { mats, radii } = cells[i].cell.cell.value[0];
        for (let lIdx = 0; lIdx < mats.length; lIdx++) {
          layers.push({
            material: mats[lIdx],
            radius: radii[lIdx],
          });
        }

        // save to external
        external.cells[id] = currentCell;
        external.viz.cells[id] = layers;
        external.viz.colors[id] = cells[i].cell.color.value;
      }
    }
  }
}

function pushRodsToExternalHook(hookConfig, dataModel, currentViewData) {
  const external = getExternal(dataModel);

  // Fill rods
  if (dataModel.data.Rods) {
    const rods = dataModel.data.Rods;
    external.rods = {};
    external.viz.rods = {};
    external.rodsNames = { '0': '-' };
    external.rodsColors = { '0': 'white' };
    for (let i = 0; i < rods.length; i++) {
      const { id, name } = rods[i];
      external.viz.names[id] = name;
      external.viz.colors[id] = rods[i].rodInfo.color.value;
      external.viz.rods[id] = {
        offset: rods[i].rodInfo.offset.value[0],
        length: rods[i].rodInfo.height.value[0],
        cells: rods[i].rodStack.rod.value[0].stack,
      };
      external.rods[id] = rods[i];
      external.rodsNames[id] = name;
      external.rodsColors[id] = `rgb(${rods[i].rodInfo.color.value
        .map((rgb) => Math.floor(rgb * 255))
        .join(',')})`;
    }
  }
}

function mapsToExternal(hookConfig, dataModel, currentViewData) {
  const external = getExternal(dataModel);

  // Fill maps
  if (dataModel.data.Maps) {
    const pitch = dataModel.data.Specifications[0].assemblySpec.pitch.value[0];
    const maps = dataModel.data.Maps;
    external.mapNames = { '0': '-' };
    external.mapColors = { '0': 'white' };
    external.viz.assembly = {};
    for (let i = 0; i < maps.length; i++) {
      const { id, name } = maps[i];
      external.viz.names[id] = name;
      external.mapNames[id] = name;
      external.mapColors[id] = `rgb(${maps[i].mapInfo.color.value
        .map((rgb) => Math.floor(rgb * 255))
        .join(',')})`;

      const { grid, config: { size } } = maps[i].rodMap.map.value[0];
      external.viz.assembly[id] = { grid, size: external[size], pitch };
    }
  }
}

function coreToExternal(hookConfig, dataModel, currentViewData) {
  const external = getExternal(dataModel);
  const pitch = dataModel.data.Specifications[0].coreSpec.apitch.value[0];
  const size = dataModel.data.Specifications[0].coreSpec.grid.value[0];
  external.viz.core = { size, pitch };

  // Fill maps
  if (dataModel.data.CoreAssemblyMap) {
    const { grid } = dataModel.data.CoreAssemblyMap[0].coreMap.map.value[0];
    external.viz.core.gridAssembly = grid;
  }
  if (dataModel.data.CoreControlInsertMap) {
    external.viz.core.gridInsertControls =
      dataModel.data.CoreControlInsertMap[1].coreMap.map.value[0].grid;
  }
  if (dataModel.data.CoreDetectorMap) {
    external.viz.core.gridDetectors =
      dataModel.data.CoreDetectorMap[2].coreMap.map.value[0].grid;
  }
}

function updateMaterialUsed(hookConfig, dataModel, currentViewData) {
  const mats = dataModel.data.Materials;
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
  const { viewName, nextViewName } = hookConfig;
  if (dataModel.data[viewName].length) {
    if (model.order.indexOf(nextViewName) === -1) {
      const insertIndex = 1 + model.order.indexOf(viewName);
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
  Simput.registerHook('cellsToExternal', pushCellsToExternalHook);
  Simput.registerHook('updateMaterialUsed', updateMaterialUsed);
  Simput.registerHook('updateCellUsed', updateCellUsed);
  Simput.registerHook('updateRodUsed', updateRodUsed);
  Simput.registerHook('addNextView', addNextView);
  Simput.registerHook('rodsToExternal', pushRodsToExternalHook);
  Simput.registerHook('mapsToExternal', mapsToExternal);
  Simput.registerHook('coreToExternal', coreToExternal);
};
