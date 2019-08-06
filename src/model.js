const simModel = require('./simModel');
// import matModel from './matModel';

// ----------------------------------------------------------------------------
// Color palettes
// ----------------------------------------------------------------------------

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

const cellPalette = [
  '#1b9e77',
  '#d95f02',
  '#7570b3',
  '#e7298a',
  '#66a61e',
  '#e6ab02',
  '#a6761d',
  '#666666',
];

const rodPalette = [
  '#e41a1c',
  '#377eb8',
  '#4daf4a',
  '#984ea3',
  '#ff7f00',
  '#ffff33',
  '#a65628',
  '#f781bf',
  '#999999',
];

const mapPalette = [
  '#e41a1c',
  '#377eb8',
  '#4daf4a',
  '#984ea3',
  '#ff7f00',
  '#ffff33',
  '#a65628',
  '#f781bf',
  '#999999',
];

// ----------------------------------------------------------------------------
// Model definition
// ----------------------------------------------------------------------------
const nozzleList = [
  {
    id: 'material',
    type: 'string',
    size: 1,
    ui: 'enum',
    domain: {
      dynamic: true,
      external: 'materialEnum',
    },
    label: 'Material',
  },
  {
    id: 'height',
    type: 'float',
    size: 1,
    default: 0,
    label: 'Height (cm)',
    help: 'cm',
  },
  {
    id: 'mass',
    type: 'float',
    size: 1,
    default: 0,
    label: 'Mass (g)',
    help: 'g',
  },
];
const plateList = [
  {
    id: 'material',
    type: 'string',
    size: 1,
    ui: 'enum',
    domain: {
      dynamic: true,
      external: 'materialEnum',
    },
    label: 'Material',
  },
  {
    id: 'thick',
    type: 'float',
    size: 1,
    default: 0,
    label: 'Thickness (cm)',
    help: 'cm',
  },
  {
    id: 'volfrac',
    type: 'float',
    size: 1,
    default: 0,
    label: 'Volume fraction (0 to 1)',
    help: 'Percent, 0 -> 1',
  },
];

