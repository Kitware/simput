import conus from './conus-small.jpg';

export default {
  name: 'RegionSelector',
  data() {
    return {
      conus,
      x: Math.floor((3366 - 500) / 2),
      y: Math.floor((1903 - 500) / 2),
      width: 500,
      height: 500,
      imageWidth: 3366,
      imageHeight: 1903,
    };
  },
  methods: {
    onMouseDown(e) {
      console.log('down');
    },
    onMouseUp(e) {
      console.log('up');
    },
    onMouseMove(e) {
      console.log('move');
    },
  },
}