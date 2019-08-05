import { mapGetters } from 'vuex';
import { Getters } from 'simput/src/stores/types';

// ----------------------------------------------------------------------------

export default {
  name: 'WorkflowMenu',
  computed: mapGetters({
    dataModel: 'SIMPUT_DATAMANAGER',
    getListComponentByName: 'SIMPUT_COMPONENT_GET',
  }),
  methods: {
    viewHasChildren(viewId) {
      const viewItem = this.dataModel.model.views[viewId];
      return 'size' in viewItem || 'children' in viewItem;
    },
  },
};
