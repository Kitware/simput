import { mapGetters } from 'vuex';
import { Getters } from 'simput/src/stores/types';

import GlobalSettings from 'simput/src/components/core/GlobalSettings';
import WorkflowMenu from 'simput/src/components/core/WorkflowMenu';

// ----------------------------------------------------------------------------

export default {
  name: 'ControlsDrawer',
  components: {
    GlobalSettings,
    WorkflowMenu,
  },
  computed: Object.assign(
    mapGetters({
      dataModel: Getters.SIMPUT_MODEL,
    })
  ),
  data() {
    return {
      activeTab: 0,
    };
  },
};
