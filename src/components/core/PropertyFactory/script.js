import CellProperty from 'simput/src/components/properties/CellProperty';

/* eslint-disable no-param-reassign */
function lowerKeys(obj) {
  Object.keys(obj).forEach((key) => {
    obj[key.toLowerCase()] = obj[key];
    delete obj[key];
  });
  return obj;
}

const factoryMapping = lowerKeys({
  TextField: CellProperty,
});

// ---------------------------------------------------------------------------

export default {
  name: 'PropertyFactory',
  props: ['prop', 'viewData'],
  computed: {
    component() {
      return factoryMapping[this.prop.ui.propType.toLowerCase()];
    },
  },
};
