import inpTemplate from './templates/inp.hbs';

// given a numeric ID, return the name of the material
function materialIdToName(dataModel, id) {
  const materials = dataModel.data.Materials;
  let count = materials.length;
  while (count--) {
    if (materials[count].id === id) return materials[count].name;
  }
  return null;
}

// from a grid array, extract IDs of all used items, except the emptyItem
function extractUsedItems(itemMap) {
  const usedMap = {};
  itemMap.grid.forEach((item) => {
    usedMap[+item] = true;
  });
  delete usedMap[+itemMap.emptyItem];
  return usedMap;
}

// from a list of rods, extract IDs of all used cells.
function extractUsedCells(rodList) {
  const usedMap = {};
  rodList.forEach((rod) => {
    rod.rodStack.rod.value[0].stack.forEach((item) => {
      usedMap[+item.cell] = true;
    });
  });
  return usedMap;
}

function getSymmetricMap(cellMap, symmetry) {
  const InpHelper = window.Simput.types.vera.helper.InpHelper;

  return InpHelper.getTextMap(
    {
      cell_map: cellMap,
      symmetry,
    },
    {
      numPins: Math.sqrt(cellMap.length),
      pad: '    ', // 4 space padding on left.
    }
  );
}
// get a text map, but stripped of empty items where coreTextMap is '0'
function getStrippedSymmetricMap(cellMap, symmetry, coreTextMap) {
  const InpHelper = window.Simput.types.vera.helper.InpHelper;
  let textMap = getSymmetricMap(cellMap, symmetry);
  textMap = InpHelper.stripCoreZeros(textMap, coreTextMap, '    ');
  return textMap;
}

function fillCoreMaps(model, dataModel) {
  const InpHelper = window.Simput.types.vera.helper.InpHelper;
  const assemblyMap = dataModel.data.CoreAssemblyMap[0];
  // const title = assemblyMap.coreMapInfo.title.value[0];
  const itemMap = assemblyMap.coreMap.map.value[0];
  const usedAssemblies = extractUsedItems(itemMap);
  const rodMaps = dataModel.data.Maps;
  rodMaps.forEach((map) => {
    if (usedAssemblies[map.id]) {
      // convert to a lookup.
      usedAssemblies[map.id] = map.name;
    }
  });
  usedAssemblies[+itemMap.emptyItem] = '-';
  const labeledMap = itemMap.grid.map((id) => {
    const name = usedAssemblies[+id];
    return name !== undefined ? name : '-';
  });
  // assembly map defines the core_shape map. Always saved without symmetry.
  const coreShape = InpHelper.getCoreShape([{ cell_map: labeledMap }]);
  model.core.core_shape = getSymmetricMap(
    coreShape.cell_map,
    InpHelper.SymmetryModes.NONE
  );

  const coreTextMaps = {
    [InpHelper.SymmetryModes.NONE]: model.core.core_shape,
  };

  if (!coreTextMaps[itemMap.symmetry]) {
    coreTextMaps[itemMap.symmetry] = getSymmetricMap(
      coreShape.cell_map,
      itemMap.symmetry
    );
  }
  model.core.assm_map = getStrippedSymmetricMap(
    labeledMap,
    itemMap.symmetry,
    coreTextMaps[itemMap.symmetry]
  );
}

function fillCore(model, dataModel) {
  // FIXME broken (baffleSpec, padSpec, lowerPlateSpec, upperPlateSpec) are not in "Specifications"
  // model.core = {};
  // const { coreSpec, baffleSpec, padSpec, lowerPlateSpec, upperPlateSpec } = dataModel.data.Specifications[0];
  // model.core.title = coreSpec.title.value[0];
  // model.core.size = coreSpec.grid.value[0];
  // model.core.apitch = coreSpec.apitch.value[0];
  // model.core.height = coreSpec.height.value[0];
  // if (baffleSpec.thick.value[0] > 0) {
  //   model.core.baffle = [
  //     materialIdToName(dataModel, +baffleSpec.material.value[0]),
  //     baffleSpec.gap.value[0],
  //     baffleSpec.thick.value[0],
  //   ];
  // }
  // if (
  //   padSpec.params.value[0] > 0 &&
  //   padSpec.params.value[1] > 0 &&
  //   padSpec.params.value[2] > 0
  // ) {
  //   model.core.pad = [materialIdToName(dataModel, +padSpec.material.value[0])].concat(
  //     padSpec.params.value,
  //     padSpec.positions.value
  //   );
  // }
  //   if (lowerPlateSpec.thick.value[0] > 0) {
  //     model.core.lower_plate = [
  //       materialIdToName(dataModel, lowerPlateSpec.material.value[0]),
  //       lowerPlateSpec.thick.value[0],
  //       lowerPlateSpec.volfrac.value[0],
  //     ];
  //   }
  //   if (upperPlateSpec.thick.value[0] > 0) {
  //     model.core.upper_plate = [
  //       materialIdToName(dataModel, upperPlateSpec.material.value[0]),
  //       upperPlateSpec.thick.value[0],
  //       upperPlateSpec.volfrac.value[0],
  //     ];
  //   }
  // fillCoreMaps(model, dataModel);
}

