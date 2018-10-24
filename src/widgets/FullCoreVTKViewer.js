import macro from 'vtk.js/Sources/macro';
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkColorTransferFunction from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction';
import vtkCubeSource from 'vtk.js/Sources/Filters/Sources/CubeSource';
import vtkConcentricCylinderSource from 'vtk.js/Sources/Filters/Sources/ConcentricCylinderSource';
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper';
import vtkDataArray from 'vtk.js/Sources/Common/Core/DataArray';
import vtkGlyph3DMapper from 'vtk.js/Sources/Rendering/Core/Glyph3DMapper';
import vtkPolyData from 'vtk.js/Sources/Common/DataModel/PolyData';

import vtkVTKViewer from './VTKViewer';
import vtkRodMapVTKViewer from './RodMapVTKViewer';
import vtkCoreMapVTKViewer from './CoreMapVTKViewer';
import vtkRodVTKViewer from './RodVTKViewer';

const EPSILON = 0.01;

// ----------------------------------------------------------------------------

function extractGrids(viz) {
  const gridSpacing = viz.cellPitch;
  const assemWidth = gridSpacing * viz.assemblyGridSize;
  const halfWidth = assemWidth / 2;

  const numOfLayers = Object.keys(viz.grids).reduce(
    (sum, gridName) => sum + viz.grids[gridName].elevations.length,
    0
  );

  const nbPoints = numOfLayers * (viz.assemblyGridSize + 1) * 2;
  const somegrid = {
    pointsData: new Float32Array(nbPoints * 3),
    scalingData: new Float32Array(nbPoints * 3),
    colorData: new Uint16Array(nbPoints),
  };

  let offset = 0;
  let colorOffset = 0;

  const getGridThickness = (pitch, mass, density, height, npins) =>
    (2 * pitch -
      Math.sqrt(
        4 * pitch * pitch - 4 * (mass / (density * height * npins * npins))
      )) /
    4;

  const allMats = {};
  const gridNames = Object.keys(viz.grids);
  for (let i = 0; i < gridNames.length; i++) {
    const grid = viz.grids[gridNames[i]];
    const { mat, mass, height, elevations } = grid;

    allMats[mat] = true;

    // density and grid thickness
    const density = (viz.materials[mat] && viz.materials[mat].density) || 1;
    const thickness = getGridThickness(
      gridSpacing,
      mass,
      density,
      height,
      viz.assemblyGridSize
    );

    for (let j = 0; j < elevations.length; j++) {
      const elevation = elevations[j];
      // Horizontal
      for (let k = 0; k <= viz.assemblyGridSize; k++) {
        somegrid.pointsData[offset] = (k - 0.5) * gridSpacing;
        somegrid.scalingData[offset] = thickness;
        offset++;
        somegrid.pointsData[offset] = halfWidth - gridSpacing * 0.5;
        somegrid.scalingData[offset] = assemWidth;
        offset++;
        somegrid.pointsData[offset] = elevation;
        somegrid.scalingData[offset] = height;
        offset++;
        somegrid.colorData[colorOffset++] = mat;
      }
      // Vertical
      for (let k = 0; k <= viz.assemblyGridSize; k++) {
        somegrid.pointsData[offset] = halfWidth - gridSpacing * 0.5;
        somegrid.scalingData[offset] = assemWidth;
        offset++;
        somegrid.pointsData[offset] = (k - 0.5) * gridSpacing;
        somegrid.scalingData[offset] = thickness;
        offset++;
        somegrid.pointsData[offset] = elevation;
        somegrid.scalingData[offset] = height;
        offset++;
        somegrid.colorData[colorOffset++] = mat;
      }
    }
  }

  // get the ID of the core assemblies map
  let assembliesId = 0;
  Object.keys(viz.core.types).forEach((id) => {
    if (viz.core.types[id].indexOf('assembly') > -1) {
      assembliesId = id;
    }
  });

  const outGrids = [];
  let gridArraySize = 0;
  for (let j = 0; j < viz.core.size; j++) {
    for (let i = 0; i < viz.core.size; i++) {
      const idx = j * viz.core.size + i;
      const offsetX = i * viz.core.pitch;
      const offsetY = (viz.core.size - j - 1) * viz.core.pitch;

      // only add grids to assemblies
      if (viz.core[assembliesId][idx] !== '0') {
        const grid = Object.assign({}, somegrid);
        grid.pointsData = Float32Array.from(grid.pointsData);
        gridArraySize += grid.pointsData.length;

        // Apply translation from the core
        const nbValues = grid.pointsData.length;
        for (let z = 0; z < nbValues; z += 3) {
          grid.pointsData[z + 0] += offsetX;
          grid.pointsData[z + 1] += offsetY;
        }

        outGrids.push(grid);
      }
    }
  }

  // Merge grids to a single grid
  const fullGridPointData = new Float32Array(gridArraySize);
  const fullGridScaleData = new Float32Array(gridArraySize);
  const fullGridColorData = new Float32Array(gridArraySize / 3);

  let vec3Offset = 0;
  colorOffset = 0;

  let gCount = outGrids.length;
  while (gCount--) {
    const { pointsData, scalingData, colorData } = outGrids[gCount];
    const vec3Size = pointsData.length;
    const colorSize = colorData.length;
    for (let idx = 0; idx < vec3Size; idx++) {
      fullGridPointData[vec3Offset] = pointsData[idx];
      fullGridScaleData[vec3Offset] = scalingData[idx];
      vec3Offset++;
    }
    for (let idx = 0; idx < colorSize; idx++) {
      fullGridColorData[colorOffset++] = colorData[idx];
    }
  }
  const ret = {
    pointsData: fullGridPointData,
    scalingData: fullGridScaleData,
    colorData: fullGridColorData,
    mats: Object.keys(allMats),
  };

  return ret;
}

