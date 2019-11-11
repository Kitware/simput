function get(dataModel, path, defaultValue) {
  const keys = path.split('.');
  let container = dataModel;
  while (container && keys.length) {
    container = container[keys.shift()];
  }
  return container || defaultValue;
}

function addProcessTopology(data, dataModel) {
  var value;
  var topology = {};

  // Process Topology extracts
  value = get(
  	         	dataModel,
  	         	'data.ProcessTopologyDefinition.0.ProcessTopology.P.value',
  	         	""
  	         );
  topology.P = value[0];
  value = get(
  	         	dataModel,
  	         	'data.ProcessTopologyDefinition.0.ProcessTopology.Q.value',
  	         	""
  	         );
  topology.Q = value[0];
  value = get(
  	         	dataModel,
  	         	'data.ProcessTopologyDefinition.0.ProcessTopology.R.value',
  	         	""
  	         );
  topology.R = value[0];
  data.ProcessTopology = topology;
}

function addComputationalGrid(data, dataModel) {
  var value;
  var computationalGrid = {};
  var lower = {};

  // Computational Grid extracts
  value = get(
  	         	dataModel,
  	         	'data.ComputationalGridDefinition.0.ComputationalGrid.Lower.value',
  	         	""
  	         );
  lower.X = value[0];
  lower.Y = value[1];
  lower.Z = value[2];
  computationalGrid.Lower = lower;
  value = get(
  	         	dataModel,
  	         	'data.ComputationalGridDefinition.0.ComputationalGrid.N.value',
  	         	""
  	         );
  computationalGrid.NX = value[0];
  computationalGrid.NY = value[1];
  computationalGrid.NZ = value[2];
  value = get(
  	         	dataModel,
  	         	'data.ComputationalGridDefinition.0.ComputationalGrid.D.value',
  	         	""
  	         );
  computationalGrid.DX = value[0];
  computationalGrid.DY = value[1];
  computationalGrid.DZ = value[2];
  data.ComputationalGrid = computationalGrid;
}

function addGeometryInput(data, dataModel) {
  var value;
  var geometries = [];
  var geometryInput = {};
  var lower = {};
  var upper = {};
  var patches = {};

  // Geometry Input extracts
  var GeometryInputType = ["SolidFile", "IndicatorField", "Box"];
  value = get(
  	         	dataModel,
  	         	'data.GeometryInputDefinition.0.GeometryInput.Name.value',
  	         	""
  	         );
  geometryInput.Name = value[0];
  value = get(
  	         	dataModel,
  	         	'data.GeometryInputDefinition.0.GeometryInput.InputType.value',
  	         	0
  	         );
  geometryInput.InputType = GeometryInputType[value];
  if (geometryInput.InputType == "SolidFile") {
  	 value = get(
  	 	        	dataModel,
  	 	        	'data.GeometryInputDefinition.0.GeometryInputSolidFile.FileName.value',
  	 	        	""
  	 	        );
     geometryInput.FileName = value;
     value = get(
  	 	        	dataModel,
  	 	        	'data.GeometryInputDefinition.0.GeometryInputSolidFile.Patch.value',
  	 	        	""
  	 	        );
     geometryInput.Patches = value;
     // TODO: GeomNames List
  }
  else if (geometryInput.InputType == "IndicatorField") {
  	 value = get(
  	 	        	dataModel,
  	 	        	'data.GeometryInputDefinition.0.GeometryInputSolidFile.FileName.value',
  	 	        	""
  	 	        );
     geometryInput.FileName = value;
     // TODO: GeomNames List
  }
  else if (geometryInput.InputType == "Box") {
     value = get(
  	         	dataModel,
  	         	'data.GeometryInputDefinition.0.GeometryInputBox.Lower.value',
  	         	""
  	         );
  	 lower.X = value[0];
  	 lower.Y = value[1];
  	 lower.Z = value[2];
  	 geometryInput.Lower = lower;
  	 value = get(
  	         	dataModel,
  	         	'data.GeometryInputDefinition.0.GeometryInputBox.Upper.value',
  	         	""
  	         );
  	 upper.X = value[0];
  	 upper.Y = value[1];
  	 upper.Z = value[2];
  	 geometryInput.Upper = upper;
     // TODO: GeomNames List
     value = get(
  	         	dataModel,
  	         	'data.GeometryInputDefinition.0.GeometryInputBox.Patches.value',
  	         	""
  	         );
  	 patches.right = value[0];
  	 patches.left = value[1];
  	 patches.front = value[2];
  	 patches.back = value[3];
  	 patches.top = value[4];
  	 patches.bottom = value[5];
  	 geometryInput.Patches = patches;
  }
  geometries.push(geometryInput);
  data.GeometryInput = geometries;
}

