// ----------------------------------------------------------------------------
// Color palettes
// ----------------------------------------------------------------------------

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

module.exports = {
    scripts: [],
    defaultActiveView: 'Welcome',
    order: [
            'Welcome', 
            'ProcessTopologyDefinition', 
            'ComputationalGridDefinition', 
            'GeometryInputDefinition',
            'TimingDefinition',
            'CycleDefinition',
            'DomainDefinition',
            'GravityDefinition',
            'PhaseDefinition',
            'ContaminantDefinition',
            'PermeabilityDefinition',
            'PermeabilityTensorDefinition',
            'PorosityDefinition',
            'SpecificStorageDefinition',
            'dZMultipliersDefinition',
            'ManningsDefinition', 
            'TopographicalXSlopesDefinition',
            'TopographicalYSlopesDefinition',
            'RetardationDefinition',
            'MobilitiesDefinition',
            'SolverDefinition', 
            'RelativePermeabilityDefinition',
            'PhaseSourceDefinition',
            'CapillaryPressuresDefinition',
            'SaturationDefinition',
            'InternalBoundaryConditionsDefinition',
            'PressureBoundaryConditionsDefinition',
            'Soils'
           ],
    views: {
        Welcome: {
            label: 'ParFlow Hydrologic Model',
            attributes: ['Hello'],
            hooks: [
              { type: 'checkDefaultSoils' },
              { type: 'soilsToExternal' },
           ],
        },
        ProcessTopologyDefinition: {
            label: 'Processor Topology',
            attributes: ['ProcessTopology'],
        },
        ComputationalGridDefinition: {
            label: 'Computational Grid',
            attributes: ['ComputationalGrid'],
        },
        GeometryInputDefinition: {
            label: 'Geometry Input',
            attributes: ['GeometryInput'],
            size: -1,
            hooks: [
                { type: 'copyParameterToViewName', attribute: 'GeometryInput.Name'}
            ]
        },
        TimingDefinition: {
            label: 'Timing',
            attributes: ['Timing'],
        },
        CycleDefinition: {
            label: 'Cycle',
            attributes: ['Cycle'],
            size: -1,
            hooks: [
                { type: 'copyParameterToViewName', attribute: 'Cycle.Name'}
            ]
        },
        DomainDefinition: {
            label: 'Domain',
            attributes: ['Domain'],
        },
        GravityDefinition: {
            label: 'Gravity',
            attributes: ['Gravity'],
        },
        PhaseDefinition: {
            label: 'Phase',
            attributes: ['Phase'],
            size: -1,
            hooks: [
                { type: 'copyParameterToViewName', attribute: 'Phase.Names'}
            ]
        },
        ContaminantDefinition: {
            label: 'Contaminant',
            attributes: ['Contaminant'],
            size: -1,
            hooks: [
                { type: 'copyParameterToViewName', attribute: 'Contaminant.Names'}
            ]
        },
        PermeabilityDefinition: {
            label: 'Permeability',
            attributes: ['Permeability'],
            size: -1,
            hooks: [
                { type: 'copyParameterToViewName', attribute: 'Permeability.GeomNames'}
            ]
        },
        PermeabilityTensorDefinition: {
            label: 'Permeability Tensor',
            attributes: ['PermeabilityTensor'],
            size: -1,
            hooks: [
                { type: 'copyParameterToViewName', attribute: 'PermeabilityTensor.GeomNames'}
            ]
        },
        PorosityDefinition: {
            label: 'Porosity',
            attributes: ['Porosity'],
            size: -1,
            hooks: [
                { type: 'copyParameterToViewName', attribute: 'Porosity.GeomNames'}
            ]
        },
        SpecificStorageDefinition: {
            label: 'Specific Storage',
            attributes: ['SpecificStorage'],
            size: -1,
            hooks: [
                { type: 'copyParameterToViewName', attribute: 'SpecificStorage.GeomNames'}
            ]
        },
        dZMultipliersDefinition: {
            label: 'dZ Multipliers',
            attributes: ['dZMultipliers'],
            size: -1,
            hooks: [
                { type: 'copyParameterToViewName', attribute: 'dZMultipliers.GeomNames'}
            ]
        },
        ManningsDefinition: {
            label: 'Mannings',
            attributes: ['Mannings'],
            size: -1,
            hooks: [
                { type: 'copyParameterToViewName', attribute: 'Mannings.GeomNames'}
            ]
        },
        TopographicalXSlopesDefinition: {
            label: 'Topographical X Slopes',
            attributes: ['TopographicalXSlopes'],
            size: -1,
            hooks: [
                { type: 'copyParameterToViewName', attribute: 'TopographicalXSlopes.GeomNames'}
            ]
        },
        TopographicalYSlopesDefinition: {
            label: 'Topographical Y Slopes',
            attributes: ['TopographicalYSlopes'],
            size: -1,
            hooks: [
                { type: 'copyParameterToViewName', attribute: 'TopographicalYSlopes.GeomNames'}
            ]
        },
        RetardationDefinition: {
            label: 'Retardation',
            attributes: ['Retardation'],
            size: -1,
            hooks: [
                { type: 'copyParameterToViewName', attribute: 'Retardation.GeomNames'}
            ]
        },
        MobilitiesDefinition: {
            label: 'Mobilities',
            attributes: ['Mobilities'],
            size: -1,
            hooks: [
                { type: 'copyParameterToViewName', attribute: 'Mobilities.PhaseName'}
            ]
        },
        SolverDefinition: {
            label: 'Solver',
            attributes: ['Solver'],
        },
        RelativePermeabilityDefinition: {
            label: 'Relative Permeability',
            attributes: ['RelativePermeability'],
            size: -1,
            hooks: [
                { type: 'copyParameterToViewName', attribute: 'RelativePermeability.GeomName'}
            ]
        },
        PhaseSourceDefinition: {
            label: 'Phase Source',
            attributes: ['PhaseSource'],
            size: -1,
            hooks: [
                { type: 'copyParameterToViewName', attribute: 'PhaseSource.PhaseName'}
            ]
        },
        CapillaryPressuresDefinition: {
            label: 'Capillary Pressures',
            attributes: ['CapillaryPressures'],
            size: -1,
            hooks: [
                { type: 'copyParameterToViewName', attribute: 'CapillaryPressures.PhaseName'}
            ]
        },
        SaturationDefinition: {
            label: 'Saturation',
            attributes: ['Saturation'],
            size: -1,
            hooks: [
                { type: 'copyParameterToViewName', attribute: 'Saturation.GeomName'}
            ]
        },
        InternalBoundaryConditionsDefinition: {
            label: 'InternalBoundaryConditions',
            attributes: ['InternalBoundaryConditions'],
            size: -1,
            hooks: [
                { type: 'copyParameterToViewName', attribute: 'InternalBoundaryConditions.Names'}
            ]
        },
        PressureBoundaryConditionsDefinition: {
            label: 'PressureBoundaryConditions',
            attributes: ['PressureBoundaryConditions'],
        },
        Soils: {
            label: 'Soils',
            attributes: ['soil'],
            size: -1,
            readOnly: true,
            clonable: true,
            listComponent: 'ListItemWithColor',
            hooks: [
                { type: 'copyParameterToViewName', attribute: 'soil.name' },
                { type: 'soilsToExternal' },
            ],
        },
    },
    definitions: {
        Hello: {
            label: 'ParaFlow',
            parameters: [
                {
                  id: 'title',
                  type: 'string',
                  size: 1,
                  label: 'Title',
                  help: 'Run Title',
                }
            ],
        },
        ProcessTopology: {
            label: 'Process Topology',
            parameters: [
                {
                  id: 'P',
                  label: 'P - Processes in X',
                  type: 'integer',
                  size: 1,
                  default: 1,
                  help: '<p>P - <em>integer</em> - P allocates the number of processes to the grid-cells in <em>x</em>.</p>'
                },
                {
                  id: 'Q',
                  label: 'Q - Processes in Y',
                  type: 'integer',
                  size: 1,
                  default: 1,
                  help: '<p>Q - <em>integer</em> - Q allocates the number of processes to the grid-cells in <em>y</em>.</p>'
                },
                {
                  id: 'R',
                  label: 'R - Processes in Z',
                  type: 'integer',
                  size: 1,
                  default: 1,
                  help: '<p>R - <em>integer</em> - R allocates the number of processes to the grid-cells in <em>z</em>. \
                  R should always be 1, when running a unsaturated/saturated domain (Solver Richards), unless \
                  running a totally saturated domain (Solver IMPES).</p>'
                },
            ],
        },
        ComputationalGrid: {
            label: 'Computational Grid',
            parameters: [
                {
                  id: 'Lower',
                  label: 'Lower - X, Y, Z Coordinates',
                  type: 'float',
                  size: 3,
                  default: [0.0, 0.0, 0.0],
                  help: '<p>x,y,z - <em>float</em> - The lower <em>x,y,z</em> coordinate locations for the computational grid.</p>'
                },
                {
                  id: 'N',
                  label: 'Number of Grid Cells in X, Y, Z Directions',
                  type: 'integer',
                  size: 3,
                  default: [1, 1, 1],
                  help: '<p>NX,NY,NZ - <em>integer</em> - The number of grid cells in the <em>x,y,z</em> direction for the computational grid.</p>'
                },
                {
                  id: 'D',
                  label: 'Delta of X, Y, Z directions',
                  type: 'float',
                  size: 3,
                  default: [0.1, 0.1, 0.1],
                  help: '<p>DX,DY,DZ - <em>float</em> - The size of grid cells in the <em>x,y,z</em> direction. Units are <em>L</em> and are \
                  defined by the units of the hydraulic conductivity used in the problem.</p>'
                },
            ],
        },
        GeometryInput: {
            label: 'Geometry Input Type',
            parameters: [
                {
                  id: 'Name',
                  label: 'Geometry Name',
                  type: 'string',
                  size: 1,
                  help: '<p>Name - <em>string</em> - The geometry input names which define containers for the subset of geometry \
                  defined for this problem.</p>'
                },
                {
                  id: 'InputType',
                  label: 'Input Type of Geometry',
                  type: 'integer',
                  size: 1,
                  ui: 'enum',
                  default: [0],
                  selected: 'Solid File',
                  domain: {
                    'Solid File': 0,
                    'Indicator Field': 1,
                    'Box': 2,
                  },
                  help: '<p>InputType - <em>string</em> - The input type for the geometry input with geom input name. This key must \
                  be one of: SolidFile, IndicatorField, Box.</p>',
                },
                [
                    'GeometryInputSolidFile',
                    'GeometryInputIndicatorField',
                    'GeometryInputBox'
                ],
            ],
            children: {
                'GeometryInputSolidFile':            "GeometryInput.InputType[0] === 0",
                'GeometryInputIndicatorField':       "GeometryInput.InputType[0] === 1",
                'GeometryInputBox':                  "GeometryInput.InputType[0] === 2",
            }
        },
        GeometryInputSolidFile: {
            label: 'Solid File',
            parameters: [
                {
                  id: 'FileName',
                  label: 'Solid File Name',
                  type: 'string',
                  size: 1,
                  help: '<p>FileName - <em>string</em> - The input filename which contains the solid information.</p>'
                },
                {
                  id: 'Patch',
                  label: 'Solid Patch Name',
                  type: 'string',
                  size: 1,
                  default: 'surface',
                  help: '<p>Patches - <em>string</em> - Patches are defined on the first geometry in a SolidFile.</p>'
                },
                {
                  id: 'GeomNames',
                  type: 'string',
                  layout: '-1',
                  default: 'domain',
                  label: 'Geometry Names',
                  help: '<p>Name - <em>string</em> - A list of the names of the geometries defined by the geometry input. For the \
                  SolidFile geometry type this should contain a list with the same number of gemetries as were defined using GMS. \
                  The order of geometries in the SolidFile should match the names.</p>'
                },
            ],
        },
        GeometryInputIndicatorField: {
            label: 'Indicator Field',
            parameters: [
                {
                  id: 'FileName',
                  label: 'Field File Name',
                  type: 'string',
                  size: 1,
                  help: '<p>FileName - <em>string</em> - The input filename which contains the field information.</p>'
                },
                {
                  id: 'GeomNames',
                  label: 'Geometry Names and Values',
                  ui: 'map',
                  help: '<p>Name - <em>string</em> - A list of the names of the geometries defined by the geometry input. For \
                  IndicatorField types you need to specify the value in the input field which matches the name.</p>'
                },
            ],
        },
        GeometryInputBox: {
            label: 'Box',
            parameters: [
                {
                  id: 'Lower',
                  label: 'Lower - X, Y, Z Coordinates',
                  type: 'float',
                  size: 3,
                  default: [0.0, 0.0, 0.0],
                  help: '<p>x,y,z - <em>float</em> - The lower <em>x,y,z</em> real space coordinate value of the previously \
                  specified box geometry.</p>'
                },
                {
                  id: 'Upper',
                  label: 'Upper - X, Y, Z Coordinates',
                  type: 'float',
                  size: 3,
                  default: [1.0, 1.0, 1.0],
                  help: '<p>x,y,z - <em>float</em> - The upper <em>x,y,z</em> real space coordinate value of the previously \
                  specified box geometry.</p>'
                },
                {
                  id: 'GeomNames',
                  label: 'Geometry Name',
                  type: 'string',
                  default: 'domain',
                  size: 1,
                  help: '<p>Name - <em>string</em> - A list of the names of the geometries defined by the geometry input. For a \
                  geometry input type of Box, the list should contain a single geometry name. </p>'
                },
                {
                  id: 'Patches',
                  label: 'Box Patch Names',
                  type: 'string',
                  size: 6,
                  default: ['left', 'right', 'front', 'back', 'top', 'bottom'],
                  help: '<p>Patches - <em>string</em> - Patches are defined on the surfaces of geometries. For a Box the order \
                  is fixed (left right front back bottom top) but can be renamed to anything.</p>'
                },
            ],
        },
        Timing: {
            label: 'Timing',
            parameters: [
                {
                  id: 'BaseUnit',
                  label: 'Base Unit',
                  type: 'float',
                  size: 1,
                  help: '<p>BaseUnit - <em>float</em> - Used to indicate the base unit of time for entering time values. All time should be \
                  expressed as a multiple of this value. This should be set to the smallest interval of time to be used in the problem. \
                  For example, a base unit of <em>1</em> means that all times will be integer valued. A base unit of <em>0.5</em> would allow \
                  integers and fractions of <em>0.5</em> to be used for time input values. The rationale behind this restriction is to allow \
                  time to be discretized on some interval to enable integer arithmetic to be used when computing/comparing times. This avoids \
                  the problems associated with real value comparisons which can lead to events occurring at different timesteps on different \
                  architectures or compilers. This value is also used when describing <em>time cycling data</em> in, currently, the well and \
                  boundary condition sections. The lengths of the cycles in those sections will be integer multiples of this value, therefore \
                  it needs to be the smallest divisor which produces an integral result for every <em>real time</em> cycle interval length \
                  needed.</p>'
                },
                {
                  id: 'StartCount',
                  label: 'Start Count',
                  type: 'integer',
                  size: 1,
                  help: '<p>StartCount - <em>integer</em> - Used to indicate the time step number that will be associated with the first \
                  advection cycle in a transient problem. The value <em>-1</em> indicates that advection is not to be done. The value \
                  <em>0</em> indicates that advection should begin with the given initial conditions. Values greater than <em>0</em> are \
                  intended to mean <em>restart</em> from some previous <em>checkpoint</em> time step, but this has not yet been implemented.</p>'
                },
                {
                  id: 'StartTime',
                  label: 'Start Time',
                  type: 'float',
                  size: 1,
                  help: '<p>StartTime - <em>float</em> - Used to indicate the starting time for the simulation.</p>'
                },
                {
                  id: 'StopTime',
                  label: 'Stop Time',
                  type: 'float',
                  size: 1,
                  help: '<p>StopTime - <em>float</em> - Used to indicate the stopping time for the simulation.</p>'
                },
                {
                  id: 'DumpInterval',
                  label: 'Dump Interval',
                  type: 'float',
                  size: 1,
                  help: '<p>DumpInterval - <em>float</em> - The real time interval at which time-dependent output should be written. A value of \
                  <em>0</em> will produce undefined behavior. If the value is negative, <em>-n</em>, output will be dumped out every <em>n</em> \
                  time steps, where <em>n</em> is the absolute value of the integer part of the value.</p>'
                },
                {
                  id: 'DumpIntervalExecutionTimeLimit',
                  label: 'Dump Interval Execution Time Limit',
                  type: 'float',
                  size: 1,
                  default: 0,
                  help: '<p>DumpIntervalExecutionTimeLimit - <em>float</em> - Used to indicate a wall clock time to halt the execution of a run. \
                  At the end of each dump interval the time remaining in the batch job is compared with the user supplied value, if remaining \
                  time is less than or equal to the supplied value the execution is halted. Typically used when running on batch systems with \
                  time limits to force a clean shutdown near the end of the batch job. Time units is seconds, a value of <em>0</em> \
                  (the default) disables the check. Currently only supported on <em>SLURM</em> based systems, <em>–with-slurm</em> must be \
                  specified at configure time to enable.</p>'
                },
                {
                  id: 'Type',
                  label: 'Type of Timing',
                  type: 'integer',
                  size: 1,
                  ui: 'enum',
                  default: [0],
                  selected: 'Constant',
                  domain: {
                    'Constant': 0,
                    'Growth': 1,
                  },
                  help: '<p>Type - <em>string</em> - Must be one of: <em>Constant</em> or <em>Growth</em>. The value <em>Constant</em> defines \
                  a constant time step. The value <em>Growth</em> defines a time step that starts as <em>dt<sub>0</sub></em> and is defined for \
                  other steps as <em>dt<sup>new</sup> = &gamma;dt<sup>old</sup></em> such that <em>dt<sup>new</sup> &le; dt<sub>max</sub></em> \
                  and <em>dt<sup>new</sup> &ge; dt<sub>min</sub></em>.</p>',
                },
                [
                    'TimingConstant',
                    'TimingGrowth',
                ],
            ],
            children: {
                'TimingConstant':      "Timing.Type[0] === 0",
                'TimingGrowth':        "Timing.Type[0] === 1",
            }
        },
        TimingConstant: {
            label: 'Timing Constant',
            parameters: [
                {
                  id: 'Value',
                  label: 'Value',
                  type: 'float',
                  size: 1,
                  help: '<p>Value - <em>float</em> - Used only if a constant time step is selected and indicates the value of the time step for \
                  all steps taken.</p>'
                },
            ],
        },
        TimingGrowth: {
            label: 'Timing Growth',
            parameters: [
                {
                  id: 'InitialStep',
                  label: 'Initial Time Step',
                  type: 'float',
                  size: 1,
                  help: '<p>InitialStep - <em>float</em> - The initial time step <em>dt<sub>0</sub></em> if the <em>Growth</em> type time step is \
                  selected.</p>'
                },
                {
                  id: 'GrowthFactor',
                  label: 'Growth Factor',
                  type: 'float',
                  size: 1,
                  help: '<p>GrowthFactor - <em>float</em> - The growth factor <em>&gamma;</em> by which a time step will be multiplied to get the \
                  new time step when the <em>Growth</em> type time step is selected.</p>'
                },
                {
                  id: 'MaxStep',
                  label: 'Maximum Time Step',
                  type: 'float',
                  size: 1,
                  help: '<p>MaxStep - <em>float</em> - The maximum time step allowed, <em>dt<sub>max</sub></em>, when the <em>Growth</em> type \
                  time step is selected.</p>'
                },
                {
                  id: 'MinStep',
                  label: 'Minimum Time Step',
                  type: 'float',
                  size: 1,
                  help: '<p>MinStep - <em>float</em> - the minimum time step allowed, <em>dt<sub>min</sub></em>, when the <em>Growth</em> type \
                  time step is selected.</p>'
                },
            ],
        },
        Cycle: {
            label: 'Cycle',
            parameters: [
                {
                  id: 'Name',
                  label: 'Cycle Name',
                  type: 'string',
                  size: 1,
                  help: '<p>Name - <em>string</em> - Used to specify the named time cycles to be used in a simulation.</p>'
                },
                {
                  id: 'Length',
                  label: 'Name and Length',
                  ui: 'map',
                  help: '<p>Name and Length map - <em>(string,float)</em> - Specifies the named time intervals for each cycle and the length \
                  of a named time intervals. The length is an integer multiplier of the value set for the <em>BaseUnit</em> key \
                  described above. The total length of a given time cycle is the sum of all the intervals multiplied by the base unit.</p>'
                },
                {
                  id: 'Repeat',
                  label: 'Repeat',
                  type: 'integer',
                  size: 1,
                  help: '<p>Repeat - <em>integer</em> - Specifies the how many times a named time interval repeats. A positive value \
                  specifies a number of repeat cycles a value of -1 specifies that the cycle repeat for the entire simulation.</p>'
                },
            ],
        },
        Domain: {
            label: 'Domain',
            parameters: [
                {
                  id: 'GeomName',
                  label: 'Geometry Name',
                  type: 'string',
                  size: 1,
                  help: '<p>GeomName - <em>string</em> - Specifies which of the named geometries is the problem domain.</p>'
                },
            ],
        },
        Gravity: {
            label: 'Gravity',
            parameters: [
                {
                  id: 'Gravity',
                  label: 'Gravity Constant',
                  type: 'float',
                  size: 1,
                  help: '<p>Gravity - <em>float</em> - Specifies the gravity constant to be used.</p>'
                },
            ],
        },
        Phase: {
            label: 'Phase',
            parameters: [
                {
                  id: 'Names',
                  type: 'string',
                  layout: '-1',
                  label: 'Phase Names',
                  help: '<p>Names - <em>string</em> - specifies the names of phases to be modeled. Currently only 1 or 2 phases may be modeled.</p>'
                },
                {
                  id: 'DensityType',
                  label: 'Type of Phase Density',
                  type: 'integer',
                  size: 1,
                  ui: 'enum',
                  default: [0],
                  selected: 'Constant',
                  domain: {
                    'Constant': 0,
                    'EquationOfState': 1,
                  },
                  help: '<p>DensityType - <em>string</em> - Specifies whether density will be a constant value or if it will be given by an \
                  equation of state of the form <em>(rd)exp(cP)</em>, where <em>P</em> is pressure, <em>rd</em> is the density at atmospheric \
                  pressure, and <em>c</em> is the phase compressibility constant. This key must be either <em>Constant</em> or \
                  <em>EquationOfState</em>.</p>',
                },
                {
                  id: 'ViscosityType',
                  label: 'Type of Phase Viscosity',
                  type: 'integer',
                  size: 1,
                  ui: 'enum',
                  default: [0],
                  selected: 'Constant',
                  domain: {
                    'Constant': 0,
                  },
                  help: '<p>ViscosityType - <em>string</em> - Specifies whether viscosity will be a constant value. Currently, the only choice \
                  for this key is <em>Constant</em>.</p>',
                },
                [
                    'PhaseDensityConstant',
                    'PhaseEquationOfState',
                    'PhaseViscosityConstant',
                ],
            ],
            children: {
                'PhaseDensityConstant':        "Phase.DensityType[0] === 0",
                'PhaseEquationOfState':        "Phase.DensityType[0] === 1",
                'PhaseViscosityConstant':      "Phase.ViscosityType[0] === 0",
            }
        },
        PhaseDensityConstant: {
            label: 'Density Constant',
            parameters: [
                {
                  id: 'Value',
                  label: 'Value',
                  type: 'float',
                  size: 1,
                  help: '<p>Value - <em>float</em> - The value of density if this phase was specified to have a constant density value for the \
                  phase, phase name.</p>'
                },
            ],
        },
        PhaseEquationOfState: {
            label: 'Density Equation of State',
            parameters: [
                {
                  id: 'ReferenceDensity',
                  label: 'Reference Density',
                  type: 'float',
                  size: 1,
                  help: '<p>ReferenceDensity - <em>float</em> - Specifies the reference density if an equation of state density function is specified \
                  for the phase phase name.</p>'
                },
              {
                  id: 'CompressibilityConstant',
                  label: 'Compressibility Constant',
                  type: 'float',
                  size: 1,
                  help: '<p>CompressibilityConstant - <em>float</em> - The phase compressibility constant if an equation of state density \
                  function is specified for the phase, phase name.</p>'
                },
            ],
        },
        PhaseViscosityConstant: {
            label: 'Viscosity Constant',
            parameters: [
                {
                  id: 'Value',
                  label: 'Value',
                  type: 'float',
                  size: 1,
                  help: '<p>Value - <em>float</em> - The value of viscosity if this phase was specified to have a constant viscosity value.</p>'
                },
            ],
        },
        Contaminant: {
            label: 'Contaminant',
            parameters: [
                {
                  id: 'Names',
                  label: 'Names',
                  type: 'string',
                  size: 1,
                  help: '<p>Names - <em>string</em> - Specifies the names of contaminants to be advected.</p>'
                },
                {
                  id: 'Value',
                  label: 'Degradation Value',
                  type: 'float',
                  size: 1,
                  help: '<p>Value - <em>float</em> - Specifies the half-life decay rate of the named contaminant, contaminant name. At present \
                  only first order decay reactions are implemented and it is assumed that one contaminant cannot decay into another.</p>'
                },
            ],
        },
        Permeability: {
            label: 'Permeability',
            parameters: [
                {
                  id: 'GeomNames',
                  type: 'string',
                  layout: '-1',
                  label: 'Geometry Names',
                  help: '<p>GeomNames - <em>string</em> - All of the geometries on which a different permeability will be assigned. \
                  These geometries must cover the entire computational domain.</p>'
                },
                {
                  id: 'Type',
                  label: 'Type of Permeability',
                  type: 'integer',
                  size: 1,
                  ui: 'enum',
                  default: [0],
                  selected: 'Constant',
                  domain: {
                    'Constant': 0,
                    'TurnBands': 1,
                    'ParGuass': 2,
                    'PFBFile': 3,
                  },
                  help: '<p>Type - <em>string</em> - Specifies which method is to be used to assign permeability data to the named \
                  geometry, geometry name.It must be either <em>Constant</em>, <em>TurnBands</em>, <em>ParGuass</em>, or <em>PFBFile</em>. \
                  The <em>Constant</em> value indicates that a constant is to be assigned to all grid cells within a geometry. The \
                  <em>TurnBands</em> value indicates that Tompson’s Turning Bands method is to be used to assign permeability data to all \
                  grid cells within a geometry. The <em>ParGuass</em> value indicates that a Parallel Gaussian Simulator method is to be \
                  used to assign permeability data to all grid cells within a geometry. The <em>PFBFile</em> value indicates that \
                  premeabilities are to be read from the ParFlow Binary file. Both the Turning Bands and Parallel Gaussian Simulators \
                  generate a random field with correlation lengths in the 3 spatial directions given by <em>&lambda;x</em>, \
                  <em>&lambda;y</em>, and <em>&lambda;z</em> with the geometric mean of the log normal field given by <em>&mu;</em> and \
                  the standard deviation of the normal field given by <em>&sigma;</em>. In generating the field both of these methods can \
                  be made to stratify the data, that is follow the top or bottom surface. The generated field can also be made so that the \
                  data is normal or log normal, with or without bounds truncation. Turning Bands uses a line process, the number of lines \
                  used and the resolution of the process can be changed as well as the maximum normalized frequency Kmax and the normalized \
                  frequency increment δK. The Parallel Gaussian Simulator uses a search neighborhood, the number of simulated points and the \
                  number of conditioning points can be changed.</p>',
                },
                [
                    'PermeabilityConstant',
                    'PermeabilityRandom',
                    'PermeabilityTurnBands',
                    'PermeabilityParGuass',
                    'PermeabilityPFBFile',
                ],
            ],
            children: {
                'PermeabilityConstant':      "Permeability.Type[0] === 0",
                'PermeabilityRandom':        "(Permeability.Type[0] === 1 || Permeability.Type[0] === 2)",
                'PermeabilityTurnBands':     "Permeability.Type[0] === 1",
                'PermeabilityParGuass':      "Permeability.Type[0] === 2",
                'PermeabilityPFBFile':       "Permeability.Type[0] === 3",
            }
        },
        PermeabilityConstant: {
            label: 'Permeability Constant',
            parameters: [
                {
                  id: 'Value',
                  label: 'Value',
                  type: 'float',
                  size: 1,
                  help: '<p>Value - <em>float</em> - The value assigned to all points in the named geometry, geometry name, if the type was set \
                  to constant.</p>'
                },
            ],
        },
        PermeabilityRandom: {
            label: 'Random Permeability',
            parameters: [
                {
                  id: 'LambdaX',
                  label: 'Lambda X',
                  type: 'float',
                  size: 1,
                  help: '<p>LambdaX - <em>float</em> - The <em>x</em> correlation length, <em>&lambda;x</em>, of the field generated for the named \
                  geometry, geometry name, if either the Turning Bands or Parallel Gaussian Simulator are chosen.</p>'
                },
                {
                  id: 'LambdaY',
                  label: 'Lambda Y',
                  type: 'float',
                  size: 1,
                  help: '<p>LambdaY - <em>float</em> - The <em>y</em> correlation length, <em>&lambda;y</em>, of the field generated for the named \
                  geometry, geometry name, if either the Turning Bands or Parallel Gaussian Simulator are chosen.</p>'
                },
                {
                  id: 'LambdaZ',
                  label: 'Lambda Z',
                  type: 'float',
                  size: 1,
                  help: '<p>LambdaZ - <em>float</em> - The <em>z</em> correlation length, <em>&lambda;z</em>, of the field generated for the named \
                  geometry, geometry name, if either the Turning Bands or Parallel Gaussian Simulator are chosen.</p>'
                },
                {
                  id: 'GeomMean',
                  label: 'Geometry Mean',
                  type: 'float',
                  size: 1,
                  help: '<p>GeomMean - <em>float</em> - The geometric mean, <em>&mu;</em>, of the log normal field generated for the named geometry, \
                  geometry name, if either the Turning Bands or Parallel Gaussian Simulator are chosen.</p>'
                },
                {
                  id: 'Sigma',
                  label: 'Sigma',
                  type: 'float',
                  size: 1,
                  help: '<p>Sigma - <em>float</em> - The standard deviation, <em>&sigma;</em>, of the normal field generated for the named geometry, \
                  geometry name, if either the Turning Bands or Parallel Gaussian Simulator are chosen.</p>'
                },
                {
                  id: 'Seed',
                  label: 'Seed',
                  type: 'integer',
                  size: 1,
                  default: 1,
                  help: '<p>Seed - <em>integer</em> - The initial seed for the random number generator used to generate the field for the named \
                  geometry, geometry name, if either the Turning Bands or Parallel Gaussian Simulator are chosen. This number must be positive.</p>'
                },
                {
                  id: 'StratType',
                  label: 'Stratification Type',
                  type: 'integer',
                  size: 1,
                  ui: 'enum',
                  default: [1],
                  selected: 'Bottom',
                  domain: {
                    'Horizontal': 0,
                    'Bottom': 1,
                    'Top': 2,
                  },
                  help: '<p>StratType - <em>string</em> - Specifies the stratification of the permeability field generated by the method for the \
                  amed geometry, geometry name. The value must be one of <em>Horizontal</em>, <em>Bottom</em> or <em>Top</em> and can be used \
                  with either the Turning Bands or the Parallel Gaussian Simulator.</p>',
                },
                {
                  id: 'LogNormal',
                  label: 'Field Type',
                  type: 'integer',
                  size: 1,
                  ui: 'enum',
                  default: [3],
                  selected: 'LogTruncate',
                  domain: {
                    'Normal': 0,
                    'Log': 1,
                    'NormalTruncated': 2,
                    'LogTruncate': 3,
                  },
                  help: '<p>LogNormal - <em>string</em> - Specifies when a normal, log normal, truncated normal or truncated log normal field is \
                  to be generated by the method for the named geometry, geometry name. This value must be one of <em>Normal</em>, <em>Log</em>, \
                  <em>NormalTruncated</em> or <em>LogTruncate</em> and can be used with either Turning Bands or the Parallel Gaussian Simulator.</p>',
                },
                {
                  id: 'LowCutoff',
                  label: 'Low Cutoff',
                  type: 'float',
                  size: 1,
                  show: "(PermeabilityRandom.LogNormal[0] === 2 || PermeabilityRandom.LogNormal[0] === 3)",
                  help: '<p>LowCutoff - <em>float</em> - The low cutoff value for truncating the generated field for the named geometry, geometry \
                  name, when either the <em>NormalTruncated</em> or <em>LogTruncate</em> values are chosen.<p>'
                },
                {
                  id: 'HighCutoff',
                  label: 'High Cutoff',
                  type: 'float',
                  size: 1,
                  show: "(PermeabilityRandom.LogNormal[0] === 2 || PermeabilityRandom.LogNormal[0] === 3)",
                  help: '<p>HighCutoff - <em>float</em> - The high cutoff value for truncating the generated field for the named geometry, geometry \
                  name, when either the <em>NormalTruncated</em> or <em>LogTruncate</em> values are chosen.<p>'
                },
            ],
        },
        PermeabilityTurnBands: {
            label: 'Permeability Turning Bands',
            parameters: [
                {
                  id: 'NumLines',
                  label: 'Number of Lines',
                  type: 'integer',
                  size: 1,
                  default: 100,
                  help: '<p>NumLines - <em>integer</em> - The number of lines to be used in the Turning Bands algorithm for the named geometry, \
                  geometry name.</p>'
                },
                {
                  id: 'RZeta',
                  label: 'R Zeta',
                  type: 'float',
                  size: 1,
                  default: 5.0,
                  help: '<p>RZeta - <em>float</em> - The resolution of the line processes, in terms of the minimum grid spacing, to be used in \
                  the Turning Bands algorithm for the named geometry, geometry name. Large values imply high resolution.</p>'
                },
                {
                  id: 'KMax',
                  label: 'K Maximum',
                  type: 'float',
                  size: 1,
                  default: 100.0,
                  help: '<p>KMax - <em>float</em> - The maximum normalized frequency, <em>K<sub>max</sub></em>, to be used in the Turning Bands \
                  algorithm for the named geometry, geometry name.</p>'
                },
                {
                  id: 'DelK',
                  label: 'Delta K',
                  type: 'float',
                  size: 1,
                  default: 0.2,
                  help: '<p>DelK - <em>float</em> - Tthe normalized frequency increment, <em>&delta;K</em>, to be used in the Turning Bands \
                  algorithm for the named geometry, geometry name.</p>'
                },
            ],
        },
        PermeabilityParGuass: {
            label: 'Permeability Parallel Guassian',
            parameters: [
                {
                  id: 'MaxNPts',
                  label: 'Maximum Number of Points',
                  type: 'integer',
                  size: 1,
                  help: '<p>MaxNPts - <em>integer</em> - Sets limits on the number of simulated points in the search neighborhood to be used in \
                  the Parallel Gaussian Simulator for the named geometry, geometry name.</p>'
                },
                {
                  id: 'MaxCpts',
                  label: 'Maximum Number of Conditioning Points',
                  type: 'integer',
                  size: 1,
                  help: '<p>MaxCpts - <em>integer</em> - Sets limits on the number of external conditioning points in the search neighborhood to \
                  be used in the Parallel Gaussian Simulator for the named geometry, geometry name.</p>'
                },
            ],
        },
        PermeabilityPFBFile: {
            label: 'Permeability PFBFile',
            parameters: [
                {
                  id: 'FileName',
                  label: 'File Name',
                  type: 'string',
                  size: 1,
                  help: '<p>FileName - <em>string</em> - Specifies that permeability values for the specified geometry, geometry name, are given \
                  according to a user-supplied description in the ParFlow Binary file whose filename is given as the value. For a description of \
                  The ParFlow Binary file associated with the named geometry must contain a collection of permeability values corresponding in a \
                  one-to-one manner to the entire computational grid. That is to say, when the contents of the file are read into the simulator, \
                  a complete permeability description for the entire domain is supplied. Only those values associated with computational cells \
                  residing within the geometry (as it is represented on the computational grid) will be copied into data structures used during \
                  the course of a simulation. Thus, the values associated with cells outside of the geounit are irrelevant. For clarity, consider \
                  a couple of different scenarios. For example, the user may create a file for each geometry such that appropriate permeability \
                  values are given for the geometry and “garbage” values (e.g., some flag value) are given for the rest of the computational \
                  domain. In this case, a separate binary file is specified for each geometry. Alternatively, one may place all values \
                  representing the permeability field on the union of the geometries into a single binary file. Note that the permeability values \
                  must be represented in precisely the same configuration as the computational grid. Then, the same file could be specified for \
                  each geounit in the input file. Or, the computational domain could be described as a single geouint (in the ParFlow input file) \
                  in which case the permeability values would be read in only once.</p>'
                },
            ],
        },
        PermeabilityTensor: {
            label: 'Permeability Tensor',
            parameters: [
                {
                  id: 'GeomNames',
                  type: 'string',
                  layout: '-1',
                  label: 'Geometry Names',
                  help: '<p>GeomNames - <em>string</em> - All of the geometries on which a different permeability will be assigned. \
                  These geometries must cover the entire computational domain.</p>'
                },
                {
                  id: 'TensorType',
                  label: 'Type of Permeability Tensor',
                  type: 'integer',
                  size: 1,
                  ui: 'enum',
                  default: [0],
                  selected: 'TensorByGeom',
                  domain: {
                    'TensorByGeom': 0,
                    'TensorByFile': 1,
                  },
                  help: '<p>TensorType - <em>string</em> - Specifies whether the permeability tensor entries kx, ky and kz will be specified as \
                  three constants within a set of regions covering the domain or whether the entries will be specified cell-wise by files. The \
                  choices for this key are <em>TensorByGeom</em> and <em>TensorByFile</em>.</p>',
                },
                [
                    'PermeabilityTensorByGeom',
                    'PermeabilityTensorByFile',
                ],
            ],
            children: {
                'PermeabilityTensorByGeom':      "PermeabilityTensor.TensorType[0] === 0",
                'PermeabilityTensorByFile':      "PermeabilityTensor.TensorType[0] === 1",
            }
        },
        PermeabilityTensorByGeom: {
            label: 'Permeability Tensor by Geometry',
            parameters: [
                {
                  id: 'TensorVal',
                  label: 'Tensor Value X, Y, Z',
                  type: 'float',
                  size: 3,
                  help: '<p>TensorValX - <em>float</em> - Tthe value of <em>k<sub>x</sub></em>, <em>k<sub>y</sub></em>, and <em>k<sub>z</sub></em> \
                  or the geometry given by geometry name.</p>'
                },
            ],
        },
        PermeabilityTensorByFile: {
            label: 'Permeability Tensor by File',
            parameters: [
                {
                  id: 'TensorFile',
                  label: 'X, Y, and Z Tensor File Names',
                  type: 'string',
                  size: 3,
                  help: '<p>TensorFileX - <em>string</em> - Specifies that <em>k<sub>x</sub></em>, <em>k<sub>y</sub></em>, and <em>k<sub>z</sub></em> \
                  alues for the specified geometry, geometry name, are given according to a user-supplied description in the ParFlow Binary file whose \
                  filename is given as the value. The only choice for the value of geometry name is <em>domain</em>.</p>'
                },
            ],
        },
        Porosity: {
            label: 'Porosity',
            parameters: [
                {
                  id: 'GeomNames',
                  type: 'string',
                  layout: '-1',
                  label: 'Geometry Names',
                  help: '<p>GeomNames - <em>string</em> - All of the geometries on which a different porosity will be assigned. \
                  These geometries must cover the entire computational domain.</p>'
                },
                {
                  id: 'Type',
                  label: 'Type of Porosity',
                  type: 'integer',
                  size: 1,
                  ui: 'enum',
                  default: [0],
                  selected: 'Constant',
                  domain: {
                    'Constant': 0,
                  },
                  help: '<p>Type - <em>string</em> - Specifies which method is to be used to assign porosity data. The only \
                  choice currently available is <em>Constant</em> which indicates that a constant is to be assigned to all grid cells within a \
                  geometry.</p>',
                },
                [
                    'PorosityConstant',
                ],
            ],
            children: {
                'PorosityConstant':      "Porosity.Type[0] === 0",
            }
        },
        PorosityConstant: {
            label: 'Porosity Constant',
            parameters: [
                {
                  id: 'Value',
                  label: 'Value',
                  type: 'float',
                  size: 1,
                  help: '<p>Value - <em>float</em> - The value assigned to all points in the named geometry, geometry name, if the type was set \
                  to constant.</p>'
                },
            ],
        },
        SpecificStorage: {
            label: 'Specific Storage',
            parameters: [
                {
                  id: 'GeomNames',
                  type: 'string',
                  layout: '-1',
                  label: 'Geometry Names',
                  help: '<p>GeomNames - <em>string</em> - All of the geometries on which a different specific storage value will be assigned. \
                  These geometries must cover the entire computational domain.</p>'
                },
                {
                  id: 'Type',
                  label: 'Type of Specific Storage',
                  type: 'integer',
                  size: 1,
                  ui: 'enum',
                  default: [0],
                  selected: 'Constant',
                  domain: {
                    'Constant': 0,
                  },
                  help: '<p>Type - <em>string</em> - Specifies which method is to be used to assign specific storage data. The only \
                  choice currently available is <em>Constant</em> which indicates that a constant is to be assigned to all grid cells within a \
                  geometry.</p>',
                },
                [
                    'SpecificStorageConstant',
                ],
            ],
            children: {
                'SpecificStorageConstant':      "SpecificStorage.Type[0] === 0",
            }
        },
        SpecificStorageConstant: {
            label: 'Specific Storage Constant',
            parameters: [
                {
                  id: 'Value',
                  label: 'Value',
                  type: 'float',
                  size: 1,
                  help: '<p>Value - <em>float</em> - The value assigned to all points in the named geometry, geometry name, if the type was set \
                  to constant.</p>'
                },
            ],
        },
        dZMultipliers: {
            label: 'dZ Multipliers',
            parameters: [
                {
                  id: 'GeomNames',
                  type: 'string',
                  layout: '-1',
                  label: 'Geometry Names',
                  help: '<p>GeomNames - <em>string</em> - Specifies which problem domain is being applied a variable <em>dz</em> \
                  subsurface. These geometries must cover the entire computational domain.</p>'
                },
                {
                  id: 'Type',
                  label: 'Type of Mannings',
                  type: 'integer',
                  size: 1,
                  ui: 'enum',
                  default: [0],
                  selected: 'Constant',
                  domain: {
                    'Constant': 0,
                    'nzList': 1,
                    'PFBFile': 2,
                  },
                  help: '<p>Type - <em>string</em> - Specifies which method is to be used to assign variable vertical grid spacing. The \
                  choices currently available are <em>Constant</em> which indicates that a constant is to be assigned to all grid cells \
                  within a geometry, <em>nzList</em> which assigns all layers of a given model to a list value, and <em>PFBFile</em> which \
                  reads in values from a distributed pfb file.</p>',
                },
                [
                    'dZMultipliersConstant',
                    'dZMultipliersnzList',
                    'dZMultipliersPFBFile',
                ],
            ],
            children: {
                'dZMultipliersConstant':      "dZMultipliers.Type[0] === 0",
                'dZMultipliersnzList':        "dZMultipliers.Type[0] === 1",
                'dZMultipliersPFBFile':       "dZMultipliers.Type[0] === 2",
            }
        },
        dZMultipliersConstant: {
            label: 'dZ Multipliers Constant',
            parameters: [
                {
                  id: 'Value',
                  label: 'Value',
                  type: 'float',
                  size: 1,
                  help: '<p>Value - <em>float</em> - The value assigned to all points in the named geometry, geometry name, if the type was \
                  set to constant.</p>'
                },
            ],
        },
        dZMultipliersnzList: {
            label: 'dZ Multipliers nz List',
            parameters: [
                {
                  id: 'nzListNumber',
                  label: 'Number of nz List Items',
                  type: 'integer',
                  size: 1,
                  help: '<p>nzListNumber - <em>integer</em> - The number of layers with variable dz in the subsurface. This value is the same \
                  as the <em>ComputationalGrid.NZ</em> key.</p>'
                },
                {
                  id: 'Value',
                  label: 'Number and Value',
                  ui: 'map',
                  help: '<p>Number and Value map - <em>(integer,float)</em> - The thickness of each layer defined by nzListNumber. ParFlow \
                  assigns the layers from the bottom-up (i.e. the bottom of the domain is layer <em>0</em>, the top is layer <em>NZ-1</em>). \
                  The total domain depth (<em>Geom.domain.Upper.Z</em>) does not change with variable <em>dz</em>. The layer thickness is \
                  calculated by <em>ComputationalGrid.DZ * dZScale</em>.</p>'
                },
            ],
        },
        dZMultipliersPFBFile: {
            label: 'dZ Multipliers PBF File',
            parameters: [
                {
                  id: 'FileName',
                  label: 'File Name',
                  type: 'string',
                  size: 1,
                  help: '<p>FileName - <em>string</em> - Specifies file to be read in for variable dz values for the given geometry, \
                  geometry name, if the type was set to PFBFile.</p>'
                },
            ],
        },
        Mannings: {
            label: 'Mannings',
            parameters: [
                {
                  id: 'GeomNames',
                  type: 'string',
                  layout: '-1',
                  label: 'Geometry Names',
                  help: '<p>GeomNames - <em>string</em> - All of the geometries on which a different Mannings roughness value will be \
                  assigned. Mannings may be assigned by <em>PFBFile</em> or as <em>Constant</em> by geometry. These geometries must \
                  cover the entire upper surface of the computational domain.</p>'
                },
                {
                  id: 'Type',
                  label: 'Type of Mannings',
                  type: 'integer',
                  size: 1,
                  ui: 'enum',
                  default: [0],
                  selected: 'Constant',
                  domain: {
                    'Constant': 0,
                    'PFBFile': 1,
                  },
                  help: '<p>Type - <em>string</em> - Specifies which method is to be used to assign Mannings roughness data. The choices \
                  currently available are <em>Constant</em> which indicates that a constant is to be assigned to all grid cells within a \
                  geometry and <em>PFBFile</em> which indicates that all values are read in from a distributed, grid-based ParFlow binary \
                  file.</p>',
                },
                [
                    'ManningsConstant',
                    'ManningsPFBFile',
                ],
            ],
            children: {
                'ManningsConstant':      "Mannings.Type[0] === 0",
                'ManningsPFBFile':       "Mannings.Type[0] === 1",
            }
        },
        ManningsConstant: {
            label: 'Mannings Constant',
            parameters: [
                {
                  id: 'Value',
                  label: 'Value',
                  type: 'float',
                  size: 1,
                  help: '<p>Value - <em>float</em> - The value assigned to all points in the named geometry, geometry name, if the \
                  type was set to constant.</p>'
                },
            ],
        },
        ManningsPFBFile: {
            label: 'Mannings PBF File',
            parameters: [
                {
                  id: 'FileName',
                  label: 'File Name',
                  type: 'string',
                  size: 1,
                  help: '<p>FileName - <em>string</em> - Specifies the value assigned to all points be read in from a ParFlow binary \
                  file.</p>'
                },
            ],
        },
        TopographicalXSlopes: {
            label: 'Topographical X Slopes',
            parameters: [
                {
                  id: 'GeomNames',
                  type: 'string',
                  layout: '-1',
                  label: 'Geometry Names',
                  help: '<p>GeomNames - <em>string</em> - All of the geometries on which a different <em>x</em> topographic slope values \
                  will be assigned. Topographic slopes may be assigned by <em>PFBFile</em> or as <em>Constant</em> by geometry. These \
                  geometries must cover the entire upper surface of the computational domain.</p>'
                },
                {
                  id: 'Type',
                  label: 'Type of Topographical X Slopes',
                  type: 'integer',
                  size: 1,
                  ui: 'enum',
                  default: [0],
                  selected: 'Constant',
                  domain: {
                    'Constant': 0,
                    'PFBFile': 1,
                  },
                  help: '<p>Type - <em>string</em> - Specifies which method is to be used to assign topographic slopes. The choices \
                  currently available are <em>Constant</em> which indicates that a constant is to be assigned to all grid cells within a \
                  geometry and <em>PFBFile</em> which indicates that all values are read in from a distributed, grid-based ParFlow binary \
                  file.</p>',
                },
                [
                    'TopographicalXSlopesConstant',
                    'TopographicalXSlopesPFBFile',
                ],
            ],
            children: {
                'TopographicalXSlopesConstant':      "TopographicalXSlopes.Type[0] === 0",
                'TopographicalXSlopesPFBFile':       "TopographicalXSlopes.Type[0] === 1",
            }
        },
        TopographicalXSlopesConstant: {
            label: 'Topographical X Slopes Constant',
            parameters: [
                {
                  id: 'Value',
                  label: 'Value',
                  type: 'float',
                  size: 1,
                  help: '<p>Value - <em>float</em> - The value assigned to all points in the named geometry, geometry name, if the \
                  type was set to constant.</p>'
                },
            ],
        },
        TopographicalXSlopesPFBFile: {
            label: 'Topographical X Slopes PBF File',
            parameters: [
                {
                  id: 'FileName',
                  label: 'File Name',
                  type: 'string',
                  size: 1,
                  help: '<p>FileName - <em>string</em> - Specifies the value assigned to all points be read in from a ParFlow binary \
                  file.</p>'
                },
            ],
        },
        TopographicalYSlopes: {
            label: 'Topographical Y Slopes',
            parameters: [
                {
                  id: 'GeomNames',
                  type: 'string',
                  layout: '-1',
                  label: 'Geometry Names',
                  help: '<p>GeomNames - <em>string</em> - All of the geometries on which a different <em>y</em> topographic slope values \
                  will be assigned. Topographic slopes may be assigned by <em>PFBFile</em> or as <em>Constant</em> by geometry. These \
                  geometries must cover the entire upper surface of the computational domain.</p>'
                },
                {
                  id: 'Type',
                  label: 'Type of Topographical Y Slopes',
                  type: 'integer',
                  size: 1,
                  ui: 'enum',
                  default: [0],
                  selected: 'Constant',
                  domain: {
                    'Constant': 0,
                    'PFBFile': 1,
                  },
                  help: '<p>Type - <em>string</em> - Specifies which method is to be used to assign topographic slopes. The choices \
                  currently available are <em>Constant</em> which indicates that a constant is to be assigned to all grid cells within a \
                  geometry and <em>PFBFile</em> which indicates that all values are read in from a distributed, grid-based ParFlow binary \
                  file.</p>',
                },
                [
                    'TopographicalYSlopesConstant',
                    'TopographicalYSlopesPFBFile',
                ],
            ],
            children: {
                'TopographicalYSlopesConstant':      "TopographicalYSlopes.Type[0] === 0",
                'TopographicalYSlopesPFBFile':       "TopographicalYSlopes.Type[0] === 1",
            }
        },
        TopographicalYSlopesConstant: {
            label: 'Topographical Y Slopes Constant',
            parameters: [
                {
                  id: 'Value',
                  label: 'Value',
                  type: 'float',
                  size: 1,
                  help: '<p>Value - <em>float</em> - The value assigned to all points in the named geometry, geometry name, if the \
                  type was set to constant.</p>'
                },
            ],
        },
        TopographicalYSlopesPFBFile: {
            label: 'Topographical Y Slopes PBF File',
            parameters: [
                {
                  id: 'FileName',
                  label: 'File Name',
                  type: 'string',
                  size: 1,
                  help: '<p>FileName - <em>string</em> - Specifies the value assigned to all points be read in from a ParFlow binary \
                  file.</p>'
                },
            ],
        },
        Retardation: {
            label: 'Retardation',
            parameters: [
                {
                  id: 'GeomNames',
                  type: 'string',
                  layout: '-1',
                  label: 'Geometry Names',
                  help: '<p>GeomNames - <em>string</em> - All of the geometries to which the contaminants will have a retardation function \
                  applied.</p>'
                },
                {
                  id: 'Type',
                  label: 'Type of Retardation',
                  type: 'integer',
                  size: 1,
                  ui: 'enum',
                  default: [0],
                  selected: 'Linear',
                  domain: {
                    'Linear': 0,
                  },
                  help: '<p>Type - <em>string</em> - Specifies which function is to be used to compute the retardation for the named \
                  contaminant, contam- inant name, in the named geometry, geometry name. The only choice currently available is \
                  <em>Linear</em> which indicates that a simple linear retardation function is to be used to compute the retardation.</p>',
                },
                [
                    'RetardationLinear',
                ],
            ],
            children: {
                'RetardationLinear':      "Retardation.Type[0] === 0",
            }
        },
        RetardationLinear: {
            label: 'Retardation Linear',
            parameters: [
                {
                  id: 'Value',
                  label: 'Value',
                  type: 'float',
                  size: 1,
                  help: '<p>Value - <em>float</em> - The distribution coefficient for the linear function used to compute the retardation of \
                  the named contaminant, contaminant name, in the named geometry, geometry name. The value should be scaled by the density of \
                  the material in the geometry.</p>'
                },
            ],
        },
        Mobilities: {
            label: 'Mobilities',
            parameters: [
                {
                  id: 'PhaseName',
                  type: 'string',
                  size: 1,
                  label: 'Phase Name',
                  help: '<p>PhaseName - <em>string</em> - The phase name.</p>'
                },
                {
                  id: 'Type',
                  label: 'Type of Retardation',
                  type: 'integer',
                  size: 1,
                  ui: 'enum',
                  default: [0],
                  selected: 'Constant',
                  domain: {
                    'Constant': 0,
                    'Polynomial': 1,
                  },
                  help: '<p>Type - <em>string</em> - Specifies whether the mobility for phase name will be a given constant or a polynomial \
                  of the form, <em>(S − S<sub>0</sub>)<sup>a</sup></em>, where <em>S</em> is saturation, <em>S<sub>0</sub></em> is irreducible \
                  saturation, and <em>a</em> is some exponent. The possibilities for this key are Constant and Polynomial.</p>',
                },
                [
                    'MobilitiesConstant',
                    'MobilitiesPolynomial',
                ],
            ],
            children: {
                'MobilitiesConstant':        "Mobilities.Type[0] === 0",
                'MobilitiesPolynomial':      "Mobilities.Type[0] === 1",
            }
        },
        MobilitiesConstant: {
            label: 'Mobilities Constant',
            parameters: [
                {
                  id: 'Value',
                  label: 'Value',
                  type: 'float',
                  size: 1,
                  help: '<p>Value - <em>float</em> - Specifies the constant mobility value for phase phase name.</p>'
                },
            ],
        },
        MobilitiesPolynomial: {
            label: 'Mobilities Polynomial',
            parameters: [
                {
                  id: 'Exponent',
                  label: 'Exponent',
                  type: 'float',
                  size: 1,
                  default: 2.0,
                  help: '<p>Exponent - <em>float</em> - The exponent used in a polynomial representation of the mobilities. Currently, \
                  only a value of 2.0 is allowed.</p>'
                },
                {
                  id: 'IrreducibleSaturation',
                  label: 'Irreducible Saturation',
                  type: 'float',
                  size: 1,
                  default: 0.0,
                  help: '<p>IrreducibleSaturation - <em>float</em> - The irreducible saturation used in a polynomial representation of the \
                  mobilities. Currently, only a value of 0.0 is allowed.</p>'
                },
            ],
        },
        Solver: {
            label: 'Solver',
            parameters: [
                {
                  id: 'Type',
                  label: 'Solver Type',
                  type: 'integer',
                  size: 1,
                  ui: 'enum',
                  default: [0],
                  selected: 'IMPES',
                  domain: {
                    'IMPES': 0,
                    'Richards': 1,
                    'Richards with Overland Flow': 2,
                    'Richards with LSM': 3,
                    'Richards with Overland Flow and LSM': 4,
                  },
                  help: '<p>Solver - <em>string</em> - The solver in ParFlow. 1. IMPES - To simulate fully saturated, \
                  steady-state conditions. 2. Richards - To simulate variably-saturated, transient conditions or variably/fully \
                  saturated, transient with compressible storage. 3. Richards with Overland Flow - To simulate Richards \
                  conditions plus overland flow, using the kinematic wave approximation to the shallow-wave equations. 4. \
                  Richards with LSM - To simulate Richards conditions plus the land surface model CLM. 5. Richards with \
                  Overland Flow and LSM - To simulate Richards conditions with overland flow plus the land surface model CLM.</p>',
                },
                [
                  'SolverCore',
                  'SolverIMPES',
                  'SolverRichards',
                  'RichardsLinear', 
                  'RichardsNonLinear',
                  'RichardsNonLinearPreconditioner',
                  'EvaporationTransport',
                  'SolverOverlandFlow',
                  'SolverOverlandFlowSpinUp',
                  'SolverLSM',
                  'LSMMetForcing',
                  'LSMIrrigation',
                  'LSMWaterStress',
                  'LSMEvapBeta',
                  'SolverOutput',
                  'LSMOutput'
                ],
            ],
            children: {
                'SolverCore':                          "(Solver.Type[0] === 0 || Solver.Type[0] !== 0)",
                'SolverIMPES':                         "Solver.Type[0] === 0",
                'SolverRichards':                      "Solver.Type[0] !== 0",
                'RichardsLinear':                      "Solver.Type[0] !== 0",
                'RichardsNonLinear':                   "Solver.Type[0] !== 0",
                'RichardsNonLinearPreconditioner':     "Solver.Type[0] !== 0",
                'EvaporationTransport':                "Solver.Type[0] !== 0",
                'SolverOverlandFlow':                  "(Solver.Type[0] === 2 || Solver.Type[0] === 4)",
                'SolverOverlandFlowSpinUp':            "(Solver.Type[0] === 2 || Solver.Type[0] === 4)",
                'SolverLSM':                           "(Solver.Type[0] === 3 || Solver.Type[0] === 4)",
                'LSMMetForcing':                       "(Solver.Type[0] === 3 || Solver.Type[0] === 4)",
                'LSMIrrigation':                       "(Solver.Type[0] === 3 || Solver.Type[0] === 4)",
                'LSMWaterStress':                      "(Solver.Type[0] === 3 || Solver.Type[0] === 4)",
                'LSMEvapBeta':                         "(Solver.Type[0] === 3 || Solver.Type[0] === 4)",
                'SolverOutput':                        "(Solver.Type[0] === 0 || Solver.Type[0] !== 0)",
                'LSMOutput':                           "(Solver.Type[0] === 3 || Solver.Type[0] === 4)",
            },
        },
        SolverCore: {
            label: 'Solver Core Parameters',
            parameters: [
                {
                  id: 'SadvectOrder',
                  label: 'Saturation Advection Order',
                  type: 'integer',
                  size: 1,
                  default: 2,
                  help: '<p>SadvectOrder - <em>integer</em> - The order of the explicit method used in advancing the \
                  saturations. This value can be either 1 for a standard upwind first order or 2 for a second order Godunov \
                  method.</p>'
                },
                {
                  id: 'AdvectOrder',
                  label: 'Advection Order',
                  type: 'integer',
                  size: 1,
                  default: 2,
                  help: '<p>AdvectOrder - <em>integer</em> - The order of the explicit method used in advancing the \
                  concentrations. This value can be either 1 for a standard upwind first order or 2 for a second order Godunov \
                  method.</p>'
                },
                {
                  id: 'CFL',
                  label: 'CFL Weight',
                  type: 'float',
                  size: 1,
                  default: 0.7,
                  help: '<p>CFL - <em>float</em> - The value of the weight put on the computed CFL limit before computing a global \
                  timestep value. Values greater than 1 are not suggested and in fact because this is an approximation, values \
                  slightly less than 1 can also produce instabilities.</p>'
                },
                {
                  id: 'MaxIter',
                  label: 'Maximum Iterations',
                  type: 'integer',
                  size: 1,
                  default: 1000000,
                  help: '<p>MaxIter - <em>integer</em> - The maximum number of iterations that will be allowed for time-stepping. This \
                  is to prevent a run-away simulation.</p>'
                },
                {
                  id: 'Drop',
                  label: 'Drop',
                  type: 'float',
                  size: 1,
                  default: 1e-8,
                  help: '<p>Drop - <em>float</em> - A clipping value for data written to PFSB files. Data values greater than the negative \
                  of this value and less than the value itself are treated as zero and not written to PFSB files.</p>'
                },
            ],
        },
        SolverIMPES: {
            label: 'IMPES Solver',
            parameters: [
                {
                  id: 'Linear',
                  label: 'Linear Solver',
                  type: 'integer',
                  size: 1,
                  ui: 'enum',
                  default: [2],
                  selected: 'PCG',
                  domain: {
                    'MGSemi':0,
                    'PPCG':1,
                    'PCG':2,
                    'CGHS':3,
                  },
                  help: '<p>Linear - <em>string</em> - The linear solver used for solver IMPES. Choices for this key are MGSemi, \
                  PPCG, PCG and CGHS. The choice MGSemi is an algebraic mulitgrid linear solver (not a preconditioned conjugate \
                  gradient) which may be less robust than PCG. The choice PPCG is a preconditioned conjugate gradient solver. The \
                  choice PCG is a conjugate gradient solver with a multigrid preconditioner. The choice CGHS is a conjugate \
                  gradient solver.</p>',
                },
                {
                  id: 'RelTol',
                  label: 'Relative Tolerance',
                  type: 'float',
                  size: 1,
                  default: 1.0,
                  help: '<p>RelTol - <em>float</em> - The relative tolerance for the linear solve algorithm.</p>'
                },
                {
                  id: 'AbsTol',
                  label: 'Absolute Tolerance',
                  type: 'float',
                  size: 1,
                  default: 1e-9,
                  help: '<p>AbsTol - <em>float</em> - The absolute tolerance for the linear solve algorithm.</p>'
                },
            ],
        },
        SolverRichards: {
            label: 'Richards Solver',
            parameters: [
                {
                  id: 'TerrainFollowingGrid',
                  label: 'Terrain Following Grid',
                  type: 'bool',
                  size: 1,
                  ui: 'enum',
                  default: [false],
                  selected: 'false',
                  domain: {
                    'false': false,
                    'true': true
                  },
                  help: '<p>TerrainFollowingGrid - <em>bool</em> - Specifies that a terrain-following coordinate transform is used for \
                  solver Richards. This key sets x and y subsurface slopes to be the same as the Topographic slopes (a value of False \
                  sets these subsurface slopes to zero). These slopes are used in the Darcy fluxes to add a density, gravity-dependent \
                  term.</p>',
                },
                {
                  id: 'MaxConvergencFailures',
                  label: 'Maximum Convergence Failures',
                  type: 'integer',
                  size: 1,
                  default: 3,
                  help: '<p>MaxConvergencFailures - <em>integer</em> - The maximum number of convergence failures allowed. Each \
                  convergence failure cuts the timestep in half and the solver tries to advance the solution with the reduced \
                  timestep. Note that setting this value to a value greater than 9 may result in errors in how time cycles are \
                  calculated. Time is discretized in terms of the base time unit and if the solver begins to take very small \
                  timesteps the values based on time cycles will be change at slightly incorrect times. If the problem is \
                  failing converge so poorly that a large number of restarts are required, consider setting the timestep to a \
                  smaller value.</p>'
                },
            ],
        },
        RichardsLinear: {
            label: 'Richards Linear Solver',
            parameters: [
                {
                  id: 'KrylovDimension',
                  label: 'Krylov Dimension',
                  type: 'integer',
                  size: 1,
                  default: 10,
                  help: '<p>KrylovDimension - <em>integer</em> - The maximum number of vectors to be used in setting up the Krylov \
                  subspace in the GMRES iterative solver. These vectors are of problem size and it should be noted that large \
                  increases in this parameter can limit problem sizes. However, increasing this parameter can sometimes help nonlinear \
                  solver convergence.</p>'
                },
                {
                  id: 'MaxRestarts',
                  label: 'Maximum Restarts',
                  type: 'integer',
                  size: 1,
                  default: 0,
                  help: '<p>MaxRestarts - <em>integer</em> - The number of restarts allowed to the GMRES solver. Restarts start the \
                  development of the Krylov subspace over using the current iterate as the initial iterate for the next pass.</p>'
                },
            ],
        },
        RichardsNonLinear: {
            label: 'Richards Nonlinear Solver',
            parameters: [
                {
                  id: 'VariableDz',
                  label: 'Variable Dz',
                  type: 'bool',
                  size: 1,
                  ui: 'enum',
                  default: [false],
                  selected: 'false',
                  domain: {
                    'false': false,
                    'true': true
                  },
                  help: '<p>VariableDz - <em>bool</em> - Specifies whether <em>dZ</em> multipliers are to be used, the default is \
                  False. The default indicates a false or non-active variable <em>dz</em> and each layer thickness is 1.0 [L].</p>',
                },
                {
                  id: 'ResidualTol',
                  label: 'Residual Tolerance',
                  type: 'float',
                  size: 1,
                  default: 1e-7,
                  help: '<p>ResidualTol - <em>float</em> - The tolerance that measures how much the relative reduction in the \
                  nonlinear residual should be before nonlinear iterations stop. The magnitude of the residual is measured with \
                  the <em>l<sup>1</sup></em> (max) norm.</p>'
                },
                {
                  id: 'StepTol',
                  label: 'Step Tolerance',
                  type: 'float',
                  size: 1,
                  default: 1e-7,
                  help: '<p>StepTol - <em>float</em> - The tolerance that measures how small the difference between two consecutive \
                  nonlinear steps can be before nonlinear iterations stop.</p>'
                },
                {
                  id: 'NonlinearMaxIter',
                  label: 'Maximum Iterations',
                  type: 'integer',
                  size: 1,
                  default: 15,
                  help: '<p>NonlinearMaxIter - <em>integer</em> - The maximum number of nonlinear iterations allowed before iterations stop \
                  with a convergence failure.</p>'
                },
                {
                  id: 'PrintFlag',
                  label: 'Print Flag',
                  type: 'integer',
                  size: 1,
                  ui: 'enum',
                  default: [3],
                  selected: 'HighVerbosity',
                  domain: {
                    'NoVerbosity':0,
                    'LowVerbosity':1,
                    'NormalVerbosity':2,
                    'HighVerbosity':3,
                  },
                  help: '<p>PrintFlag - <em>string</em> - The amount of informational data that is printed to the \
                  <em>*.out.kinsol.log</em> file. Choices for this key are <em>NoVerbosity</em>, <em>LowVerbosity</em>, \
                  <em>NormalVerbosity</em> and <em>HighVerbosity</em>. The choice <em>NoVerbosity</em> prints no statistics about \
                  the nonlinear convergence process. The choice <em>LowVerbosity</em> outputs the nonlinear iteration count, the \
                  scaled norm of the nonlinear function, and the number of function calls. The choice <em>NormalVerbosity</em> \
                  prints the same as for <em>LowVerbosity</em> and also the global strategy statistics. The choice \
                  <em>HighVerbosity</em> prints the same as for NormalVerbosity with the addition of further Krylov iteration \
                  statistics.</p>',
                },
                {
                  id: 'EtaChoice',
                  label: 'Eta Choice',
                  type: 'integer',
                  size: 1,
                  ui: 'enum',
                  default: [2],
                  selected: 'Walker2',
                  domain: {
                    'EtaConstant':0,
                    'Walker1':1,
                    'Walker2':2,
                  },
                  help: '<p>EtaChoice - <em>string</em> - How the linear system tolerance will be selected. The linear system is solved \
                  until a relative residual reduction of <em>&eta;</em> is achieved. Linear residuall norms are measured in the \
                  <em>l<sup>2</sup></em> norm. Choices for this key include <em>EtaConstant</em>, <em>Walker1</em> and <em>Walker2</em>. \
                  If the choice <em>EtaConstant</em> is specified, then <em>&eta;</em> will be taken as constant. The choices \
                  <em>Walker1</em> and <em>Walker2</em> specify choices for <em>&eta;</em> developed by Eisenstat and Walker. For both of \
                  the last two choices, <em>&eta;</em> is never allowed to be less than <em>1e-4</em>.</p>',
                },
                {
                  id: 'EtaValue',
                  label: 'Eta Value',
                  type: 'float',
                  size: 1,
                  default: 1e-4,
                  show: "RichardsNonLinear.EtaChoice[0] === 0",
                  help: '<p>EtaValue - <em>float</em> - The constant value of <em>&eta;</em> for the <em>EtaChoice</em> key \
                  <em>EtaConstant</em>.</p>'
                },
                {
                  id: 'EtaAlpha',
                  label: 'Eta Alpha',
                  type: 'float',
                  size: 1,
                  default: 2.0,
                  show: "RichardsNonLinear.EtaChoice[0] === 2",
                  help: '<p>EtaAlpha - <em>float</em> - The value of <em>&alpha;</em> for the case of <em>EtaChoice</em> being \
                  <em>Walker2</em>.</p>'
                },
                {
                  id: 'EtaGamma',
                  label: 'Eta Gamma',
                  type: 'float',
                  size: 1,
                  default: 0.9,
                  show: "RichardsNonLinear.EtaChoice[0] === 2",
                  help: '<p>EtaGamma - <em>float</em> - The constant value of <em>&gamma;</em> for the <em>EtaChoice</em> being \
                  <em>Walker2</em>.</p>'
                },
                {
                  id: 'UseJacobian',
                  label: 'Use Jacobian',
                  type: 'bool',
                  size: 1,
                  ui: 'enum',
                  default: [false],
                  selected: 'false',
                  domain: {
                    'false': false,
                    'true': true
                  },
                  help: '<p>UseJacobian - <em>bool</em> - Whether the Jacobian will be used in matrix-vector products or whether a \
                  matrix-free version of the code will run. Choices for this key are False and True. Using the Jacobian will most \
                  likely decrease the number of nonlinear iterations but require more memory to run.</p>',
                },
                {
                  id: 'DerivativeEpsilon',
                  label: 'DerivativeEpsilon',
                  type: 'float',
                  size: 1,
                  default: 1e-7,
                  show: "RichardsNonLinear.UseJacobian[0] === 'false'",
                  help: '<p>DerivativeEpsilon - <em>float</em> - The value of ε used in approximating the action of the Jacobian on a \
                  vector with approximate directional derivatives of the nonlinear function. This parameter is only used when the \
                  <em>UseJacobian</em> key is False.</p>'
                },
                {
                  id: 'Globalization',
                  label: 'Globalization',
                  type: 'integer',
                  size: 1,
                  ui: 'enum',
                  default: [0],
                  selected: 'LineSearch',
                  domain: {
                    'LineSearch':0,
                    'InexactNewton':1,
                  },
                  help: '<p>Globalization - <em>string</em> - The type of global strategy to use. Possible choices for this key are \
                  <em>InexactNewton</em> and <em>LineSearch</em>. The choice <em>InexactNewton</em> specifies no global strategy, and the \
                  choice <em>LineSearch</em> specifies that a line search strategy should be used where the nonlinear step can be \
                  lengthened or decreased to satisfy certain criteria.</p>',
                },
            ],
        },
        RichardsNonLinearPreconditioner: {
            label: 'Richards Nonlinear Preconditioner',
            parameters: [
            {
                  id: 'Preconditioner',
                  label: 'Preconditioner',
                  type: 'integer',
                  size: 1,
                  ui: 'enum',
                  default: [1],
                  selected: 'MGSemi',
                  domain: {
                    'NoPC':0,
                    'MGSemi':1,
                    'PFMGOctree':2,
                    'SMG':3,
                  },
                  help: '<p>Preconditioner - <em>string</em> - The preconditioner to use. Currently, the three choices are <em>NoPC</em>, \
                  <em>MGSemi</em>, <em>PFMGOctree</em> and <em>SMG</em>. The choice <em>NoPC</em> specifies that no preconditioner should \
                  be used. The choice <em>MGSemi</em> specifies a semi-coarsening multigrid algorithm which uses a point relaxation method. \
                  The choice <em>SMG</em> specifies a semi-coarsening multigrid algorithm which uses plane relaxations. This method is more \
                  robust than <em>MGSemi</em>, but generally requires more memory and compute time. The choice <em>PFMGOctree</em> can be \
                  more efficient for problems with large numbers of inactive cells.</p>',
                },
                {
                  id: 'SymmetricMat',
                  label: 'Preconditioner Matrix',
                  type: 'integer',
                  size: 1,
                  ui: 'enum',
                  default: [0],
                  selected: 'Symmetric',
                  domain: {
                    'Symmetric':0,
                    'Nonsymmetric':1,
                  },
                  help: '<p>SymmetricMat - <em>string</em> - Whether the preconditioning matrix is symmetric. Choices for this key are \
                  <em>Symmetric</em> and <em>Nonsymmetric</em>. The choice <em>Symmetric</em> specifies that the symmetric part of the \
                  Jacobian will be used as the preconditioning matrix. The choice <em>Nonsymmetric</em> specifies that the full Jacobian \
                  will be used as the preconditioning matrix. NOTE: <em>MGSemi</em> requires <em>Symmetric</em></p>',
                },
                {
                  id: 'PreconditionerMaxIter',
                  label: 'Preconditioner Maximum Iterations',
                  type: 'integer',
                  size: 1,
                  default: 1,
                  help: '<p>PreconditionerMaxIter - <em>integer</em> - The maximum number of iterations to take in solving the \
                  preconditioner system with specified preconditioning method solver.</p>'
                },
                {
                  id: 'NumPreRelax',
                  label: 'SMG Preconditioner Number of Pre-Relaxations',
                  type: 'integer',
                  size: 1,
                  default: 1,
                  show: "RichardsNonLinearPreconditioner.Preconditioner[0] === 3",
                  help: '<p>NumPreRelax - <em>integer</em> - The number of relaxations to take before coarsening in the specified \
                  preconditioner method.</p>'
                },
                {
                  id: 'NumPostRelax',
                  label: 'SMG Preconditioner Number of Post-Relaxations',
                  type: 'integer',
                  size: 1,
                  default: 1,
                  show: "RichardsNonLinearPreconditioner.Preconditioner[0] === 3",
                  help: '<p>NumPostRelax - <em>integer</em> - The number of relaxations to take after coarsening in the specified \
                  preconditioner method.</p>'
                },
            ],
        },
        EvaporationTransport: {
            label: 'Richards Evaporation Transport',
            parameters: [
                {
                  id: 'EvapTransFile',
                  label: 'Evaporation Transport File',
                  type: 'bool',
                  size: 1,
                  ui: 'enum',
                  default: [false],
                  selected: 'false',
                  domain: {
                    'false': false,
                    'true': true
                  },
                  help: '<p>EvapTransFile - <em>bool</em> - Specifies that the Flux terms for Richards’ equation are read in from \
                  a .pfb file. This file has [<em>T<sup>−1</sup></em>] units. Note this key is for a steady-state flux and should \
                  not be used in conjunction with the transient key below.</p>',
                },
                {
                  id: 'EvapTransFileTransient',
                  label: 'Evaporation Transport File Transient',
                  type: 'bool',
                  size: 1,
                  ui: 'enum',
                  default: [false],
                  selected: 'false',
                  domain: {
                    'false': false,
                    'true': true
                  },
                  help: '<p>EvapTransFileTransient - <em>bool</em> - Specifies that the Flux terms for Richards’ equation are read in \
                  from a series of flux .pfb file. Each file has [<em>T<sup>−1</sup></em>] units. Note this key should not be used with \
                  the key above, only one of these keys should be set to True at a time, not both.</p>',
                },
                {
                  id: 'EvapTransFileName',
                  label: 'Evaporation Transport File Name',
                  type: 'string',
                  size: 1,
                  show: "EvaporationTransport.EvapTransFile[0] === 'false' && EvaporationTransport.EvapTransFileTransient[0] === 'false'",
                  help: '<p>EvapTransFileName - <em>string</em> - Specifies filename for the distributed .pfb file that contains the flux \
                  values for Richards’ equation. This file has [<em>T<sup>−1</sup></em>] units. For the steady-state option ( \
                  <em>EvapTransFile=True</em> ) this key should be the complete filename. For the transient option ( \
                  <em>EvapTransFileTransient=True</em> ) then the filename is a header and ParFlow will load one file per timestep, with the \
                  form <em>filename.00000.pfb</em>.</p>'
                },
            ],
        },
        SolverOverlandFlow: {
            label: 'Overland Flow',
            parameters: [
                {
                  id: 'Patch',
                  label: 'Upper Patch',
                  typr: 'string',
                  size: 1,
                  help: '<p>Patch - <em>string</em> - The upper patch name for the domain geometry to set the boundary condition \
                  to OverlandFlow. This simulates overland flow, independently or coupled to Richards’ Equation as detailed in. \
                  The overland flow boundary condition can simulate both uniform and spatially-distributed sources, reading a \
                  distribution of fluxes from a binary file in the latter case.</p>'
                },
            ],
        },
        SolverOverlandFlowSpinUp: {
            label: 'Overland Flow Spinup',
            parameters: [
                {
                  id: 'OverlandFlowSpinUp',
                  label: 'Spinup',
                  typr: 'integer',
                  size: 1,
                  default: 0,
                  help: '<p>OverlandFlowSpinUp - <em>integer</em> - A simplified form of the overland flow boundary condition be \
                  used in place of the full equation. This formulation removes lateral flow and drives ponded water pressures to \
                  zero. While this can be helpful in spinning up the subsurface, this is no longer coupled subsurface-surface flow. \
                  If set to zero (the default) this overland flow behaves normally.</p>'
                },
                {
                  id: 'OverlandFlowSpinUpDampP1',
                  label: 'Spinup Damp P1',
                  typr: 'float',
                  size: 1,
                  default: 0.0,
                  show: "SolverOverlandFlowSpinUp.OverlandFlowSpinUp[0] !== 0",
                  help: '<p>OverlandFlowSpinUpDampP1 - <em>float</em> - Sets <em>P<sub>1</sub></em> and provides exponential dampening to \
                  the pressure relationship in the overland flow equation by adding the following term: \
                  <em>P<sub>1</sub> * exp(&psi; * P<sub>2</sub>)</em>.</p>'
                },
                {
                  id: 'OverlandFlowSpinUpDampP2',
                  label: 'Spinup Damp P2',
                  typr: 'float',
                  size: 1,
                  default: 0.0,
                  show: "SolverOverlandFlowSpinUp.OverlandFlowSpinUp[0] !== 0",
                  help: '<p>OverlandFlowSpinUpDampP2 - <em>float</em> - Sets <em>P<sub>2</sub></em> and provides exponential dampening to \
                  the pressure relationship in the overland flow equation by adding the following term: \
                  <em>P<sub>1</sub> * exp(&psi; * P<sub>2</sub>)</em>.</p>'
                },
            ],
        },
        SolverLSM: {
            label: 'LSM - Land Surface Model Solver',
            parameters: [
                {
                  id: 'LSMType',
                  label: 'LSM Type',
                  type: 'integer',
                  size: 1,
                  ui: 'enum',
                  default: [1],
                  selected: 'CLM',
                  domain: {
                    'None': 0,
                    'CLM': 1
                  },
                  help: '<p>LSM - <em>string</em> - The land surface model to use. This key is used to call LSM from within the \
                  nonlinear solver time loop and requires that the solver be set to Richards to work.</p>',
                },
                {
                  id: 'IstepStart',
                  label: 'Set istep',
                  type: 'integer',
                  size: 1,
                  default: 1,
                  show: "SolverLSM.LSMType[0] !== 0",
                  help: '<p>IstepStart - <em>integer</em> - The value of the counter, istep in CLM. This key primarily determines \
                  the start of the output counter for CLM. It is used to restart a run by setting the key to the ending step of \
                  the previous run plus one.</p>',
                },
                {
                  id: 'RootZoneNZ',
                  label: 'Root Zone NZ',
                  type: 'integer',
                  size: 1,
                  default: 10,
                  show: "SolverLSM.LSMType[0] !== 0",
                  help: '<p>RootZoneNZ - <em>integer</em> - This key sets the number of soil layers the ParFlow expects from CLM. It will allocate \
                  and format all the arrays for passing variables to and from CLM accordingly. Note that this does not set the soil layers in CLM to \
                  do that the user needs to change the value of the parameter <em>nlevsoi</em> in the file <em>clm_varpar.F90</em> in the PARFLOW DIR \
                  <em>\\pfsimulator\\clm</em> directory to reflect the desired numnber of soil layers and recompile. Most likely the key \
                  <em>Solver.CLM.SoiLayer</em>, described below, will also need to be changed.</p>'
                },
                {
                  id: 'SoilLayer',
                  label: 'Soil Layer',
                  type: 'integer',
                  size: 1,
                  default: 7,
                  show: "SolverLSM.LSMType[0] !== 0",
                  help: '<p>SoilLayer - <em>integer</em> - The soil layer, and thus the soil depth, that CLM uses for the seasonal temperature \
                  adjustment for all leaf and stem area indices.</p>'
                },
            ],
        },
        LSMMetForcing: {
            label: 'LSM Meteorological Forcing',
            parameters: [
                {
                  id: 'MetForcing',
                  label: 'Meteorological Forcing',
                  type: 'integer',
                  size: 1,
                  ui: 'enum',
                  default: [0],
                  selected: 'none',
                  domain: {
                    'none':0,
                    '1D':1,
                    '2D':2,
                    '3D':3,
                  },
                  show: "SolverLSM.LSMType[0] !== 0 && LSMMetForcing.MetForcing[0] !== 0",
                  help: '<p>MetForcing - <em>string</em> - Defining whether 1D (uniform over the domain), 2D (spatially distributed) \
                  or 3D (spatially distributed with multiple timesteps per .pfb file) meteorological forcing data is used.</p>',
                },
                {
                  id: 'ReuseCount',
                  label: 'Reuse Count',
                  type: 'integer',
                  size: 1,
                  default: 1,
                  show: "SolverLSM.LSMType[0] !== 0",
                  help: '<p>ReuseCount - <em>integer</em> - How many times to reuse a CLM atmospheric forcing file input. For example \
                  <em>timestep=1</em>, <em>reuse=1</em> is normal behavior but <em>reuse=2</em> and <em>timestep=0.5</em> subdivides \
                  the time step using the same CLM input for both halves instead of needing two files. This is particually useful for \
                  large, distributed runs when the user wants to run ParFlow at a smaller timestep than the CLM forcing. Forcing files \
                  will be re-used and total fluxes adjusted accordingly without needing duplicate files.</p>'
                },
                {
                  id: 'MetFileName',
                  label: 'Meteorological Forcing Filename',
                  type: 'string',
                  size: 1,
                  show: "SolverLSM.LSMType[0] !== 0 && LSMMetForcing.MetForcing[0] !== 0",
                  help: '<p>MetFileName - <em>string</em> - The file name for 1D, 2D or 3D forcing data. 1D meteorological forcing \
                  files are text files with single columns for each variable and each timestep per row, while 2D and 3D forcing \
                  files are distributed ParFlow binary files, one for each variable and timestep (2D) or one for each variable and \
                  multiple timesteps (3D).</p>',
                },
                {
                  id: 'MetFilePath',
                  label: 'Meteorological Forcing File Path',
                  type: 'string',
                  size: 1,
                  show: "SolverLSM.LSMType[0] !== 0 && LSMMetForcing.MetForcing[0] !== 0",
                  help: '<p>MetFilePath - <em>string</em> - The location of 1D, 2D or 3D forcing data. For 1D cases, this is the \
                  path to a single forcing file. For 2D and 3D cases, this is the path to the directory containing all forcing \
                  files.</p>',
                },
                {
                  id: 'MetFileNT',
                  label: 'Meteorological Forcing Time Steps per File',
                  type: 'integer',
                  size: 1,
                  show: "SolverLSM.LSMType[0] !== 0 && LSMMetForcing.MetForcing[0] !== 0 && LSMMetForcing.MetForcing[0] === 3",
                  help: '<p>MetFileNT - <em>integer</em> - The number of timesteps per file for 3D forcing data.</p>',
                },
                {
                  id: 'ForceVegetation',
                  label: 'Force Vegetation',
                  type: 'bool',
                  size: 1,
                  ui: 'enum',
                  default: [false],
                  selected: 'false',
                  domain: {
                    'false': false,
                    'true': true
                  },
                  show: "SolverLSM.LSMType[0] !== 0",
                  help: '<p>ForceVegetation - <em>bool</em> - Should the vegetation be forced in CLM. Currently this option only \
                  works for 1D and 3D forcings.</p>',
                },
            ],
        },
        LSMIrrigation: {
            label: 'LSM Irrigation',
            parameters: [
                {
                  id: 'IrrigationTypes',
                  label: 'Irrigation Types',
                  type: 'integer',
                  size: 1,
                  ui: 'enum',
                  default: [0],
                  selected: 'None',
                  domain: {
                    'None': 0,
                    'Spray': 1,
                    'Drip':2,
                    'Instant':3
                  },
                  show: "SolverLSM.LSMType[0] !== 0",
                  help: '<p>IrrigationTypes - <em>string</em> - The form of the irrigation in CLM.</p>',
                },
                {
                  id: 'IrrigationCycle',
                  label: 'Irrigation Cycle',
                  type: 'integer',
                  size: 1,
                  ui: 'enum',
                  default: [0],
                  selected: 'Constant',
                  domain: {
                    'Constant': 0,
                    'Deficit': 1
                  },
                  show: "SolverLSM.LSMType[0] !== 0 && SolverLSM.IrrigationTypes[0] !== 0",
                  help: '<p>IrrigationCycle - <em>string</em> - The cycle of the irrigation in CLM. The valid types for this key are \
                  <em>Constant</em>, <em>Deficit</em>. Note: Only <em>Constant</em> is currently implemented. <em>Constant</em> cycle \
                  applies irrigation each day from <em>IrrigationStartTime</em> to <em>IrrigationStopTime</em> in GMT.</p>',
                },
                {
                  id: 'IrrigationRate',
                  label: 'Irrigation Rate',
                  type: 'float',
                  size: 1,
                  show: "SolverLSM.LSMType[0] !== 0 && SolverLSM.IrrigationTypes[0] !== 0 && SolverLSM.IrrigationCycle[0] === 0",
                  help: '<p>IrrigationRate - <em>float</em> - The rate of the irrigation in CLM in [mm/s].</p>'
                },
                {
                  id: 'IrrigationStartTime',
                  label: 'Irrigation Start Time',
                  type: 'float',
                  size: 1,
                  show: "SolverLSM.LSMType[0] !== 0 && SolverLSM.IrrigationTypes[0] !== 0 && SolverLSM.IrrigationCycle[0] === 0",
                  help: '<p>IrrigationStartTime - <em>float</em> - The start time of the irrigation in CLM GMT.</p>'
                },
                {
                  id: 'IrrigationStopTime',
                  label: 'Irrigation Stop Time',
                  type: 'float',
                  size: 1,
                  show: "SolverLSM.LSMType[0] !== 0 && SolverLSM.IrrigationTypes[0] !== 0 && SolverLSM.IrrigationCycle[0] === 0",
                  help: '<p>IrrigationStopTime - <em>float</em> - The stop time of the irrigation in CLM GMT.</p>'
                },
                {
                  id: 'IrrigationThreshold',
                  label: 'Irrigation Threshold',
                  type: 'float',
                  size: 1,
                  default: 0.5,
                  show: "SolverLSM.LSMType[0] !== 0 && SolverLSM.IrrigationTypes[0] !== 0",
                  help: '<p>IrrigationThreshold - <em>float</em> - The threshold value for the irrigation in CLM.</p>'
                },
            ],
        },
        LSMWaterStress: {
            label: 'LSM Plant Water Stress',
            parameters: [
                {
                  id: 'VegWaterStress',
                  label: 'Type of Plant Water Stress',
                  type: 'integer',
                  size: 1,
                  ui: 'enum',
                  default: [1],
                  selected: 'Saturation',
                  domain: {
                    'None': 0,
                    'Saturation': 1,
                    'Pressure':2
                  },
                  show: "SolverLSM.LSMType[0] !== 0",
                  help: '<p>VegWaterStress - <em>string</em> - The form of the plant water stress function <em>&beta;<sub>t</sub></em> \
                  parameter in CLM.</p>',
                },
                {
                  id: 'WiltingPoint',
                  label: 'Wilting Point',
                  type: 'float',
                  size: 1,
                  default: 0.1,
                  show: "SolverLSM.LSMType[0] !== 0 && SolverLSM.VegWaterStress[0] !== 0",
                  help: '<p>WiltingPoint - <em>float</em> - The wilting point for the plant water stress <em>&beta;<sub>t</sub></em> \
                  function in CLM.</p>'
                },
                {
                  id: 'FieldCapacity',
                  label: 'Field Capacity',
                  type: 'float',
                  size: 1,
                  default: 1.0,
                  show: "SolverLSM.LSMType[0] !== 0 && SolverLSM.VegWaterStress[0] !== 0",
                  help: '<p>FieldCapacity - <em>float</em> - The field capacity for the plant water stress <em>&beta;<sub>t</sub></em> \
                  function in CLM.</p>'
                },
            ],
        },
        LSMEvapBeta: {
            label: 'LSM Bare Soil Evaporation',
            parameters: [
                {
                  id: 'EvapBeta',
                  label: 'Type of Bare Soil Evaporation',
                  type: 'integer',
                  size: 1,
                  ui: 'enum',
                  default: [1],
                  selected: 'Linear',
                  domain: {
                    'None': 0,
                    'Linear': 1,
                    'Cosine':2
                  },
                  show: "SolverLSM.LSMType[0] !== 0",
                  help: '<p>EvapBeta - <em>string</em> - The form of the bare soil evaporation <em>&beta;</em> parameter in CLM.</p>',
                },
                {
                  id: 'ResSat',
                  label: 'Residual Saturation',
                  type: 'float',
                  size: 1,
                  default: 0.1,
                  show: "SolverLSM.LSMType[0] !== 0 && LSMEvapBeta.EvapBeta[0] !== 0",
                  help: '<p>ResSat - <em>float</em> - The residual saturation for the bare soil evaporation <em>&beta;</em> function \
                  in CLM.</p>'
                },
            ],
        },
        SolverOutput: {
            label: 'Solver Output',
            parameters: [
                {
                  id: 'PrintSubsurf',
                  label: 'Print Subsurface',
                  type: 'bool',
                  size: 1,
                  ui: 'enum',
                  default: [true],
                  selected: 'true',
                  domain: {
                    'false': false,
                    'true': true
                  },
                  help: '<p>PrintSubsurf - <em>bool</em> - Used to turn on printing of the subsurface data, Permeability and Porosity. The data \
                  is printed after it is generated and before the main time stepping loop - only once during the run. The data is written as a \
                  PFB file.</p>',
                },
                {
                  id: 'PrintPressure',
                  label: 'Print Pressure',
                  type: 'bool',
                  size: 1,
                  ui: 'enum',
                  default: [true],
                  selected: 'true',
                  domain: {
                    'false': false,
                    'true': true
                  },
                  help: '<p>PrintPressure - <em>bool</em> - Used to turn on printing of the pressure data. The printing of the data is controlled \
                  by values in the timing information section. The data is written as a PFB file.</p>',
                },
                {
                  id: 'PrintVelocities',
                  label: 'Print Velocities',
                  type: 'bool',
                  size: 1,
                  ui: 'enum',
                  default: [false],
                  selected: 'false',
                  domain: {
                    'false': false,
                    'true': true
                  },
                  help: '<p>PrintVelocities - <em>bool</em> - Used to turn on printing of the x, y and z velocity data. The printing of the data \
                  is controlled by values in the timing information section. The data is written as a PFB file.</p>',
                },
                {
                  id: 'PrintSaturation',
                  label: 'Print Saturation',
                  type: 'bool',
                  size: 1,
                  ui: 'enum',
                  default: [true],
                  selected: 'true',
                  domain: {
                    'false': false,
                    'true': true
                  },
                  help: '<p>PrintSaturation - <em>bool</em> - Used to turn on printing of the saturation data. The printing of the data is controlled \
                  by values in the timing information section. The data is written as a PFB file.</p>',
                },
                {
                  id: 'PrintConcentration',
                  label: 'Print Concentration',
                  type: 'bool',
                  size: 1,
                  ui: 'enum',
                  default: [true],
                  selected: 'true',
                  domain: {
                    'false': false,
                    'true': true
                  },
                  help: '<p>PrintConcentration - <em>bool</em> - Used to turn on printing of the concentration data. The printing of the data is controlled \
                  by values in the timing information section. The data is written as a PFB file.</p>',
                },
                {
                  id: 'PrintWells',
                  label: 'Print Wells',
                  type: 'bool',
                  size: 1,
                  ui: 'enum',
                  default: [true],
                  selected: 'true',
                  domain: {
                    'false': false,
                    'true': true
                  },
                  help: '<p>PrintWells - <em>bool</em> - Used to turn on collection and printing of the well data. The data is collected at \
                  intervals given by values in the timing information section. Printing occurs at the end of the run when all collected data \
                  is written.</p>',
                },
            ],
        },
        LSMOutput: {
            label: 'Solver LSM Output',
            parameters: [
                {
                  id: 'PrintLSMSink',
                  label: 'Print LSM Sink',
                  type: 'bool',
                  size: 1,
                  ui: 'enum',
                  default: [false],
                  selected: 'false',
                  domain: {
                    'false': false,
                    'true': true
                  },
                  show: "SolverLSM.LSMType[0] !== 0",
                  help: '<p>PrintLSMSink - <em>bool</em> - Whether or not to turn on printing of the flux array passed from CLM to \
                  ParFlow. Printing occurs at each <em>DumpInterval</em> time.</p>',
                },
                {
                  id: 'Print1dOut',
                  label: 'Print 1D Output',
                  type: 'bool',
                  size: 1,
                  ui: 'enum',
                  default: [false],
                  selected: 'false',
                  domain: {
                    'false': false,
                    'true': true
                  },
                  show: "SolverLSM.LSMType[0] !== 0",
                  help: '<p>Print1dOut - <em>bool</em> - Whether or not to print out he CLM one dimensional (averaged over each \
                  processor) output file.</p>',
                },
                {
                  id: 'PrintCLM',
                  label: 'Print CLM PFB File',
                  type: 'integer',
                  size: 1,
                  ui: 'enum',
                  default: [0],
                  selected: 'false',
                  domain: {
                    'false': 0,
                    'true': 1
                  },
                  show: "SolverLSM.LSMType[0] !== 0",
                  help: '<p>PrintCLM - <em>bool</em> - Should the CLM writes two dimensional binary output files to a PFB binary \
                  format. </p>',
                },
                {
                  id: 'CLMFileDir',
                  label: 'CLM File Directory',
                  type: 'string',
                  size: 1,
                  show: "SolverLSM.LSMType[0] !== 0 && SolverLSM.PrintCLM[0] !== 0",
                  help: '<p>CLMFileDir - <em>string</em> - What directory all output from the CLM is written to. This directory \
                  must be created before ParFlow is run.</p>',
                },
                {
                  id: 'CLMDumpInterval',
                  label: 'CLM Dump Interval',
                  type: 'integer',
                  size: 1,
                  default: 1,
                  show: "SolverLSM.LSMType[0] !== 0 && SolverLSM.PrintCLM[0] !== 0",
                  help: '<p>CLMDumpInterval - <em>integer</em> - How often output from the CLM is written.</p>',
                },
                {
                  id: 'WriteLogs',
                  label: 'Write Logs',
                  type: 'bool',
                  size: 1,
                  ui: 'enum',
                  default: [false],
                  selected: 'false',
                  domain: {
                    'false': false,
                    'true': true
                  },
                  show: "SolverLSM.LSMType[0] !== 0",
                  help: '<p>WriteLogs - <em>bool</em> - When False, this disables writing of the CLM output log files for each processor. \
                  For example, in the clm.tcl test case, if this flag is added False, <em>washita.output.txt.p</em> and \
                  <em>washita.para.out.dat.p</em> (were <em>p</em> is the processor #) are not created, assuming washita is the run name.</p>',
                },
                {
                  id: 'WriteLastRST',
                  label: 'Write Last RST',
                  type: 'bool',
                  size: 1,
                  ui: 'enum',
                  default: [false],
                  selected: 'false',
                  domain: {
                    'false': false,
                    'true': true
                  },
                  show: "SolverLSM.LSMType[0] !== 0",
                  help: '<p>WriteLastRST - <em>bool</em> - Controls whether CLM restart files are sequentially written or whether a single \
                  file restart file <em>name.00000.p</em> is overwritten each time the restart file is output, where <em>p</em> is the \
                  processor number. If ”True” only one file is written/overwritten and if ”False” outputs are written more frequently. \
                  Compatible with <em>DailyRST</em> and <em>ReuseCount</em>; for the latter, outputs are written every <em>n</em> steps \
                  where <em>n</em> is the value of <em>ReuseCount</em>.</p>',
                },
                {
                  id: 'DailyRST',
                  label: 'Daily RST',
                  type: 'bool',
                  size: 1,
                  ui: 'enum',
                  default: [true],
                  selected: 'true',
                  domain: {
                    'false': false,
                    'true': true
                  },
                  show: "SolverLSM.LSMType[0] !== 0",
                  help: '<p>DailyRST - <em>bool</em> - Controls whether CLM writes daily restart files (default) or at every time step when \
                  set to False; outputs are numbered according to the <em>istep</em> from ParFlow. If <em>ReuseCount=n</em>, with <em>n</em> \
                  greater than 1, the output will be written every <em>n</em> steps (i.e. it still writes hourly restart files if your time \
                  step is 0.5 or 0.25, etc...). Fully compatible with <em>WriteLastRST=False</em> so that each daily output is overwritten to \
                  time 00000 in restart file <em>name.00000.p</em> where <em>p</em> is the processor number.</p>',
                },
                {
                  id: 'SingleFile',
                  label: 'Single File',
                  type: 'bool',
                  size: 1,
                  ui: 'enum',
                  default: [false],
                  selected: 'false',
                  domain: {
                    'false': false,
                    'true': true
                  },
                  show: "SolverLSM.LSMType[0] !== 0",
                  help: '<p>SingleFile - <em>bool</em> - Controls whether ParFlow writes all CLM output variables as a single file per time step. \
                  When ”True”, this combines the output of all the CLM output variables into a special multi-layer PFB with the file extension \
                  ”<em>.C.pfb</em>”. The first 13 layers correspond to the 2-D CLM outputs and the remaining layers are the soil temperatures in \
                  each layer. For example, a model with 4 soil layers will create a SingleFile CLM output with 17 layers at each time step.</p>',
                },
            ],
        },
        RelativePermeability: {
            label: 'Relative Permeability Type',
            parameters: [
                {
                  id: 'GeomName',
                  label: 'Geometry Name',
                  type: 'string',
                  size: 1,
                  help: '<p>GeomName - <em>string</em> - The geometries on which relative permeability will be given.</p>'
                },
                {
                  id: 'Type',
                  label: 'Type of Relative Permeability Function',
                  type: 'integer',
                  size: 1,
                  ui: 'enum',
                  default: [0],
                  selected: 'Constant',
                  domain: {
                    'Constant': 0,
                    'Van Genuchten by Files': 1,
                    'Van Genuchten by Region': 2,
                    'Haverkamp': 3,
                    'Data': 4,
                    'Polynomial': 5
                  },
                  help: '<p>Type - <em>string</em> - The type of relative permeability function that will be used on all specified \
                  geometries. Note that only one type of relative permeability may be used for the entire problem. However, \
                  parameters may be different for that type in different geometries.</p>',
                },
                [
                    'RelativePermeabilityConstant',
                    'RelativePermeabilityVanGenuchtenFiles',
                    'RelativePermeabilityVanGenuchtenRegion',
                    'RelativePermeabilityHaverkamp',
                    'RelativePermeabilityData',
                    'RelativePermeabilityPolynomial'
                ],
            ],
            children: {
                'RelativePermeabilityConstant':            "RelativePermeability.Type[0] === 0",
                'RelativePermeabilityVanGenuchtenFiles':   "RelativePermeability.Type[0] === 1",
                'RelativePermeabilityVanGenuchtenRegion':  "RelativePermeability.Type[0] === 2",
                'RelativePermeabilityHaverkamp':           "RelativePermeability.Type[0] === 3",
                'RelativePermeabilityData':                "RelativePermeability.Type[0] === 4",
                'RelativePermeabilityPolynomial':          "RelativePermeability.Type[0] === 5",
            }
        },
        RelativePermeabilityConstant: {
            label: 'Constant',
            parameters: [
                {
                  id: 'Value',
                  label: 'Relative Permeability',
                  type: 'float',
                  size: 1,
                  help: '<p>Value - <em>float</em> - The constant relative permeability value on the specified geometry.</p>'
                },
            ],
        },
        RelativePermeabilityVanGenuchtenFiles: {
            label: 'Van Genuchten Function by Files',
            parameters: [
                {
                  id: 'Alpha_Filename',
                  label: 'Alpha Filename',
                  type: 'string',
                  size: 1,
                  help: '<p>Alpha.Filename - <em>string</em> - The pfb filename containing the <em>&alpha;</em> parameters for the Van \
                  Genuchten function cell-by-cell.</p>'
                },
                {
                  id: 'N_Filename',
                  label: 'N Filename',
                  type: 'string',
                  size: 1,
                  help: '<p>N.Filename - <em>string</em> - The pfb filename containing the <em>N</em> parameters for the Van Genuchten \
                  function cell-by-cell.</p>'
                },
            ],
        },
        RelativePermeabilityVanGenuchtenRegion: {
            label: 'Van Genuchten Function by Region',
            parameters: [
                {
                  id: 'Alpha',
                  label: 'Alpha',
                  type: 'float',
                  size: 1,
                  help: '<p>Alpha - <em>float</em> - The <em>&alpha;</em> parameter for the Van Genuchten function specified on this \
                  geometry.</p>'
                },
                {
                  id: 'N',
                  label: 'N',
                  type: 'float',
                  size: 1,
                  help: '<p>N - <em>float</em> - The <em>N</em> parameter for the Van Genuchten function specified on this \
                  geometry.</p>'
                },
                {
                  id: 'NumSamplePoints',
                  label: 'Number of Sample Points',
                  type: 'integer',
                  default: 0,
                  size: 1,
                  help: '<p>NumSamplePoints - <em>integer</em> - The number of sample points for a spline base interpolation table \
                  for the Van Genuchten function specified on this geometry. If this number is 0 (the default) then the function \
                  is evaluated directly. Using the interpolation table is faster but is less accurate.</p>'
                },
                {
                  id: 'MinPressureHead',
                  label: 'Minimum Pressure Head',
                  type: 'integer',
                  size: 1,
                  help: '<p>MinPressureHead - <em>float</em> - The lower value for a spline base interpolation table for the Van \
                  Genuchten function specified on this geometry. The upper value of the range is 0. This value is used only when \
                  the table lookup method is used (NumSamplePoints is greater than 0).</p>'
                },
            ],
        },
        RelativePermeabilityHaverkamp: {
            label: 'Haverkamp Function',
            parameters: [
               {
                  id: 'A',
                  label: 'A',
                  type: 'float',
                  size: 1,
                  help: '<p>A - <em>float</em> - The <em>A</em> parameter for the Haverkamp relative permeability on this \
                  geometry.</p>'
                },
                {
                  id: 'Gamma',
                  label: 'Gamma',
                  type: 'float',
                  size: 1,
                  help: '<p>Gamma - <em>float</em> - The <em>&gamma;</em> parameter for the Haverkamp relative permeability on \
                  this geometry.</p>'
                },
            ],
        },
        RelativePermeabilityData: {
            label: 'Data Function',
            parameters: [
                {
                  id: 'Data',
                  label: 'Currently Unsupported',
                  type: 'string',
                  size: 1,
                  help: '<p>The Data function is currently unsupported but will later mean that data points for the \
                  relative permeability curve will be given and ParFlow will set up the proper interpolation coefficients to \
                  get values between the given data points.</p>'
                },
            ],
        },
        RelativePermeabilityPolynomial: {
            label: 'Polynomial Function',
            parameters: [
               {
                  id: 'Degree',
                  label: 'Degree',
                  type: 'integer',
                  size: 1,
                  help: '<p>Degree - <em>integer</em> - The degree of the polynomial for the Polynomial relative permeability \
                  given on this geometry.</p>'
                },
                {
                  id: 'Coeff',
                  label: 'Numberberth and Coefficient',
                  ui: 'map',
                  help: '<p>A Numberberth and A Coefficient map - <em>(integer,float)</em> - The <em>coeff_numberth</em> \
                  coefficient of the Polynomial relative permeability given on this geometry.</p>'
                },
            ],
        },
        PhaseSource: {
            label: 'Phase Source',
            parameters: [
                {
                  id: 'PhaseName',
                  type: 'string',
                  size: 1,
                  label: 'Phase Name',
                  help: '<p>PhaseName - <em>string</em> - The phase name.</p>'
                },
                {
                  id: 'Type',
                  label: 'Type of Phase Source',
                  type: 'integer',
                  size: 1,
                  ui: 'enum',
                  default: [0],
                  selected: 'Constant',
                  domain: {
                    'Constant': 0,
                    'PredefinedFunction': 1,
                  },
                  help: '<p>Type - <em>string</em> - The type of source to use for phase, phase name. Possible values for this key are \
                  <em>Constant</em> and <em>PredefinedFunction</em>. <em>Constant</em> type phase sources specify a constant phase source \
                  value for a given set of regions. <em>PredefinedFunction</em> type phase sources use a preset function (choices are listed \
                  below) to specify the source. Note that the <em>PredefinedFunction</em> type can only be used to set a single source over the \
                  entire domain and not separate sources over different regions.</p>',
                },
                [
                    'PhaseSourceConstant',
                    'PhaseSourcePredefinedFunction',
                ],
            ],
            children: {
                'PhaseSourceConstant':                "PhaseSource.Type[0] === 0",
                'PhaseSourcePredefinedFunction':      "PhaseSource.Type[0] === 1",
            }
        },
        PhaseSourceConstant: {
            label: 'Phase Source Constant',
            parameters: [
                {
                  id: 'GeomNames',
                  type: 'string',
                  layout: '-1',
                  label: 'Geometry Names',
                  help: '<p>GeomNames - <em>string</em> - The names of the geometries on which source terms will be specified. This is used only \
                  for <em>Constant</em> type phase sources.</p>'
                },
                {
                  id: 'Value',
                  label: 'Value',
                  type: 'float',
                  size: 1,
                  help: '<p>Value - <em>float</em> - The value of a constant source term applied to phase, phase name, on geometry, geom name.</p>'
                },
            ],
        },
        PhaseSourcePredefinedFunction: {
            label: 'Phase Source Predefined Function',
            parameters: [
                {
                  id: 'PredefinedFunction',
                  label: 'Type of Predefined Function',
                  type: 'integer',
                  size: 1,
                  ui: 'enum',
                  default: [0],
                  selected: 'X',
                  domain: {
                    'X': 0,
                    'XPlusYPlusZ': 1,
                    'X3Y2PlusSinXYPlus1': 2,
                    'X3Y4PlusX2PlusSinXYCosYPlus1': 3,
                    'XYZTPlus1': 4,
                    'XYZTPlus1PermTensor': 5,
                  },
                  help: '<p>PredefinedFunction - <em>string</em> - specifies which of the predefined functions will be used for the source. \
                  Possible values for this key are <em>X</em>, <em>XPlusYPlusZ</em>, <em>X3Y2PlusSinXYPlus1</em>, \
                  <em>X3Y4PlusX2PlusSinXYCosYPlus1</em>, <em>XYZTPlus1</em> and <em>XYZTPlus1PermTensor</em>. <em>X</em>: <em>source=0.0</em>. \
                  <em>XPlusYPlusX</em>: <em>source=0.0</em>. <em>X3Y2PlusSinXYPlus1</em>: \
                  <em>source=−(3x<sup>2</sup>y<sup>2</sup>+ycos(xy))<sup>2</sup>−(2x<sup>3</sup>y+xcos(xy))<sup>2</sup>−\
                  (x<sup>3</sup>y<sup>2</sup>+sin(xy)+1)(6xy<sup>2</sup>+2x<sup>3</sup>−(x<sup>2</sup>+y<sup>2</sup>)sin(xy))</em>. This corresponds \
                  to <em>p=x<sup>3</sup>y<sup>2</sup>+sin(xy)+1</em> in the problem <em>−&nabla;&#8729;(p&nabla;p)=f</em>. \
                  <em>X3Y4PlusX2PlusSinXYCosYPlus1</em>: <em>source=−(3x<sup>2</sup>2y<sup>4</sup>+2x+ycos(xy)cos(y))<sup>2</sup>−\
                  (4x<sup>3</sup>y<sup>3</sup>+xcos(xy)cos(y)−sin(xy)sin(y))<sup>2</sup>−(x<sup>3</sup>y<sup>4</sup>+x<sup>2</sup>+sin(xy)cos(y)\
                  +1)(6xy<sup>4</sup>+2−(x<sup>2</sup>+y<sup>2</sup>+1)sin(xy)cos(y)+12x<sup>3</sup>y<sup>2</sup>−2xcos(xy)sin(y))</em>. This \
                  corresponds to <em>p=x3y4 +x2 +sin(xy)cos(y)+1</em> in the problem <em>−&nabla;&#8729;(p&nabla;p)=f</em>. <em>XYZTPlus1</em>: \
                  <em>source = xyz − t<sup>2</sup>(x<sup>2</sup>y<sup>2</sup>+x<sup>2</sup>z<sup>2</sup>+y<sup>2</sup>z<sup>2</sup>)</em>. \
                  This corresponds to <em>p=xyzt+1</em> in the problem <em>&part;p&#8725;&part;t−&nabla;&#8729;(p&nabla;p)=f</em>. \
                  <em>XYZTPlus1PermTensor</em>: <em>source=xyz−t<sup>2</sup>(3x<sup>2</sup>y<sup>2</sup>+2x<sup>2</sup>z<sup>2</sup>+\
                  y<sup>2</sup>z<sup>2</sup>)</em>. This corresponds to <em>p=xyzt+1</em> in the problem <em>&part;p&#8725;&part;t−&nabla;\
                  &#8729;(Kp&nabla;p)=f</em>, where <em>K=diag(1 2 3)</em>.</p>',
                },
            ],
        },
        CapillaryPressures: {
            label: 'Capillary Pressures',
            parameters: [
                {
                  id: 'PhaseName',
                  label: 'Phase Name',
                  type: 'string',
                  size: 1,
                  help: '<p>PhaseName - <em>string</em> - The phase name.</p>'
                },
                {
                  id: 'Type',
                  label: 'Type of Capillary Pressures',
                  type: 'integer',
                  size: 1,
                  ui: 'enum',
                  default: [0],
                  selected: 'Constant',
                  domain: {
                    'Constant': 0,
                  },
                  help: '<p>Type - <em>string</em> - The capillary pressure between phase 0 and the named phase, phase name. The only choice \
                  available is <em>Constant</em> which indicates that a constant capillary pressure exists between the phases.</p>',
                },
                [
                    'CapillaryPressuresConstant',
                ],
            ],
            children: {
                'CapillaryPressuresConstant':       "CapillaryPressures.Type[0] === 0",
            }
        },
        CapillaryPressuresConstant: {
            label: 'Capillary Pressures Constant',
            parameters: [
                {
                  id: 'GeomNames',
                  type: 'string',
                  layout: '-1',
                  label: 'Geometry Names',
                  help: '<p>GeomNames - <em>string</em> - Specifies the geometries that capillary pressures will be computed for in the named \
                  phase, phase name. Regions listed later “overlay” regions listed earlier. Any geometries not listed will be assigned \
                  <em>0.0</em> capillary pressure by ParFlow.</p>'
                },
                {
                  id: 'Value',
                  label: 'Value',
                  type: 'float',
                  size: 1,
                  help: '<p>Value - <em>float</em> - The value of the capillary pressure in the named geometry, geometry name, for the named \
                  phase, phase name.</p>'
                },
            ],
        },
        Saturation: {
            label: 'Saturation Type',
            parameters: [
                {
                  id: 'GeomName',
                  label: 'Geometry Name',
                  type: 'string',
                  size: 1,
                  help: '<p>GeomName - <em>string</em> - The geometries on which saturation will be given.</p>'
                },
                {
                  id: 'Type',
                  label: 'Type of Saturation Function',
                  type: 'integer',
                  size: 1,
                  ui: 'enum',
                  default: [0],
                  selected: 'Constant',
                  domain: {
                    'Constant': 0,
                    'Van Genuchten by Files': 1,
                    'Van Genuchten by Region': 2,
                    'Haverkamp': 3,
                    'Data': 4,
                    'Polynomial': 5,
                    'PFBFile': 6
                  },
                  help: '<p>Type - <em>string</em> - The type of saturation function that will be used on all specified \
                  geometries. Note that only one type of saturation may be used for the entire problem. However, parameters \
                  may be different for that type in different geometries.</p>',
                },
                [
                    'SaturationConstant',
                    'SaturationVanGenuchtenFiles',
                    'SaturationVanGenuchtenRegion',
                    'SaturationHaverkamp',
                    'SaturationData',
                    'SaturationPolynomial',
                    'SaturationPFBFile'
                ],
            ],
            children: {
                'SaturationConstant':            "Saturation.Type[0] === 0",
                'SaturationVanGenuchtenFiles':   "Saturation.Type[0] === 1",
                'SaturationVanGenuchtenRegion':  "Saturation.Type[0] === 2",
                'SaturationHaverkamp':           "Saturation.Type[0] === 3",
                'SaturationData':                "Saturation.Type[0] === 4",
                'SaturationPolynomial':          "Saturation.Type[0] === 5",
                'SaturationPFBFile':             "Saturation.Type[0] === 6",
            }
        },
        SaturationConstant: {
            label: 'Constant',
            parameters: [
                {
                  id: 'Value',
                  label: 'Saturation',
                  type: 'float',
                  size: 1,
                  help: '<p>Value - <em>float</em> - The constant saturation value on the specified geometry.</p>'
                },
            ],
        },
        SaturationVanGenuchtenFiles: {
            label: 'Van Genuchten Function by Files',
            parameters: [
                {
                  id: 'Alpha_Filename',
                  label: 'Alpha Filename',
                  type: 'string',
                  size: 1,
                  help: '<p>Alpha.Filename - <em>string</em> - The pfb filename containing the <em>&alpha;</em> parameters for the Van \
                  Genuchten function cell-by-cell.</p>'
                },
                {
                  id: 'N_Filename',
                  label: 'N Filename',
                  type: 'string',
                  size: 1,
                  help: '<p>N.Filename - <em>string</em> - The pfb filename containing the <em>N</em> parameters for the Van Genuchten \
                  function cell-by-cell.</p>'
                },
                {
                  id: 'SRes_Filename',
                  label: 'SRes Filename',
                  type: 'string',
                  size: 1,
                  help: '<p>SRes.Filename - <em>string</em> - The pfb filename containing the <em>SRes</em> parameters for the Van Genuchten \
                  function cell-by-cell.</p>'
                },
                {
                  id: 'SSat_Filename',
                  label: 'SSat Filename',
                  type: 'string',
                  size: 1,
                  help: '<p>SSat.Filename - <em>string</em> - The pfb filename containing the <em>SSat</em> parameters for the Van Genuchten \
                  function cell-by-cell.</p>'
                },
            ],
        },
        SaturationVanGenuchtenRegion: {
            label: 'Van Genuchten Function by Region',
            parameters: [
                {
                  id: 'Alpha',
                  label: 'Alpha',
                  type: 'float',
                  size: 1,
                  help: '<p>Alpha - <em>float</em> - The <em>&alpha;</em> parameter for the Van Genuchten function specified on this \
                  geometry.</p>'
                },
                {
                  id: 'N',
                  label: 'N',
                  type: 'float',
                  size: 1,
                  help: '<p>N - <em>float</em> - The <em>N</em> parameter for the Van Genuchten function specified on this \
                  geometry.</p>'
                },
                {
                  id: 'SRes',
                  label: 'Residual Saturation',
                  type: 'float',
                  size: 1,
                  help: '<p>SRes - <em>float</em> - The residual saturation on this geometry.</p>'
                },
                {
                  id: 'SSat',
                  label: 'Saturation at Saturated Conditions',
                  type: 'float',
                  size: 1,
                  help: '<p>SSat - <em>float</em> - The saturation at saturated conditions on this geometry.</p>'
                },
            ],
        },
        SaturationHaverkamp: {
            label: 'Haverkamp Function',
            parameters: [
               {
                  id: 'A',
                  label: 'A',
                  type: 'float',
                  size: 1,
                  help: '<p>A - <em>float</em> - The <em>A</em> parameter for the Haverkamp saturation on this geometry.</p>'
                },
                {
                  id: 'Gamma',
                  label: 'Gamma',
                  type: 'float',
                  size: 1,
                  help: '<p>Gamma - <em>float</em> - The <em>&gamma;</em> parameter for the Haverkamp saturation on this geometry.</p>'
                },
            ],
        },
        SaturationData: {
            label: 'Data Function',
            parameters: [
                {
                  id: 'Data',
                  label: 'Currently Unsupported',
                  type: 'string',
                  size: 1,
                  help: '<p>The Data function is currently unsupported but will later mean that data points for the \
                  saturatioin curve will be given and ParFlow will set up the proper interpolation coefficients to \
                  get values between the given data points.</p>'
                },
            ],
        },
        SaturationPolynomial: {
            label: 'Polynomial Function',
            parameters: [
               {
                  id: 'Degree',
                  label: 'Degree',
                  type: 'integer',
                  size: 1,
                  help: '<p>Degree - <em>integer</em> - The degree of the polynomial for the Polynomial saturation \
                  given on this geometry.</p>'
                },
                {
                  id: 'Coeff',
                  label: 'Numberberth and Coefficient',
                  ui: 'map',
                  help: '<p>A Numberberth and A Coefficient map - <em>(integer,float)</em> - The <em>coeff_numberth</em> \
                  coefficient of the Polynomial saturation given on this geometry.</p>'
                },
            ],
        },
        SaturationPFBFile: {
            label: 'Saturation PFB File',
            parameters: [
               {
                  id: 'Saturation_FileName',
                  label: 'Saturation FileName',
                  type: 'string',
                  size: 1,
                  help: '<p>Saturation_FileName - <em>string</em> - The name of the file containing saturation values for the domain.</p>'
                },
            ],
        },
        InternalBoundaryConditions: {
            label: 'Internal Boundary Conditions',
            parameters: [
                {
                  id: 'Names',
                  type: 'string',
                  size: 1,
                  label: 'Names',
                  help: '<p>Names - <em>string</em> - specifies the names for the internal boundary conditions. At each named point, <em>x</em>, \
                  <em>y</em> and <em>z</em> will specify the coordinate locations and <em>h</em> will specify the hydraulic head value of the \
                  condition. This real location is “snapped” to the nearest gridpoint in ParFlow. Currently, ParFlow assumes that internal \
                  boundary conditions and pressure wells are separated by at least one cell from any external boundary. The user should be \
                  careful of this when defining the input file and grid.</p>'
                },
                {
                  id: 'Coordinate',
                  label: 'X, Y, and Z Coordinate',
                  type: 'float',
                  size: 3,
                  help: '<p>Coordinate - <em>float</em> - Specifies the <em>x</em>, <em>y</em>, <em>z</em>-coordinate, x, of the named, internal \
                  boundary condition name, condition.</p>'
                },
                {
                  id: 'Value',
                  label: 'Value',
                  type: 'float',
                  size: 1,
                  help: '<p>Value - <em>float</em> - The value of the named, internal boundary condition name, condition.</p>'
                },
            ],
        },
        PressureBoundaryConditions: {
            label: 'Pressure Boundary Conditions',
            parameters: [
                {
                  id: 'PatchNames',
                  type: 'string',
                  layout: '-1',
                  label: 'Patch Names',
                  help: '<p>PatchNames - <em>string</em> - The names of patches on which pressure boundary conditions will be specified. Note \
                  that these must all be patches on the external boundary of the domain and these patches must <em>cover</em> that external \
                  boundary.</p>'
                },
                {
                  id: 'Cycle',
                  label: 'Cycle',
                  type: 'string',
                  size: 1,
                  help: '<p>Cycle - <em>string</em> - The time cycle to which boundary condition data for patch, patch name, corresponds.</p>'
                },
                {
                  id: 'Type',
                  label: 'Type of Pressure Boundary Condition',
                  type: 'integer',
                  size: 1,
                  ui: 'enum',
                  default: [0],
                  selected: 'None',
                  domain: {
                    'None': 0,
                    'DirEquilRefPatch': 1,
                    'DirEquilPLinear': 2,
                    'FluxConst': 3,
                    'FluxVolumetric': 4,
                    'PressureFile':  5,
                    'FluxFile': 6,
                    'OverlandFow': 7,
                    'OverlandFlowPFB': 8,
                    'ExactSolution': 9,
                  },
                  help: '<p>Type - <em>string</em> - The type of boundary condition data given for patch, patch name. Possible values are \
                  <em>DirEquilRefPatch</em>, <em>DirEquilPLinear</em>, <em>FluxConst</em>, <em>FluxVolumetric</em>, <em>PressureFile</em>, \
                  <em>FluxFile</em>, <em>OverlandFow</em>, <em>OverlandFlowPFB</em> and <em>ExactSolution</em>. The choice \
                  <em>DirEquilRefPatch</em> specifies that the pressure on the specified patch will be in hydrostatic equilibrium with a \
                  constant reference pressure given on a reference patch. The choice <em>DirEquilPLinear</em> specifies that the pressure on the \
                  specified patch will be in hydrostatic equilibrium with pressure given along a piecewise line at elevation <em>z&equals;0</em>. \
                  The choice <em>FluxConst</em> defines a constant normal flux boundary condition through the domain patch. This flux must be \
                  specified in units of <em>[L]/[T]</em>. For Richards’ equation, fluxes must be specified as a mass flux and given as the above \
                  flux multiplied by the density. Thus, this choice of input type for a Richards’ equation problem has units of \
                  <em>([L]/[T])([M]/[L]<sup>3</sup>)</em>. The choice <em>FluxVolumetric</em> defines a volumetric flux boundary condition \
                  through the domain patch. The units should be consistent with all other user input for the problem. For Richards’ equation \
                  fluxes must be specified as a mass flux and given as the above flux multiplied by the density. The choice <em>PressureFile</em> \
                  defines a hydraulic head boundary condition that is read from a properly distributed .pfb file. Only the values needed for the \
                  patch are used. The choice <em>FluxFile</em> defines a flux boundary condition that is read form a properly distributed .pfb \
                  file defined on a grid consistent with the pressure field grid. Only the values needed for the patch are used. The choices \
                  <em>OverlandFow</em> and <em>OverlandFlowPFB</em> both turn on fully-coupled overland flow routing. The key \
                  <em>OverlandFow</em> corresponds to a Value key with a positive or negative value, to indicate uniform fluxes (such as \
                  rainfall or evapotranspiration) over the entire domain while the key <em>OverlandFlowPFB</em> allows a .pfb file to contain \
                  grid-based, spatially-variable fluxes. The choice <em>ExactSolution</em> specifies that an exact known solution is to be \
                  applied as a Dirichlet boundary condition on the respective patch. Note that this does not change according to any cycle. \
                  Instead, time dependence is handled by evaluating at the time the boundary condition value is desired. The solution is \
                  specified by using a predefined function. NOTE: These last three types of boundary condition input is for Richards’ equation \
                  cases only!</p>',
                },
                [
                    'PressureBCDirEquilRefPatch',
                    'PressureBCDirEquilPLinear',
                    'PressureBCFluxConst',
                    'PressureBCFluxVolumetric',
                    'PressureBCPressureFile',
                    'PressureBCFluxFile',
                    'PressureBCOverlandFow',
                    'PressureBCOverlandFlowPFB',
                    'PressureBCExactSolution',
                ],
            ],
            children: {
                'PressureBCDirEquilRefPatch': "PressureBoundaryCondition.Type[0] === 1",
                'PressureBCDirEquilPLinear':  "PressureBoundaryCondition.Type[0] === 2",
                'PressureBCFluxConst':        "PressureBoundaryCondition.Type[0] === 3",
                'PressureBCFluxVolumetric':   "PressureBoundaryCondition.Type[0] === 4",
                'PressureBCPressureFile':     "PressureBoundaryCondition.Type[0] === 5",
                'PressureBCFluxFile':         "PressureBoundaryCondition.Type[0] === 6",
                'PressureBCOverlandFow':      "PressureBoundaryCondition.Type[0] === 7",
                'PressureBCOverlandFlowPFB':  "PressureBoundaryCondition.Type[0] === 8",
                'PressureBCExactSolution':    "PressureBoundaryCondition.Type[0] === 9",
            }
        },
        PressureBCDirEquilRefPatch: {
            label: 'Hydrostatic Equilibrium on a Reference Patch',
            parameters: [
                {
                  id: 'RefGeom',
                  label: 'RefGeom',
                  type: 'string',
                  size: 1,
                  help: '<p>RefGeom - <em>string</em> - The name of the solid on which the reference patch for the <em>DirEquilRefPatch</em> \
                  boundary condition data is given. Care should be taken to make sure the correct solid is specified in cases of layered \
                  domains.</p>'
                },
                {
                  id: 'RefPatch',
                  label: 'RefPatch',
                  type: 'string',
                  size: 1,
                  help: '<p>RefPatch - <em>string</em> - The reference patch on which the <em>DirEquilRefPatch</em> boundary condition data is \
                  given. This patch must be on the reference solid specified by the <em>RefGeom</em> key.</p>'
                },
                {
                  id: 'Value',
                  label: 'Value',
                  type: 'float',
                  size: 1,
                  help: '<p>Value - <em>float</em> - The reference pressure value for the <em>DirEquilRefPatch</em> boundary condition or the \
                  constant flux value for the <em>FluxConst</em> boundary condition, or the constant volumetric flux for the \
                  <em>FluxVolumetric</em> boundary condition.</p>'
                },
                {
                  id: 'IntValue',
                  label: 'IntValue',
                  type: 'float',
                  size: 1,
                  help: '<p>IntValue - <em>float</em> - The constant pressure value along the interface with phase, phase name, for cases with \
                  two phases present. Note that the reference conditions for types <em>DirEquilPLinear</em> and <em>DirEquilRefPatch</em> \
                  boundary conditions are for phase 0 only.</p>'
                },
            ],
        },
        PressureBCDirEquilPLinear: {
            label: 'Hydrostatic Equilibrium Along a Piecewise Line ',
            parameters: [
                {
                  id: 'IntValue',
                  label: 'IntValue',
                  type: 'float',
                  size: 1,
                  help: '<p>IntValue - <em>float</em> - The constant pressure value along the interface with phase, phase name, for cases with \
                  two phases present. Note that the reference conditions for types <em>DirEquilPLinear</em> and <em>DirEquilRefPatch</em> \
                  boundary conditions are for phase 0 only.</p>'
                },
                {
                  id: 'Lower',
                  label: 'Lower (X,Y) Point',
                  type: 'float',
                  size: 2,
                  help: '<p>Lower - <em>(float,float)</em> - The lower <em>x</em>, <em>y</em> coordinates of a line in the \
                  <em>xy</em>-plane.</p>'
                },
                {
                  id: 'Upper',
                  label: 'Upper (X,Y) Point',
                  type: 'float',
                  size: 2,
                  help: '<p>Upper - <em>(float,float)</em> - The upper <em>x</em>, <em>y</em> coordinates of a line in the \
                  <em>xy</em>-plane.</p>'
                },
                {
                  id: 'NumPoints',
                  label: 'Number of Points',
                  type: 'integer',
                  size: 1,
                  help: '<p>NumPoints - <em>integer</em> - The number of points on which pressure data is given along the line used in the \
                  type <em>DirEquilPLinear</em> boundary conditions.</p>'
                },
                {
                  id: 'LocationValue',
                  label: 'Location and Value',
                  ui: 'map',
                  layout: -1,
                  help: '<p>LocationValue - <em>(flaot,float)</em> - For the <em>location</em> enter a number between <em>0</em> and <em>1</em> \
                  which represents the location of a point on the line on which data is given for type <em>DirEquilPLinear</em> boundary \
                  conditions. Here 0 corresponds to the lower end of the line, and 1 corresponds to the upper end. The pressure value for phase \
                  0 at point number, <em>location</em>, and <em>z&equals;0</em> for type <em>DirEquilPLinear</em> boundary conditions. All \
                  pressure values on the patch are determined by first projecting the boundary condition coordinate onto the line, then linearly \
                  interpolating between the neighboring point pressure values on the line.</p>'
                },
            ],
        },
        PressureBCFluxConst: {
            label: 'Constant Normal Flux',
            parameters: [
                {
                  id: 'Value',
                  label: 'Value',
                  type: 'float',
                  size: 1,
                  help: '<p>Value - <em>float</em> - The reference pressure value for the <em>DirEquilRefPatch</em> boundary condition or the \
                  constant flux value for the <em>FluxConst</em> boundary condition, or the constant volumetric flux for the \
                  <em>FluxVolumetric</em> boundary condition.</p>'
                },
            ],
        },
        PressureBCFluxVolumetric: {
            label: 'Volumetric Flux ',
            parameters: [
                {
                  id: 'Value',
                  label: 'Value',
                  type: 'float',
                  size: 1,
                  help: '<p>Value - <em>float</em> - The reference pressure value for the <em>DirEquilRefPatch</em> boundary condition or the \
                  constant flux value for the <em>FluxConst</em> boundary condition, or the constant volumetric flux for the \
                  <em>FluxVolumetric</em> boundary condition.</p>'
                },
            ],
        },
        PressureBCPressureFile: {
            label: 'Hydrostatic Equilibrium on a Reference Patch',
            parameters: [
                {
                  id: 'FileName',
                  label: 'FileName',
                  type: 'string',
                  size: 1,
                  help: '<p>FileName - <em>string</em> - The name of a properly distributed .pfb file that contains boundary data to be read for \
                  types <em>PressureFile</em> and <em>FluxFile</em>. For flux data, the data must be defined over a grid consistent with the \
                  pressure field. In both cases, only the values needed for the patch will be used. The rest of the data is ignored.</p>'
                },
            ],
        },
        PressureBCExactSolution: {
            label: 'Hydrostatic Equilibrium on a Reference Patch',
            parameters: [
                {
                  id: 'FileName',
                  label: 'FileName',
                  type: 'string',
                  size: 1,
                  help: '<p>FileName - <em>string</em> - The name of a properly distributed .pfb file that contains boundary data to be read for \
                  types <em>PressureFile</em> and <em>FluxFile</em>. For flux data, the data must be defined over a grid consistent with the \
                  pressure field. In both cases, only the values needed for the patch will be used. The rest of the data is ignored.</p>'
                },
            ],
        },
        PressureBCOverlandFow: {
            label: 'Hydrostatic Equilibrium on a Reference Patch',
            parameters: [
            ],
        },
        PressureBCOverlandFowPFB: {
            label: 'Hydrostatic Equilibrium on a Reference Patch',
            parameters: [
            ],
        },
        PressureBCExactSolution: {
            label: 'Hydrostatic Equilibrium on a Reference Patch',
            parameters: [
                {
                  id: 'PredefinedFunction',
                  label: 'Predefined Function',
                  type: 'integer',
                  size: 1,
                  ui: 'enum',
                  default: [0],
                  selected: 'None',
                  domain: {
                    'None': 0,
                    'X': 1,
                    'XPlusYPlusZ': 2,
                    'X3Y2PlusSinXYPlus1': 3,
                    'X3Y4PlusX2PlusSinXYCosYPlus1': 4,
                    'XYZTPlus1': 5,
                    'XYZTPlus1PermTensor': 6,
                  },
                  help: '<p>PredefinedFunction - <em>string</em> - Specifies the predefined function that will be used to specify Dirichlet \
                  boundary conditions on patch, patch name. Note that this does not change according to any cycle. Instead, time dependence \
                  is handled by evaluating at the time the boundary condition value is desired. Choices for this key include <em>X</em>, \
                  <em>XPlusYPlusZ</em>, <em>X3Y2PlusSinXYPlus1</em>, <em>X3Y4PlusX2PlusSinXYCosYPlus1</em>, <em>XYZTPlus1</em> and \
                  <em>XYZTPlus1PermTensor</em>. The choices for this key correspond to pressures as follows. <em>X</em>: <em>p&equals;x</em>, \
                  <em>XPlusYPlusZ</em>: <em>pequals;x&plus;y&plus;z</em>, <em>X3Y2PlusSinXYPlus1</em>: \
                  <em>p&equals;x<sup>3</sup>y<sup>2</sup>&plus;sin(xy)&plus;1</em>, <em>X3Y4PlusX2PlusSinXYCosYPlus1</em>: \
                  <em>p&equals;x<sup>3</sup>y<sup>4</sup>&plus;x<sup>2</sup>&plus;sin(xy)cos(y)&plus;1 </em>, <em>XYZTPlus1</em>: \
                  <em>p&equals;xyzt&plus;1</em>, and <em>XYZTPlus1PermTensor</em>: <em>p&equals;xyzt&plus;1</em>.</p>'
                },
            ],
        },
        soil: {
            label: 'Soil definition',
            parameters: [
                {
                  id: 'name',
                  type: 'string',
                  size: 1,
                  label: 'Name',
                  default: 'Soil',
                },
                {
                  id: 'color',
                  propType: 'Color',
                  label: 'Associated color',
                  default: [204 / 255, 235 / 255, 197 / 255],
                  domain: {
                     palette: soilPalette,
                  },
                },
                {
                  id: 'porosity',
                  type: 'float',
                  size: 1,
                  label: 'Porosity',
                },
                {
                  id: 'permeability',
                  type: 'float',
                  size: 1,
                  label: 'Permeability',
                },
                {
                  id: 'relativePermAlpha',
                  type: 'float',
                  size: 1,
                  label: 'Relative Permeability - Alpha',
                },
                {
                  id: 'relativePermN',
                  type: 'float',
                  size: 1,
                  label: 'Relative Permeability - N',
                },
                {
                  id: 'saturationAlpha',
                  type: 'float',
                  size: 1,
                  label: 'Saturation - Alpha',
                },
                {
                  id: 'saturationN',
                  type: 'float',
                  size: 1,
                  label: 'Saturation - N',
                },
                {
                  id: 'saturationSRes',
                  type: 'float',
                  size: 1,
                  label: 'Saturation - Residual Saturation',
                },
                {
                  id: 'saturationSSat',
                  type: 'float',
                  size: 1,
                  label: 'Saturation - Saturation at Saturated',
                },
            ],
        },
    },
};