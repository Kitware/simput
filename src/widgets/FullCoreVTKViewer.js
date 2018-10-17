import macro from 'vtk.js/Sources/macro';
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkColorTransferFunction from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction';
import vtkCubeSource from 'vtk.js/Sources/Filters/Sources/CubeSource';
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper';

import vtkVTKViewer from './VTKViewer';
import vtkRodMapVTKViewer from './RodMapVTKViewer';
import vtkCoreMapVTKViewer from './CoreMapVTKViewer';
import vtkRodVTKViewer from './RodVTKViewer';

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
// vtkCoreMapVTKViewer methods
// ----------------------------------------------------------------------------

function vtkFullCoreVTKViewer(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkFullCoreVTKViewer');

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

  model.bafflePipelines = [];

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

    // baffle
    const baffle = extractBaffleLayoutFrom(core, viz.cellPitch);
    // Adjust bounding box size
    const sideLength = core.size * core.pitch;
    model.sourceCtx.setXLength(sideLength);
    model.sourceCtx.setYLength(sideLength);
    model.sourceCtx.setZLength(core.height);
    model.sourceCtx.setCenter(sideLength / 2, sideLength / 2, core.height / 2);

    publicAPI.addActor(model.actorCtx);
    // add grid
    vtkRodMapVTKViewer
      .updateGrids(model.gridList, core.size, sideLength, core.height, offset)
      .forEach(publicAPI.addActor);
    // create rod pipeline
    vtkRodMapVTKViewer.createGlyphPipeline(publicAPI, model, cellMap);

    // add baffle
    for (let i = baffle.pieces.length - 1; i >= 0; i--) {
      const piece = vtkCubeSource.newInstance(baffle.pieces[i]);
      const mapper = vtkMapper.newInstance();
      const actor = vtkActor.newInstance();
      mapper.setInputConnection(piece.getOutputPort());
      actor.setMapper(mapper);

      model.bafflePipelines.push({
        actor,
        mapper,
        piece,
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

  publicAPI.resetCamera = () => {
    const camera = model.renderer.getActiveCamera();
    model.renderer.resetCamera();

    model.interactorStyle3D.setCenterOfRotation(camera.getFocalPoint());
    model.interactorStyle2D.setCenterOfRotation(camera.getFocalPoint());

    publicAPI.renderAnimation();
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
  sourceResolution: 20,
  lodResolution: 4,
  fullResolution: 20,
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