function addRelativePermeability(data, dataModel) {
  var value;
  var geometries = [];
  var geometry = {};

  // RelativePermeability extracts
  var RelativePermeabilityType = ["Constant", "VanGenuchten", "VanGenuchten", "Haverkamp", "Data", "Polynomial"];
  value = get(
  	         	dataModel,
  	         	'data.RelativePermeabilityDefinition.0.RelativePermeability.GeomName.value',
  	         	""
  	         );
  geometry.GeomName = value[0];
  value = get(
  	         	dataModel,
  	         	'data.RelativePermeabilityDefinition.0.RelativePermeability.Type.value',
  	         	0
  	         );
  geometry.Type = RelativePermeabilityType[value];
  if (value == 1) geometry.File = 1;
  else if (value == 2) geometry.File = 0;
  if (geometry.Type == "Constant") {
  	 value = get(
  	 	        	dataModel,
  	 	        	'data.RelativePermeabilityDefinition.0.RelativePermeabilityConstant.Value.value',
  	 	        	""
  	 	        );
     geometry.Value = value[0];
  }
  else if (geometry.Type == "VanGenuchten" && geometry.File == 1) {
  	 value = get(
  	 	        	dataModel,
  	 	        	'data.RelativePermeabilityDefinition.0.RelativePermeabilityVanGenuchtenFiles.Alpha_Filename.value',
  	 	        	""
  	 	        );
     geometry.Alpha_Filename = value;
     value = get(
  	 	        	dataModel,
  	 	        	'data.RelativePermeabilityDefinition.0.RelativePermeabilityVanGenuchtenFiles.N_Filename.value',
  	 	        	""
  	 	        );
     geometry.N_Filename = value;
  }
  else if (geometry.Type == "VanGenuchten" && geometry.File == 0) {
  	 value = get(
  	 	        	dataModel,
  	 	        	'data.RelativePermeabilityDefinition.0.RelativePermeabilityVanGenuchtenRegion.Alpha.value',
  	 	        	""
  	 	        );
     geometry.Alpha = value[0];
     value = get(
  	 	        	dataModel,
  	 	        	'data.RelativePermeabilityDefinition.0.RelativePermeabilityVanGenuchtenRegion.N.value',
  	 	        	""
  	 	        );
     geometry.N = value[0];
     value = get(
  	 	        	dataModel,
  	 	        	'data.RelativePermeabilityDefinition.0.RelativePermeabilityVanGenuchtenRegion.NumSamplePoints.value',
  	 	        	""
  	 	        );
     geometry.NumSamplePoints = value[0];
     value = get(
  	 	        	dataModel,
  	 	        	'data.RelativePermeabilityDefinition.0.RelativePermeabilityVanGenuchtenRegion.MinPressureHead.value',
  	 	        	""
  	 	        );
     geometry.MinPressureHead = value[0];
  }
  else if (geometry.Type == "Haverkamp") {
  	 value = get(
  	 	        	dataModel,
  	 	        	'data.RelativePermeabilityDefinition.0.RelativePermeabilityHaverkamp.A.value',
  	 	        	""
  	 	        );
     geometry.A = value[0];
     value = get(
  	 	        	dataModel,
  	 	        	'data.RelativePermeabilityDefinition.0.RelativePermeabilityHaverkamp.Gamma.value',
  	 	        	""
  	 	        );
     geometry.Gamma = value[0];
  }
  else if (geometry.Type == "Data") {
  }
  else if (geometry.Type == "Polynomial") {
  	value = get(
  	 	        	dataModel,
  	 	        	'data.RelativePermeabilityDefinition.0.RelativePermeabilityPolynomial.Degree.value',
  	 	        	""
  	 	        );
    geometry.Degree = value[0];
    // TODO: Coefficients
  }
  geometries.push(geometry);
  data.RelativePermeability = geometries;
}

