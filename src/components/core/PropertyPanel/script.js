import { mapGetters } from 'vuex';
import { Getters } from 'simput/src/stores/types';

import PropertyFactory from 'simput/src/components/core/PropertyFactory';

// ----------------------------------------------------------------------------

export default {
  name: 'PropertyPanel',
  components: {
    PropertyFactory,
  },
  props: {
    input: {
      required: true,
    },
    viewData: {
      required: true,
    },
  },
  methods: {
    getPropertyDisplay(property) {
      const alwaysShow = () => true;
      return (property.show || alwaysShow)(this.viewData) ? 'block' : 'none';
    },
  },
};
