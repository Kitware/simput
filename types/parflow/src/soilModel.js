const soilPalette = [
  '#8dd3c7',
  '#ffffb3',
  '#bebada',
  '#fb8072',
  '#80b1d3',
  '#fdb462',
  '#b3de69',
  '#fccde5',
  '#d9d9d9',
  '#bc80bd',
  '#ccebc5',
  '#ffed6f',
  '#51574a',
  '#447c69',
  '#74c493',
  '#8e8c6d',
  '#e4bf80',
  '#e9d78e',
  '#e2975d',
  '#f19670',
  '#e16552',
  '#c94a53',
  '#be5168',
  '#a34974',
  '#993767',
  '#65387d',
  '#4e2472',
  '#9163b6',
  '#e279a3',
  '#e0598b',
  '#7c9fb0',
  '#5698c4',
  '#9abf88',
];

function hex2float(hexStr, outFloatArray = [0, 0.5, 1]) {
  switch (hexStr.length) {
    case 3: // abc => #aabbcc
      outFloatArray[0] = parseInt(hexStr[0], 16) * 17 / 255;
      outFloatArray[1] = parseInt(hexStr[1], 16) * 17 / 255;
      outFloatArray[2] = parseInt(hexStr[2], 16) * 17 / 255;
      return outFloatArray;
    case 4: // #abc => #aabbcc
      outFloatArray[0] = parseInt(hexStr[1], 16) * 17 / 255;
      outFloatArray[1] = parseInt(hexStr[2], 16) * 17 / 255;
      outFloatArray[2] = parseInt(hexStr[3], 16) * 17 / 255;
      return outFloatArray;
    case 6: // ab01df => #ab01df
      outFloatArray[0] = parseInt(hexStr.substr(0, 2), 16) / 255;
      outFloatArray[1] = parseInt(hexStr.substr(2, 2), 16) / 255;
      outFloatArray[2] = parseInt(hexStr.substr(4, 2), 16) / 255;
      return outFloatArray;
    case 7: // #ab01df
      outFloatArray[0] = parseInt(hexStr.substr(1, 2), 16) / 255;
      outFloatArray[1] = parseInt(hexStr.substr(3, 2), 16) / 255;
      outFloatArray[2] = parseInt(hexStr.substr(5, 2), 16) / 255;
      return outFloatArray;
    case 9: // #ab01df00
      outFloatArray[0] = parseInt(hexStr.substr(1, 2), 16) / 255;
      outFloatArray[1] = parseInt(hexStr.substr(3, 2), 16) / 255;
      outFloatArray[2] = parseInt(hexStr.substr(5, 2), 16) / 255;
      outFloatArray[3] = parseInt(hexStr.substr(7, 2), 16) / 255;
      return outFloatArray;
    default:
      return outFloatArray;
  }
}

