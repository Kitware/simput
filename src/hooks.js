function getExternal(dataModel) {
  if (!dataModel.external) {
    dataModel.external = {};
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
    for (let i = 0; i < cells.length; i++) {
      const name = cells[i].name;
      const id = cells[i].id;
      const currentCell = { name };
      // Gather cell fields
      if (cells[i].cell) {
        Object.keys(cells[i].cell).forEach((key) => {
          currentCell[key] = cells[i].cell[key].value;
        });

        // save to external
        external.cells[id] = currentCell;
      }
    }
  }
}

function pushRodsToExternalHook(hookConfig, dataModel, currentViewData) {
  const external = getExternal(dataModel);

  // Fill cells
  if (dataModel.data.Rods) {
    const rods = dataModel.data.Rods;
    external.rodsNames = { '0': '-' };
    external.rodsColors = { '0': 'white' };
    for (let i = 0; i < rods.length; i++) {
      const { id, name } = rods[i];
      external.rodsNames[id] = name;
      external.rodsColors[id] = `rgb(${rods[i].rodInfo.color.value
        .map((rgb) => Math.floor(rgb * 255))
        .join(',')})`;
    }
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
    }
  }

  for (let i = 0; i < cells.length; i++) {
    cells[i].noDelete = cells[i].id in usedCells;
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
  Simput.registerHook('addNextView', addNextView);
  Simput.registerHook('rodsToExternal', pushRodsToExternalHook);
};
