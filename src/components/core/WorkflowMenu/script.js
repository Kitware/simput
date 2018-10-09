import { mapGetters } from 'vuex';
import { Getters } from 'simput/src/stores/types';

// ----------------------------------------------------------------------------

export default {
  name: 'WorkflowMenu',
  computed: mapGetters({
    dataModel: Getters.DATAMANAGER,
  }),
  methods: {
    viewHasChildren(viewId) {
      const viewItem = this.dataModel.model.views[viewId];
      return 'size' in viewItem || 'children' in viewItem;
    },
    getListComponentByName(name) {
      return this.$store.state.properties.mapping[name.toLowerCase()];
    },
  },
};
