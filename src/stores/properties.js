import Vue from 'vue';
import { Mutations, Actions } from 'simput/src/stores/types';

export default {
  state: {
    mapping: {},
  },

  mutations: {
    ADD_PROPERTY_MAPPING(state, { name, component }) {
      Vue.set(state.mapping, name.toLowerCase(), component);
    },
  },
};