const soils = [
  {
    name: 's1',
    porosity: 0.375,
    permeability: 0.269022595,
    relativePermAlpha: 3.548,
    relativePermN: 4.162,
    saturationAlpha: 3.548,
    saturationN: 4.162,
    saturationSRes: 0.0001,
    saturationSSat: 1.0,
  },
  {
    name: 's2',
    porosity: 0.39,
    permeability: 0.043630356,
    relativePermAlpha: 3.467,
    relativePermN: 2.738,
    saturationAlpha: 3.467,
    saturationN: 2.738,
    saturationSRes: 0.0001,
    saturationSSat: 1.0,
  },
  {
    name: 's3',
    porosity: 0.387,
    permeability: 0.015841225,
    relativePermAlpha: 2.692,
    relativePermN: 2.445,
    saturationAlpha: 2.692,
    saturationN: 2.445,
    saturationSRes: 0.0001,
    saturationSSat: 1.0,
  },
  {
    name: 's4',
    porosity: 0.439,
    permeability: 0.007582087,
    relativePermAlpha: 0.501,
    relativePermN: 2.659,
    saturationAlpha: 0.501,
    saturationN: 2.659,
    saturationSRes: 0.1,
    saturationSSat: 1.0,
  },
  {
    name: 's5',
    porosity: 0.489,
    permeability: 0.01818816,
    relativePermAlpha: 0.661,
    relativePermN: 2.659,
    saturationAlpha: 0.661,
    saturationN: 2.659,
    saturationSRes: 0.0001,
    saturationSSat: 1.0,
  },
  {
    name: 's6',
    porosity: 0.399,
    permeability: 0.005009435,
    relativePermAlpha: 1.122,
    relativePermN: 2.479,
    saturationAlpha: 1.122,
    saturationN: 2.479,
    saturationSRes: 0.0001,
    saturationSSat: 1.0,
  },
  {
    name: 's7',
    porosity: 0.384,
    permeability: 0.005492736,
    relativePermAlpha: 2.089,
    relativePermN: 2.318,
    saturationAlpha: 2.089,
    saturationN: 2.318,
    saturationSRes: 0.0001,
    saturationSSat: 1.0,
  },
  {
    name: 's8',
    porosity: 0.482,
    permeability: 0.004675077,
    relativePermAlpha: 0.832,
    relativePermN: 2.514,
    saturationAlpha: 0.832,
    saturationN: 2.514,
    saturationSRes: 0.0001,
    saturationSSat: 1.0,
  },
  {
    name: 's9',
    porosity: 0.442,
    permeability: 0.003386794,
    relativePermAlpha: 1.585,
    relativePermN: 2.413,
    saturationAlpha: 1.585,
    saturationN: 2.413,
    saturationSRes: 0.0001,
    saturationSSat: 1.0,
  },
  {
    name: 's10',
    porosity: 0.385,
    permeability: 0.004783973,
    relativePermAlpha: 3.311,
    relativePermN: 2.202,
    saturationAlpha: 3.311,
    saturationN: 2.202,
    saturationSRes: 0.0001,
    saturationSSat: 1.0,
  },
  {
    name: 's11',
    porosity: 0.481,
    permeability: 0.003979136,
    relativePermAlpha: 1.622,
    relativePermN: 2.318,
    saturationAlpha: 1.622,
    saturationN: 2.318,
    saturationSRes: 0.0001,
    saturationSSat: 1.0,
  },
  {
    name: 's12',
    porosity: 0.459,
    permeability: 0.006162952,
    relativePermAlpha: 1.514,
    relativePermN: 2.259,
    saturationAlpha: 1.514,
    saturationN: 2.259,
    saturationSRes: 0.0001,
    saturationSSat: 1.0,
  },
  {
    name: 's13',
    porosity: 0.399,
    permeability: 0.005009435,
    relativePermAlpha: 1.122,
    relativePermN: 2.479,
    saturationAlpha: 1.122,
    saturationN: 2.479,
    saturationSRes: 0.0001,
    saturationSSat: 1.0,
  },
  {
    name: 'b1',
    porosity: 0.33,
    permeability: 0.005,
    relativePermAlpha: 1,
    relativePermN: 3,
    saturationAlpha: 1,
    saturationN: 3,
    saturationSRes: 0.001,
    saturationSSat: 1.0,
  },
  {
    name: 'b2',
    porosity: 0.33,
    permeability: 0.01,
    relativePermAlpha: 1,
    relativePermN: 3,
    saturationAlpha: 1,
    saturationN: 3,
    saturationSRes: 0.001,
    saturationSSat: 1.0,
  },
  {
    name: 'g1',
    porosity: 0.33,
    permeability: 0.02,
    relativePermAlpha: 1,
    relativePermN: 3,
    saturationAlpha: 1,
    saturationN: 3,
    saturationSRes: 0.001,
    saturationSSat: 1.0,
  },
  {
    name: 'g2',
    porosity: 0.33,
    permeability: 0.03,
    relativePermAlpha: 1,
    relativePermN: 3,
    saturationAlpha: 1,
    saturationN: 3,
    saturationSRes: 0.001,
    saturationSSat: 1.0,
  },
  {
    name: 'g3',
    porosity: 0.33,
    permeability: 0.04,
    relativePermAlpha: 1,
    relativePermN: 3,
    saturationAlpha: 1,
    saturationN: 3,
    saturationSRes: 0.001,
    saturationSSat: 1.0,
  },
  {
    name: 'g4',
    porosity: 0.33,
    permeability: 0.05,
    relativePermAlpha: 1,
    relativePermN: 3,
    saturationAlpha: 1,
    saturationN: 3,
    saturationSRes: 0.001,
    saturationSSat: 1.0,
  },
  {
    name: 'g5',
    porosity: 0.33,
    permeability: 0.06,
    relativePermAlpha: 1,
    relativePermN: 3,
    saturationAlpha: 1,
    saturationN: 3,
    saturationSRes: 0.001,
    saturationSSat: 1.0,
  },
  {
    name: 'g6',
    porosity: 0.33,
    permeability: 0.08,
    relativePermAlpha: 1,
    relativePermN: 3,
    saturationAlpha: 1,
    saturationN: 3,
    saturationSRes: 0.001,
    saturationSSat: 1.0,
  },
  {
    name: 'g7',
    porosity: 0.33,
    permeability: 0.1,
    relativePermAlpha: 1,
    relativePermN: 3,
    saturationAlpha: 1,
    saturationN: 3,
    saturationSRes: 0.001,
    saturationSSat: 1.0,
  },
  {
    name: 'g8',
    porosity: 0.33,
    permeability: 0.2,
    relativePermAlpha: 1,
    relativePermN: 3,
    saturationAlpha: 1,
    saturationN: 3,
    saturationSRes: 0.001,
    saturationSSat: 1.0,
  },
];

function addDefaultSoils(dataModel) {
  if (dataModel.data.Soils && dataModel.data.Soils.length) return;
  dataModel.data.Soils = soils.map((properties, index) => ({
    name: properties.name,
    id: index + 1, // start indices at 1 b/c 0 is special in getExternal()
    soil: {
      name: {
        id: 'soil.name',
        value: [properties.name],
      },
      color: {
        id: 'soil.color',
        value: hex2float(soilPalette[index % soilPalette.length]),
      },
      porosity: {
        id: 'soil.porosity',
        value: [properties.porosity],
      },
      permeability: {
        id: 'soil.permeability',
        value: [properties.permeability],
      },
      relativePermAlpha: {
        id: 'soil.relativePermAlpha',
        value: [properties.relativePermAlpha],
      },
      relativePermN: {
        id: 'soil.relativePermN',
        value: [properties.relativePermN],
      },
      saturationAlpha: {
        id: 'soil.saturationAlpha',
        value: [properties.saturationAlpha],
      },
      saturationN: {
        id: 'soil.saturationN',
        value: [properties.saturationN],
      },
      saturationSRes: {
        id: 'soil.saturationSRes',
        value: [properties.saturationSRes],
      },
      saturationSSat: {
        id: 'soil.saturationSSat',
        value: [properties.saturationSSat],
      },
    },
  }));
}

function defaultSoilNameFromId(id) {
  const ds = id.lastIndexOf('defaultSoil');
  if (ds === -1) return '';
  const index = +id.slice(ds + 'defaultSoil'.length);
  if (soils[index]) return soils[index].name;
  return '';
}

module.exports = {
  addDefaultSoils,
  defaultSoilNameFromId,
};