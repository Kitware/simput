import Vue from 'vue';
import { Mutations, Actions } from 'simput/src/stores/types';

export default {
  state: {
    mapping: {},
  },
  getters: {
    SIMPUT_COMPONENT_GET(state) {
      return (name) => state.mapping[name.toLowerCase()];
    },
  },
  mutations: {
    SIMPUT_ADD_PROPERTY_MAPPING(state, { name, component }) {
      Vue.set(state.mapping, name.toLowerCase(), component);
    },
  },
};
