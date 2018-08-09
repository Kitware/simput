/* eslint-disable import/prefer-default-export */
import Vue from 'vue';
import Vuex from 'vuex';
import Vuetify from 'vuetify';

/* eslint-disable-next-line import/extensions */
import 'typeface-roboto';
import 'vuetify/dist/vuetify.min.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

import App from 'simput/src/components/core/App';
import createStore from 'simput/src/stores';
import { Mutations } from 'simput/src/stores/types';

import CellProperty from 'simput/src/components/properties/CellProperty';
import HookManager from './core/HookManager';

Vue.use(Vuex);
Vue.use(Vuetify);

export const { applyHook, registerHook } = HookManager;

export function createViewer() {
  const store = createStore();

  // register Property components
  store.commit(Mutations.ADD_PROPERTY_MAPPING, {
    name: 'TextField',
    component: CellProperty,
  });

  /* eslint-disable no-new */
  new Vue({
    el: '#root-container',
    components: { App },
    store,
    template: '<App />',
  });

  // support history-based navigation
  function onRoute(event) {
    const state = event.state || {};
    if (state.app) {
      store.commit(Mutations.SHOW_APP);
    } else {
      store.commit(Mutations.SHOW_LANDING);
    }
  }
  store.watch(
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

  return {
    processURLArgs() {
      // Add URL argument handling...
      // FIXME
    },
    // All components must have a unique name
    registerWidget(component) {
      store.commit(Mutations.ADD_WIDGET, { component });
    },
    registerType(type, urls) {
      store.commit(Mutations.REGISTER_TEMPLATE, { type, urls });
    },
  };
}
