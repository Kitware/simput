import JSZip from 'jszip';
import Vue from 'vue';
import { Mutations, Actions } from 'simput/src/stores/types';
import ModelManager from 'simput/src/core/ModelManager';

function loadScript(url) {
  return new Promise((resolve, reject) => {
    const body = document.getElementsByTagName('body')[0];
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onload = resolve;
    body.appendChild(script);
  });
}

export default {
  state: {
    types: {},
    loaded: {},

    model: null,
    dataManager: null,
  },

  getters: {
    MODEL(state) {
      return state.model;
    },
    DATAMANAGER(state) {
      return state.dataManager;
    },
  },

  mutations: {
    SET_MODEL(state, model) {
      Vue.set(state, 'model', model);
    },
    SET_DATAMANAGER(state, dm) {
      Vue.set(state, 'dataManager', dm);
    },
    REGISTER_TEMPLATE(state, { type, urls }) {
      state.types[type] = { urls };
    },
    UPDATE_TYPE_STATUS(state, { type, status }) {
      state.loaded[type] = status;
    },
  },

  actions: {
    LOAD_TEMPLATE({ commit, state }, type) {
      const finishLoad = () => {
        const module = window.Simput.types[type];

        // Initialize hooks
        if (module.hooks) {
          module.hooks();
        }

        const dataManager = new ModelManager(module, state.model);
        commit(Mutations.SET_DATAMANAGER, dataManager);
        commit(Mutations.SHOW_APP);
      };

      if (!state.loaded[type] && state.types[type] && state.types[type].urls) {
        commit(Mutations.UPDATE_TYPE_STATUS, { type, status: 'pending' });
        Promise.all(state.types[type].urls.map(loadScript)).then(() => {
          commit(Mutations.UPDATE_TYPE_STATUS, { type, status: 'loaded' });
          finishLoad();
        });
      } else if (state.loaded[type] === 'loaded') {
        finishLoad();
      }
    },
    SAVE({ rootState, state }) {
      const compressionLevel = 0; // no compression
      const output = state.dataManager.getOutput();
      console.log(state);
      const outputFileName =
        rootState.files.lastLoadedFilename ||
        `generated-output-${output.model.type}.zip`;
      const hasError =
        output.errors && Array.isArray(output.errors)
          ? output.errors.length
          : output.errors;

      if (!hasError) {
        const zip = new JSZip();
        zip.file('.simput.model', JSON.stringify(output.model));
        const files = output.results;
        Object.keys(files).forEach((fileName) => {
          zip.file(fileName, files[fileName]);
        });
        zip
          .generateAsync({
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: {
              level: compressionLevel,
            },
          })
          .then((blob) => {
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.setAttribute('href', url);
            anchor.setAttribute('download', outputFileName);
            anchor.click();
            setTimeout(() => URL.revokeObjectURL(url), 60000);
          });
      }
    },
  },
};
