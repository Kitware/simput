import samples from 'simput/src/samples';
import DragAndDrop from 'simput/src/components/widgets/DragAndDrop';
import { Mutations, Actions } from 'simput/src/stores/types';

export default {
  name: 'Landing',
  components: {
    DragAndDrop,
  },
  data() {
    return {
      samples,
    };
  },
  methods: {
    openModel(sample) {
      if (sample.goTo) {
        window.open(sample.goTo, '_blank');
      } else {
        this.$store.commit(Mutations.SET_MODEL, sample.model);
        this.$store.dispatch(Actions.SIMPUT_LOAD_TEMPLATE, sample.model.type);
      }
    },
  },
};
