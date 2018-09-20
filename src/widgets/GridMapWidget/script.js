import TextRenderer from './TextRenderer';
import vtkGridMap from '../GridMap';

// ----------------------------------------------------------------------------

export default {
  name: 'GridMapWidget',
  props: {
    itemRenderer: {
      default: () => TextRenderer,
    },
    itemRendererProps: {
      default: () => {},
    },
    gridSize: {
      type: Number,
      default: () => 15,
    },
    items: {
      type: Array,
      default: () => [],
    },
    state: {
      default: () => ({
        grid: [],
        symmetry: 3,
        replacementMode: 0,
      }),
    },
  },
  data() {
    return {
      activeIds: [],
      selected: null,
      gridMap: vtkGridMap.newInstance(
        Object.assign(
          {
            gridSize: this.gridSize,
            emptyItem: '0',
          },
          this.state
        )
      ),
    };
  },
  computed: {
    gridStyle() {
      return {
        gridTemplateColumns: `repeat(${this.gridSize}, ${100 /
          this.gridSize}%)`,
      };
    },
  },
  methods: {
    updateMode(mode, value) {
      this.gridMap.set({ [mode]: value });
    },
    pushChanges() {
      const grid = this.gridMap.getReferenceByName('grid');
      this.$emit(
        'change',
        Object.assign({ grid }, this.gridMap.get('symmetry', 'replacementMode'))
      );
    },
    onEnter(idx) {
      this.activeIds = this.gridMap.getIndices(idx);
    },
    onLeave(idx) {
      this.activeIds = [];
    },
    onClick(idx) {
      if (this.selected) {
        this.gridMap.setGridEntry(
          idx % this.gridSize,
          Math.floor(idx / this.gridSize),
          this.selected
        );
      }
      this.pushChanges();
    },
    onSelectItem(item) {
      this.selected = item;
    },
  },
  mounted() {
    this.sub = this.gridMap.onModified(() => this.$forceUpdate());
  },
  updated() {
    if (this.gridMap.getReferenceByName('grid') !== this.state.grid) {
      this.gridMap.setGrid(this.state.grid);
      this.gridMap.setSymmetry(this.state.symmetry);
      this.gridMap.setReplacementMode(this.state.replacementMode);
      this.gridMap.setGridSize(this.gridSize);
      // avoid keeping a selected item from another map.
      this.selected = null;
      this.pushChanges();
    }
  },
  beforeDestroy() {
    this.sub.unsubscribe();
    this.sub = null;
  },
};
