import { mapGetters } from 'vuex';
import { Getters } from 'simput/src/stores/types';

import PropertyFactory from 'simput/src/components/core/PropertyFactory';

const alwaysShow = () => true;

// ----------------------------------------------------------------------------

export default {
  name: 'PropertyPanel',
  components: {
    PropertyFactory,
  },
  props: {
    panelData: {
      required: true,
    },
    viewData: {
      required: true,
    },
  },
  methods: {
    getPropertyDisplay(property) {
      return (property.show || alwaysShow)(this.viewData) ? 'block' : 'none';
    },
    updateViewData(newData) {
      this.$store.getters.SIMPUT_DATAMANAGER.updateViewData(newData);
    },
  },
};
