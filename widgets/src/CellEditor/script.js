import EditableList from '../EditableList';
import ViewerWidget from '../ViewerWidget';
import vtkCellVTKViewer from '../CellVTKViewer';
import vtkCell2DViewer from '../Cell2DViewer';
import VisibilityToolbar from '../VisibilityToolbar';
import ThreeDToolbar from '../ThreeDToolbar';

import MaterialDropdown from './MaterialDropdown';
import RadiusInput from './RadiusInput';

function zip(...lists) {
  const result = [];
  const length = lists.reduce((min, l) => Math.min(min, l.length), Infinity);
  for (let i = 0; i < length; ++i) {
    result.push(lists.map((l) => l[i]));
  }
  return result;
}

// ----------------------------------------------------------------------------

export default {
  name: 'CellEditor',
  components: {
    EditableList,
    ViewerWidget,
    VisibilityToolbar,
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
      viewer2d: vtkCell2DViewer.newInstance(),
      viewer3d: vtkCellVTKViewer.newInstance(),
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
    tableData() {
      const { data } = this.prop;
      if (data.value && data.value.length) {
        const cell = data.value[0];
        return zip(cell.mats, cell.radii).map(([material, radius], key) => ({
          key,
          material,
          radius,
        }));
      }
      return [];
    },
    columns() {
      const viz = this.prop.ui.domain;
      const materialIds = [].concat(
        viz.types.fuels || [],
        viz.types.materials || []
      );
      return [
        {
          key: 'material',
          dataKey: 'material',
          label: 'Material / Fuel',
          render: {
            component: MaterialDropdown,
            props: {
              materialIds,
              viz,
              onChange: this.onMaterialChange,
            },
          },
        },
        {
          key: 'radius',
          dataKey: 'radius',
          label: 'Radius',
          render: {
            component: RadiusInput,
            props: {
              onChange: this.onRadiusChange,
              onBlur: this.validateOrder,
            },
          },
        },
      ];
    },
  },
  methods: {
    isVisible() {
      return this.prop.show(this.viewData);
    },
    onChange(value, index = 0) {
      const newData = Object.assign({}, this.prop.data);
      if (value === null) {
        newData.value.splice(index, 1);
      } else {
        newData.value[index] = value;
      }
      this.$emit('change', newData);
    },
    onMaterialChange(item, value) {
      if (this.prop.data.value && this.prop.data.value.length) {
        const newData = Object.assign({}, this.prop.data);
        const cell = newData.value[0];
        cell.mats[item.key] = value;
        this.$emit('change', newData);
      }
    },
    onRadiusChange(item, value) {
      if (this.prop.data.value && this.prop.data.value.length) {
        const newData = Object.assign({}, this.prop.data);
        const cell = newData.value[0];
        cell.radii[item.key] = Number(value);
        this.$emit('change', newData);
      }
    },
    validateOrder() {
      if (this.prop.data.value && this.prop.data.value.length) {
        const newData = Object.assign({}, this.prop.data);
        const cell = newData.value[0];
        const zipped = zip(cell.mats, cell.radii);
        zipped.sort((a, b) => a[1] - b[1]);
        const [sortedMats, sortedRadii] = zip(...zipped);

        cell.mats = sortedMats;
        cell.radii = sortedRadii;
        this.$emit('change', newData);
      }
    },
    addMaterial(idx) {
      const { ui, data } = this.prop;
      const viz = ui.domain;
      const materialIds = Object.keys(viz.colors || {});
      if (data.value && data.value.length && materialIds.length) {
        const cell = data.value[0];
        const length = cell.mats.length;
        const pitch = this.viewData.cell
          ? this.viewData.cell.pitch.value[0]
          : 1000;

        // first material ID is empty/null "-"
        // See type/vera hook.js for this.
        cell.mats.splice(idx, 0, cell.mats[idx - 1] || materialIds[1]);
        cell.radii.splice(idx, 0, cell.radii[idx - 1] || 0);

        if (length === idx) {
          cell.radii[idx] = Math.min(cell.radii[idx] + 1, pitch / 2);
        } else {
          // set radius to between before and after cell
          cell.radii[idx] += (cell.radii[idx] - cell.radii[idx - 1]) / 2;
        }
        this.$emit('change', data);
      }
    },
    deleteMaterial(key) {
      const { data } = this.prop;
      if (data.value && data.value.length) {
        const cell = data.value[0];

        cell.mats.splice(key, 1);
        cell.radii.splice(key, 1);

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
