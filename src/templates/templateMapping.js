module.exports = [
  // initialConditions
  {
    help: 'Initial conditions: Flow velocity',
    src: 'data/InitialConditions/0/initconst/initialConditions.flowVelocity/value',
    dst: 'initialConditions/flowVelocity',
  }, {
    help: 'Initial conditions: Pressure',
    src: 'data/InitialConditions/0/initconst/initialConditions.pressure/value/0',
    dst: 'initialConditions/pressure',
  }, {
    help: 'Initial conditions: Turbulent KE',
    src: 'data/InitialConditions/0/initconst/initialConditions.turbulentKE/value/0',
    dst: 'initialConditions/turbulentKE',
  }, {
    help: 'Initial conditions: Turbulent Omega',
    src: 'data/InitialConditions/0/initconst/initialConditions.turbulentOmega/value/0',
    dst: 'initialConditions/turbulentOmega',
  },

  // meshGroupName
  {
    help: 'Mesh group name',
    src: 'external/groupName',
    dst: 'meshGroupName',
  },

  // initfields
  {
    help: 'Initial conditions: k',
    src: 'data/InitialConditions/0/initfields/fields.k.dimensions/value',
    dst: 'k/dimensions',
  }, {
    help: 'Initial conditions: nut',
    src: 'data/InitialConditions/0/initfields/fields.nut.dimensions/value',
    dst: 'nut/dimensions',
  }, {
    help: 'Initial conditions: omega',
    src: 'data/InitialConditions/0/initfields/fields.omega.dimensions/value',
    dst: 'omega/dimensions',
  }, {
    help: 'Initial conditions: p',
    src: 'data/InitialConditions/0/initfields/fields.p.dimensions/value',
    dst: 'p/dimensions',
  }, {
    help: 'Initial conditions: U',
    src: 'data/InitialConditions/0/initfields/fields.U.dimensions/value',
    dst: 'U/dimensions',
  }, {
    help: 'Initial conditions: U inlet',
    src: 'data/InitialConditions/0/initfields/fields.U.inletValue/value',
    dst: 'U/inletValue',
  },

  // transport
  {
    help: 'Transport: model',
    src: 'data/InitialConditions/0/transport/transport.model/value/0',
    dst: 'transport/model',
  }, {
    help: 'Transport: Newtonian nu ',
    src: 'data/InitialConditions/0/Newtonian/Newtonian.nu.dimensions/value',
    dst: 'transport/nu/dimensions',
  }, {
    help: 'Transport: Newtonian nu epsilon',
    src: 'data/InitialConditions/0/Newtonian/Newtonian.nu.epsilon/value/0',
    dst: 'transport/nu/epsilon',
  },

  // WindTunnel
  {
    help: 'WindTunnel: bounds X (min)',
    src: 'data/WindTunnel/0/wallBounds/tunnel.bounds.x/value/0',
    dst: 'tunnel/bounds/0',
  }, {
    help: 'WindTunnel: bounds X (max)',
    src: 'data/WindTunnel/0/wallBounds/tunnel.bounds.x/value/1',
    dst: 'tunnel/bounds/1',
  }, {
    help: 'WindTunnel: bounds Y (min)',
    src: 'data/WindTunnel/0/wallBounds/tunnel.bounds.y/value/0',
    dst: 'tunnel/bounds/2',
  }, {
    help: 'WindTunnel: bounds Y (max)',
    src: 'data/WindTunnel/0/wallBounds/tunnel.bounds.y/value/1',
    dst: 'tunnel/bounds/3',
  }, {
    help: 'WindTunnel: bounds Z (min)',
    src: 'data/WindTunnel/0/wallBounds/tunnel.bounds.z/value/0',
    dst: 'tunnel/bounds/4',
  }, {
    help: 'WindTunnel: bounds Z (max)',
    src: 'data/WindTunnel/0/wallBounds/tunnel.bounds.z/value/1',
    dst: 'tunnel/bounds/5',
  },
  // Wall assignement
  {
    help: 'Wall assignement: X+',
    src: 'data/WindTunnel/0/wallAssign/tunnel.walls.x.plus/value/0',
    dst: 'tunnel/walls/x/plus',
  }, {
    help: 'Wall assignement: X-',
    src: 'data/WindTunnel/0/wallAssign/tunnel.walls.x.minus/value/0',
    dst: 'tunnel/walls/x/minus',
  }, {
    help: 'Wall assignement: Y+',
    src: 'data/WindTunnel/0/wallAssign/tunnel.walls.y.plus/value/0',
    dst: 'tunnel/walls/y/plus',
  }, {
    help: 'Wall assignement: Y-',
    src: 'data/WindTunnel/0/wallAssign/tunnel.walls.y.minus/value/0',
    dst: 'tunnel/walls/y/minus',
  }, {
    help: 'Wall assignement: Z+',
    src: 'data/WindTunnel/0/wallAssign/tunnel.walls.z.plus/value/0',
    dst: 'tunnel/walls/z/plus',
  }, {
    help: 'Wall assignement: Z-',
    src: 'data/WindTunnel/0/wallAssign/tunnel.walls.z.minus/value/0',
    dst: 'tunnel/walls/z/minus',
  },

  // controls
  {
    help: 'Controls: Start time',
    src: 'data/Parameters/0/controldictTime/controldict.time.startTime/value/0',
    dst: 'controls/startTime',
  }, {
    help: 'Controls: End time',
    src: 'data/Parameters/0/controldictTime/controldict.time.end/value/0',
    dst: 'controls/endTime',
  }, {
    help: 'Controls: Delta',
    src: 'data/Parameters/0/controldictTime/controldict.time.delta/value/0',
    dst: 'controls/deltaT',
  }, {
    help: 'Controls: Write type',
    src: 'data/Parameters/0/controldictWrite/controldict.write.control/value/0',
    dst: 'controls/writeControl',
  }, {
    help: 'Controls: Write interval',
    src: 'data/Parameters/0/controldictWrite/controldict.write.interval/value/0',
    dst: 'controls/writeInterval',
  }, {
    help: 'Controls: Write format',
    src: 'data/Parameters/0/controldictWrite/controldict.write.format/value/0',
    dst: 'controls/writeFormat',
  }, {
    help: 'Controls: Write precision',
    src: 'data/Parameters/0/controldictWrite/controldict.write.precision/value/0',
    dst: 'controls/writePrecision',
  }, {
    help: 'Controls: Time format',
    src: 'data/Parameters/0/controldictWrite/controldict.write.time.format/value/0',
    dst: 'controls/timeFormat',
  }, {
    help: 'Controls: Time precision',
    src: 'data/Parameters/0/controldictWrite/controldict.write.time.precision/value/0',
    dst: 'controls/timePrecision',
  },

  // decompose
  {
    help: 'Decomposition: subdomains',
    src: 'data/Decomposition/0/decomposeParDict/decomposeParDict.subdomains/value/0',
    dst: 'decompose/numberOfSubdomains',
  }, {
    help: 'Decomposition: method',
    src: 'data/Decomposition/0/decomposeParDict/decomposeParDict.method/value/0',
    dst: 'decompose/method',
  }, {
    help: 'Decomposition: simpleCoeffs n',
    src: 'data/Decomposition/0/decomposition_simpleCoeffs/decomposeParDict.simpleCoeffs.n/value',
    dst: 'decompose/simpleCoeffs/n',
  }, {
    help: 'Decomposition: simpleCoeffs delta',
    src: 'data/Decomposition/0/decomposition_simpleCoeffs/decomposeParDict.simpleCoeffs.delta/value/0',
    dst: 'decompose/simpleCoeffs/delta',
  }, {
    help: 'Decomposition: hierarchicalCoeffs n',
    src: 'data/Decomposition/0/decomposition_hierarchicalCoeffs/decomposeParDict.hierarchicalCoeffs.n/value',
    dst: 'decompose/hierarchicalCoeffs/n',
  }, {
    help: 'Decomposition: hierarchicalCoeffs delta',
    src: 'data/Decomposition/0/decomposition_hierarchicalCoeffs/decomposeParDict.hierarchicalCoeffs.delta/value/0',
    dst: 'decompose/hierarchicalCoeffs/delta',
  }, {
    help: 'Decomposition: hierarchicalCoeffs order',
    src: 'data/Decomposition/0/decomposition_hierarchicalCoeffs/decomposeParDict.hierarchicalCoeffs.order/value/0',
    dst: 'decompose/hierarchicalCoeffs/order',
  },

  // forceCoeffs
  {
    help: 'Force coef: write control',
    src: 'data/Decomposition/0/forceCoeffs/forceCoeffs.write.control/value/0',
    dst: 'forceCoeffs/writeControl',
  }, {
    help: 'Force coef: time interval',
    src: 'data/Decomposition/0/forceCoeffs/forceCoeffs.write.interval/value/0',
    dst: 'forceCoeffs/timeInterval',
  }, {
    help: 'Force coef: log',
    src: 'data/Decomposition/0/forceCoeffs/forceCoeffs.write.log/value/0',
    dst: 'forceCoeffs/log',
  }, {
    help: 'Force coef: liftDir',
    src: 'data/Decomposition/0/forceCoeffs/forceCoeffs.liftDir/value',
    dst: 'forceCoeffs/liftDir',
  }, {
    help: 'Force coef: dragDir',
    src: 'data/Decomposition/0/forceCoeffs/forceCoeffs.dragDir/value',
    dst: 'forceCoeffs/dragDir',
  }, {
    help: 'Force coef: CofR',
    src: 'data/Decomposition/0/forceCoeffs/forceCoeffs.CofR/value',
    dst: 'forceCoeffs/CofR',
  }, {
    help: 'Force coef: pitchAxis',
    src: 'data/Decomposition/0/forceCoeffs/forceCoeffs.pitchAxis/value',
    dst: 'forceCoeffs/pitchAxis',
  }, {
    help: 'Force coef: magUInf',
    src: 'data/Decomposition/0/forceCoeffs/forceCoeffs.magUInf/value/0',
    dst: 'forceCoeffs/magUInf',
  }, {
    help: 'Force coef: lRef',
    src: 'data/Decomposition/0/forceCoeffs/forceCoeffs.lRef/value/0',
    dst: 'forceCoeffs/lRef',
  }, {
    help: 'Force coef: Aref',
    src: 'data/Decomposition/0/forceCoeffs/forceCoeffs.Aref/value/0',
    dst: 'forceCoeffs/Aref',
  },

  // solvers
  // - p
  {
    help: 'Solver: p solver',
    src: 'data/Solvers/0/solver-p/solver.p.solver/value/0',
    dst: 'solvers/p/solver',
  }, {
    help: 'Solver: p smoother',
    src: 'data/Solvers/0/solver-p/solver.p.smoother/value/0',
    dst: 'solvers/p/smoother',
  }, {
    help: 'Solver: p tolerance',
    src: 'data/Solvers/0/solver-p/solver.p.tolerance/value/0',
    dst: 'solvers/p/tolerance',
  }, {
    help: 'Solver: p relTol',
    src: 'data/Solvers/0/solver-p/solver.p.relTol/value/0',
    dst: 'solvers/p/relTol',
  },
  // - U
  {
    help: 'Solver: U solver',
    src: 'data/Solvers/0/solver-U/solver.U.solver/value/0',
    dst: 'solvers/U/solver',
  }, {
    help: 'Solver: U smoother',
    src: 'data/Solvers/0/solver-U/solver.U.smoother/value/0',
    dst: 'solvers/U/smoother',
  }, {
    help: 'Solver: U tolerance',
    src: 'data/Solvers/0/solver-U/solver.U.tolerance/value/0',
    dst: 'solvers/U/tolerance',
  }, {
    help: 'Solver: U relTol',
    src: 'data/Solvers/0/solver-U/solver.U.relTol/value/0',
    dst: 'solvers/U/relTol',
  }, {
    help: 'Solver: U nSweeps',
    src: 'data/Solvers/0/solver-U/solver.U.nSweeps/value/0',
    dst: 'solvers/U/nSweeps',
  },
  // - k
  {
    help: 'Solver: k solver',
    src: 'data/Solvers/0/solver-k/solver.k.solver/value/0',
    dst: 'solvers/k/solver',
  }, {
    help: 'Solver: k smoother',
    src: 'data/Solvers/0/solver-k/solver.k.smoother/value/0',
    dst: 'solvers/k/smoother',
  }, {
    help: 'Solver: k tolerance',
    src: 'data/Solvers/0/solver-k/solver.k.tolerance/value/0',
    dst: 'solvers/k/tolerance',
  }, {
    help: 'Solver: k relTol',
    src: 'data/Solvers/0/solver-k/solver.k.relTol/value/0',
    dst: 'solvers/k/relTol',
  }, {
    help: 'Solver: k nSweeps',
    src: 'data/Solvers/0/solver-k/solver.k.nSweeps/value/0',
    dst: 'solvers/k/nSweeps',
  },
  // - omega
  {
    help: 'Solver: omega solver',
    src: 'data/Solvers/0/solver-omega/solver.omega.solver/value/0',
    dst: 'solvers/omega/solver',
  }, {
    help: 'Solver: omega smoother',
    src: 'data/Solvers/0/solver-omega/solver.omega.smoother/value/0',
    dst: 'solvers/omega/smoother',
  }, {
    help: 'Solver: omega tolerance',
    src: 'data/Solvers/0/solver-omega/solver.omega.tolerance/value/0',
    dst: 'solvers/omega/tolerance',
  }, {
    help: 'Solver: omega relTol',
    src: 'data/Solvers/0/solver-omega/solver.omega.relTol/value/0',
    dst: 'solvers/omega/relTol',
  }, {
    help: 'Solver: omega nSweeps',
    src: 'data/Solvers/0/solver-omega/solver.omega.nSweeps/value/0',
    dst: 'solvers/omega/nSweeps',
  },
  // correctors
  {
    help: 'Correctors: simple non orthogonal',
    src: 'data/Solvers/0/correctors/correctors.simple.nNonOrthogonalCorrectors/value/0',
    dst: 'solvers/correctors/simple/nNonOrthogonalCorrectors',
  }, {
    help: 'Correctors: simple consistent',
    src: 'data/Solvers/0/correctors/correctors.simple.consistent/value/0',
    dst: 'solvers/correctors/simple/consistent',
  }, {
    help: 'Correctors: potentialFlow',
    src: 'data/Solvers/0/correctors/correctors.potentialFlow.nNonOrthogonalCorrectors/value/0',
    dst: 'solvers/correctors/potentialFlow/nNonOrthogonalCorrectors',
  },

  // relaxationFactors
  {
    help: 'RelaxationFactors: U',
    src: 'data/Solvers/0/relaxationFactors/relaxationFactors.equations.U/value/0',
    dst: 'relaxationFactors/equations/U',
  }, {
    help: 'RelaxationFactors: k',
    src: 'data/Solvers/0/relaxationFactors/relaxationFactors.equations.k/value/0',
    dst: 'relaxationFactors/equations/k',
  }, {
    help: 'RelaxationFactors: omega',
    src: 'data/Solvers/0/relaxationFactors/relaxationFactors.equations.omega/value/0',
    dst: 'relaxationFactors/equations/omega',
  },

  // meshSize
  {
    help: 'Mesh size: dimensions',
    src: 'data/Mesh/0/meshSize/meshSize.dimensions/value',
    dst: 'meshSize/dimensions',
  }, {
    help: 'Mesh size: simpleGrading',
    src: 'data/Mesh/0/meshSize/meshSize.simpleGrading/value',
    dst: 'meshSize/grading',
  },

  // meshQuality
  {
    help: 'Mesh quality: minFaceWeight',
    src: 'data/Mesh/0/meshQuality/meshQuality.minFaceWeight/value/0',
    dst: 'meshQuality/minFaceWeight',
  },

  // hexMesh
  {
    help: 'Hex Mesh: geometry name',
    src: 'external/geometryName',
    dst: 'hexMesh/geometry/name',
  }, {
    help: 'Hex Mesh: refinementBox',
    src: 'data/Mesh/0/meshRefinement/meshRefinement.refinementBox.type/value/0',
    dst: 'hexMesh/geometry/refinementBox/type',
  }, {
    help: 'Hex Mesh: refinementBox min',
    src: 'data/Mesh/0/searchableBox/meshRefinement.refinementBox.min/value',
    dst: 'hexMesh/geometry/refinementBox/min',
  }, {
    help: 'Hex Mesh: refinementBox max',
    src: 'data/Mesh/0/searchableBox/meshRefinement.refinementBox.max/value',
    dst: 'hexMesh/geometry/refinementBox/max',
  },
  // hexMesh.castellatedMeshControls
  {
    help: 'Castellated Mesh Controls: maxLocalCells',
    src: 'data/castellatedMeshControls/0/castellatedMeshControls/castellatedMeshControls.maxLocalCells/value/0',
    dst: 'hexMesh/castellatedMeshControls/maxLocalCells',
  }, {
    help: 'Castellated Mesh Controls: maxGlobalCells',
    src: 'data/castellatedMeshControls/0/castellatedMeshControls/castellatedMeshControls.maxGlobalCells/value/0',
    dst: 'hexMesh/castellatedMeshControls/maxGlobalCells',
  }, {
    help: 'Castellated Mesh Controls: minRefinementCells',
    src: 'data/castellatedMeshControls/0/castellatedMeshControls/castellatedMeshControls.minRefinementCells/value/0',
    dst: 'hexMesh/castellatedMeshControls/minRefinementCells',
  }, {
    help: 'Castellated Mesh Controls: maxLoadUnbalance',
    src: 'data/castellatedMeshControls/0/castellatedMeshControls/castellatedMeshControls.maxLoadUnbalance/value/0',
    dst: 'hexMesh/castellatedMeshControls/maxLoadUnbalance',
  }, {
    help: 'Castellated Mesh Controls: nCellsBetweenLevels',
    src: 'data/castellatedMeshControls/0/castellatedMeshControls/castellatedMeshControls.nCellsBetweenLevels/value/0',
    dst: 'hexMesh/castellatedMeshControls/nCellsBetweenLevels',
  }, {
    help: 'Castellated Mesh Controls: resolveFeatureAngle',
    src: 'data/castellatedMeshControls/0/castellatedMeshControls/castellatedMeshControls.resolveFeatureAngle/value/0',
    dst: 'hexMesh/castellatedMeshControls/resolveFeatureAngle',
  }, {
    help: 'Castellated Mesh Controls: locationInMesh',
    src: 'data/castellatedMeshControls/0/castellatedMeshControls/castellatedMeshControls.locationInMesh/value',
    dst: 'hexMesh/castellatedMeshControls/locationInMesh',
  }, {
    help: 'Castellated Mesh Controls: allowFreeStandingZoneFaces',
    src: 'data/castellatedMeshControls/0/castellatedMeshControls/castellatedMeshControls.allowFreeStandingZoneFaces/value/0',
    dst: 'hexMesh/castellatedMeshControls/allowFreeStandingZoneFaces',
  },
  // hexMesh.snapControls
  {
    help: 'Snap Controls: nSmoothPatch',
    src: 'data/snapControls/1/snapControls/snapControls.nSmoothPatch/value/0',
    dst: 'hexMesh/snapControls/nSmoothPatch',
  }, {
    help: 'Snap Controls: tolerance',
    src: 'data/snapControls/1/snapControls/snapControls.tolerance/value/0',
    dst: 'hexMesh/snapControls/tolerance',
  }, {
    help: 'Snap Controls: nSolveIter',
    src: 'data/snapControls/1/snapControls/snapControls.nSolveIter/value/0',
    dst: 'hexMesh/snapControls/nSolveIter',
  }, {
    help: 'Snap Controls: nRelaxIter',
    src: 'data/snapControls/1/snapControls/snapControls.nRelaxIter/value/0',
    dst: 'hexMesh/snapControls/nRelaxIter',
  }, {
    help: 'Snap Controls: nFeatureSnapIter',
    src: 'data/snapControls/1/snapControls/snapControls.nFeatureSnapIter/value/0',
    dst: 'hexMesh/snapControls/nFeatureSnapIter',
  }, {
    help: 'Snap Controls: implicitFeatureSnap',
    src: 'data/snapControls/1/snapControls/snapControls.implicitFeatureSnap/value/0',
    dst: 'hexMesh/snapControls/implicitFeatureSnap',
  }, {
    help: 'Snap Controls: explicitFeatureSnap',
    src: 'data/snapControls/1/snapControls/snapControls.explicitFeatureSnap/value/0',
    dst: 'hexMesh/snapControls/explicitFeatureSnap',
  }, {
    help: 'Snap Controls: multiRegionFeatureSnap',
    src: 'data/snapControls/1/snapControls/snapControls.multiRegionFeatureSnap/value/0',
    dst: 'hexMesh/snapControls/multiRegionFeatureSnap',
  },
  // hexMesh.addLayersControls
  {
    help: 'Add Layers Controls: relativeSizes',
    src: 'data/addLayersControls/2/addLayersControls/addLayersControls.relativeSizes/value/0',
    dst: 'hexMesh/addLayersControls/relativeSizes',
  }, {
    help: 'Add Layers Controls: expansionRatio',
    src: 'data/addLayersControls/2/addLayersControls/addLayersControls.expansionRatio/value/0',
    dst: 'hexMesh/addLayersControls/expansionRatio',
  }, {
    help: 'Add Layers Controls: finalLayerThickness',
    src: 'data/addLayersControls/2/addLayersControls/addLayersControls.finalLayerThickness/value/0',
    dst: 'hexMesh/addLayersControls/finalLayerThickness',
  }, {
    help: 'Add Layers Controls: minThickness',
    src: 'data/addLayersControls/2/addLayersControls/addLayersControls.minThickness/value/0',
    dst: 'hexMesh/addLayersControls/minThickness',
  }, {
    help: 'Add Layers Controls: nGrow',
    src: 'data/addLayersControls/2/addLayersControls/addLayersControls.nGrow/value/0',
    dst: 'hexMesh/addLayersControls/nGrow',
  }, {
    help: 'Add Layers Controls: featureAngle',
    src: 'data/addLayersControls/2/addLayersControls/addLayersControls.featureAngle/value/0',
    dst: 'hexMesh/addLayersControls/featureAngle',
  }, {
    help: 'Add Layers Controls: slipFeatureAngle',
    src: 'data/addLayersControls/2/addLayersControls/addLayersControls.slipFeatureAngle/value/0',
    dst: 'hexMesh/addLayersControls/slipFeatureAngle',
  }, {
    help: 'Add Layers Controls: nRelaxIter',
    src: 'data/addLayersControls/2/addLayersControls/addLayersControls.nRelaxIter/value/0',
    dst: 'hexMesh/addLayersControls/nRelaxIter',
  }, {
    help: 'Add Layers Controls: nSmoothSurfaceNormals',
    src: 'data/addLayersControls/2/addLayersControls/addLayersControls.nSmoothSurfaceNormals/value/0',
    dst: 'hexMesh/addLayersControls/nSmoothSurfaceNormals',
  }, {
    help: 'Add Layers Controls: nSmoothNormals',
    src: 'data/addLayersControls/2/addLayersControls/addLayersControls.nSmoothNormals/value/0',
    dst: 'hexMesh/addLayersControls/nSmoothNormals',
  }, {
    help: 'Add Layers Controls: nSmoothThickness',
    src: 'data/addLayersControls/2/addLayersControls/addLayersControls.nSmoothThickness/value/0',
    dst: 'hexMesh/addLayersControls/nSmoothThickness',
  }, {
    help: 'Add Layers Controls: maxFaceThicknessRatio',
    src: 'data/addLayersControls/2/addLayersControls/addLayersControls.maxFaceThicknessRatio/value/0',
    dst: 'hexMesh/addLayersControls/maxFaceThicknessRatio',
  }, {
    help: 'Add Layers Controls: maxThicknessToMedialRatio',
    src: 'data/addLayersControls/2/addLayersControls/addLayersControls.maxThicknessToMedialRatio/value/0',
    dst: 'hexMesh/addLayersControls/maxThicknessToMedialRatio',
  }, {
    help: 'Add Layers Controls: minMedianAxisAngle',
    src: 'data/addLayersControls/2/addLayersControls/addLayersControls.minMedianAxisAngle/value/0',
    dst: 'hexMesh/addLayersControls/minMedianAxisAngle',
  }, {
    help: 'Add Layers Controls: nBufferCellsNoExtrude',
    src: 'data/addLayersControls/2/addLayersControls/addLayersControls.nBufferCellsNoExtrude/value/0',
    dst: 'hexMesh/addLayersControls/nBufferCellsNoExtrude',
  }, {
    help: 'Add Layers Controls: nLayerIter',
    src: 'data/addLayersControls/2/addLayersControls/addLayersControls.nLayerIter/value/0',
    dst: 'hexMesh/addLayersControls/nLayerIter',
  },
];