// ----------------------------------------------------------------------------

function extractBaffleLayoutFrom(core, baffleOffset) {
  const gap = core.baffleSpec.gap;
  const mat = core.baffleSpec.material;
  const thick = core.baffleSpec.thick;
  const coreSize = core.size;
  const halfCoreSize = coreSize / 2;
  const { pitch, height } = core;
  const lastIndex = coreSize - 1;
  const baffleElements = [];

  // construct shape from merging all core maps
  const shape = Array(coreSize * coreSize);
  const mapIds = Object.keys(core.types);
  mapIds.forEach((mapId) => {
    for (let i = 0; i < core[mapId].length; i++) {
      shape[i] = shape[i] || core[mapId][i] !== '0';
    }
  });

  for (let j = 0; j < coreSize; j++) {
    for (let i = 0; i < coreSize; i++) {
      const idx = j * coreSize + i;
      if (shape[idx]) {
        const left = i === 0 || (i > 0 && !shape[idx - 1]);
        const top = j === 0 || (j > 0 && !shape[idx - coreSize]);
        const right = i === lastIndex || (i < lastIndex && !shape[idx + 1]);
        const bottom =
          j === lastIndex || (j < lastIndex && !shape[idx + coreSize]);
        if (left || top || right || bottom) {
          baffleElements.push({
            i,
            j,
            left,
            top,
            right,
            bottom,
          });
        }
      }
    }
  }

  // Create baffles
  const pieces = [];
  const baffle = { mat, pieces };
  const shift = gap + thick / 2;
  let sign = 1;
  let count = baffleElements.length;
  const middleAssemblyIndex = Math.floor(halfCoreSize);
  while (count--) {
    const item = baffleElements[count];
    if (item.top) {
      sign = item.i < halfCoreSize ? -1 : +1;
      pieces.push({
        xLength: pitch + thick + (middleAssemblyIndex === item.i ? shift : 0),
        yLength: thick,
        zLength: height,
        center: [
          baffleOffset + pitch * 0.5 + item.i * pitch + sign * shift,
          baffleOffset + item.j * pitch - shift,
          height * 0.5,
        ],
      });
    }
    if (item.bottom) {
      sign = item.i < halfCoreSize ? -1 : +1;
      pieces.push({
        xLength: pitch + thick + (middleAssemblyIndex === item.i ? shift : 0),
        yLength: thick,
        zLength: height,
        center: [
          baffleOffset + pitch * 0.5 + item.i * pitch + sign * shift,
          baffleOffset + (item.j + 1) * pitch + shift,
          height * 0.5,
        ],
      });
    }
    if (item.left) {
      sign = item.j < halfCoreSize ? -1 : +1;
      pieces.push({
        xLength: thick,
        yLength: pitch + thick + (middleAssemblyIndex === item.j ? shift : 0),
        zLength: height,
        center: [
          baffleOffset + item.i * pitch - shift,
          baffleOffset + pitch * 0.5 + item.j * pitch + sign * shift,
          height * 0.5,
        ],
      });
    }
    if (item.right) {
      sign = item.j < halfCoreSize ? -1 : +1;
      pieces.push({
        xLength: thick,
        yLength: pitch + thick + (middleAssemblyIndex === item.j ? shift : 0),
        zLength: height,
        center: [
          baffleOffset + (item.i + 1) * pitch + shift,
          baffleOffset + pitch * 0.5 + item.j * pitch + sign * shift,
          height * 0.5,
        ],
      });
    }
  }

  return baffle;
}

