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

const relperms = [
  {
    name: 's1',
    relativePermAlpha: 3.548,
    relativePermN: 4.162,
  },
  {
    name: 's2',
    relativePermAlpha: 3.467,
    relativePermN: 2.738,
  },
  {
    name: 's3',
    relativePermAlpha: 2.692,
    relativePermN: 2.445,
  },
  {
    name: 's4',
    relativePermAlpha: 0.501,
    relativePermN: 2.659,
  },
  {
    name: 's5',
    relativePermAlpha: 0.661,
    relativePermN: 2.659,
  },
  {
    name: 's6',
    relativePermAlpha: 1.122,
    relativePermN: 2.479,
  },
  {
    name: 's7',
    relativePermAlpha: 2.089,
    relativePermN: 2.318,
  },
  {
    name: 's8',
    relativePermAlpha: 0.832,
    relativePermN: 2.514,
  },
  {
    name: 's9',
    relativePermAlpha: 1.585,
    relativePermN: 2.413,
  },
  {
    name: 's10',
    relativePermAlpha: 3.311,
    relativePermN: 2.202,
  },
  {
    name: 's11',
    relativePermAlpha: 1.622,
    relativePermN: 2.318,
  },
  {
    name: 's12',
    relativePermAlpha: 1.514,
    relativePermN: 2.259,
  },
  {
    name: 's13',
    relativePermAlpha: 1.122,
    relativePermN: 2.479,
  },
  {
    name: 'b1',
    relativePermAlpha: 1,
    relativePermN: 3,
  },
  {
    name: 'b2',
    relativePermAlpha: 1,
    relativePermN: 3,
  },
  {
    name: 'g1',
    relativePermAlpha: 1,
    relativePermN: 3,
  },
  {
    name: 'g2',
    relativePermAlpha: 1,
    relativePermN: 3,
  },
  {
    name: 'g3',
    relativePermAlpha: 1,
    relativePermN: 3,
  },
  {
    name: 'g4',
    relativePermAlpha: 1,
    relativePermN: 3,
  },
  {
    name: 'g5',
    relativePermAlpha: 1,
    relativePermN: 3,
  },
  {
    name: 'g6',
    relativePermAlpha: 1,
    relativePermN: 3,
  },
  {
    name: 'g7',
    relativePermAlpha: 1,
    relativePermN: 3,
  },
  {
    name: 'g8',
    relativePermAlpha: 1,
    relativePermN: 3,
  },
];

function addDefaultRelPerms(dataModel) {
  if (dataModel.data.RelPerms && dataModel.data.RelPerms.length) return;
  dataModel.data.RelPerms = relperms.map((properties, index) => ({
    name: properties.name,
    id: index + 1, // start indices at 1 b/c 0 is special in getExternal()
    relperm: {
      name: {
        id: 'relperm.name',
        value: [properties.name],
      },
      color: {
        id: 'relperm.color',
        value: hex2float(soilPalette[index % soilPalette.length]),
      },
      relativePermAlpha: {
        id: 'relperm.relativePermAlpha',
        value: [properties.relativePermAlpha],
      },
      relativePermN: {
        id: 'relperm.relativePermN',
        value: [properties.relativePermN],
      },
    },
  }));
}

function defaultRelPermNameFromId(id) {
  const ds = id.lastIndexOf('defaultRelPerm');
  if (ds === -1) return '';
  const index = +id.slice(ds + 'defaultRelPerm'.length);
  if (soils[index]) return soils[index].name;
  return '';
}

module.exports = {
  addDefaultRelPerms,
  defaultRelPermNameFromId,
};