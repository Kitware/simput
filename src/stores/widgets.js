import Vue from 'vue';

export default {
  state: {},
  mutations: {
    ADD_WIDGET: (state, { component, priority = 0 }) => {
      if (!(priority in state.panels)) {
        Vue.set(state.panels, priority, []);
      }
      state.panels[priority].push(component);
    },
  },
};
