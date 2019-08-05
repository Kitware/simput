import { mapGetters } from 'vuex';

// ---------------------------------------------------------------------------

export default {
  name: 'PropertyFactory',
  props: ['prop', 'viewData'],
  computed: {
    ...mapGetters({
      getComponent: 'SIMPUT_COMPONENT_GET',
    }),
    component() {
      return this.getComponent(this.prop.ui.propType);
    },
  },
};
