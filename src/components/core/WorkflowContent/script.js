import { mapGetters } from 'vuex';

import PropertyPanel from 'simput/src/components/core/PropertyPanel';

// ----------------------------------------------------------------------------

export default {
  name: 'WorkflowContent',
  components: {
    PropertyPanel,
  },
  computed: {
    ...mapGetters({
      dataManager: 'SIMPUT_DATAMANAGER',
    }),
    panelData() {
      if (this.dataManager) {
        return this.dataManager.getPropertyList();
      }
      return [];
    },
    viewData() {
      if (this.dataManager) {
        return this.dataManager.getActiveViewData();
      }
      return {};
    },
  },
};
