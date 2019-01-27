/* eslint-disable import/prefer-default-export */
import Vue from 'vue';
import Vuex from 'vuex';
import Vuetify from 'vuetify';

/* eslint-disable-next-line import/extensions */
import 'typeface-roboto';
import 'vuetify/dist/vuetify.min.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

// global symbol expose/export
import 'simput/src/expose';

import vtkURLExtract from 'vtk.js/Sources/Common/Core/URLExtract';

import App from 'simput/src/components/core/App';
import Store from 'simput/src/stores';
import { Actions, Mutations } from 'simput/src/stores/types';

import registerDefaultProperties from 'simput/src/components/properties/registerDefaults';
import HookManager from 'simput/src/core/HookManager';
import ReaderFactory from 'simput/src/io/ReaderFactory';

Vue.use(Vuetify);

export const { applyHook, registerHook } = HookManager;

export function registerWidget(name, component) {
  Store.commit(Mutations.ADD_PROPERTY_MAPPING, { name, component });
}

export function registerType(type, urls) {
  Store.commit(Mutations.REGISTER_TEMPLATE, { type, urls });
}

export function createViewer() {
  /* eslint-disable no-new */
  new Vue({
    el: '#root-container',
    components: { App },
    store: Store,
    template: '<App />',
  });

  // support history-based navigation
  function onRoute(event) {
    const state = event.state || {};
    if (state.app) {
      Store.commit(Mutations.SHOW_APP);
    } else {
      Store.commit(Mutations.SHOW_LANDING);
    }
  }
  Store.watch(
    (state) => state.route,
    (route) => {
      const state = window.history.state || {};
      if (route === 'landing' && state.app) {
        window.history.back();
      }
      if (route === 'app' && !state.app) {
        window.history.pushState({ app: true }, '');
      }
    }
  );
  window.history.replaceState({ app: false }, '');
  window.addEventListener('popstate', onRoute);

  // Register widgets
  registerDefaultProperties(registerWidget);

  return {
    processURLArgs() {
      const { url, type } = vtkURLExtract.extractURLParameters();
      if (url || type) {
        // don't flash landing
        Store.commit(Mutations.SHOW_APP);
      }

      // try URL first, then load type
      if (url) {
        return ReaderFactory.downloadDataset('data.zip', url).then((result) => {
          const { dataset } = result;
          if (dataset.type && dataset.data) {
            Store.commit(Mutations.SET_MODEL, {
              type: dataset.type,
              data: dataset.data,
            });
            return Store.dispatch(Actions.LOAD_TEMPLATE, dataset.type);
          }
          return Promise.reject(new Error('No model found in download'));
        });
      } else if (type) {
        Store.commit(Mutations.SET_MODEL, {
          type,
          data: {},
        });
        return Store.dispatch(Actions.LOAD_TEMPLATE, type);
      }
      return Promise.resolve();
    },
  };
}
