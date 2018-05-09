import inpTemplate from './templates/inp.hbs';

function fillCore(model, dataModel) {
  model.core = {};
  const { coreSpec, baffleSpec } = dataModel.data.Specifications[0];
  model.core.title = coreSpec.title.value[0];
  model.core.size = coreSpec.grid.value[0];
  model.core.apitch = coreSpec.apitch.value[0];
  model.core.height = coreSpec.height.value[0];
  if (baffleSpec.thick > 0) {
    model.core.baffle = [
      baffleSpec.material.value[0],
      baffleSpec.gap.value[0],
      baffleSpec.thick.value[0],
    ];
  }
}

function extractUsedItems(itemMap) {
  const usedMap = {};
  itemMap.grid.forEach((item) => {
    usedMap[+item] = true;
  });
  delete usedMap[+itemMap.emptyItem];
  return usedMap;
}

function extractUsedCells(rodList) {
  const usedMap = {};
  rodList.forEach((rod) => {
    rod.rodStack.rod.value[0].stack.forEach((item) => {
      usedMap[+item.cell] = true;
    });
  });
  return usedMap;
}

function fillAssemblyMap(model, dataModel, map) {
  // given a map, get used fuels, cells, rods
  const usedRodMap = extractUsedItems(map.rodMap.map.value[0]);
  console.log('rods', usedRodMap);
  const rods = dataModel.data.Rods;
  const cells = dataModel.data.Cells;
  const usedRods = rods.filter((rod) => usedRodMap[rod.id]);
  const usedCellMap = extractUsedCells(usedRods);
  console.log('cells', usedCellMap);
  const usedCells = cells.filter((cell) => usedCellMap[cell.id]);

  // extract a lattice for each layer in the rods
}

function fillAssembly(model, dataModel) {
  model.assembly = {};
  const assemblySpec = dataModel.data.Specifications[0].assemblySpec;
  model.assembly.npin = assemblySpec.grid.value[0];
  model.assembly.ppitch = assemblySpec.pitch.value[0];

  // grab the core map, see which assemblies are used
  if (dataModel.data.CoreAssemblyMap && dataModel.data.Maps) {
    const coreMap = dataModel.data.CoreAssemblyMap[0].coreMap.map.value[0];
    const usedAssemblies = extractUsedItems(coreMap);
    const rodMaps = dataModel.data.Maps;
    rodMaps.forEach((map) => {
      if (usedAssemblies[map.id]) {
        fillAssemblyMap(model, dataModel, map);
      }
    });
  }
}

module.exports = function convert(dataModel) {
  const results = {};
  const model = {};
  fillCore(model, dataModel);
  fillAssembly(model, dataModel);

  results['simput.inp'] = inpTemplate(model);
  return { results, model: dataModel };
};
