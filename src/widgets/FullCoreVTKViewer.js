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
  vtkFullCoreVTKViewer(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkFullCoreVTKViewer');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
