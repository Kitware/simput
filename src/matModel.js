// no vtkjs: import vtkMath from 'vtk.js/Sources/Common/Core/Math';
// no react: import { hex2float } from 'paraviewweb/src/React/Properties/ColorProperty';
const materialPalette = [
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

// so copy:
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

// needed before window.Simput.types.vera is set up.
// copied from VeraInView/src/utils/Materials.js
const materials = [
  {
    label: 'aic',
    density: 10.2,
    names: ['ag-107', 'ag-109', 'in-113', 'in-115', 'cd-00'],
    thexp: 6.9,
    fracs: [4.1101e-1, 3.8899e-1, 6.32772e-3, 1.43672e-1, 5.0e-2],
  },

  {
    density: 1.189e-3,
    label: 'air',
    fracs: [0.7649, 0.2351],
    names: ['n-14', 'o-16'],
  },
  {
    density: 3.96,
    label: 'al2o3',
    fracs: [5.29321e-1, 4.70679e-1],
    names: ['al-27', 'o-16'],
    thexp: 7.0,
  },
  {
    density: 2.55,
    label: 'b2o3',
    fracs: [5.72412e-2, 2.5333e-1, 6.89429e-1],
    names: ['b-10', 'b-11', 'o-16'],
    thexp: 7.0,
  },
  {
    density: 1.7597,
    label: 'b4c',
    fracs: [1.44272e-1, 6.38495e-1, 2.17234e-1],
    names: ['b-10', 'b-11', 'c-00'],
    thexp: 5.73,
  },
  {
    density: 2.37,
    label: 'boron',
    fracs: [1.84309e-1, 8.15691e-1],
    names: ['b-10', 'b-11'],
    thexp: 7.0,
  },
  {
    density: 6.56,
    label: 'clad',
    fracs: [1],
    names: ['zirc4'],
    thexp: 7.092,
  },
  {
    density: 7.85,
    label: 'cs',
    fracs: [9.99216e-3, 5.58916e-2, 9.09832e-1, 2.13879e-2, 2.89625e-3],
    names: ['c-00', 'fe-54', 'fe-56', 'fe-57', 'fe-58'],
    thexp: 16.79,
  },
  {
    density: 7.407,
    label: 'gad',
    fracs: [
      1.67644e-3,
      1.85136e-2,
      1.26506e-1,
      1.76101e-1,
      1.355e-1,
      2.16438e-1,
      1.92889e-1,
      1.32376e-1,
    ],
    names: [
      'gd-152',
      'gd-154',
      'gd-155',
      'gd-156',
      'gd-157',
      'gd-158',
      'gd-160',
      'o-16',
    ],
    thexp: 7.0,
  },
  {
    density: 0.1786e-3,
    label: 'gap',
    fracs: [1.0],
    names: ['he-4'],
  },
  {
    density: 0.1786e-3,
    label: 'he',
    fracs: [1.0],
    names: ['he-4'],
  },
  {
    density: 8.19,
    label: 'inc',
    fracs: [
      2.50001e-2,
      2.50075e-2,
      6.26047e-3,
      1.25547e-1,
      1.45103e-2,
      3.68004e-3,
      3.95183e-3,
      6.43299e-2,
      1.51224e-3,
      2.0478e-4,
      4.90541e-1,
      1.95463e-1,
      8.63849e-3,
      2.79938e-2,
      7.35945e-3,
    ],
    names: [
      'si-00',
      'ti-00',
      'cr-50',
      'cr-52',
      'cr-53',
      'cr-54',
      'fe-54',
      'fe-56',
      'fe-57',
      'fe-58',
      'ni-58',
      'ni-60',
      'ni-61',
      'ni-62',
      'ni-64',
    ],
    thexp: 16.79,
  },
  {
    density: 0.743,
    label: 'mod',
    fracs: [1],
    names: ['water'],
  },
  {
    density: 2.34249,
    label: 'pyrex',
    fracs: [6.81945e-3, 3.01805e-2, 5.35e-1, 4.1e-2, 1.0e-2, 3.77e-1],
    names: ['b-10', 'b-11', 'o-16', 'na-23', 'al-27', 'si-00'],
    thexp: 3.25,
  },
  {
    density: 2.24419,
    label: 'pyrex-vera',
    fracs: [7.11823e-3, 3.17015e-2, 5.52167e-1, 4.09014e-1],
    names: ['b-10', 'b-11', 'o-16', 'si-00'],
    thexp: 3.25,
  },
  {
    density: 2.18,
    label: 'sio2',
    fracs: [5.32565e-1, 4.67435e-1],
    names: ['o-16', 'si-00'],
    thexp: 7.0,
  },
  {
    density: 8.0,
    label: 'ss',
    fracs: [
      7.99365e-4,
      1.00002e-2,
      4.50008e-4,
      7.93005e-3,
      1.59029e-1,
      1.838e-2,
      4.66146e-3,
      2.00001e-2,
      3.86016e-2,
      6.28376e-1,
      1.47715e-2,
      2.0003e-3,
      6.38386e-2,
      2.54373e-2,
      1.1242e-3,
      3.64308e-3,
      9.57752e-4,
    ],
    names: [
      'c-00',
      'si-00',
      'p-31',
      'cr-50',
      'cr-52',
      'cr-53',
      'cr-54',
      'mn-55',
      'fe-54',
      'fe-56',
      'fe-57',
      'fe-58',
      'ni-58',
      'ni-60',
      'ni-61',
      'ni-62',
      'ni-64',
    ],
    thexp: 16.79,
  },
  {
    density: 19.3,
    label: 'tungsten',
    fracs: [0.0012, 0.265, 0.1431, 0.3064, 0.2843],
    names: ['o-16', 'w-182', 'w-183', 'w-184', 'w-186'],
    thexp: 16.79,
  },
  {
    density: 3.65,
    label: 'waba',
    fracs: [1.3621e-2, 6.02818e-2, 2.05259e-2, 4.26297e-1, 4.79274e-1],
    names: ['b-10', 'b-11', 'c-00', 'o-16', 'al-27'],
    thexp: 7.0,
  },
  {
    density: 0.743,
    label: 'water',
    fracs: [1.11915e-1, 8.88085e-1],
    names: ['h-1', 'o-16'],
  },
  {
    density: 6.56,
    label: 'zirc2',
    fracs: [
      4.17369e-5,
      8.36994e-4,
      9.67359e-5,
      2.45336e-5,
      7.6215e-5,
      1.24067e-3,
      2.9165e-5,
      3.94935e-6,
      3.69587e-4,
      1.47268e-4,
      6.50848e-6,
      2.10915e-5,
      5.54483e-6,
      4.98188e-1,
      1.09852e-1,
      1.69757e-1,
      1.7578e-1,
      2.89227e-2,
      1.32587e-4,
      9.18245e-5,
      4.77191e-5,
      2.05842e-3,
      1.09665e-3,
      3.48798e-3,
      1.24758e-3,
      4.77154e-3,
      6.8941e-4,
      8.76292e-4,
      1.55926e-7,
      5.18504e-6,
      1.84393e-5,
      2.71973e-5,
      1.36552e-5,
      3.53673e-5,
    ],
    names: [
      'cr-50',
      'cr-52',
      'cr-53',
      'cr-54',
      'fe-54',
      'fe-56',
      'fe-57',
      'fe-58',
      'ni-58',
      'ni-60',
      'ni-61',
      'ni-62',
      'ni-64',
      'zr-90',
      'zr-91',
      'zr-92',
      'zr-94',
      'zr-96',
      'sn-112',
      'sn-114',
      'sn-115',
      'sn-116',
      'sn-117',
      'sn-118',
      'sn-119',
      'sn-120',
      'sn-122',
      'sn-124',
      'hf-174',
      'hf-176',
      'hf-177',
      'hf-178',
      'hf-179',
      'hf-180',
    ],
    thexp: 7.092,
  },
  {
    density: 6.56,
    label: 'zirc4',
    fracs: [
      4.17369e-5,
      8.36988e-4,
      9.67361e-5,
      2.45339e-5,
      1.18556e-4,
      1.92992e-3,
      4.53675e-5,
      6.14347e-6,
      4.98086e-1,
      1.0983e-1,
      1.69723e-1,
      1.75744e-1,
      2.89168e-2,
      1.32586e-4,
      9.18243e-5,
      4.7719e-5,
      2.05842e-3,
      1.09665e-3,
      3.48799e-3,
      1.24758e-3,
      4.77153e-3,
      6.89408e-4,
      8.76293e-4,
      1.55926e-7,
      5.18504e-6,
      1.84393e-5,
      2.71973e-5,
      1.36552e-5,
      3.53673e-5,
    ],
    names: [
      'cr-50',
      'cr-52',
      'cr-53',
      'cr-54',
      'fe-54',
      'fe-56',
      'fe-57',
      'fe-58',
      'zr-90',
      'zr-91',
      'zr-92',
      'zr-94',
      'zr-96',
      'sn-112',
      'sn-114',
      'sn-115',
      'sn-116',
      'sn-117',
      'sn-118',
      'sn-119',
      'sn-120',
      'sn-122',
      'sn-124',
      'hf-174',
      'hf-176',
      'hf-177',
      'hf-178',
      'hf-179',
      'hf-180',
    ],
    thexp: 7.092,
  },
  {
    density: 6.55934,
    label: 'zirc4-xhf',
    fracs: [
      4.17411e-5,
      8.37072e-4,
      9.67458e-5,
      2.45364e-5,
      1.18568e-4,
      1.93011e-3,
      4.5372e-5,
      6.14409e-6,
      4.98136e-1,
      1.09841e-1,
      1.6974e-1,
      1.75762e-1,
      2.89197e-2,
      1.32599e-4,
      9.18335e-5,
      4.77238e-5,
      2.05863e-3,
      1.09676e-3,
      3.48834e-3,
      1.24771e-3,
      4.77201e-3,
      6.89477e-4,
      8.76381e-4,
    ],
    names: [
      'cr-50',
      'cr-52',
      'cr-53',
      'cr-54',
      'fe-54',
      'fe-56',
      'fe-57',
      'fe-58',
      'zr-90',
      'zr-91',
      'zr-92',
      'zr-94',
      'zr-96',
      'sn-112',
      'sn-114',
      'sn-115',
      'sn-116',
      'sn-117',
      'sn-118',
      'sn-119',
      'sn-120',
      'sn-122',
      'sn-124',
    ],
    thexp: 7.092,
  },
  {
    density: 6.506,
    label: 'zr',
    fracs: [5.07061e-1, 1.11809e-1, 1.72781e-1, 1.78911e-1, 2.94379e-2],
    names: ['zr-90', 'zr-91', 'zr-92', 'zr-94', 'zr-96'],
    thexp: 7.092,
  },
];

// function addDefaultMaterials(model, materialPalette) {
// const VeraMaterials = window.Simput.types.vera.helper.Materials;

// const matList = model.definitions.defaultMaterial.parameters;
// materials.forEach((mat, index) => {
//   matList.push({
//     id: `defaultMat${index}`,
//     type: 'bool',
//     size: 1,
//     ui: 'checkbox',
//     default: (mat.label === 'ss' || mat.label === 'mod'),
//     label: `Enable ${mat.label}`,
//   });
//   matList.push({
//     id: `defaultMat${index}_color`,
//     propType: 'Color',
//     label: 'Associated color',
//     default: hex2float(materialPalette[index % materialPalette.length]),
//     domain: {
//       palette: materialPalette,
//     },
//     // using the mat.label doesn't work, because some have dashes, so can't be variables.
//     show: `defaultMat${index}[0] === true`,
//   });

// });
// }
function addDefaultMaterials(dataModel) {
  if (dataModel.data.Materials && dataModel.data.Materials.length) return;
  dataModel.data.Materials = materials.map((mat, index) => ({
    name: mat.label,
    id: index + 1, // start indices at 1 b/c 0 is special in getExternal()
    material: {
      name: {
        id: 'material.name',
        value: [mat.label],
      },
      color: {
        id: 'material.color',
        value: hex2float(materialPalette[index % materialPalette.length]),
      },
      density: {
        id: 'material.density',
        value: [mat.density],
      },
      thexp: mat.thexp
        ? {
            id: 'material.thexp',
            value: [mat.thexp],
          }
        : undefined,
      fractions: {
        id: 'material.fractions',
        value: mat.fracs.map((f, i) => ({
          name: mat.names[i],
          value: f,
        })),
      },
    },
  }));
}

const epsilon = 1.0e-13; //smallest specified number is 1e-12
function materialIsDefault(mat) {
  let ok = true;
  // 'thexp' is allowed to be missing.
  ['name', 'color', 'density', 'fractions'].forEach(key => {
    if (mat[key] && (!mat[key].value || mat[key].value.length === 0)) ok = false;
  });
  if (!ok) return false;
  const defMat = materials.find((m) => m.label === mat.name.value[0]);
  if (!defMat) return false;
  ['density', 'thexp'].forEach(key => {
    if (!defMat[key]) {
      if (mat[key] && mat[key].value && mat[key].value.length > 0) ok = false;
    } else {
      if (Math.abs(mat[key].value[0] - defMat[key]) > epsilon) ok = false;
    }
  });
  if (!ok) return false;
  mat.fractions.value.forEach((frac, i) => {
    if (frac.name !== defMat.names[i]) ok = false;
    if (Math.abs(frac.value - defMat.fracs[i]) > epsilon) ok = false;
  });
  return ok;
}

function defaultMaterialNameFromId(id) {
  const dm = id.lastIndexOf('defaultMat');
  if (dm === -1) return '';
  const index = +id.slice(dm + 'defaultMat'.length);
  if (materials[index]) return materials[index].label;
  return '';
}

module.exports = {
  materialIsDefault,
  addDefaultMaterials,
  defaultMaterialNameFromId,
};
