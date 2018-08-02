import SvgIcon from 'simput/src/components/widgets/SvgIcon';

// ----------------------------------------------------------------------------

export default {
  name: 'AboutBox',
  components: {
    SvgIcon,
  },
  data() {
    return {
      version: window.SIMPUT_VERSION || 'not available',
    };
  },
};