const model = {
  scripts: [
    // 'https://unpkg.com/@doe-casl/verain-view@1.1.1/dist/simput-external-vera.js',
    'simput-external-vera.js',
  ],
  defaultActiveView: 'Specifications',
  order: ['Specifications', 'Materials', 'Fuels', 'Cells', 'Grids', 'StateInitialization', 'States', 'Edits', 'Simulations'],
  views: {
    Specifications: {
      label: 'Specifications',
      attributes: ['coreSpec', 'assemblySpec'],
      hooks: [
        {
          type: 'copyToExternal',
          src: 'data.Specifications.0.assemblySpec.pitch.value.0',
          dst: 'viz.cellPitch',
        },
        {
          type: 'copyToExternal',
          src: 'data.Specifications.0.assemblySpec.grid.value.0',
          dst: 'viz.assemblyGridSize',
        },
        {
          type: 'copyToExternal',
          src: 'data.Specifications.0.coreSpec.grid.value.0',
          dst: 'viz.coreGridSize',
        },
        {
          type: 'copyToExternal',
          src: 'data.Specifications.0.coreSpec.height.value.0',
          dst: 'viz.core.height',
        },
        { type: 'checkDefaultMaterials' },
        // push mats to external after adding default mats
        { type: 'materialsToExternal' },
      ],
    },
    Materials: {
      label: 'Materials',
      attributes: ['material'],
      size: -1,
      readOnly: true,
      clonable: true,
      listComponent: 'ListItemWithColor',
      hooks: [
        { type: 'copyParameterToViewName', attribute: 'material.name' },
        // { type: 'specsToExternal' },
        { type: 'materialsToExternal' },
        // { type: 'addNextView', viewName: 'Materials', nextViewName: 'Cells' },
      ],
    },
    Fuels: {
      label: 'Fuels',
      attributes: ['fuel'],
      size: -1,
      readOnly: true,
      clonable: true,
      listComponent: 'ListItemWithColor',
      hooks: [
        { type: 'copyParameterToViewName', attribute: 'fuel.name' },
        // { type: 'specsToExternal' },
        { type: 'fuelsToExternal' },
        // { type: 'addNextView', viewName: 'Fuels', nextViewName: 'Cells' },
      ],
    },
    Cells: {
      label: 'Cells',
      attributes: ['cell'],
      hooks: [
        { type: 'copyParameterToViewName', attribute: 'cell.name' },
        { type: 'cellsToExternal' },
        { type: 'updateMaterialUsed' },
        { type: 'addNextView', viewName: 'Cells', nextViewName: 'Rods' },
        {
          type: 'copy',
          src: 'data.Specifications.0.assemblySpec.pitch.value.0',
          dst: 'cell.pitch',
        },
      ],
      size: -1,
      readOnly: true,
      clonable: true,
      listComponent: 'ListItemWithColor',
    },
    Rods: {
      label: 'Rods',
      attributes: ['rodInfo', 'rodStack'],
      size: -1,
      readOnly: true,
      clonable: true,
      listComponent: 'ListItemWithColor',
      hooks: [
        { type: 'copyParameterToViewName', attribute: 'rodInfo.name' },
        { type: 'updateCellUsed' },
        {
          type: 'copy',
          src: 'data.Specifications.0.coreSpec.height.value.0',
          dst: 'rodInfo.height',
        },
        { type: 'rodsToExternal' },
        { type: 'addNextView', viewName: 'Rods', nextViewName: 'Maps' },
      ],
    },
    Maps: {
      label: 'Rod maps',
      attributes: ['mapInfo', 'rodMap'],
      size: -1,
      readOnly: true,
      clonable: true,
      listComponent: 'ListItemWithColor',
      hooks: [
        { type: 'updateRodUsed' },
        { type: 'mapsToExternal' },
        { type: 'copyParameterToViewName', attribute: 'mapInfo.name' },
        {
          type: 'addNextView',
          viewName: 'Maps',
          insertAfter: 'Grids',
          nextViewName: 'CoreMap',
        },
      ],
    },
    Grids: {
      label: 'Grids',
      attributes: ['spacer'],
      size: -1,
      readOnly: true,
      clonable: true,
      hooks: [
        { type: 'copyParameterToViewName', attribute: 'spacer.name' },
        { type: 'gridsToExternal' },
      ],
    },
    CoreMap: {
      label: 'Core map',
      children: [
        'CoreAssemblyMap',
        'CoreControlInsertMap',
        'CoreDetectorMap',
        'LabelMap',
      ],
      hooks: [
        { type: 'coreToExternal' }
      ],
    },
    CoreAssemblyMap: {
      label: 'Assemblies',
      attributes: ['coreMapInfo', 'lowerNozzleSpec', 'upperNozzleSpec', 'coreMap'],
      hooks: [
        { type: 'updateRodmapUsed' },
        { type: 'coreToExternal' },
        {
          type: 'addNextView',
          viewName: 'CoreAssemblyMap',
          insertAfter: 'CoreMap',
          nextViewName: 'CoreDefinition',
        },
        {
          type: 'addNextView',
          viewName: 'CoreAssemblyMap',
          insertAfter: 'CoreDefinition',
          nextViewName: 'FullCore',
        },
      ],
    },
    CoreControlInsertMap: {
      label: 'Controls and Inserts',
      attributes: ['coreMapInfo', 'controlMapInfo', 'coreMap'],
      hooks: [
        { type: 'updateRodmapUsed' },
        { type: 'coreToExternal' },
      ],
    },
    CoreDetectorMap: {
      label: 'Detectors',
      attributes: ['coreMapInfo', 'coreMap'],
      hooks: [
        { type: 'updateRodmapUsed' },
        { type: 'coreToExternal' },
      ],
    },
    FullCore: {
      label: 'Full Core',
      attributes: ['fullCore'],
    },
    CoreDefinition: {
      label: 'Core definition',
      attributes: [
        'coreAdvancedSpec',
        'baffleSpec',
        'padSpec',
        'lowerPlateSpec',
        'upperPlateSpec',
        'vesselSpec',
      ],
      hooks: [
        // should technically sync used materials since
        // baffles/pads/plates/vessels use materials
        // { type: 'updateMaterialUsed' },
        { type: 'coreDefToExternal' },
      ],
    },
    LabelMap: {
      label: 'Labels',
      attributes: ['stateMapLabels'],
    },
    StateInitialization: {
      label: 'State Initialization',
      attributes: ['stateInit'],
    },
    States: {
      label: 'State',
      attributes: ['stateInfo', 'stateLabelPositions'],
      size: -1,
      hooks: [
        {
          type: 'copy',
          src: 'data.StateInitialization.0.stateInit.feedback.value.0',
          dst: 'stateInfo.feedback',
        },
      ],
    },
    Edits: {
      label: 'Edits',
      attributes: ['edits'],
      readOnly: true,
    },
  },
  definitions: {
    coreSpec: {
      label: 'Core Specifications',
      parameters: [
        {
          id: 'title',
          type: 'string',
          size: 1,
          label: 'Title',
        },
        {
          id: 'reactor_type',
          type: 'string',
          ui: 'enum',
          size: 1,
          label: 'Reactor type',
          domain: {
            PWR: 'PWR',
            BWR: 'BWR',
          },
        },
        {
          id: 'grid',
          type: 'int',
          size: 1,
          default: 15,
          label: 'Size (assemblies across core)',
          help: 'Size of the grid for the core',
        },
        {
          id: 'apitch',
          type: 'float',
          size: 1,
          default: 21.5,
          label: 'Assembly pitch (cm)',
          help: 'Default assembly spacing in core maps, in cm',
        },
        {
          id: 'height',
          type: 'float',
          size: 1,
          default: 400,
          label: 'Core height (cm)',
          help: 'Height of the core, in cm.',
        },
        {
          id: 'rated',
          type: 'float',
          size: 2,
          layout: '2',
          default: [0, 0],
          label: 'Rated power and flow (MW, Mlbs/hr)',
          help: 'MW, Mlbs/hr',
        },
      ],
    },
    coreAdvancedSpec: {
      label: 'Advanced Core Specifications',
      parameters: [
        {
          id: 'name',
          type: 'string',
          size: 1,
          label: 'Name',
        },
        {
          id: 'rcs_volume',
          type: 'float',
          size: 1,
          label: 'RCS volume',
        },
        {
          id: 'op_date',
          type: 'string',
          size: 1,
          label: 'Operation date',
        },
        {
          id: 'unit',
          type: 'string',
          size: 1,
          label: 'Unit',
        },
        {
          id: 'cycle',
          type: 'string',
          size: 1,
          label: 'Cycle',
        },
        {
          id: 'hole',
          type: 'float',
          size: -1,
          layout: '-1',
          label: 'Hole (x, y, radius, in cm)',
          help: 'x, y, radius triples',
        },
        {
          id: 'bc_sym',
          type: 'string',
          ui: 'enum',
          size: 1,
          domain: {
            Rotational: 'rot',
            Mirror: 'mir',
          },
          label: 'bc_sym',
        },
        {
          id: 'bc_bot',
          type: 'string',
          ui: 'enum',
          size: 1,
          domain: {
            Reflecting: 'reflecting',
            Vacuum: 'vacuum',
          },
          label: 'bc_bot',
        },
        {
          id: 'bc_top',
          type: 'string',
          ui: 'enum',
          size: 1,
          domain: {
            Reflecting: 'reflecting',
            Vacuum: 'vacuum',
          },
          label: 'bc_top',
        },
        {
          id: 'bc_rad',
          type: 'string',
          ui: 'enum',
          size: 1,
          domain: {
            Reflecting: 'reflecting',
            Vacuum: 'vacuum',
          },
          label: 'bc_rad',
        },
        {
          id: 'label_format',
          type: 'string',
          ui: 'enum',
          size: 1,
          domain: {
            'x-y': 'x-y',
            'y-x': 'y-x',
          },
          label: 'label_format',
        },
        {
          id: 'xlabel',
          type: 'string',
          size: 1,
          label: 'xlabel',
        },
        {
          id: 'ylabel',
          type: 'string',
          size: 1,
          label: 'ylabel',
        },
        {
          id: 'upper_ref',
          type: 'string',
          size: -1,
          layout: '-1',
          label: 'Upper ref (material, thickness (cm), volfrac)',
          help: 'material, thickness, volfrac triples',
        },
        {
          id: 'lower_ref',
          type: 'string',
          size: -1,
          layout: '-1',
          label: 'Lower ref (material, thickness (cm), volfrac)',
          help: 'material, thickness, volfrac triples',
        },
        {
          id: 'rotate_map',
          type: 'string',
          size: 1,
          label: 'Rotate map',
        },
      ],
    },
    assemblySpec: {
      label: 'Assembly Specifications',
      parameters: [
        {
          id: 'grid',
          type: 'int',
          size: 1,
          default: 17,
          label: 'Size (rods across assembly)',
          help: 'Size of the grid for an assembly',
        },
        {
          id: 'pitch',
          type: 'float',
          size: 1,
          default: 1.26,
          label: 'Rod pitch (cm)',
          help: 'Default rod pitch in assemblies, in cm',
        },
      ],
    },
    baffleSpec: {
      label: 'Baffle Specifications',
      parameters: [
        {
          id: 'material',
          type: 'string',
          size: 1,
          ui: 'enum',
          domain: {
            dynamic: true,
            external: 'materialEnum',
          },
          label: 'Material',
        },
        {
          id: 'gap',
          type: 'float',
          size: 1,
          default: 0,
          label: 'Gap (cm)',
        },
        {
          id: 'thick',
          type: 'float',
          size: 1,
          default: 0,
          label: 'Thickness (cm)',
        },
      ],
    },
    padSpec: {
      label: 'Pad Specifications',
      parameters: [
        {
          id: 'material',
          type: 'string',
          size: 1,
          ui: 'enum',
          domain: {
            dynamic: true,
            external: 'materialEnum',
          },
          label: 'Material',
        },
        {
          id: 'params',
          type: 'float',
          size: 3,
          layout: '3',
          default: [0, 0, 0],
          label: 'Inner diameter (cm), Outer diameter (cm), Arc length (deg)',
          help: 'cm, cm, deg',
        },
        {
          id: 'positions',
          type: 'float',
          layout: '-1',
          default: 0,
          label: 'Angular positions (deg)',
          help: 'deg',
        },
      ],
    },
    vesselSpec: {
      label: 'Vessel Specifications',
      parameters: [
        {
          id: 'cell',
          propType: 'CellEditor',
          size: 1,
          default: {
            name: 'Vessel name',
            radii: [],
            mats: [],
          },
          domain: {
            dynamic: true,
            external: 'viz',
          },
          label: 'Vessel',
        },
      ],
    },
    lowerPlateSpec: {
      label: 'Lower Plate Specifications',
      parameters: plateList,
    },
    upperPlateSpec: {
      label: 'Upper Plate Specifications',
      parameters: plateList,
    },
    lowerNozzleSpec: {
      label: 'Lower Nozzle Specifications',
      parameters: nozzleList,
    },
    upperNozzleSpec: {
      label: 'Upper Nozzle Specifications',
      parameters: nozzleList,
    },
    material: {
      label: 'Material definition',
      parameters: [
        {
          id: 'name',
          type: 'string',
          size: 1,
          label: 'Name',
          default: 'Material',
        },
        {
          id: 'color',
          propType: 'Color',
          label: 'Associated color',
          default: [204 / 255, 235 / 255, 197 / 255],
          domain: {
            palette: materialPalette,
          },
        },
        {
          id: 'density',
          type: 'float',
          size: 1,
          label: 'Density (g/cc)',
        },
        {
          id: 'thexp',
          type: 'float',
          size: 1,
          label: 'Thermal expansion coefficient [thexp]',
        },
        {
          id: 'fractions',
          ui: 'map',
          label: 'Material fractions (material, fraction)',
          componentLabels: ['Material', 'Fraction (0 to 1)'],
        },
      ],
    },
    fuel: {
      label: 'Fuel definition',
      parameters: [
        {
          id: 'name',
          type: 'string',
          size: 1,
          label: 'Name',
          name: 'Fuel',
        },
        {
          id: 'color',
          propType: 'Color',
          label: 'Associated color',
          default: [204 / 255, 235 / 255, 197 / 255],
          domain: {
            palette: materialPalette,
          },
        },
        {
          id: 'density',
          type: 'float',
          size: 1,
          label: 'Density (g/cc)',
        },
        {
          id: 'thden',
          type: 'float',
          size: 1,
          label: 'Theoretical density (%)',
        },
        {
          id: 'u235_enrichment',
          type: 'float',
          size: 1,
          label: 'U235 enrichment (weight %)',
        },
        {
          id: 'enrichments',
          ui: 'map',
          label: 'Heavy metal enrichment (material, enrichment (weight %))',
          componentLabels: ['Material', 'Enrichment (weight %)'],
        },
        {
          id: 'gad_material',
          type: 'string',
          size: 1,
          ui: 'enum',
          domain: {
            dynamic: true,
            external: 'materialEnum',
          },
          label: 'Gad material',
        },
        {
          id: 'gad_fraction',
          type: 'float',
          size: 1,
          label: 'Gad fraction (weight fraction 0 to 1)',
        },
      ],
    },
    cell: {
      label: 'Cell definition',
      parameters: [
        {
          id: 'name',
          type: 'string',
          size: 1,
          default: 'New Cell',
          label: 'Name',
        },
        {
          id: 'pitch',
          type: 'float',
          size: 1,
          default: 0,
          label: 'Contact radius/pitch (cm)',
          domain: {
            readOnly: true,
          },
        },
        {
          id: 'color',
          propType: 'Color',
          label: 'Associated color',
          default: [204 / 255, 235 / 255, 197 / 255],
          domain: {
            palette: cellPalette,
          },
        },
        {
          id: 'cell',
          propType: 'CellEditor',
          size: 1,
          default: {
            name: 'Cell name',
            radii: [],
            mats: [],
          },
          domain: {
            dynamic: true,
            external: 'viz',
          },
          label: 'Cell',
        },
      ],
    },
    rodInfo: {
      label: 'Rod description',
      parameters: [
        {
          id: 'name',
          type: 'string',
          size: 1,
          default: 'New Rod',
          label: 'Name',
        },
        {
          id: 'color',
          propType: 'Color',
          label: 'Associated color',
          default: [204 / 255, 235 / 255, 197 / 255],
          domain: {
            palette: rodPalette,
          },
        },
        {
          id: 'height',
          type: 'string',
          size: 1,
          default: '',
          label: 'Rod height (cm)',
          domain: {
            readOnly: true,
          },
        },
        {
          id: 'offset',
          type: 'float',
          size: 1,
          default: 0,
          label: 'Rod offset (cm)',
        },
        {
          id: 'type',
          type: 'string',
          ui: 'enum',
          size: 1,
          default: 'assembly',
          label: 'Usage',
          domain: {
            Assembly: 'assembly',
            Insert: 'insert',
            Control: 'control',
            Detector: 'detector',
          },
          noEmpty: true,
        },
      ],
    },
    rodStack: {
      label: 'Axial definition',
      parameters: [
        {
          id: 'rod',
          propType: 'RodEditor',
          size: 1,
          default: {
            stack: [],
          },
          domain: {
            dynamic: true,
            external: 'viz',
          },
          label: 'Rod',
        },
      ],
    },
    mapInfo: {
      label: 'Rod map',
      parameters: [
        {
          id: 'name',
          type: 'string',
          size: 1,
          default: 'Assembly',
          label: 'Name',
        },
        {
          id: 'color',
          propType: 'Color',
          label: 'Associated color',
          default: [204 / 255, 235 / 255, 197 / 255],
          domain: {
            palette: mapPalette,
          },
        },
        {
          id: 'type',
          type: 'string',
          ui: 'enum',
          size: 1,
          default: 'assembly',
          label: 'Usage',
          domain: {
            Assembly: 'assembly',
            Insert: 'insert',
            Control: 'control',
            Detector: 'detector',
          },
          noEmpty: true,
        },
        {
          id: 'stateMapLabels',
          type: 'string',
          layout: '-1',
          default: '',
          label: 'Labels for state',
          show: 'type[0] === "control"',
        },
      ],
    },
    rodMap: {
      label: 'Layout definition',
      parameters: [
        {
          id: 'map',
          propType: 'AssemblyEditor',
          size: 1,
          default: {
            emptyItem: '0',
            grid: [],
          },
          domain: {
            dynamic: true,
            external: 'viz',
          },
          label: 'Rod Map',
        },
      ],
    },
    spacer: {
      label: 'Spacer grid',
      parameters: [
        {
          id: 'name',
          type: 'string',
          size: 1,
          label: 'Name',
        },
        {
          id: 'material',
          type: 'string',
          size: 1,
          ui: 'enum',
          domain: {
            dynamic: true,
            external: 'materialEnum',
          },
          label: 'Material',
        },
        {
          id: 'height',
          type: 'float',
          size: 1,
          default: 3.8,
          label: 'Height (cm)',
        },
        {
          id: 'mass',
          type: 'float',
          size: 1,
          default: 1000,
          label: 'Mass (g)',
        },
        {
          id: 'loss',
          type: 'float',
          size: 1,
          default: 0.9,
          label: 'Loss',
        },
        {
          id: 'blockage',
          type: 'float',
          size: 1,
          label: 'Blockage',
        },
        {
          id: 'axisPositions',
          type: 'float',
          layout: '-1',
          default: 0,
          label: 'Axial positions (cm)',
        },
      ],
    },
    coreMapInfo: {
      label: 'Core map description',
      parameters: [
        {
          id: 'title',
          type: 'string',
          size: 1,
          label: 'Title',
        },
      ],
    },
    controlMapInfo: {
      label: 'Control map parameters',
      parameters: [
        {
          id: 'stroke',
          type: 'float',
          size: 2,
          layout: '2',
          default: [0, 0],
          label: 'Stroke',
          help: 'total travel (cm) and number of steps',
        },
        // TODO complex 'blade' structure - need an example .inp file
      ],
    },
    coreMap: {
      label: 'Layout',
      parameters: [
        {
          id: 'map',
          propType: 'CoreEditor',
          size: 1,
          default: {
            emptyItem: '0',
            grid: [],
          },
          domain: {
            dynamic: true,
            external: 'viz',
          },
        },
      ],
    },
    fullCore: {
      label: 'Layout',
      parameters: [
        {
          id: 'fullCore',
          propType: 'FullCore',
          size: 1,
          domain: {
            dynamic: true,
            external: 'viz',
          },
        },
      ],
    },
    stateMapLabels: {
      label: 'Rodbank Labels',
      parameters: [
        {
          id: 'labels',
          propType: 'StateMapEditor',
          size: 1,
          domain: {
            dynamic: true,
            external: 'viz',
          },
        },
      ],
    },
    stateLabelPositions: {
      label: 'Rodbank Positions',
      parameters: [
        {
          id: 'rodbank',
          propType: 'StateLabelEditor',
          size: 1,
          default: { },
          domain: {
            dynamic: true,
            external: 'viz',
          },
        },
      ]
    },
    stateInit: {
      label: 'State Initialization',
      parameters: [
        {
          id: 'title',
          type: 'string',
          size: 1,
          label: 'Title',
        },
        {
          id: 'sym',
          type: 'string',
          ui: 'enum',
          size: 1,
          default: 0,
          label: 'Symmetry [sym]',
          domain: {
            Quarter: 'qtr',
            Full: 'full',
          },
        },
        {
          id: 'feedback',
          type: 'string',
          ui: 'enum',
          size: 1,
          default: 0,
          label: 'Feedback',
          domain: {
            Off: 'off',
            On: 'on',
          },
        },
        {
          id: 'xenon',
          type: 'string',
          ui: 'enum',
          size: 1,
          default: 0,
          label: 'Xenon option [xenon]',
          domain: {
            zero: 'zero',
            dep: 'dep',
            equil: 'equil',
          },
        },
        {
          id: 'samar',
          type: 'string',
          ui: 'enum',
          size: 1,
          default: 0,
          label: 'Samarium option [samar]',
          domain: {
            zero: 'zero',
            dep: 'dep',
            equil: 'equil',
            peak: 'peak',
          },
        },
        {
          id: 'thexp',
          type: 'string',
          size: 1,
          label: 'Thexp',
        },
        {
          id: 'thexp_tfuel',
          type: 'float',
          size: 1,
          label: 'Thexp Fuel Temperature [thexp_tfuel]',
        },
        {
          id: 'thexp_tfuel_units',
          type: 'string',
          ui: 'enum',
          size: 1,
          default: 'C',
          label: 'Thexp Fuel Temperature Units',
          noEmpty: true,
          domain: {
            Farenheit: 'F',
            Celcius: 'C',
            Kelvin: 'K',
          },
        },
        {
          id: 'thexp_tclad',
          type: 'float',
          size: 1,
          label: 'Thexp Clad Temperature [thexp_tclad]',
        },
        {
          id: 'thexp_tclad_units',
          type: 'string',
          ui: 'enum',
          size: 1,
          default: 'C',
          label: 'Thexp Clad Temperature Units',
          noEmpty: true,
          domain: {
            Farenheit: 'F',
            Celcius: 'C',
            Kelvin: 'K',
          },
        },
        {
          id: 'thexp_tmod',
          type: 'float',
          size: 1,
          label: 'Thexp Mod Temperature [thexp_tmod]',
        },
        {
          id: 'thexp_tmod_units',
          type: 'string',
          ui: 'enum',
          size: 1,
          default: 'C',
          label: 'Thexp Mod Temperature Units',
          noEmpty: true,
          domain: {
            Farenheit: 'F',
            Celcius: 'C',
            Kelvin: 'K',
          },
        },
      ],
    },
    stateInfo: {
      label: 'State',
      parameters: [
        {
          // copied from stateInit, only needed for item viz below.
          id: 'feedback',
          type: 'string',
          size: 1,
          default: 'off',
          label: 'Feedback',
          show: 'false',
        },
        {
          id: 'power',
          type: 'float',
          size: 1,
          label: 'Power (%)',
        },
        {
          id: 'pressure',
          type: 'float',
          size: 1,
          label: 'Pressure (psia)',
        },
        {
          id: 'flow',
          type: 'float',
          size: 1,
          label: 'Flow (% rated)',
        },
        {
          id: 'bypass',
          type: 'float',
          size: 1,
          label: 'Bypass flow (% rated)',
        },
        {
          id: 'tinlet',
          type: 'float',
          size: 1,
          label: 'Inlet Temperature [tinlet]',
        },
        {
          id: 'tinlet_units',
          type: 'string',
          ui: 'enum',
          size: 1,
          default: 'C',
          label: 'Inlet Temperature Units',
          domain: {
            Farenheit: 'F',
            Celcius: 'C',
            Kelvin: 'K',
          },
        },
        {
          id: 'tfuel',
          type: 'float',
          size: 1,
          label: 'Fuel Temperature [tfuel]',
          show: 'feedback[0] !== "on"',
        },
        {
          id: 'tfuel_units',
          type: 'string',
          ui: 'enum',
          size: 1,
          default: 'C',
          label: 'Fuel Temperature Units',
          show: 'feedback[0] !== "on"',
          domain: {
            Farenheit: 'F',
            Celcius: 'C',
            Kelvin: 'K',
          },
        },
        {
          id: 'modden',
          type: 'float',
          size: 1,
          label: 'Moderator density [modden] (g/cc)',
          show: 'feedback[0] !== "on"',
        },
        {
          id: 'rlx_xesm',
          type: 'float',
          size: 1,
          label: 'Rlx_xesm',
        },
        {
          id: 'boron',
          type: 'float',
          size: 1,
          label: 'Boron (ppm)',
        },
        {
          id: 'b10',
          type: 'float',
          size: 1,
          label: 'Boron-10 fraction in coolant [b10] (atom percent)',
        },
        {
          id: 'b10_depl',
          type: 'string',
          ui: 'enum',
          size: 1,
          default: 'off',
          label: 'Boron-10 depletion in coolant [b10_depl]',
          domain: {
            Off: 'off',
            On: 'on',
          },
        },
        {
          id: 'search',
          type: 'string',
          ui: 'enum',
          size: 1,
          default: 0,
          label: 'Search option [search]',
          domain: {
            keff: 'keff',
            boron: 'boron',
          },
        },
        {
          id: 'search_bank',
          type: 'string',
          size: 1,
          default: '',
          label: 'Search bank',
        },
        {
          id: 'kcrit',
          type: 'float',
          size: 1,
          label: 'Critical eigenvalue for boron search [kcrit]',
          show: 'search[0] === "boron"',
        },
        {
          id: 'deplete_vals',
          type: 'float',
          size: -1,
          layout: '-1',
          label: 'Depletion [deplete]',
        },
        {
          id: 'deplete',
          type: 'string',
          ui: 'enum',
          size: 1,
          label: 'Depletion units',
          domain: {
            EFPD: 'EFPD',
            GWDMT: 'GWDMT',
            hours: 'hours',
          },
        },
        {
          id: 'edit',
          type: 'string',
          size: -1,
          layout: '-1',
          label: 'Edit',
        },
        {
          id: 'restart_shuffle',
          type: 'string',
          ui: 'map',
          label: 'Restart Shuffle (file, label)',
        },
        {
          id: 'restart_write',
          type: 'string',
          size: 2,
          layout: '2',
          default: ['', ''],
          label: 'Restart Write (file, label)',
          componentLabels: ['File', 'Label'],
        },
        {
          id: 'restart_read',
          type: 'string',
          size: 2,
          layout: '2',
          default: ['', ''],
          label: 'Restart Read (file, label)',
        },
        {
          id: 'op_date',
          type: 'string',
          size: 1,
          label: 'Operation date',
        },
      ],
    },
    edits: {
      label: 'Edits',
      parameters: [
        {
          id: 'axial_edit_bounds',
          type: 'float',
          size: -1,
          layout: '-1',
          label: 'Axial edit bounds (cm)',
        },
        {
          id: 'axial_edit_mesh_delta',
          type: 'float',
          size: 1,
          label: 'Axial edit mesh delta (cm)',
        },
        {
          id: 'edit_group',
          type: 'string',
          size: -1,
          layout: '-1',
          label: 'Edit group (name, var1, var2...)',
        },
      ],
    },
  },
};
simModel.addSimulationDefinitions(model);
// matModel.addDefaultMaterials(model, materialPalette);

module.exports = model;
