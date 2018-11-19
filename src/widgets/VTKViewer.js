import macro from 'vtk.js/Sources/macro';
// import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
// import vtkConcentricCylinderSource from 'vtk.js/Sources/Filters/Sources/ConcentricCylinderSource';
// import vtkCubeSource from 'vtk.js/Sources/Filters/Sources/CubeSource';
import vtkInteractorStyleManipulator from 'vtk.js/Sources/Interaction/Style/InteractorStyleManipulator';
import vtkInteractorStylePresets from 'vtk.js/Sources/Interaction/Style/InteractorStyleManipulator/Presets';
// import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper';
import vtkOpenGLRenderWindow from 'vtk.js/Sources/Rendering/OpenGL/RenderWindow';
import vtkRenderer from 'vtk.js/Sources/Rendering/Core/Renderer';
import vtkRenderWindow from 'vtk.js/Sources/Rendering/Core/RenderWindow';
import vtkRenderWindowInteractor from 'vtk.js/Sources/Rendering/Core/RenderWindowInteractor';

// ----------------------------------------------------------------------------
// GLOBAL
// ----------------------------------------------------------------------------

const PROPERTY_SETTINGS = {
  diffuse: 0.7,
  ambient: 0.3,
};

const INTERACT_2D_PRESET = [
  { type: 'pan' },
  { type: 'zoom', options: { control: true } },
  { type: 'zoom', options: { button: 3 } },
  { type: 'zoom', options: { scrollEnabled: true } },
  { type: 'vrPan' },
  { type: 'gestureCamera' },
];

// ----------------------------------------------------------------------------
// vtkVTKViewer methods
// ----------------------------------------------------------------------------

