import macro from 'vtk.js/Sources/macro';

// ----------------------------------------------------------------------------
// Constants
// ----------------------------------------------------------------------------

const SymmetryModes = {
  NONE: 0,
  QUADRANT_MIRROR: 1,
  QUADRANT_ROTATION: 2,
  OCTANT: 3,
};

const ReplacementMode = {
  SINGLE: 0,
  ALL: 1,
};

// ----------------------------------------------------------------------------
// Helpers methods
// ----------------------------------------------------------------------------

function none(size, i, j) {
  return [[i, j]];
}

function quadrantMirror(size, i, j) {
  const iComp = size - i - 1;
  const jComp = size - j - 1;
  return [[i, j], [iComp, j], [i, jComp], [iComp, jComp]];
}

function quadrantRotation(size, i, j) {
  const iComp = size - i - 1;
  const jComp = size - j - 1;
  return [[i, j], [jComp, i], [j, iComp], [iComp, jComp]];
}

function octant(size, i, j) {
  const iComp = size - i - 1;
  const jComp = size - j - 1;
  if (i === j) return quadrantMirror(size, i, j);
  return [
    [i, j],
    [iComp, j],
    [i, jComp],
    [iComp, jComp],
    [j, i],
    [jComp, i],
    [j, iComp],
    [jComp, iComp],
  ];
}

const SymmetryFn = [none, quadrantMirror, quadrantRotation, octant];

function createGrid(size, fillItem) {
  const grid = [];
  const totalSize = size * size;
  while (grid.length < totalSize) {
    grid.push(fillItem);
  }
  return grid;
}

// ----------------------------------------------------------------------------
// vtkGridMap methods
// ----------------------------------------------------------------------------

function vtkGridMap(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkGridMap');

  publicAPI.getGridEntry = (i, j) => model.grid[j * model.gridSize + i];

  publicAPI.setGridEntry = (i, j, value) => {
    const previousValue = publicAPI.getGridEntry(i, j);
    if (model.replacementMode === ReplacementMode.ALL) {
      for (let y = 0; y < model.gridSize; y++) {
        for (let x = 0; x < model.gridSize; x++) {
          const idx = y * model.gridSize + x;
          if (model.grid[idx] === previousValue) {
            model.grid[idx] = value;
          }
        }
      }
    } else {
      const fn = SymmetryFn[model.symmetry] || none;
      const list = fn(model.gridSize, i, j);
      while (list.length) {
        const [x, y] = list.pop();
        model.grid[y * model.gridSize + x] = value;
      }
    }
    if (model.autoResetReplacementMode) {
      model.replacementMode = ReplacementMode.SINGLE;
    }
    publicAPI.modified();
  };

  const superGridSize = publicAPI.setGridSize;
  publicAPI.setGridSize = (newSize) => {
    if (superGridSize(newSize)) {
      // Need to adjust our data model
      model.grid = createGrid(model.gridSize, model.emptyItem);
      return true;
    }
    return false;
  };

  publicAPI.setGrid = (grid) => {
    model.grid = grid || [];
    const totalSize = model.gridSize * model.gridSize;
    while (model.grid.length < totalSize) {
      model.grid.push(model.emptyItem);
    }
    publicAPI.modified();
  };

  publicAPI.indexToIJ = (idx) => [
    idx % model.gridSize,
    Math.floor(idx / model.gridSize),
  ];

  publicAPI.ijToIndex = (ij) => ij[0] + model.gridSize * ij[1];

  publicAPI.getIndices = (idx) => {
    if (model.replacementMode === ReplacementMode.ALL) {
      const value = model.grid[idx];
      const ids = [];
      for (let i = 0; i < model.grid.length; i++) {
        if (model.grid[i] === value) {
          ids.push(i);
        }
      }
      return ids;
    }

    const fn = SymmetryFn[model.symmetry] || none;
    const list = fn(model.gridSize, ...publicAPI.indexToIJ(idx));
    return list.map(publicAPI.ijToIndex);
  };

  /* eslint-disable default-case */
  /* eslint-disable no-fallthrough */
  publicAPI.getSymmetryAxialIndices = () => {
    const idx = [];
    const quadOffset = (model.gridSize - 1) / 2;
    switch (model.symmetry) {
      case SymmetryModes.OCTANT:
        for (let i = 0; i < model.gridSize; i++) {
          idx.push(i + i * model.gridSize);
          idx.push(model.gridSize - i - 1 + i * model.gridSize);
        }
      case SymmetryModes.QUADRANT_MIRROR:
      case SymmetryModes.QUADRANT_ROTATION:
        for (let i = 0; i < model.gridSize; i++) {
          idx.push(quadOffset + i * model.gridSize);
          idx.push(i + quadOffset * model.gridSize);
        }
    }
    return idx;
  };
  /* eslint-enable default-case */
  /* eslint-enable no-fallthrough */

  const superSymmetry = publicAPI.setSymmetry;
  publicAPI.setSymmetry = (mode) => {
    if (superSymmetry(mode)) {
      const range = Math.round(model.gridSize / 2 + 0.3);
      for (let j = 0; j < range; j++) {
        for (let i = 0; i < range; i++) {
          publicAPI.setGridEntry(i, j, publicAPI.getGridEntry(i, j));
        }
      }
    }
  };

  if (!model.grid) {
    publicAPI.setGridSize(model.gridSize);
  } else {
    const totalSize = model.gridSize * model.gridSize;
    while (model.grid.length < totalSize) {
      model.grid.push(model.emptyItem);
    }
  }
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  autoResetReplacementMode: true,
  emptyItem: undefined,
  gridSize: 17,
  replacementMode: ReplacementMode.SINGLE,
  symmetry: SymmetryModes.NONE,
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Object methods
  macro.obj(publicAPI, model);

  macro.setGet(publicAPI, model, [
    'autoResetReplacementMode',
    'emptyItem',
    'grid',
    'gridSize',
    'replacementMode',
    'symmetry',
  ]);

  // Object specific methods
  vtkGridMap(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkGridMap');

// ----------------------------------------------------------------------------

export default { newInstance, extend, SymmetryModes };
