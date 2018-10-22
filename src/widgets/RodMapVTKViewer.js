import macro from 'vtk.js/Sources/macro';
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkColorTransferFunction from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction';
import vtkConcentricCylinderSource from 'vtk.js/Sources/Filters/Sources/ConcentricCylinderSource';
import vtkCubeSource from 'vtk.js/Sources/Filters/Sources/CubeSource';
import vtkPlaneSource from 'vtk.js/Sources/Filters/Sources/PlaneSource';
import vtkDataArray from 'vtk.js/Sources/Common/Core/DataArray';
import vtkGlyph3DMapper from 'vtk.js/Sources/Rendering/Core/Glyph3DMapper';
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper';
import vtkPolyData from 'vtk.js/Sources/Common/DataModel/PolyData';

import vtkVTKViewer from './VTKViewer';
import vtkRodVTKViewer from './RodVTKViewer';

// ----------------------------------------------------------------------------

function processColors(colors, lookupTable) {
  const materialIds = Object.keys(colors);
  const RGBPoints = [];
  for (let i = 0; i < materialIds.length; i++) {
    RGBPoints.push(i);
    RGBPoints.push(colors[materialIds[i]][0]);
    RGBPoints.push(colors[materialIds[i]][1]);
    RGBPoints.push(colors[materialIds[i]][2]);
  }

  lookupTable.applyColorMap({ RGBPoints });

  return materialIds;
}

// ----------------------------------------------------------------------------

function processCells(cells, materialIds) {
  const cellMap = {};

  const names = Object.keys(cells);
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    const cell = cells[name];
    const radii = [];
    const materials = [];
    const cellFields = [];

    for (let j = 0; j < cell.length; j++) {
      const { material, radius } = cell[j];
      radii.push(radius);
      materials.push(material);
      cellFields.push(materialIds.indexOf(material));
    }

    cellMap[name] = {
      radius: radii,
      cellFields,
      materials,
      center: [],
      scale: [],
      assembly: {},
    };
  }
  return cellMap;
}

// ----------------------------------------------------------------------------

function processRods(rods) {
  const rodsMap = {};
  const ids = Object.keys(rods);
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const rod = rods[id];
    const cellMap = {};
    rodsMap[id] = cellMap;
    let currentZ = rod.offset;
    for (let j = 0; j < rod.cells.length; j++) {
      const { cell, length } = rod.cells[j];
      if (!cellMap[cell]) {
        cellMap[cell] = [];
      }
      cellMap[cell].push([currentZ + length / 2, length]);
      currentZ += length;
    }
  }
  return rodsMap;
}

// ----------------------------------------------------------------------------

function createGlyphPipeline(publicAPI, model, cellMap) {
  model.stack = [];

  const cellNames = Object.keys(cellMap);
  for (let i = 0; i < cellNames.length; i++) {
    const { lookupTable, sourceResolution } = model;
    const { radius, cellFields, center, scale, materials } = cellMap[
      cellNames[i]
    ];

    const source = vtkPolyData.newInstance();
    source.getPoints().setData(Float32Array.from(center), 3);
    source.getPointData().addArray(
      vtkDataArray.newInstance({
        name: 'scale',
        values: Float32Array.from(scale),
        numberOfComponents: 3,
      })
    );

    const glyph = vtkConcentricCylinderSource.newInstance({
      resolution: sourceResolution,
      radius,
      cellFields,
    });

    const mapper = vtkGlyph3DMapper.newInstance({
      lookupTable,
      useLookupTableScalarRange: true,
      orient: false,
      scaling: true,
      scaleArray: 'scale',
      scaleMode: vtkGlyph3DMapper.ScaleModes.SCALE_BY_COMPONENTS,
    });
    const actor = vtkActor.newInstance({ scale: [1, 1, model.zScaling] });

    actor.getProperty().set(vtkVTKViewer.PROPERTY_SETTINGS);
    actor.setMapper(mapper);
    mapper.setInputData(source, 0);
    mapper.setInputConnection(glyph.getOutputPort(), 1);

    model.stack.push({
      id: cellNames[i],
      source,
      glyph,
      mapper,
      actor,
      materials,
    });
    publicAPI.addActor(actor);
  }
  publicAPI.renderLater();
}

// ----------------------------------------------------------------------------

function applyVisibility(publicAPI, model) {
  if (!model.stack) {
    return;
  }
  for (let i = 0; i < model.stack.length; i++) {
    const { id, materials, glyph, actor } = model.stack[i];
    actor.setVisibility(publicAPI.getObjectVisibility(id));
    for (let j = 0; j < materials.length; j++) {
      glyph.setMaskLayer(j, !publicAPI.getObjectVisibility(materials[j]));
    }
  }
  publicAPI.renderLater();
}

// ----------------------------------------------------------------------------

function createGridPipeline() {
  const source = vtkPlaneSource.newInstance();
  const mapper = vtkMapper.newInstance({ scalarVisibility: false });
  const actor = vtkActor.newInstance();

  actor
    .getProperty()
    .set(Object.assign({ representation: 1 }, vtkVTKViewer.PROPERTY_SETTINGS));
  actor.setMapper(mapper);
  mapper.setInputConnection(source.getOutputPort());
  return { source, mapper, actor };
}

// ----------------------------------------------------------------------------

function updateGrids(gridList, size, sideLength, height, offset) {
  const actors = [];
  const split = gridList.length > 2 ? gridList.length - 1 : 1;
  for (let i = 0; i < gridList.length; i++) {
    const z = i * height / split;
    gridList[i].source.setXResolution(size);
    gridList[i].source.setYResolution(size);
    gridList[i].source.setOrigin(-offset, -offset, z);
    gridList[i].source.setPoint1(sideLength - offset, -offset, z);
    gridList[i].source.setPoint2(-offset, sideLength - offset, z);
    actors.push(gridList[i].actor);
  }
  return actors;
}

