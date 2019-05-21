import grid0 from './grid-0.jpg';
import grid1 from './grid-1.jpg';
import grid2 from './grid-2.jpg';

import SoilWidget from '../SoilWidget';

const IMG_0 = new Image();
const IMG_1 = new Image();
const IMG_2 = new Image();

IMG_0.src = grid0;
IMG_1.src = grid1;
IMG_2.src = grid2;

export default {
  name: 'SoilDefinition',
  components: {
    SoilWidget,
  },
  data() {
    return {
      originalLayers: [IMG_0, IMG_1, IMG_2, IMG_2, IMG_2],
      height: 500,
      activeLayer: 4,
      nbSoils: 27,
      colorRange: 206,
      activeSoil: -1,
      soilData: {
        '1': {
          name: 's1',
          porosity: 0.375,
          permeability: 0.269022595,
          relativePermAlpha: 3.548,
          relativePermN: 4.162,
          saturationAlpha: 3.548,
          saturationN: 4.162,
          saturationSRes: 0.0001,
        },
        '2': {
          name: 's2',
          porosity: 0.39,
          permeability: 0.043630356,
          relativePermAlpha: 3.467,
          relativePermN: 2.738,
          saturationAlpha: 3.467,
          saturationN: 2.738,
          saturationSRes: 0.0001,
        },
        '3': {
          name: 's3',
          porosity: 0.387,
          permeability: 0.015841225,
          relativePermAlpha: 2.692,
          relativePermN: 2.445,
          saturationAlpha: 2.692,
          saturationN: 2.445,
          saturationSRes: 0.0001,
        },
        '4': {
          name: 's4',
          porosity: 0.439,
          permeability: 0.007582087,
          relativePermAlpha: 0.501,
          relativePermN: 2.659,
          saturationAlpha: 0.501,
          saturationN: 2.659,
          saturationSRes: 0.1,
        },
        '5': {
          name: 's5',
          porosity: 0.489,
          permeability: 0.01818816,
          relativePermAlpha: 0.661,
          relativePermN: 2.659,
          saturationAlpha: 0.661,
          saturationN: 2.659,
          saturationSRes: 0.0001,
        },
        '6': {
          name: 's6',
          porosity: 0.399,
          permeability: 0.005009435,
          relativePermAlpha: 1.122,
          relativePermN: 2.479,
          saturationAlpha: 1.122,
          saturationN: 2.479,
          saturationSRes: 0.0001,
        },
        '7': {
          name: 's7',
          porosity: 0.384,
          permeability: 0.005492736,
          relativePermAlpha: 2.089,
          relativePermN: 2.318,
          saturationAlpha: 2.089,
          saturationN: 2.318,
          saturationSRes: 0.0001,
        },
        '8': {
          name: 's8',
          porosity: 0.482,
          permeability: 0.004675077,
          relativePermAlpha: 0.832,
          relativePermN: 2.514,
          saturationAlpha: 0.832,
          saturationN: 2.514,
          saturationSRes: 0.0001,
        },
        '9': {
          name: 's9',
          porosity: 0.442,
          permeability: 0.003386794,
          relativePermAlpha: 1.585,
          relativePermN: 2.413,
          saturationAlpha: 1.585,
          saturationN: 2.413,
          saturationSRes: 0.0001,
        },
        '10': {
          name: 's10',
          porosity: 0.385,
          permeability: 0.004783973,
          relativePermAlpha: 3.311,
          relativePermN: 2.202,
          saturationAlpha: 3.311,
          saturationN: 2.202,
          saturationSRes: 0.0001,
        },
        '11': {
          name: 's11',
          porosity: 0.481,
          permeability: 0.003979136,
          relativePermAlpha: 1.622,
          relativePermN: 2.318,
          saturationAlpha: 1.622,
          saturationN: 2.318,
          saturationSRes: 0.0001,
        },
        '12': {
          name: 's12',
          porosity: 0.459,
          permeability: 0.006162952,
          relativePermAlpha: 1.514,
          relativePermN: 2.259,
          saturationAlpha: 1.514,
          saturationN: 2.259,
          saturationSRes: 0.0001,
        },
        '13': {
          name: 's13',
          porosity: 0.399,
          permeability: 0.005009435,
          relativePermAlpha: 1.122,
          relativePermN: 2.479,
          saturationAlpha: 1.122,
          saturationN: 2.479,
          saturationSRes: 0.0001,
        },
        '19': {
          name: 'b1',
          porosity: 0.33,
          permeability: 0.005,
          relativePermAlpha: 1,
          relativePermN: 3,
          saturationAlpha: 1,
          saturationN: 3,
          saturationSRes: 0.001,
        },
        '20': {
          name: 'b2',
          porosity: 0.33,
          permeability: 0.01,
          relativePermAlpha: 1,
          relativePermN: 3,
          saturationAlpha: 1,
          saturationN: 3,
          saturationSRes: 0.001,
        },
        '21': {
          name: 'g1',
          porosity: 0.33,
          permeability: 0.02,
          relativePermAlpha: 1,
          relativePermN: 3,
          saturationAlpha: 1,
          saturationN: 3,
          saturationSRes: 0.001,
        },
        '22': {
          name: 'g2',
          porosity: 0.33,
          permeability: 0.03,
          relativePermAlpha: 1,
          relativePermN: 3,
          saturationAlpha: 1,
          saturationN: 3,
          saturationSRes: 0.001,
        },
        '23': {
          name: 'g3',
          porosity: 0.33,
          permeability: 0.04,
          relativePermAlpha: 1,
          relativePermN: 3,
          saturationAlpha: 1,
          saturationN: 3,
          saturationSRes: 0.001,
        },
        '24': {
          name: 'g4',
          porosity: 0.33,
          permeability: 0.05,
          relativePermAlpha: 1,
          relativePermN: 3,
          saturationAlpha: 1,
          saturationN: 3,
          saturationSRes: 0.001,
        },
        '25': {
          name: 'g5',
          porosity: 0.33,
          permeability: 0.06,
          relativePermAlpha: 1,
          relativePermN: 3,
          saturationAlpha: 1,
          saturationN: 3,
          saturationSRes: 0.001,
        },
        '26': {
          name: 'g6',
          porosity: 0.33,
          permeability: 0.08,
          relativePermAlpha: 1,
          relativePermN: 3,
          saturationAlpha: 1,
          saturationN: 3,
          saturationSRes: 0.001,
        },
        '27': {
          name: 'g7',
          porosity: 0.33,
          permeability: 0.1,
          relativePermAlpha: 1,
          relativePermN: 3,
          saturationAlpha: 1,
          saturationN: 3,
          saturationSRes: 0.001,
        },
        '28': {
          name: 'g8',
          porosity: 0.33,
          permeability: 0.2,
          relativePermAlpha: 1,
          relativePermN: 3,
          saturationAlpha: 1,
          saturationN: 3,
          saturationSRes: 0.001,
        },
      },
    };
  },
  computed: {
    layers() {
      const last3 = this.computeActiveSoil(
        this.originalLayers[2],
        this.activeSoil
      );
      return [
        this.computeActiveSoil(this.originalLayers[0], this.activeSoil),
        this.computeActiveSoil(this.originalLayers[1], this.activeSoil),
        last3,
        last3,
        last3,
      ];
    },
  },
  mounted() {
    this.updateSize();
  },
  methods: {
    updateSize() {
      const { offsetWidth } = this.$el;
      const img = this.originalLayers[0];
      this.height = Math.ceil(50 + img.height * (offsetWidth / img.width));
    },
    computeActiveSoil(img, soil) {
      if (soil < 0 || !this.$el) {
        return img.src;
      }

      const baseValue = (this.colorRange * soil) / this.nbSoils;
      const tolerance = 0.5 * (this.colorRange / this.nbSoils);

      const soilRange = [baseValue - tolerance, baseValue + tolerance];

      const canvas = this.$el.querySelector('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        0,
        0,
        canvas.width,
        canvas.height
      );
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const rgba = imageData.data;
      for (let i = 0; i < rgba.length; i += 4) {
        if (rgba[i] > soilRange[0] && rgba[i] < soilRange[1]) {
          rgba[i] = 255;
          rgba[i + 1] = 0;
          rgba[i + 2] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      return canvas.toDataURL();
    },
  },
};