function addSaturation(data, dataModel) {
  var value;
  var geometries = [];
  var geometry = {};

  // Saturation extracts
  var SaturationType = ["Constant", "VanGenuchten", "VanGenuchten", "Haverkamp", "Data", "Polynomial", "PFBFile"];
  value = get(
  	         	dataModel,
  	         	'data.SaturationDefinition.0.Saturation.GeomName.value',
  	         	""
  	         );
  geometry.GeomName = value[0];
  value = get(
  	         	dataModel,
  	         	'data.SaturationDefinition.0.Saturation.Type.value',
  	         	0
  	         );
  geometry.Type = SaturationType[value];
  if (value == 1) geometry.File = 1;
  else if (value == 2) geometry.File = 0;
  if (geometry.Type == "Constant") {
  	 value = get(
  	 	        	dataModel,
  	 	        	'data.SaturationDefinition.0.SaturationConstant.Value.value',
  	 	        	""
  	 	        );
     geometry.Value = value[0];
  }
  else if (geometry.Type == "VanGenuchten" && geometry.File == 1) {
  	 value = get(
  	 	        	dataModel,
  	 	        	'data.SaturationDefinition.0.SaturationVanGenuchtenFiles.Alpha_Filename.value',
  	 	        	""
  	 	        );
     geometry.Alpha_Filename = value;
     value = get(
  	 	        	dataModel,
  	 	        	'data.SaturationDefinition.0.SaturationVanGenuchtenFiles.N_Filename.value',
  	 	        	""
  	 	        );
     geometry.N_Filename = value;
     value = get(
  	 	        	dataModel,
  	 	        	'data.SaturationDefinition.0.SaturationVanGenuchtenFiles.SRes_Filename.value',
  	 	        	""
  	 	        );
     geometry.SRes_Filename = value;
     value = get(
  	 	        	dataModel,
  	 	        	'data.SaturationDefinition.0.SaturationVanGenuchtenFiles.SSat_Filename.value',
  	 	        	""
  	 	        );
     geometry.SSat_Filename = value;
  }
  else if (geometry.Type == "VanGenuchten" && geometry.File == 0) {
  	 value = get(
  	 	        	dataModel,
  	 	        	'data.SaturationDefinition.0.SaturationVanGenuchtenRegion.Alpha.value',
  	 	        	""
  	 	        );
     geometry.Alpha = value[0];
     value = get(
  	 	        	dataModel,
  	 	        	'data.SaturationDefinition.0.SaturationVanGenuchtenRegion.N.value',
  	 	        	""
  	 	        );
     geometry.N = value[0];
     value = get(
  	 	        	dataModel,
  	 	        	'data.SaturationDefinition.0.SaturationVanGenuchtenRegion.SRes.value',
  	 	        	""
  	 	        );
     geometry.SRes = value[0];
     value = get(
  	 	        	dataModel,
  	 	        	'data.SaturationDefinition.0.SaturationVanGenuchtenRegion.SSat.value',
  	 	        	""
  	 	        );
     geometry.SSat = value[0];
  }
  else if (geometry.Type == "Haverkamp") {
  	 value = get(
  	 	        	dataModel,
  	 	        	'data.SaturationDefinition.0.SaturationHaverkamp.A.value',
  	 	        	""
  	 	        );
     geometry.A = value[0];
     value = get(
  	 	        	dataModel,
  	 	        	'data.SaturationDefinition.0.SaturationHaverkamp.Gamma.value',
  	 	        	""
  	 	        );
     geometry.Gamma = value[0];
  }
  else if (geometry.Type == "Data") {
  }
  else if (geometry.Type == "Polynomial") {
  	value = get(
  	 	        	dataModel,
  	 	        	'data.SaturationDefinition.0.SaturationPolynomial.Degree.value',
  	 	        	""
  	 	        );
    geometry.Degree = value[0];
    // TODO: Coefficients
  }
  else if (geometry.Type == "PFBFile") {
  	value = get(
  	 	        	dataModel,
  	 	        	'data.SaturationDefinition.0.SaturationPFBFile.Saturation_FileName.value',
  	 	        	""
  	 	        );
    geometry.Saturation_FileName = value;
    // TODO: Coefficients
  }
  geometries.push(geometry);
  data.Saturation = geometries;
}

module.exports = function convert(dataModel) {
  const results = {};
  var data = {};
  addProcessTopology(data,dataModel);
  addComputationalGrid(data, dataModel);
  addGeometryInput(data, dataModel);
  addRelativePermeability(data,dataModel);
  addSaturation(data,dataModel);
  results['data.json'] = JSON.stringify(data);
  return { results, model: dataModel };
};