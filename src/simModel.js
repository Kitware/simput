const MPACT = require('./MPACT');
const SHIFT = require('./SHIFT');
const INSILICO = require('./INSILICO');
const COBRATF = require('./COBRATF');

// Simulations have a large number of individual parameters that can be set
// but most of which can be left unset or at defaults.
// The parameter lists are derived from VERAin python templates, which are
// dictionaries that are almost a json object, except for the "_value" and "_check" fields.
// Conversion is performed by verain/python/template2json.py, then imported here.
// Fork at https://github.com/aronhelser/VERAin
// Derive our lists from that struct.

const simulationList = [
  { sim: 'MPACT', pyvera: MPACT },
  { sim: 'SHIFT', pyvera: SHIFT },
  { sim: 'INSILICO', pyvera: INSILICO },
  { sim: 'COBRATF', pyvera: COBRATF },
];

function addSimulationDefinitions(model) {
  model.views.Simulations = {
    label: 'Simulations',
    children: simulationList.map((info) => info.sim),
  };
  simulationList.forEach((info) => {
    const { sim, pyvera } = info;
    model.views[sim] = {
      label: sim,
      attributes: [`${sim}Info`],
    };

    // each simulation type must be enabled explicitly.
    model.definitions[`${sim}Info`] = {
      label: `${sim} Parameters`,
      parameters: [
        {
          id: 'enabled',
          type: 'bool',
          size: 1,
          ui: 'checkbox',
          default: false,
          label: 'Enabled',
        },
        {
          id: 'include',
          type: 'string',
          size: -1,
          layout: '-1',
          label: 'Include (file path)',
        },
      ],
    };
    const params = model.definitions[`${sim}Info`].parameters;
    Object.keys(pyvera._content).forEach((key) => {
      const veraDef = pyvera._content[key];
      const output = veraDef._output;
      let type = output[0]._type;
      if (type === 'double') type = 'float';
      let label = key;
      if (veraDef._inlist) {
        // param belongs to a list, give user some additional info
        label = `${key} (${veraDef._inlist.replace(',', ' => ')})`
      }
      // basic template for a single parameter input
      const item = {
        id: key,
        label,
        size: 1,
        type,
      };
      if (type === 'bool' && output.length === 1) {
        item.ui = 'checkbox';
        item.default = '';
      }
      if (veraDef._listName) {
        // console.log('list', key);
        // MPACT mesh, db_entry - allow freeform string
        item.size = -1;
        item.layout = '-1';
        item.type = 'string';
        // item.default = '';
        params.push(item);
      } else if (output.length === 1) {
        if (output[0]._value === 'copy_value') {
          // single input, single output, we are good
          params.push(item);
        } else if (output[0]._value === 'copy_array') {
          item.size = -1;
          item.layout = '-1';
          // console.log('array', key);
          params.push(item);
        } else {
          console.log('Unhandled single', key);
        }
      } else if (output.length > 1) {
        if (output.every((item) => item._value[0] === 'copy_value')) {
          // multiple output
          // all the same type? If no, allow any input.
          if (!output.every((item) => item._type === output[0]._type)) {
            item.type = 'string';
          } else if (type === 'bool') {
            // set checkboxes for all
            item.ui = 'checkbox';
          }
          item.size = output.length;
          // always 2 or 3 so far, may need to add layouts for 4, 5 later.
          item.layout = `${output.length}`;
          item.default = output.map(() => '');
          // console.log('multiple', key);
          params.push(item);
        } else if (
          output.every(
            (item) =>
              item._value[0] === 'copy_value' || item._value[0] === 'copy_array'
          )
        ) {
          // all the same type? If no, allow any input.
          if (!output.every((item) => item._type === output[0]._type)) {
            item.type = 'string';
            // item.default = ''; // causes a blank item to be added automatically
          }
          // unpredictable size, allow user to append values.
          // User must know correct length
          item.size = -1;
          item.layout = '-1';
          // console.log('multiple array', key);
          params.push(item);
        } else {
          console.log('Unhandled multiple', key);
        }
      } else {
        console.log('No output, skip', key);
      }
    });
  });
}

function fillSimulations(model, dataModel) {
  model.simulations = [];
  const addCard = (currSim, dataIn, name, comment = '') => {
    if (
      !(dataIn[name].value[0] === undefined || dataIn[name].value[0] === '')
    ) {
      currSim.cards.push({ name, params: dataIn[name].value.slice() });
    }
  };
  // each value results in a separate card
  const addCardList = (currSim, dataIn, name, comment = '') => {
    dataIn[name].value.forEach((val) => {
      if (!(val === undefined || val === '')) {
        currSim.cards.push({ name, params: [val] });
      }
    });
  };
  simulationList.forEach((info, i) => {
    const { sim, pyvera } = info;

    if (!dataModel.data[sim]) return;
    const simInfo = dataModel.data[sim][i][`${sim}Info`];
    // user must enable this simulation block for it to be output.
    if (!simInfo || !simInfo.enabled.value[0]) return;
    const currSim = { name: sim, cards: [], cardsWithZero: [] };
    Object.keys(simInfo).forEach((key) => {
      if (key === 'enabled') return;
      else if (key === 'include') {
        addCardList(currSim, simInfo, key);
        return;
      }
      const veraDef = pyvera._content[key];
      if (veraDef._listName) {
        addCardList(currSim, simInfo, key);
      } else {
        addCard(currSim, simInfo, key);
      }
    });
    model.simulations.push(currSim);
  });
}

module.exports = {
  fillSimulations,
  addSimulationDefinitions,
};
