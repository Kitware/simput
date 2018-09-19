import Vue from 'vue';
import macro from 'vtk.js/Sources/macro';

import Cell2DPreview from './Cell2DPreview';

// --------------------------------------------------------------------------

function toRGB(color) {
  return `rgb(${color.map((i) => Math.floor(i * 255))})`;
}

// --------------------------------------------------------------------------

function vtkCell2DViewer(publicAPI, model) {
  model.classHierarchy.push('vtkCell2DViewer');

  const WORKING_CANVAS = document.createElement('canvas');

  // --------------------------------------------------------------------------

  function onToolTip({ x, y, width, height }) {
    const materials = model.cell.cells[model.cell.selected];
    const pitch = model.cell.cellPitch;

    // normalize to [0,1]
    const posx = x / width;
    const posy = y / height;
    if (posx >= 0 && posx <= 1.0 && posy >= 0 && posy <= 1.0) {
      const radius =
        pitch *
        Math.sqrt((posx - 0.5) * (posx - 0.5) + (posy - 0.5) * (posy - 0.5));
      for (let i = 0; i < materials.length; i++) {
        if (radius < materials[i].radius) {
          return model.toolTipCallback(materials[i]);
        }
      }
    }
    return '';
  }

  // --------------------------------------------------------------------------

  publicAPI.setContainer = (container) => {
    if (model.container && model.vm) {
      model.vm.$destroy();
      model.container.removeChild(model.vm.$el);
      model.vm = null;
    }

    model.container = container;

    if (container) {
      publicAPI.renderPreview();
    }
  };

  // --------------------------------------------------------------------------

  publicAPI.renderPreview = (props = {}) => {
    if (model.vm) {
      Object.keys(props).forEach((key) => {
        model.vm.$data[key] = props[key];
      });
    } else if (model.container) {
      const div = document.createElement('div');
      model.container.appendChild(div);

      model.vm = new Vue({
        el: div,
        components: { Cell2DPreview },
        data() {
          return {
            imageSrc: null,
          };
        },
        template: '<Cell2DPreview :imageSrc="imageSrc" />',
      });
    }
  };

  // --------------------------------------------------------------------------

  publicAPI.getSize = () => {
    if (model.container) {
      const { width, height } = model.container.getBoundingClientRect();
      return [Math.floor(width), Math.floor(height)];
    }
    return [0, 0];
  };

  // --------------------------------------------------------------------------

  publicAPI.captureImage = () => {};

  // --------------------------------------------------------------------------

  publicAPI.setData = macro.chain((cell) => {
    model.cell = cell;
    publicAPI.render();
  }, publicAPI.setData);

  // --------------------------------------------------------------------------

  publicAPI.render = () => {
    if (
      !model.cell ||
      !model.cell.cells ||
      !model.cell.cells[model.cell.selected]
    ) {
      return;
    }

    const pitch = model.cell.cellPitch;

    WORKING_CANVAS.setAttribute('width', model.size);
    WORKING_CANVAS.setAttribute('height', model.size);
    const ctx = WORKING_CANVAS.getContext('2d');
    ctx.clearRect(0, 0, model.size, model.size);
    const center = model.size / 2;

    const layers = model.cell.cells[model.cell.selected];

    let count = layers.length;
    while (count--) {
      const rgba = toRGB(model.cell.colors[layers[count].material]);
      // material radii are interpreted in terms of the assembly ppitch.
      const radius = layers[count].radius * model.size / pitch;
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = rgba;
      ctx.fill();
    }

    // draw an indication of the available size
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(100, 100, 100, 1)';
    const step = 2 * Math.PI / 16;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.arc(
        center,
        center,
        0.5 * model.size,
        2 * i * step,
        (2 * i + 1) * step,
        false
      );
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.arc(
        center,
        center,
        0.5 * model.size,
        (2 * i + 1) * step,
        (2 * i + 2) * step,
        false
      );
      ctx.stroke();
    }

    const imageSrc = WORKING_CANVAS.toDataURL();

    publicAPI.renderPreview({
      imageSrc,
      onToolTip,
    });
  };

  // --------------------------------------------------------------------------

  publicAPI.renderLater = publicAPI.render;

  // --------------------------------------------------------------------------

  publicAPI.resize = () => {};
  publicAPI.setZScale = () => {};
  publicAPI.setParallelRendering = () => {};
  publicAPI.resetCamera = () => {};
  publicAPI.addActor = () => {};
  publicAPI.removeAllActors = () => {};
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  size: 512,
  toolTipCallback: () => {},
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Object methods
  macro.obj(publicAPI, model);
  macro.setGet(publicAPI, model, ['toolTipCallback']);

  // Object specific methods
  vtkCell2DViewer(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkCell2DViewer');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
