import { mapState } from 'vuex';

// ---------------------------------------------------------------------------

export default {
  name: 'PropertyFactory',
  props: ['prop', 'viewData'],
  computed: mapState({
    component(state) {
      return state.properties.mapping[this.prop.ui.propType.toLowerCase()];
    },
  }),
};