// ----------------------------------------------------------------------------

function extractVesselAsCell(core) {
  const { name, mats, radii } = core.vesselSpec;
  // assumes mats.length === radii.length
  const segments = [];
  for (let i = 0; i < mats.length; i++) {
    segments.push({
      material: mats[i],
      radius: radii[i],
    });
  }
  return {
    [name]: segments,
  };
}

// ----------------------------------------------------------------------------

function extractPlates(core) {
  const lower = core.lowerPlateSpec;
  const upper = core.upperPlateSpec;

  const radius = core.vesselSpec.radii
    ? core.vesselSpec.radii[core.vesselSpec.radii.length - 1]
    : core.pitch / 2;

  // currently ignore vfrac; not sure how to show 50% moderator
  return [lower, upper].map((plate, idx) => {
    if (plate && plate.thick) {
      const name = ['lower', 'upper'][idx];
      return {
        name,
        mats: [plate.material],
        radii: [radius],
        height: plate.thick,
      };
    }
    return null;
  });
}

// ----------------------------------------------------------------------------

function extractPads(core) {
  const { material, innerDiameter, outerDiameter, arc, angles } = core.padSpec;
  return angles.map((angle) => {
    // VERA wants angle counter-clockwise from positive-x
    const center = angle % 360;
    return {
      mats: [material],
      radii: [innerDiameter, outerDiameter],
      theta: [center - arc / 2, center + arc / 2],
    };
  });
}

// ----------------------------------------------------------------------------
// vtkCoreMapVTKViewer methods
// ----------------------------------------------------------------------------

