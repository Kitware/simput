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
    for (let i = 0; i < mats.length; i++) {
      const name = mats[i].name;
      const currentMaterial = { name };
      // Gather material fields
      Object.keys(mats[i].material).forEach((key) => {
        currentMaterial[key] = mats[i].material[key].value[0];
      });

      // save to external
      external.materials[name] = currentMaterial;
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
      const currentCell = { name };
      // Gather material fields
      if (cells[i].materials) {
        Object.keys(cells[i].materials).forEach((key) => {
          currentCell[key] = cells[i].cell[key].value[0];
        });

        // save to external
        external.cells[name] = currentCell;
      }
    }
  }
}

module.exports = function initialize() {
  Simput.registerHook('materialsToExternal', pushMaterialsToExternalHook);
  Simput.registerHook('cellsToExternal', pushCellsToExternalHook);
};
