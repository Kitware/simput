import macro from 'vtk.js/Sources/macro';
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkColorTransferFunction from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction';
import vtkConcentricCylinderSource from 'vtk.js/Sources/Filters/Sources/ConcentricCylinderSource';
import vtkCubeSource from 'vtk.js/Sources/Filters/Sources/CubeSource';
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper';

import vtkVTKViewer from './VTKViewer';

// ----------------------------------------------------------------------------

function createCell(model, center, height, radius, cellFields, materials, id) {
  const { lookupTable, zScaling } = model;

  const source = vtkConcentricCylinderSource.newInstance({
    resolution: 60,
    startTheta: 180,
    endTheta: 360,
    height,
    center,
    radius,
    cellFields,
  });

  const mapper = vtkMapper.newInstance({
    lookupTable,
    useLookupTableScalarRange: true,
  });
  const actor = vtkActor.newInstance({ scale: [1, 1, zScaling] });

  actor.getProperty().set(vtkVTKViewer.PROPERTY_SETTINGS);
  actor.setMapper(mapper);
  mapper.setInputConnection(source.getOutputPort());

  return { source, mapper, actor, id, materials };
}

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
    const cellFields = [];
    const materials = [];

    for (let j = 0; j < cell.length; j++) {
      const { material, radius } = cell[j];
      radii.push(radius);
      materials.push(material);
      cellFields.push(materialIds.indexOf(material));
    }

    cellMap[name] = { radius: radii, cellFields, materials };
  }
  return cellMap;
}

// ----------------------------------------------------------------------------

function getVisibiltyOptions(publicAPI, model) {
  const mats = {};
  const list = [];
  if (model.stack) {
    for (let i = 0; i < model.stack.length; i++) {
      const { id, materials } = model.stack[i];
      list.push({ id, label: model.labels[id], type: 'cell' });
      for (let j = 0; j < materials.length; j++) {
        mats[materials[j]] = model.labels[materials[j]];
      }
    }
    const matIds = Object.keys(mats);
    while (matIds.length) {
      const id = matIds.pop();
      const label = model.labels[id];
      list.push({ id, label, type: 'material' });
    }
  }
  return list; // [{ id, label, type }, ] with type = material/cell
}

// ----------------------------------------------------------------------------
// vtkRodVTKViewer methods
// ----------------------------------------------------------------------------

function vtkRodVTKViewer(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkRodVTKViewer');

  // 2D navigation
  publicAPI.setParallelRendering(true);

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

  // viz = {
  //   selected: 'insert',
  //   cellPitch: 1.26,
  //   colors: {
  //     mod: [0, 0, 0.5],
  //     he: [0, 0.5, 0.3],
  //     zirc: [0.5, 0.5, 0.3],
  //     ss: [0.4, 0.5, 0.4],
  //   },
  //   cells: {
  //     A : [
  //       { material: 'mod', radius: 0.2 },
  //       { material: 'he', radius: 0.3 },
  //       { material: 'zirc', radius: 0.4 },
  //       { material: 'ss', radius: 0.5 },
  //     ],
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
  //   [...]
  // }
  publicAPI.setData = macro.chain((viz) => {
    publicAPI.removeAllActors();

    if (!viz.rods[viz.selected]) {
      return;
    }

    const { colors, cells, cellPitch } = viz;
    const {
      offset: originalOffset,
      length: totalLength,
      cells: layers,
    } = viz.rods[viz.selected];
    const matIdMapping = processColors(colors, model.lookupTable);
    const cellMap = processCells(cells, matIdMapping);

    model.labels = viz.names;
    model.stack = [];

    let offset = originalOffset;
    for (let i = 0; i < layers.length; i++) {
      const { cell, length } = layers[i];
      const { radius, cellFields, materials } = cellMap[cell];
      const cellPipeline = createCell(
        model,
        [0, 0, offset + length / 2],
        length,
        radius,
        cellFields,
        materials,
        cell
      );
      model.stack.push(cellPipeline);
      offset += length;
      publicAPI.addActor(cellPipeline.actor);
    }

    // Update context
    model.sourceCtx.setZLength(totalLength);
    model.sourceCtx.setXLength(cellPitch);
    model.sourceCtx.setYLength(cellPitch);
    model.sourceCtx.setCenter(0, 0, totalLength * 0.5);
    publicAPI.addActor(model.actorCtx);

    publicAPI.renderLater();
  }, publicAPI.setData);

  // --------------------------------------------------------------------------

  publicAPI.applyVisibility = () => {
    if (!model.stack) {
      return;
    }
    for (let i = 0; i < model.stack.length; i++) {
      const { id, materials, source, actor } = model.stack[i];
      actor.setVisibility(publicAPI.getObjectVisibility(id));
      for (let j = 0; j < materials.length; j++) {
        source.setMaskLayer(j, !publicAPI.getObjectVisibility(materials[j]));
      }
    }
    publicAPI.renderLater();
  };

  // --------------------------------------------------------------------------

  publicAPI.getVisibiltyOptions = () => getVisibiltyOptions(publicAPI, model);
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Object methods
  vtkVTKViewer.extend(publicAPI, model);

  // Object specific methods
  vtkRodVTKViewer(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkRodVTKViewer');

// ----------------------------------------------------------------------------

export default { newInstance, extend, getVisibiltyOptions };
