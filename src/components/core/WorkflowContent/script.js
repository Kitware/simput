import { mapState } from 'vuex';

import PropertyPanel from 'simput/src/components/core/PropertyPanel';

// ----------------------------------------------------------------------------

export default {
  name: 'WorkflowContent',
  components: {
    PropertyPanel,
  },
  computed: Object.assign(
    {
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
    mapState({
      dataManager: (state) => state.templates.dataManager,
    })
  ),
  methods: {
    onChange(data) {
      this.dataManager.updateViewData(data);
    },
  },
};
