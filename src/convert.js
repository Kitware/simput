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
  {
    type: 'control',
    coreMapKey: 'CoreControlInsertMap',
    coreMapName: 'crd_map',
    index: 1,
  },
  {
    type: 'detector',
    coreMapKey: 'CoreDetectorMap',
    coreMapName: 'det_map',
    index: 2,
  },
];

function fillCoreMaps(model, dataModel) {
  const InpHelper = window.Simput.types.vera.helper.InpHelper;
  let coreShape = null;
  const coreTextMaps = {};
  mapConfig.forEach(config => {
    const assemblyMap = dataModel.data[config.coreMapKey][config.index];
    // const title = assemblyMap.coreMapInfo.title.value[0];
    const itemMap = assemblyMap.coreMap.map.value[0];
    const usedAssemblies = extractUsedItems(itemMap);
    const rodMaps = dataModel.data.Maps;
    let emptyMap = true;
    rodMaps.forEach((map) => {
      if (usedAssemblies[map.id]) {
        const mapType = map.mapInfo.type.value[0];
        // convert to a lookup.
        // control/insert needs to filter the other types of rod out.
        usedAssemblies[map.id] = mapType === config.type ? map.name : '-';
        if (mapType === config.type) emptyMap = false;
      }
    });
    if (emptyMap) return;

    usedAssemblies[+itemMap.emptyItem] = '-';
    const labeledMap = itemMap.grid.map((id) => {
      const name = usedAssemblies[+id];
      return name !== undefined ? name : '-';
    });
    // assembly map is first,
    // defines the core_shape map. Always saved without symmetry.
    if (!coreShape) {
      coreShape = InpHelper.getCoreShape([{ cell_map: labeledMap }]);
      model.core.core_shape = getSymmetricMap(
        coreShape.cell_map,
        InpHelper.SymmetryModes.NONE
      );
      coreTextMaps[InpHelper.SymmetryModes.NONE] = model.core.core_shape;
    }

    if (!coreTextMaps[itemMap.symmetry]) {
      coreTextMaps[itemMap.symmetry] = getSymmetricMap(
        coreShape.cell_map,
        itemMap.symmetry
      );
    }
    model.core[config.coreMapName] = getStrippedSymmetricMap(
      labeledMap,
      itemMap.symmetry,
      coreTextMaps[itemMap.symmetry]
    );
  });
}

function fillCore(model, dataModel) {
  model.core = {};
  const { coreSpec } = dataModel.data.Specifications[0];
  const {
    baffleSpec,
    padSpec,
    lowerPlateSpec,
    upperPlateSpec,
    vesselSpec,
  } = dataModel.data.CoreDefinition[0];
  model.core.title = coreSpec.title.value[0];
  model.core.size = coreSpec.grid.value[0];
  model.core.apitch = coreSpec.apitch.value[0];
  model.core.height = coreSpec.height.value[0];
  if (baffleSpec.thick.value[0] > 0) {
    model.core.baffle = [
      materialIdToName(dataModel, +baffleSpec.material.value[0]),
      baffleSpec.gap.value[0],
      baffleSpec.thick.value[0],
    ];
  }
  if (
    padSpec.params.value[0] > 0 &&
    padSpec.params.value[1] > 0 &&
    padSpec.params.value[2] > 0
  ) {
    model.core.pad = [
      materialIdToName(dataModel, +padSpec.material.value[0]),
    ].concat(padSpec.params.value, padSpec.positions.value);
  }
  if (lowerPlateSpec.thick.value[0] > 0) {
    model.core.lower_plate = [
      materialIdToName(dataModel, lowerPlateSpec.material.value[0]),
      lowerPlateSpec.thick.value[0],
      lowerPlateSpec.volfrac.value[0],
    ];
  }
  if (upperPlateSpec.thick.value[0] > 0) {
    model.core.upper_plate = [
      materialIdToName(dataModel, upperPlateSpec.material.value[0]),
      upperPlateSpec.thick.value[0],
      upperPlateSpec.volfrac.value[0],
    ];
  }
  if (vesselSpec.cell.value[0].radii.length) {
    model.core.vessel = [];
    const spec = vesselSpec.cell.value[0];
    spec.radii.forEach((radius, index) => {
      model.core.vessel.push(materialIdToName(dataModel, +spec.mats[index]));
      model.core.vessel.push(radius);
    });
  }
  fillCoreMaps(model, dataModel);
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
function fillAssemblyMap(model, dataModel, map, config) {
  const { type } = config;
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
  model[type].cells = usedCells.map((item) => ({
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
  model[type].lattices = model[type].lattices.concat(lattices);
  const elevationMats = [];
  for (let i = 0; i < elevations.length; ++i) {
    elevationMats.push(elevations[i]);
    if (lattices[i]) elevationMats.push(lattices[i].name);
  }
  model[type].axials.push({ name: map.name, elevationMats });

  // specific to assembly maps.
  if (map.lowerNozzleSpec && map.lowerNozzleSpec.height.value[0] > 0) {
    model[type].lower_nozzle = [
      materialIdToName(dataModel, map.lowerNozzleSpec.material.value[0]),
      map.lowerNozzleSpec.height.value[0],
      map.lowerNozzleSpec.mass.value[0],
    ];
  }
  if (map.upperNozzleSpec && map.upperNozzleSpec.height.value[0] > 0) {
    model[type].upper_nozzle = [
      materialIdToName(dataModel, map.upperNozzleSpec.material.value[0]),
      map.upperNozzleSpec.height.value[0],
      map.upperNozzleSpec.mass.value[0],
    ];
  }
}

function fillAssembly(model, dataModel, config) {
  const { type, coreMapKey, index } = config;
  model[type] = {};
  const assemblySpec = dataModel.data.Specifications[0].assemblySpec;
  model[type].npin = assemblySpec.grid.value[0];
  model[type].ppitch = assemblySpec.pitch.value[0];

  // grab the core map, see which assemblies are used
  if (dataModel.data[coreMapKey] && dataModel.data.Maps) {
    const assemblyMap = dataModel.data[coreMapKey][index];
    model[type].title = assemblyMap.coreMapInfo.title.value[0];
    const coreMap = assemblyMap.coreMap.map.value[0];
    const usedAssemblies = extractUsedItems(coreMap);
    const rodMaps = dataModel.data.Maps;
    model[type].lattices = [];
    model[type].axials = [];
    rodMaps.forEach((map) => {
      if (usedAssemblies[map.id]) {
        fillAssemblyMap(model, dataModel, map, config);
      }
    });
  }
}

module.exports = function convert(dataModel) {
  const results = {};
  const model = {};
  fillCore(model, dataModel);
  mapConfig.forEach((config) => fillAssembly(model, dataModel, config));

  results['simput.inp'] = inpTemplate(model);
  return { results, model: dataModel };
};
