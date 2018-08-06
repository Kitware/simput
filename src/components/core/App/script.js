import { mapState, mapActions, mapMutations } from 'vuex';
import Mousetrap from 'mousetrap';

import AboutBox from 'simput/src/components/core/AboutBox';
import BrowserIssues from 'simput/src/components/core/BrowserIssues';
import ControlsDrawer from 'simput/src/components/core/ControlsDrawer';
import DragAndDrop from 'simput/src/components/widgets/DragAndDrop';
import ErrorBox from 'simput/src/components/core/ErrorBox';
import Landing from 'simput/src/components/core/Landing';
import SvgIcon from 'simput/src/components/widgets/SvgIcon';
import WorkflowContent from 'simput/src/components/core/WorkflowContent';
import { Actions, Mutations } from 'simput/src/stores/types';
import shortcuts from 'simput/src/shortcuts';

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

export default {
  name: 'App',
  components: {
    AboutBox,
    BrowserIssues,
    ControlsDrawer,
    DragAndDrop,
    ErrorBox,
    Landing,
    SvgIcon,
    WorkflowContent,
  },
  props: {},
  data() {
    return {
      aboutDialog: false,
      errorDialog: false,
      controlsDrawer: false,
      errors: [],
    };
  },
  computed: mapState({
    loadingState: 'loadingState',
    landingVisible: (state) => state.route === 'landing',
    smallScreen() {
      // vuetify xs is 600px, but our buttons collide at around 700, so
      // hide buttons under 768.
      return this.$vuetify.breakpoint.width < 768;
    },
    dialogType() {
      return this.smallScreen ? 'v-bottom-sheet' : 'v-dialog';
    },
    iconLogo() {
      return this.smallScreen ? 'simput-small' : 'simput';
    },
  }),
  watch: {
    landingVisible(value) {
      // matches the mobile breakpoint for navigation-drawer
      if (!value && this.$vuetify.breakpoint.mdAndUp) {
        this.controlsDrawer = true;
      } else if (value) {
        this.controlsDrawer = false;
      }
    },
  },
  mounted() {
    // attach keyboard shortcuts
    shortcuts.forEach(({ key, action }) => {
      if (Actions[action]) {
        Mousetrap.bind(key, (e) => {
          e.preventDefault();
          this.$store.dispatch(Actions[action]);
        });
      }
    });

    // listen for errors
    window.addEventListener('error', this.recordError);

    // listen for errors via console.error
    if (window.console) {
      this.origConsoleError = window.console.error;
      window.console.error = (...args) => {
        this.recordError(args.join(' '));
        return this.origConsoleError(...args);
      };
    }
  },
  beforeDestroy() {
    window.removeEventListener('error', this.recordError);

    if (this.origConsoleError) {
      window.console.error = this.origConsoleError;
    }

    shortcuts.forEach(({ key, action }) => {
      if (Actions[action]) {
        Mousetrap.unbind(key);
      }
    });
  },
  methods: Object.assign(
    mapMutations({
      showApp: Mutations.SHOW_APP,
      showLanding: Mutations.SHOW_LANDING,
      toggleLanding() {
        if (this.landingVisible) {
          this.showApp();
        } else {
          this.showLanding();
        }
      },
    }),
    mapActions({
      promptUserFiles: Actions.PROMPT_FOR_FILES,

      openSample: (dispatch, urls, names) => {
        // dispatch: delete all loaded files since this is only called
        // by clicking on sample data
        dispatch(Actions.OPEN_REMOTE_FILES, { urls, names }).then(() =>
          dispatch(Actions.RESET_WORKSPACE)
        );
      },

      openFiles: (dispatch, files) =>
        dispatch(
          Actions.OPEN_FILES,
          Array.from(files).map((file) => ({ file }))
        ),
    }),
    {
      recordError(error) {
        this.errors.push(error);
      },
    }
  ),
};
