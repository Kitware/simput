import macro from 'vtk.js/Sources/macro';
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkCubeSource from 'vtk.js/Sources/Filters/Sources/CubeSource';
import vtkSphereSource from 'vtk.js/Sources/Filters/Sources/SphereSource';
import vtkInteractorStyleManipulator from 'vtk.js/Sources/Interaction/Style/InteractorStyleManipulator';
import vtkInteractorStylePresets from 'vtk.js/Sources/Interaction/Style/InteractorStyleManipulator/Presets';
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper';
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

const PALETTE = [
  // from VeraInView, utils/ColorManager.js
  // A desaturated categorical color scheme. Compatible with greys, I think:
  // http://colorbrewer2.org/#type=qualitative&scheme=Set3&n=12
  [141 / 255, 211 / 255, 199 / 255, 1], // blue-green, teal
  [255 / 255, 237 / 255, 111 / 255, 1], // He, yellow
  [190 / 255, 186 / 255, 218 / 255, 1], // blue-purple, indigo
  [251 / 255, 128 / 255, 114 / 255, 1], // red
  [128 / 255, 177 / 255, 211 / 255, 1], // mod, blue
  [253 / 255, 180 / 255, 98 / 255, 1], // orange
  [179 / 255, 222 / 255, 105 / 255, 1], // green
  [252 / 255, 205 / 255, 229 / 255, 1], // pink
  [217 / 255, 217 / 255, 217 / 255, 1], // zirc, grey
  [188 / 255, 128 / 255, 189 / 255, 1], // purple
  [204 / 255, 235 / 255, 197 / 255, 1], // light green
  [255 / 255, 255 / 255, 179 / 255, 1], // light yellow
];

function createCubePipeline() {
  const cubeSource = vtkCubeSource.newInstance();
  const actor = vtkActor.newInstance();
  const mapper = vtkMapper.newInstance();

  actor.setMapper(mapper);
  mapper.setInputConnection(cubeSource.getOutputPort());
  actor.getProperty().setRepresentationToWireframe();
  actor.getProperty().setColor(1, 1, 1);
  actor.getProperty().setLighting(false);

  return { cubeSource, mapper, actor };
}

function createSpherePipeline(osc) {
  const source = vtkSphereSource.newInstance({ phiResolution: 60, thetaResolution: 60 });
  const actor = vtkActor.newInstance();
  const mapper = vtkMapper.newInstance();

  source.setCenterFrom(osc.center);
  source.setRadius(osc.radius);
  actor.getProperty().set(PROPERTY_SETTINGS);
  actor.setMapper(mapper);
  mapper.setInputConnection(source.getOutputPort());
  actor.getProperty().setColor(...PALETTE[osc.id % PALETTE.length]);

  return { source, mapper, actor, osc };
}

// ----------------------------------------------------------------------------
// gaussianVTKViewer methods
// ----------------------------------------------------------------------------

function gaussianVTKViewer(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('gaussianVTKViewer');

  // Local variables
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
  vtkInteractorStylePresets.applyPreset('2D', model.interactorStyle2D);

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
    // orientation = [0, 0, 1],
    viewUp = [0, 1, 0],
    zoom = 1
  ) => {
    const camera = model.renderer.getActiveCamera();
    const gridsize = (model.data && model.data.gridsize) || 0;
    camera.setFocalPoint(gridsize / 2, gridsize / 2, gridsize / 2);
    camera.setPosition(gridsize / 2, gridsize / 2, 4 * gridsize || 1);
    camera.setViewUp(...viewUp);
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

  publicAPI.setData = (data) => {
    // convert to integer.
    if (data.gridsize) data.gridsize = Math.floor(+data.gridsize) || 64;
    if (model.data !== data) {
      model.data = data;

      // update pipelines based on new info.
      if (model.cubePipeline) {
        const src = model.cubePipeline.cubeSource;
        if (src.getXLength() !== data.gridsize) {
          src.setXLength(data.gridsize);
          src.setYLength(data.gridsize);
          src.setZLength(data.gridsize);
          src.setCenter(
            data.gridsize / 2,
            data.gridsize / 2,
            data.gridsize / 2
          );
          // console.log('new gridsize', data.gridsize);
          publicAPI.resetCamera();
        }
      }

      if (data.oscillators) {
        publicAPI.removeAllActors();
        if (model.cubePipeline) publicAPI.addActor(model.cubePipeline.actor);
        model.spheres = [];
        data.oscillators.forEach((osc) => {
          const pipeline = createSpherePipeline(osc);
          model.spheres.push(pipeline);
          publicAPI.addActor(pipeline.actor);
        });
        publicAPI.setTime(model.time);
      }

      publicAPI.modified();
    }
  };

  // --------------------------------------------------------------------------
  // Add something to look at.
  model.cubePipeline = createCubePipeline();
  publicAPI.addActor(model.cubePipeline.actor);
  publicAPI.resetCamera();

  publicAPI.setTime = (time) => {
    if (model.spheres) {
      time = +time || 0;
      model.time = time;
      // console.log('Set time', time);
      // oscillator variation over time from "sensei/miniapps/oscillators/oscillator.h:Oscillator::evaluate()"

      model.spheres.forEach((pipeline) => {
        const { osc, source } = pipeline;
        let t = time * 2 * Math.PI;
        let val = 1;
        if (osc.type === 'damped') {
          const phi = Math.acos(osc.zeta);
          val =
            1.0 -
            Math.exp(-osc.zeta * osc.omega0 * t) *
              (Math.sin(
                Math.sqrt(1 - osc.zeta * osc.zeta) * osc.omega0 * t + phi
              ) /
                Math.sin(phi));
        } else if (osc.type === 'decaying') {
          t += 1.0 / osc.omega0;
          val = Math.sin(t / osc.omega0) / (osc.omega0 * t);
        } else if (osc.type === 'periodic') {
          t += 1.0 / osc.omega0;
          val = Math.sin(t / osc.omega0);
        } else {
          console.log('Unrecognized oscillator type:', osc.type);
        }
        source.setRadius(Math.abs(osc.radius * val));
      });
      publicAPI.renderLater();
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
  gaussianVTKViewer(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'gaussianVTKViewer');

// ----------------------------------------------------------------------------

export default { newInstance, extend, PROPERTY_SETTINGS };