function getLatticeMaps(name, rodMap, usedRods, usedCellMap) {
  const lattices = [];
  let elevations = [];

  // extract elevations from each used rod
  usedRods.forEach((rod) => {
    let currentHeight = rod.rodInfo.offset.value[0];
    elevations.push(currentHeight);
    rod.rodStack.rod.value[0].stack.forEach((item) => {
      currentHeight += item.length;
      elevations.push(currentHeight);
    });
  });

  elevations.sort((a, b) => a - b);
  elevations = elevations.filter((v, i, a) => a[i - 1] !== v);

  // for each rod at each elevation, save which cell name it contains.
  const elevationCellMaps = elevations.map(() => ({}));
  usedRods.forEach((rod) => {
    let currentHeight = rod.rodInfo.offset.value[0];
    let currIndex = 0;
    while (elevations[currIndex] < currentHeight) currIndex += 1;
    rod.rodStack.rod.value[0].stack.forEach((item) => {
      currentHeight += item.length;
      while (elevations[currIndex] < currentHeight) {
        elevationCellMaps[currIndex][rod.id] = usedCellMap[+item.cell];
        currIndex += 1;
      }
    });
  });
  // console.log(elevationCellMaps);

  // each elevation range with cells is a lattice map, referencing cells.
  for (let i = 0; i < elevations.length - 1; i++) {
    // rodMap.grid contains a full-size array of the map, with rod IDs
    // rodMap.symmetry can be used to cut it down for output.
    const cellMap = rodMap.grid.map((id) => {
      const cell = elevationCellMaps[i][+id];
      return cell !== undefined ? cell : '-';
    });
    lattices.push({
      name: `${name}${i}`,
      cellMap: getSymmetricMap(cellMap, rodMap.symmetry),
    });
  }

  return { lattices, elevations };
}

// each rodmap represents a single axial card, comprised of several lattice maps.
function fillAssemblyMap(model, dataModel, map) {
  // given a map, get used fuels, cells, rods
  const usedRodMap = extractUsedItems(map.rodMap.map.value[0]);
  // console.log('rods', usedRodMap);
  const rods = dataModel.data.Rods;
  const cells = dataModel.data.Cells;
  const usedRods = rods.filter((rod) => usedRodMap[rod.id]);
  const usedCellMap = extractUsedCells(usedRods);
  // console.log('cells', usedCellMap);
  const usedCells = cells.filter((cell) => usedCellMap[cell.id]);
  // use for name lookup.
  usedCells.forEach((cell) => {
    usedCellMap[cell.id] = cell.name;
  });
  model.assembly.cells = usedCells.map((item) => ({
    name: item.name,
    radii: item.cell.cell.value[0].radii,
    mats: item.cell.cell.value[0].mats.map((id) =>
      materialIdToName(dataModel, +id)
    ),
  }));

  // extract a lattice for each layer in the rods
  const { lattices, elevations } = getLatticeMaps(
    map.name,
    map.rodMap.map.value[0],
    usedRods,
    usedCellMap
  );
  model.assembly.lattices = model.assembly.lattices.concat(lattices);
  const elevationMats = [];
  for (let i = 0; i < elevations.length; ++i) {
    elevationMats.push(elevations[i]);
    if (lattices[i]) elevationMats.push(lattices[i].name);
  }
  model.assembly.axials.push({ name: map.name, elevationMats });
}

function fillAssembly(model, dataModel) {
  model.assembly = {};
  const assemblySpec = dataModel.data.Specifications[0].assemblySpec;
  model.assembly.npin = assemblySpec.grid.value[0];
  model.assembly.ppitch = assemblySpec.pitch.value[0];

  // grab the core map, see which assemblies are used
  if (dataModel.data.CoreAssemblyMap && dataModel.data.Maps) {
    const assemblyMap = dataModel.data.CoreAssemblyMap[0];
    model.assembly.title = assemblyMap.coreMapInfo.title.value[0];
    const coreMap = assemblyMap.coreMap.map.value[0];
    const usedAssemblies = extractUsedItems(coreMap);
    const rodMaps = dataModel.data.Maps;
    model.assembly.lattices = [];
    model.assembly.axials = [];
    rodMaps.forEach((map) => {
      if (usedAssemblies[map.id]) {
        fillAssemblyMap(model, dataModel, map);
      }
    });

    // FIXME Nozzle not part of assemblyMap
    // if (assemblyMap.lowerNozzleSpec.height.value[0] > 0) {
    //   model.assembly.lower_nozzle = [
    //     materialIdToName(
    //       dataModel,
    //       assemblyMap.lowerNozzleSpec.material.value[0]
    //     ),
    //     assemblyMap.lowerNozzleSpec.height.value[0],
    //     assemblyMap.lowerNozzleSpec.mass.value[0],
    //   ];
    // }
    // if (assemblyMap.upperNozzleSpec.height.value[0] > 0) {
    //   model.assembly.upper_nozzle = [
    //     materialIdToName(
    //       dataModel,
    //       assemblyMap.upperNozzleSpec.material.value[0]
    //     ),
    //     assemblyMap.upperNozzleSpec.height.value[0],
    //     assemblyMap.upperNozzleSpec.mass.value[0],
    //   ];
    // }
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
