var ini = require('ini');

function assign(target, prefix, id, value) {
  var newId =  prefix + '.' + id;
  var newValue;
  if (value === undefined) {
    newValue = [];
  } else if (!isNaN(parseFloat(value))) {
    newValue = [parseFloat(value)];
  } else {
    newValue = [value.trim()];
  }
  target[newId] = {
    id: newId,
    value: newValue,
  };
}

module.exports = function(type, contents) {
    var iniFile = ini.parse(contents);
    var output = { type, data: {} };

    // constants section
    if (iniFile.hasOwnProperty('constants')) {
      var constantsSection = {};
      var expectedAttrs = ['gamma', 'mu', 'pr', 'cpTref', 'cpTs', 'cpTs'];

      expectedAttrs.forEach(function(el) {
        var attrId = 'constants.' + el;
        assign(constantsSection, 'Constants', 'constants.' + el, iniFile[attrId]);
      });

      var customConstants = { id: 'Constants.constants.custom', value: [] };
      Object.keys(iniFile.constants).forEach(function(el) {
        if (expectedAttrs.indexOf(el) !== -1) {
          return;
        }
        customConstants.value.push({ name: el, value: iniFile.constants[el].trim() });
      });
      constantsSection['constants.custom'] = customConstants;

      output.data.constants = [{
        name: 'Constants',
        Constants: constantsSection,
      }];
    }

    return output;
}
