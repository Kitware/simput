import EditableList from '../EditableList';
import ViewerWidget from '../ViewerWidget';
import Rod2DPreview from '../Rod2DPreview';
import vtkRodVTKViewer from '../RodVTKViewer';
import ThreeDToolbar from '../ThreeDToolbar';

import CellDropdown from './CellDropdown';
import LengthInput from './LengthInput';

function toRGBA(color) {
  return `rgba(${Math.floor(color[0] * 255)}, ${Math.floor(
    color[1] * 255
  )}, ${Math.floor(color[2] * 255)}, ${color[3] === undefined ? 1 : color[3]})`;
}

// ----------------------------------------------------------------------------

export default {
  name: 'RodEditor',
  components: {
    EditableList,
    ViewerWidget,
    Rod2DPreview,
    ThreeDToolbar,
  },
  props: {
    prop: {
      required: true,
    },
    viewData: {
      required: true,
    },
  },
  data() {
    return {
      help: false,
      viewer3d: vtkRodVTKViewer.newInstance(),
    };
  },
  computed: {
    viewerData() {
      return Object.assign(
        {
          selected: this.viewData.id,
        },
        this.prop.ui.domain
      );
    },
    items() {
      const { data } = this.prop;
      if (data.value && data.value.length) {
        return data.value[0].stack.map((layer, idx) => {
          const color = this.prop.ui.domain.colors[layer.cell];
          // adds alpha channel
          const background = toRGBA(color);
          return Object.assign(
            {
              key: idx,
              color: background,
              label: this.prop.ui.domain.names[layer.cell],
            },
            layer
          );
        });
      }
      return [];
    },
    columns() {
      const viz = this.prop.ui.domain;
      return [
        {
          key: 'cell',
          dataKey: 'cell',
          label: 'Cell',
          classes: this.$style.centeredCell,
          render: {
            component: CellDropdown,
            props: {
              viz,
              onChange: this.onCellChange,
            },
          },
        },
        {
          key: 'length',
          dataKey: 'length',
          label: 'Length',
          classes: this.$style.centeredCell,
          render: {
            component: LengthInput,
            props: {
              onChange: this.onLengthChange,
            },
          },
        },
      ];
    },
    activeRod() {
      return (
        this.prop.ui.domain.rods[this.prop.viewData.id] || {
          offset: 0,
          length: 0,
        }
      );
    },
  },
  methods: {
    isVisible() {
      return this.prop.show(this.viewData);
    },
    addLayer(atIndex) {
      const { ui, data } = this.prop;
      if (data.value && data.value.length) {
        const cells = ui.domain.cells;
        const stack = data.value[0].stack;
        const afterIdx = atIndex + 1;
        stack.splice(afterIdx, 0, {
          cell: Object.keys(cells)[0], // pick first cell as default
          length: 0,
        });

        this.$emit('change', data);
      }
    },
    delLayer(key) {
      const { data } = this.prop;
      if (data.value && data.value.length) {
        const stack = data.value[0].stack;
        stack.splice(key, 1);
        this.$emit('change', data);
      }
    },
    moveLayer(srcIdx, dstIdx) {
      const { data } = this.prop;
      if (data.value && data.value.length) {
        const stack = data.value[0].stack;
        stack.splice(dstIdx, 0, ...stack.splice(srcIdx, 1));
        this.$emit('change', data);
      }
    },
    onCellChange(layer, value) {
      const { ui, data } = this.prop;
      if (data.value && data.value.length) {
        const stack = data.value[0].stack;
        if (value in ui.domain.cells) {
          stack[layer.key].cell = value;
          this.$emit('change', data);
        }
      }
    },
    onLengthChange(layer, value) {
      const { data } = this.prop;
      if (data.value && data.value.length) {
        const stack = data.value[0].stack;
        stack[layer.key].length = Number(value);
        this.$emit('change', data);
      }
    },
  },
  beforeMount() {
    const update = () => this.$nextTick(this.$forceUpdate);
    this.unsubscribe = this.$store.state.templates.dataManager.subscribe(
      update
    ).unsubscribe;
  },
  beforeDestroy() {
    this.unsubscribe();
  },
};