function vtkFullCoreVTKViewer(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkFullCoreVTKViewer');

  // Internal pipeline
  model.lookupTable = vtkColorTransferFunction.newInstance();
  model.stack = [];

  // baffle, vessel, pads
  model.corePipelines = [];

  publicAPI.setData = macro.chain((viz) => {
    publicAPI.removeAllActors();
    if (!viz || !viz.core) {
      return;
    }

    model.labels = viz.names;

    const { colors, cells, rods, assembly, core } = viz;
    const matIdMapping = vtkRodMapVTKViewer.processColors(
      colors,
      model.lookupTable
    );
    const cellMap = vtkRodMapVTKViewer.processCells(cells, matIdMapping);
    const rodsCells = vtkRodMapVTKViewer.processRods(rods);
    const offset = vtkCoreMapVTKViewer.processAssembly(
      assembly,
      cellMap,
      rodsCells
    );

    // process all core maps
    Object.keys(core).forEach((mapId) => {
      vtkCoreMapVTKViewer.processCoreMap(
        core.pitch,
        core.size,
        core[mapId],
        cellMap
      );
    });

    // extract baffle
    const baffle = extractBaffleLayoutFrom(core, -viz.cellPitch / 2);
    // vessel
    const vesselCell = extractVesselAsCell(core);
    // plates
    const plates = extractPlates(core);
    // pads
    const pads = extractPads(core);
    // grids
    const grids = extractGrids(viz);

    // create rod pipeline
    vtkRodMapVTKViewer.createGlyphPipeline(publicAPI, model, cellMap);

    // add baffle
    for (let i = baffle.pieces.length - 1; i >= 0; i--) {
      const piece = vtkCubeSource.newInstance(baffle.pieces[i]);
      const mapper = vtkMapper.newInstance();
      const actor = vtkActor.newInstance();
      mapper.setInputConnection(piece.getOutputPort());
      actor.setMapper(mapper);
      actor.getProperty().set(vtkVTKViewer.PROPERTY_SETTINGS);

      model.corePipelines.push({
        id: 'baffleID',
        actor,
        mapper,
        source: piece,
        hasLayers: false,
        materials: [baffle.mat],
      });

      publicAPI.addActor(actor);
    }

    // add vessel
    const vesselMap = vtkRodMapVTKViewer.processCells(vesselCell, matIdMapping);
    const vessel = vesselMap[core.vesselSpec.name];

    const vesselPipeline = {
      id: 'vesselID',
      actor: vtkActor.newInstance(),
      mapper: vtkMapper.newInstance({
        lookupTable: model.lookupTable,
        useLookupTableScalarRange: true,
      }),
      source: vtkConcentricCylinderSource.newInstance({
        // center of core
        center: [
          (core.size / 2) * core.pitch,
          (core.size / 2) * core.pitch,
          core.height / 2,
        ],
        height: core.height,
        radius: vessel.radius,
        cellFields: vessel.cellFields,
        resolution: model.fullResolution,
        skipInnerFaces: true,
      }),
      // will be used by applyVisibility
      hasLayers: true,
      // ignore innermost layer, since that's where the
      // core resides (and is probably surrounded by some moderator)
      // indices in the array correspond to the layer (inner to outer)
      forceMask: [true],
      // materials used to construct the vessel,
      // in order from inner to outer.
      materials: core.vesselSpec.mats,
    };
    vesselPipeline.actor.getProperty().set(vtkVTKViewer.PROPERTY_SETTINGS);
    vesselPipeline.actor.setMapper(vesselPipeline.mapper);
    vesselPipeline.mapper.setInputConnection(
      vesselPipeline.source.getOutputPort()
    );

    model.corePipelines.push(vesselPipeline);
    publicAPI.addActor(vesselPipeline.actor);

    // add plates
    for (let i = 0; i < plates.length; i++) {
      const plate = plates[i];
      if (plate) {
        // center of core
        const center = [
          (core.size / 2) * core.pitch,
          (core.size / 2) * core.pitch,
          plate.name === 'lower'
            ? -(plate.height / 2)
            : core.height + plate.height / 2,
        ];

        const actor = vtkActor.newInstance();
        const mapper = vtkMapper.newInstance({
          lookupTable: model.lookupTable,
          useLookupTableScalarRange: true,
        });
        const source = vtkConcentricCylinderSource.newInstance({
          center,
          height: plate.height,
          radius: plate.radii,
          cellFields: plate.mats.map((m) => matIdMapping.indexOf(m)),
          resolution: model.fullResolution,
          skipInnerFaces: true,
        });

        actor.getProperty().set(vtkVTKViewer.PROPERTY_SETTINGS);
        actor.setMapper(mapper);
        mapper.setInputConnection(source.getOutputPort());

        model.corePipelines.push({
          id: 'PlatesID',
          actor,
          mapper,
          source,
          hasLayers: true,
          materials: plate.mats,
        });

        publicAPI.addActor(actor);
      }
    }

    // add pads
    const padResolution = Math.ceil(120 / pads.length);
    for (let i = 0; i < pads.length; i++) {
      const pad = pads[i];
      // center of core
      const center = [
        (core.size / 2) * core.pitch,
        (core.size / 2) * core.pitch,
        core.height / 2,
      ];

      const actor = vtkActor.newInstance();
      const mapper = vtkMapper.newInstance({
        lookupTable: model.lookupTable,
        useLookupTableScalarRange: true,
      });

      const source = vtkConcentricCylinderSource.newInstance({
        center,
        height: core.height + EPSILON,
        radius: pad.radii,
        startTheta: pad.theta[0],
        endTheta: pad.theta[1],
        cellFields: pad.mats.map((m) => matIdMapping.indexOf(m)),
        resolution: model.fullResolution,
        skipInnerFaces: true,
      });

      actor.getProperty().set(vtkVTKViewer.PROPERTY_SETTINGS);
      actor.setMapper(mapper);
      mapper.setInputConnection(source.getOutputPort());

      model.corePipelines.push({
        id: 'PadsID',
        actor,
        mapper,
        source,
        hasLayers: true,
        forceMask: [true],
        materials: pad.mats,
      });

      publicAPI.addActor(actor);
    }

    // add grid
    if (grids) {
      const { pointsData, scalingData, colorData, mats } = grids;
      const source = vtkPolyData.newInstance();
      source.getPoints().setData(pointsData, 3);
      source.getPointData().addArray(
        vtkDataArray.newInstance({
          name: 'scaling',
          values: scalingData,
          numberOfComponents: 3,
        })
      );
      source.getPointData().setScalars(
        vtkDataArray.newInstance({
          name: 'color',
          values: colorData.map((m) => matIdMapping.indexOf(String(m))),
        })
      );
      const cube = vtkCubeSource.newInstance();
      const mapper = vtkGlyph3DMapper.newInstance({
        useLookupTableScalarRange: true,
        lookupTable: model.lookupTable,
        orient: false,
        scaling: true,
        scaleArray: 'scaling',
        colorArray: 'color',
        scaleMode: vtkGlyph3DMapper.ScaleModes.SCALE_BY_COMPONENTS,
      });
      const actor = vtkActor.newInstance();

      mapper.setInputData(source, 0);
      mapper.setInputConnection(cube.getOutputPort(), 1);
      actor.setMapper(mapper);

      model.corePipelines.push({
        id: 'GridID',
        source,
        mapper,
        actor,
        hasLayers: false,
        materials: mats,
      });

      publicAPI.addActor(actor);
    }
  }, publicAPI.setData);

  // --------------------------------------------------------------------------

  publicAPI.setSourceResolution = (resolution) => {
    if (model.sourceResolution === resolution) {
      return;
    }
    model.sourceResolution = resolution;
    for (let i = 0; i < model.stack.length; i++) {
      const { glyph } = model.stack[i];
      glyph.setResolution(resolution);
    }
  };

  // --------------------------------------------------------------------------

  publicAPI.applyVisibility = () => {
    // rods/cells
    vtkRodMapVTKViewer.applyVisibility(publicAPI, model);

    for (let i = 0; i < model.corePipelines.length; i++) {
      const {
        id,
        actor,
        source,
        hasLayers,
        forceMask,
        materials,
      } = model.corePipelines[i];

      if (hasLayers) {
        for (let j = 0; j < materials.length; j++) {
          let mask = false;
          if (forceMask && j < forceMask.length) {
            mask = forceMask[j];
          } else {
            mask = !publicAPI.getObjectVisibility(materials[j]);
          }
          source.setMaskLayer(j, mask);
        }
      } else {
        // assume we should just toggle the actor visibility based
        // on the first material. (this is for baffle)
        actor.setVisibility(publicAPI.getObjectVisibility(materials[0]));
      }
      // toggle visibility for actor itself
      actor.setVisibility(publicAPI.getObjectVisibility(id));
    }
  };

  // --------------------------------------------------------------------------

  publicAPI.getVisibiltyOptions = () => {
    const opts = vtkRodVTKViewer.getVisibiltyOptions(publicAPI, model);

    // include materials from baffle, vessel, plates
    const mats = [].concat(...model.corePipelines.map((p) => p.materials));

    const alreadyAdded = new Map();
    for (let i = 0; i < opts.length; i++) {
      alreadyAdded.set(opts[i].id, true);
    }

    for (let i = 0; i < mats.length; i++) {
      const mat = mats[i];
      if (!alreadyAdded.has(mat)) {
        opts.push({
          id: mat,
          label: model.labels[mat],
          type: 'material',
        });
      }
    }

    // add baffle, vessel, plates, pads
    opts.push({
      id: 'baffleID',
      label: 'Baffle',
      type: 'structure',
    });

    opts.push({
      id: 'vesselID',
      label: 'Vessel',
      type: 'structure',
    });

    opts.push({
      id: 'PlatesID',
      label: 'Plates',
      type: 'structure',
    });

    opts.push({
      id: 'PadsID',
      label: 'Pads',
      type: 'structure',
    });

    opts.push({
      id: 'GridID',
      label: 'Grid',
      type: 'structure',
    });

    return opts;
  };

  // --------------------------------------------------------------------------

  // Automatic LOD when interacting
  publicAPI.onInteraction((interaction) => {
    publicAPI.setSourceResolution(
      interaction ? model.lodResolution : model.fullResolution
    );
  });
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  sourceResolution: 20,
  lodResolution: 4,
  fullResolution: 60,
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Object methods
  vtkVTKViewer.extend(publicAPI, model);
  macro.setGet(publicAPI, model, [
    'lodResolution',
    'fullResolution',
    'sourceResolution',
  ]);

  // Object specific methods
  vtkFullCoreVTKViewer(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkFullCoreVTKViewer');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
