module.exports = {
  // 0.orig/include/initialConditions
  initialConditions: {
    flowVelocity: [20, 0, 0],
    pressure: 0,
    turbulentKE: 0.24,
    turbulentOmega: 1.78,
  },

  // 0.orig/*
  // system/snappyHexMeshDict
  meshGroupName: 'motorBikeGroup',

  // 0.orig/k
  k: {
    dimensions: [0, 2, -2, 0, 0, 0, 0],
  },
  // 0.orig/nut
  nut: {
    dimensions: [0, 2, -1, 0, 0, 0, 0],
  },
  // 0.orig/omega
  omega: {
    dimensions: [0, 0, -1, 0, 0, 0, 0],
  },
  // 0.orig/p
  p: {
    dimensions: [0, 2, -2, 0, 0, 0, 0],
  },
  // 0.orig/U
  U: {
    dimensions: [0, 1, -1, 0, 0, 0, 0],
    inletValue: [0, 0, 0],
  },

  // constant/transportProperties
  transport: {
    model: 'Newtonian',
    nu: {
      dimensions: [0, 2, -1, 0, 0, 0, 0],
      epsilon: 1.5e-05,
    },
  },

  // system/blockMeshDict
  tunnel: {
    bounds: [
      -5, 15,
      -4, 4,
      0, 8,
    ],
    walls: {
      x: {
        plus: 'outlet',
        minus: 'inlet',
      },
      y: {
        plus: 'rightWall',
        minus: 'leftWall',
      },
      z: {
        plus: 'topWall',
        minus: 'bottomWall',
      },
    },
  },

  // system/controlDict
  controls: {
    startTime: 0,
    endTime: 500,
    deltaT: 1,
    writeControl: 'timeStep',
    writeInterval: 100,
    purgeWrite: 0,
    writeFormat: 'binary',
    writePrecision: 6,
    writeCompression: 'uncompressed',
    timeFormat: 'general',
    timePrecision: 6,
    runTimeModifiable: 'true',
  },

  // system/decomposeParDict
  decompose: {
    numberOfSubdomains: 6,
    method: 'hierarchical', // ptscotch
    simpleCoeffs: {
      n: [4, 1, 1],
      delta: 0.001,
    },
    hierarchicalCoeffs: {
      n: [3, 2, 1],
      delta: 0.001,
      order: 'xyz',
    },
  },

  // system/forceCoeffs
  forceCoeffs: {
    writeControl: 'timeStep',
    timeInterval: 1,
    log: 'yes',
    patches: ['motorBikeGroup'],
    liftDir: [0, 0, 1],
    dragDir: [1, 0, 0],
    CofR: [0.72, 0, 0],  // Axle midpoint on ground
    pitchAxis: [0, 1, 0],
    magUInf: 20,
    lRef: 1.42,        // Wheelbase length
    Aref: 0.75,        // Estimated
  },

  // system/fvSolution
  solvers: {
    p: {
      solver: 'GAMG',
      tolerance: 1e-7,
      relTol: 0.01,
      smoother: 'GaussSeidel',
    },
    U: {
      solver: 'smoothSolver',
      smoother: 'GaussSeidel',
      tolerance: 1e-8,
      relTol: 0.1,
      nSweeps: 1,
    },
    k: {
      solver: 'smoothSolver',
      smoother: 'GaussSeidel',
      tolerance: 1e-8,
      relTol: 0.1,
      nSweeps: 1,
    },
    omega: {
      solver: 'smoothSolver',
      smoother: 'GaussSeidel',
      tolerance: 1e-8,
      relTol: 0.1,
      nSweeps: 1,
    },
    correctors: {
      simple: {
        nNonOrthogonalCorrectors: 0,
        consistent: 'yes',
      },
      potentialFlow: {
        nNonOrthogonalCorrectors: 10,
      },
    },
  },
  relaxationFactors: {
    equations: {
      U: 0.9,
      k: 0.7,
      omega: 0.7,
    },
  },

  // system/blockMeshDict
  meshSize: {
    dimensions: [10, 10, 10],
    grading: [1, 2, 3],
  },

  // system/meshQualityDict
  meshQuality: {
    minFaceWeight: 0.02,
  },

  // system/snappyHexMeshDict
  // system/surfaceFeatureExtractDict
  // system/snappyHexMeshDict
  // Allrun
  hexMesh: {
    steps: ['castellatedMesh', 'snap', 'addLayers'],
    geometry: {
      name: 'motorBike',
      refinementBox: {
        type: 'searchableBox',
        min: [-1.0, -0.7, 0.0],
        max: [8.0, 0.7, 2.5],
      },
    },
    castellatedMeshControls: {
      maxLocalCells: 100000,
      maxGlobalCells: 2000000,
      minRefinementCells: 10,
      maxLoadUnbalance: 0.10,
      nCellsBetweenLevels: 3,

      resolveFeatureAngle: 30,
      locationInMesh: [3.0001, 3.0001, 0.43],
      allowFreeStandingZoneFaces: 'true',
    },
    snapControls: {
      nSmoothPatch: 3,
      tolerance: 2.0,
      nSolveIter: 30,
      nRelaxIter: 5,
      nFeatureSnapIter: 10,
      implicitFeatureSnap: 'false',
      explicitFeatureSnap: 'true',
      multiRegionFeatureSnap: 'false',
    },
    addLayersControls: {
      relativeSizes: 'true',
      expansionRatio: 1.0,
      finalLayerThickness: 0.3,
      minThickness: 0.1,
      nGrow: 0,
      featureAngle: 60,
      slipFeatureAngle: 30,
      nRelaxIter: 3,
      nSmoothSurfaceNormals: 1,
      nSmoothNormals: 3,
      nSmoothThickness: 10,
      maxFaceThicknessRatio: 0.5,
      maxThicknessToMedialRatio: 0.3,
      minMedianAxisAngle: 90,
      nBufferCellsNoExtrude: 0,
      nLayerIter: 50,
    },
  },
};