function vtkVTKViewer(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkVTKViewer');

  // Local variables
  if (!model.visibilty) {
    model.visibilty = {};
  }
  model.renderWindow = vtkRenderWindow.newInstance();
  model.renderer = vtkRenderer.newInstance({ background: [0, 0, 0, 1] });
  model.renderWindow.addRenderer(model.renderer);
  model.camera = model.renderer.getActiveCamera();

  model.openglRenderWindow = vtkOpenGLRenderWindow.newInstance();
  model.renderWindow.addView(model.openglRenderWindow);

  model.interactor = vtkRenderWindowInteractor.newInstance();
  model.interactor.setView(model.openglRenderWindow);

  model.interactorStyle3D = vtkInteractorStyleManipulator.newInstance();
  model.interactorStyle2D = vtkInteractorStyleManipulator.newInstance();
  model.interactor.setInteractorStyle(model.interactorStyle3D);

  model.actors = [];

  model.interactor.onStartAnimation(() => {
    publicAPI.invokeInteraction(true);
  });
  model.interactor.onEndAnimation(() => {
    publicAPI.invokeInteraction(false);
  });

  // Apply default interaction styles
  vtkInteractorStylePresets.applyPreset('3D', model.interactorStyle3D);
  vtkInteractorStylePresets.applyDefinitions(
    INTERACT_2D_PRESET,
    model.interactorStyle2D
  );

  // --------------------------------------------------------------------------

  publicAPI.setContainer = (container) => {
    if (model.container) {
      model.interactor.unbindEvents(model.container);
      model.openglRenderWindow.setContainer(null);
    }

    model.container = container;

    if (container) {
      model.openglRenderWindow.setContainer(container);
      model.openglRenderWindow.getCanvas().style.width = '100%';
      model.interactor.initialize();
      model.interactor.bindEvents(container);
    }
  };

  // --------------------------------------------------------------------------

  publicAPI.resize = () => {
    if (model.container) {
      const dims = model.container.getBoundingClientRect();
      model.openglRenderWindow.setSize(
        Math.floor(dims.width),
        Math.floor(dims.height)
      );
      publicAPI.renderAnimation();
    }
  };

  // --------------------------------------------------------------------------

  publicAPI.getSize = () => {
    if (model.container) {
      const { width, height } = model.container.getBoundingClientRect();
      return [Math.floor(width), Math.floor(height)];
    }
    return [400, 400];
  };

  // --------------------------------------------------------------------------

  publicAPI.setZScale = (zScaling) => {
    model.zScaling = zScaling;
    let count = model.actors.length || 0;
    while (count--) {
      model.actors[count].setScale(1, 1, zScaling);
    }

    publicAPI.renderAnimation();

    const camera = model.renderer.getActiveCamera();
    model.interactorStyle3D.setCenterOfRotation(camera.getFocalPoint());
    model.interactorStyle2D.setCenterOfRotation(camera.getFocalPoint());
  };

  publicAPI.getZScale = () => model.zScaling;

  // --------------------------------------------------------------------------

  publicAPI.captureImage = () => {
    model.renderer.setBackground(model.captureBackground);
    const capture = model.renderWindow.captureImages()[0];
    // Switch back to opaque background
    model.renderer.setBackground(model.interactiveBackground);
    publicAPI.renderLater();
    return capture;
  };

  // --------------------------------------------------------------------------

  publicAPI.setParallelRendering = (useParallelRendering) => {
    model.interactor.setInteractorStyle(
      useParallelRendering ? model.interactorStyle2D : model.interactorStyle3D
    );
    model.renderer
      .getActiveCamera()
      .setParallelProjection(useParallelRendering);
    publicAPI.renderLater();
  };

  // --------------------------------------------------------------------------

  publicAPI.render = () => {
    model.renderWindow.render();
  };

  // --------------------------------------------------------------------------

  publicAPI.renderLater = () => {
    setTimeout(model.renderWindow.render, 0);
  };

  // --------------------------------------------------------------------------

  const cancelAnimation = macro.debounce(() => {
    model.interactor.cancelAnimation(publicAPI);
  }, model.lodTimeout); // Can't be dynamically set

  publicAPI.renderAnimation = () => {
    if (!model.interactor.isAnimating()) {
      model.interactor.requestAnimation(publicAPI);
    }
    cancelAnimation();
  };

  // --------------------------------------------------------------------------

  publicAPI.resetCamera = (
    orientation = null,
    viewUp = null,
    zoom = 1
  ) => {
    const camera = model.renderer.getActiveCamera();
    if (orientation) {
      camera.setPosition(...orientation);
    }
    if (viewUp) {
      camera.setViewUp(...viewUp);
    }
    model.renderer.resetCamera();
    camera.zoom(zoom);

    model.interactorStyle3D.setCenterOfRotation(camera.getFocalPoint());
    model.interactorStyle2D.setCenterOfRotation(camera.getFocalPoint());

    publicAPI.renderAnimation();
  };

  // --------------------------------------------------------------------------

  publicAPI.addActor = (a) => {
    model.actors.push(a);
    model.renderer.addActor(a);
  };

  // --------------------------------------------------------------------------

  publicAPI.removeAllActors = () => {
    while (model.actors.length) {
      model.renderer.removeActor(model.actors.pop());
    }
  };

  // --------------------------------------------------------------------------

  publicAPI.setObjectVisibility = (id, visible) => {
    model.visibilty[id] = visible;
  };

  // --------------------------------------------------------------------------

  publicAPI.getObjectVisibility = (id) => {
    if (id in model.visibilty) {
      return !!model.visibilty[id];
    }
    return true;
  };

  // --------------------------------------------------------------------------

  publicAPI.applyVisibility = () => {
    console.log('applyVisibility should be override');
  };

  // --------------------------------------------------------------------------

  publicAPI.getVisibiltyOptions = () => {
    console.log('getVisibiltyOptions should be override');
    return []; // { id, label, type } with type = material/cell
  };

  // --------------------------------------------------------------------------

  publicAPI.setData = (data) => {
    if (model.data !== data) {
      model.data = data;
      // clear visibility options on new data
      model.visibilty = {};
      publicAPI.modified();
    }
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  zScaling: 1,
  captureBackground: [0, 0, 0, 0],
  interactiveBackground: [0, 0, 0, 1],
  lodTimeout: 1000,
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Object methods
  macro.obj(publicAPI, model);
  macro.event(publicAPI, model, 'interaction');

  // Object specific methods
  vtkVTKViewer(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkVTKViewer');

// ----------------------------------------------------------------------------

export default { newInstance, extend, PROPERTY_SETTINGS };
