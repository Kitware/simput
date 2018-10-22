import macro from 'vtk.js/Sources/macro';
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkColorTransferFunction from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction';
import vtkCubeSource from 'vtk.js/Sources/Filters/Sources/CubeSource';
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper';

import vtkVTKViewer from './VTKViewer';
import vtkRodMapVTKViewer from './RodMapVTKViewer';
import vtkRodVTKViewer from './RodVTKViewer';

// ----------------------------------------------------------------------------

function processAssembly(assemblyMap, cellMap, rodsCells) {
  let resultPitch = 0;
  const assemblyIds = Object.keys(assemblyMap);
  while (assemblyIds.length) {
    const assemblyId = assemblyIds.pop();
    const { pitch, size, grid } = assemblyMap[assemblyId];
    resultPitch = pitch;

    // Fill cell centers
    for (let idx = 0; idx < grid.length; idx++) {
      const x = (idx % size) * pitch;
      const y = Math.floor(idx / size) * pitch;
      const rod = rodsCells[grid[idx]];
      if (rod) {
        const cellIds = Object.keys(rod);
        for (let cIdx = 0; cIdx < cellIds.length; cIdx++) {
          if (!cellMap[cellIds[cIdx]].assembly[assemblyId]) {
            cellMap[cellIds[cIdx]].assembly[assemblyId] = {
              center: [],
              scale: [],
            };
          }
          const cell = cellMap[cellIds[cIdx]].assembly[assemblyId];
          const zList = rod[cellIds[cIdx]];
          for (let zIdx = 0; zIdx < zList.length; zIdx++) {
            const [z, length] = zList[zIdx];
            cell.center.push(x);
            cell.center.push(y);
            cell.center.push(z);
            cell.scale.push(1);
            cell.scale.push(1);
            cell.scale.push(length);
          }
        }
      }
    }
  }
  return resultPitch / 2;
}

// ----------------------------------------------------------------------------

function processCoreMap(apitch, size, grid, cellMap) {
  const cellIds = Object.keys(cellMap);

  // Fill cell centers
  for (let idx = 0; idx < grid.length; idx++) {
    const x = (idx % size) * apitch;
    const y = Math.floor(idx / size) * apitch;
    const assemblyId = grid[idx];

    for (let cIdx = 0; cIdx < cellIds.length; cIdx++) {
      const cell = cellMap[cellIds[cIdx]];
      if (cell.assembly[assemblyId]) {
        const { center, scale } = cell.assembly[assemblyId];
        for (let offset = 0; offset < center.length; offset += 3) {
          cell.center.push(center[offset + 0] + x);
          cell.center.push(center[offset + 1] + y);
          cell.center.push(center[offset + 2]);
          cell.scale.push(scale[offset]);
          cell.scale.push(scale[offset + 1]);
          cell.scale.push(scale[offset + 2]);
        }
      }
    }
  }
}

// ----------------------------------------------------------------------------
// vtkCoreMapVTKViewer methods
// ----------------------------------------------------------------------------

function vtkCoreMapVTKViewer(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkCoreMapVTKViewer');

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

  model.gridList = [
    vtkRodMapVTKViewer.createGridPipeline(),
    vtkRodMapVTKViewer.createGridPipeline(),
  ];

  // viz = {
  //   selected: 'gridAssembly',
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
    if (!viz || !viz.core || !viz.core[viz.selected]) {
      return;
    }

    model.labels = viz.names;

    const { colors, cells, rods, assembly, core, selected } = viz;
    const matIdMapping = vtkRodMapVTKViewer.processColors(
      colors,
      model.lookupTable
    );
    const cellMap = vtkRodMapVTKViewer.processCells(cells, matIdMapping);
    const rodsCells = vtkRodMapVTKViewer.processRods(rods);
    const offset = processAssembly(assembly, cellMap, rodsCells);
    processCoreMap(core.pitch, core.size, core[selected], cellMap);

    // Adjust bounding box size
    const sideLength = core.size * core.pitch;
    model.sourceCtx.setXLength(sideLength);
    model.sourceCtx.setYLength(sideLength);
    model.sourceCtx.setZLength(core.height);
    model.sourceCtx.setCenter(sideLength / 2, sideLength / 2, core.height / 2);

    // create pipeline
    publicAPI.addActor(model.actorCtx);
    vtkRodMapVTKViewer
      .updateGrids(model.gridList, core.size, sideLength, core.height, offset)
      .forEach(publicAPI.addActor);
    vtkRodMapVTKViewer.createGlyphPipeline(publicAPI, model, cellMap);
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

  publicAPI.applyVisibility = () =>
    vtkRodMapVTKViewer.applyVisibility(publicAPI, model);

  // --------------------------------------------------------------------------

  publicAPI.getVisibiltyOptions = () =>
    vtkRodVTKViewer.getVisibiltyOptions(publicAPI, model);

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
  sourceResolution: 60,
  lodResolution: 6,
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
  vtkCoreMapVTKViewer(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkCoreMapVTKViewer');

// ----------------------------------------------------------------------------

export default { newInstance, extend, processAssembly, processCoreMap };
