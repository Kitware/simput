import Vue from 'vue';

import ReaderFactory from 'simput/src/io/ReaderFactory';
import { Mutations, Actions } from 'simput/src/stores/types';

// ----------------------------------------------------------------------------

function allWithErrors(promises) {
  return new Promise((resolve, reject) => {
    let okayCount = 0;
    const errors = Array(promises.length);
    Promise.all(
      promises.map((promise, index) =>
        promise
          .then((result) => {
            okayCount += 1;
            return result;
          })
          .catch((error) => {
            errors[index] = error;
          })
      )
    ).then((results) => {
      if (okayCount === promises.length) {
        resolve(results);
      } else {
        reject(errors);
      }
    });
  });
}

// ----------------------------------------------------------------------------

function onLoadOkay(commit) {
  commit(Mutations.FILE_IDLE);
  commit(Mutations.SHOW_APP);
}

// ----------------------------------------------------------------------------

function onLoadErrored(commit, errors) {
  for (let i = 0; i < errors.length; ++i) {
    if (errors[i]) {
      commit(Mutations.FILE_SET_ERROR, {
        fileIndex: i,
        error: errors[i],
      });
    }
  }
  commit(Mutations.FILE_ERROR);
}

// ----------------------------------------------------------------------------

export default {
  state: {
    stage: 'idle',
    files: [],
    progresses: [],
    lastLoadedFilename: null,
  },

  getters: {
    FILE_TOTAL_PROGRESS(state) {
      return state.progresses.reduce((sum, v) => sum + (v || 0), 0);
    },
    FILE_INDETERMINATE_PROGRESS(state) {
      return state.files.reduce(
        (flag, { type }) => type === 'file' || flag,
        false
      );
    },
  },

  mutations: {
    FILE_SET_FILES(state, files) {
      Vue.set(state, 'files', files);
    },
    FILE_PRELOAD(state) {
      state.stage = 'preload';
    },
    FILE_LOAD(state) {
      state.stage = 'load';
      state.progresses = Array(state.files.length).fill(0);
    },
    FILE_ERROR(state) {
      state.stage = 'error';
    },
    FILE_IDLE(state) {
      // save last loaded file (assuming only 1 file was loaded)
      state.lastLoadedFilename = state.files[0].name || null;
      state.stage = 'idle';
      state.files = [];
    },
    FILE_SET_ERROR(state, { fileIndex, error }) {
      Vue.set(state.files[fileIndex], 'error', error);
    },
    FILE_UPDATE_PROGRESS(state, { index, progress }) {
      Vue.set(state.progresses, index, progress);
    },
  },

  actions: {
    PROMPT_FOR_FILES({ dispatch }) {
      const exts = ReaderFactory.listReaders().map((r) => r.ext);
      ReaderFactory.openFiles(exts, (files) =>
        dispatch(
          Actions.OPEN_FILES,
          Array.from(files).map((file) => ({ file }))
        )
      );
    },
    /**
     *
     * @param {Object[]} fileList list of files to open
     * @param {file} fileList[].file File object
     * @param {name?} fileList[].name full name of file
     * @param {isRaw?} fileList[].extension extension of ifle
     */
    OPEN_FILES({ commit, dispatch }, fileList) {
      const files = Array.from(fileList)
        .map((fileSpec) => ({
          type: 'file',
          name: fileSpec.name || fileSpec.file.name,
          file: fileSpec.file,
        }))
        .map((fileSpec) =>
          Object.assign(fileSpec, {
            extension: fileSpec.name.split('.').pop(),
          })
        );

      commit(Mutations.FILE_SET_FILES, files);
      dispatch(Actions.READ_FILES, files)
        .then((readers) => {
          readers.forEach(({ dataset, name, reader }) => {
            if (dataset && dataset.type) {
              commit(Mutations.SET_MODEL, dataset);
              dispatch(Actions.LOAD_TEMPLATE, dataset.type);
            } else if (reader && reader.getModel) {
              commit(Mutations.SET_MODEL, reader.getModel());
              dispatch(Actions.LOAD_TEMPLATE, reader.getModel().type);
            } else {
              console.error(dataset, reader, name);
            }
          });
        })
        .then(() => onLoadOkay(commit))
        .catch((errors) => onLoadErrored(commit, errors));
    },
    OPEN_REMOTE_FILES({ commit, dispatch }, { urls, names, types = [] }) {
      if (urls && urls.length && names && names.length) {
        const files = urls.map((url, index) => ({
          type: 'url',
          name: names[index],
          url,
        }));

        commit(Mutations.FILE_SET_FILES, files);
        dispatch(Actions.READ_REMOTE_FILES, { urls, names })
          .then((readers) => {
            // ReaderFactory.registerReadersToProxyManager(
            //   readers.map(({ reader, sourceType }, i) => ({
            //     reader,
            //     name: names[i],
            //     sourceType: types[i] || sourceType,
            //     metadata: { url: urls[i] },
            //   })),
            //   rootState.proxyManager
            // )
            console.log('FIXME... (b)', readers, types);
          })
          .then(() => onLoadOkay(commit))
          .catch((errors) => onLoadErrored(commit, errors));
      }
    },
    READ_REMOTE_FILES({ commit }, { urls, names }) {
      if (urls && urls.length && names && names.length) {
        commit(Mutations.FILE_LOAD);

        const progressCb = (index) => (progress) =>
          commit(Mutations.FILE_UPDATE_PROGRESS, {
            index,
            progress: (100 * progress.loaded) / progress.total / urls.length,
          });

        const promises = [];
        for (let i = 0; i < urls.length; ++i) {
          promises.push(
            ReaderFactory.downloadDataset(names[i], urls[i], progressCb(i))
          );
        }

        return allWithErrors(promises);
      }
      return Promise.reject();
    },
    /**
     *
     * @param {Object[]} files list of files to open
     * @param {file} files[].file File object
     * @param {name} files[].name full name of file
     * @param {rawInfo} files[].extension extension of ifle
     */
    READ_FILES({ commit }, files) {
      commit(Mutations.FILE_LOAD);

      const promises = files.map((file) =>
        ReaderFactory.loadFiles([file.file])
          .then(
            // only return single reader
            (readers) => readers[0]
          )
          .catch(console.error)
      );

      return allWithErrors(promises);
    },
  },
};