// ----------------------------------------------------------------------------
// vtkRodVTKViewer methods
// ----------------------------------------------------------------------------

function vtkRodMapVTKViewer(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkRodMapVTKViewer');

  // Internal pipeline
  model.lookupTable = vtkColorTransferFunction.newInstance();
  model.stack = [];

  model.sourceCtx = vtkCubeSource.newInstance();
  model.mapperCtx = vtkMapper.newInstance({ scalarVisibility: false });
  model.actorCtx = vtkActor.newInstance();

  model.actorCtx
    .getProperty()
    .set(Object.assign({ representation: 1 }, vtkVTKViewer.PROPERTY_SETTINGS));
  model.actorCtx.setMapper(model.mapperCtx);
  model.mapperCtx.setInputConnection(model.sourceCtx.getOutputPort());

  model.gridList = [createGridPipeline(), createGridPipeline()];

  // viz = {
  //   selected: 'A',
  //   names: {
  //     1: 'Water',
  //     5: 'Fuel assembly',
  //     10: 'Core assembly',
  //   },
  //   cellPitch: 1.26,
  //   colors: {
  //     mod: [0, 0, 0.5],
  //     he: [0, 0.5, 0.3],
  //     zirc: [0.5, 0.5, 0.3],
  //     ss: [0.4, 0.5, 0.4],
  //   },
  //   cells: {
  //      A: [
  //        { material: 'mod', radius: 0.2 },
  //        { material: 'he', radius: 0.3 },
  //        { material: 'zirc', radius: 0.4 },
  //        { material: 'ss', radius: 0.5 },
  //      ],
  //      B: [],
  //      C: [],
  //   },
  //   rods: {
  //     insert: {
  //       offset: 10,
  //       length: 400,
  //       cells: [
  //         { cell: 'A', length: 10 },
  //         { cell: 'B', length: 200 },
  //         { cell: 'A', length: 5 },
  //         { cell: 'C', length: 10 },
  //       ],
  //     },
  //     control: {
  //       ...
  //     }
  //   },
  //   assembly: {
  //     fuel: {
  //       pitch: 1.27,
  //       size: 17,
  //       grid: [1,2,1,2,1,2,1,2,1],
  //     },
  //     insert: {
  //       pitch: 1.27,
  //       size: 17,
  //       grid: [1,2,1,2,1,2,1,2,1],
  //     }
  //   },
  //   core: {
  //     pitch: 25,
  //     size: 15,
  //     gridAssembly: [10,20,10,20,10,20,10,20,10],
  //     gridInsertControls: [10,20,10,20,10,20,10,20,10],
  //     gridDetectors: [10,20,10,20,10,20,10,20,10],
  //   },
  // }
  publicAPI.setData = macro.chain((viz) => {
    publicAPI.removeAllActors();
    if (!viz || !viz.assembly || !viz.assembly[viz.selected]) {
      return;
    }

    model.labels = viz.names;

    const { colors, cells, rods } = viz;
    const { size, grid, pitch } = viz.assembly[viz.selected];

    const matIdMapping = processColors(colors, model.lookupTable);
    const cellMap = processCells(cells, matIdMapping);
    const rodsCells = processRods(rods);

    // Fill cell centers
    let maxLength = 0;
    for (let idx = 0; idx < grid.length; idx++) {
      const x = (idx % size) * pitch;
      const y = Math.floor(idx / size) * pitch;
      const rod = rodsCells[grid[idx]];
      if (rod) {
        const cellIds = Object.keys(rod);
        for (let cIdx = 0; cIdx < cellIds.length; cIdx++) {
          const cell = cellMap[cellIds[cIdx]];
          const zList = rod[cellIds[cIdx]];
          for (let zIdx = 0; zIdx < zList.length; zIdx++) {
            const [z, length] = zList[zIdx];
            cell.center.push(x);
            cell.center.push(y);
            cell.center.push(z);
            cell.scale.push(1);
            cell.scale.push(1);
            cell.scale.push(length);

            if (maxLength < length) {
              maxLength = length;
            }
          }
        }
      }
    }

    if (viz.core && viz.core.height && maxLength < viz.core.height) {
      maxLength = viz.core.height;
    }

    // Adjust bounding box size
    const sideLength = size * pitch;
    model.sourceCtx.setXLength(sideLength);
    model.sourceCtx.setYLength(sideLength);
    model.sourceCtx.setZLength(maxLength);
    model.sourceCtx.setCenter(
      (sideLength - pitch) / 2,
      (sideLength - pitch) / 2,
      maxLength / 2
    );

    // create pipeline
    publicAPI.addActor(model.actorCtx);
    updateGrids(model.gridList, size, sideLength, maxLength, pitch / 2).forEach(
      publicAPI.addActor
    );
    createGlyphPipeline(publicAPI, model, cellMap);
  }, publicAPI.setData);

  // --------------------------------------------------------------------------

  publicAPI.applyVisibility = () => applyVisibility(publicAPI, model);

  // --------------------------------------------------------------------------

  publicAPI.getVisibiltyOptions = () =>
    vtkRodVTKViewer.getVisibiltyOptions(publicAPI, model);
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  sourceResolution: 60,
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Object methods
  vtkVTKViewer.extend(publicAPI, model);

  // Object specific methods
  vtkRodMapVTKViewer(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkRodMapVTKViewer');

// ----------------------------------------------------------------------------

export default {
  newInstance,
  extend,
  processColors,
  processCells,
  processRods,
  createGlyphPipeline,
  applyVisibility,
  createGridPipeline,
  updateGrids,
};
