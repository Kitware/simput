var ini = require('ini');
var elementsFactory = require('./elementsFactory');
var bcsFactory = require('./bcsFactory');
var solnFactory = require('./solnFactory');

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
  target[id] = {
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
      assign(constantsSection, 'Constants', attrId, iniFile.constants[el]);
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

  output.data.solver = [{ name: 'Solver' }];
  //Solver-settings
  if (iniFile.hasOwnProperty('solver')) {
    var settings = {};

    Object.keys(iniFile.solver).forEach(function(el) {
      var attrId = 'solver.' + el;
      assign(settings, 'Solver', attrId, iniFile.solver[attrId]);
    });

    output.data.solver[0]['Solver-settings'] = settings;
  }

  // solver time-integrator
  if (iniFile.hasOwnProperty('solver-time-integrator')) {
    var integrator = {};
    var expectedAttrs = ['scheme', 'tstart', 'tend', 'dt', 'controller'];

    expectedAttrs.forEach(function(el) {
      var attrId = 'solver.' + el;
      assign(settings, 'TimeIntegrator', attrId, iniFile['solver-time-integrator'][el]);
    });

    output.data.solver[0]['TimeIntegrator'] = settings;

    //  time integrator has a special secition if scheme is rk34 or rk45
    if (iniFile['solver-time-integrator'].scheme.match(/34$|45$/)) {
      var rkScheme = {};
      var rkAttrs = ['atol', 'rtol', 'safety_fact', 'min_fact', 'max_fact'];
      rkAttrs.forEach(function(el) {
        var attrId = 'solver.' + el;
        assign(rkScheme, 'rkScheme', attrId, iniFile['solver-time-integrator'][el]);
      });

      output.data.solver[0].rkScheme = rkScheme;
    }
  }

  // artificial viscosity
  if (iniFile['solver-artificial-viscosity']) {
    var av = {};
    Object.keys(iniFile['solver-artificial-viscosity']).forEach(function(el) {
      var attrId = 'solver.' + el;
      assign(settings, 'ArtificialViscosity', attrId, iniFile['solver-artificial-viscosity'][el]);
    });
    output.data.solver[0]['ArtificialViscosity'] = av;
  }

  if (iniFile['solver-source-terms']) {
    var av = {};
    Object.keys(iniFile['solver-source-terms']).forEach(function(el) {
      var attrId = 'solver.source-terms' + el;
      assign(settings, 'Solver-source-terms', attrId, iniFile['Solver-source-terms'][el]);
    });
    output.data.solver[0]['Solver-source-terms'] = av;
  }

  if (iniFile['solver-interfaces']) {
    var av = {};
    Object.keys(iniFile['solver-interfaces']).forEach(function(el) {
      var attrId = 'solver.' + el;
      assign(settings, 'Interfaces', attrId, iniFile['solver-interfaces'][el]);
    });
    output.data.solver[0]['Interfaces'] = av;
  }

  // specific solver interfaces
  var interfaces = Object.keys(iniFile).filter(function(el) { return /solver-interfaces-.*$/.test(el) });
  if (interfaces.length) {
    var orVal = ['line', 'tri', 'quad'].indexOf(interfaces[0].split('-').pop());
    var orVals = ['Linear-int', 'Triangular-int', 'Quadrilateral-int'].map(function(el, index) {
      if (index === orVal) {
        return {
          "solver.interfaces.flux_pts": {
            id: el + '.solver.interfaces.flux_pts',
            value: [ iniFile[interfaces[0]]['flux_pts'] ]
          },
          "solver.interfaces.quad_deg": {
            id: el + '.solver.interfaces.quad_deg',
            value: [ iniFile[interfaces[0]]['quad_deg'] ]
          },
          "solver.interfaces.quad_pts": {
            id: el + '.solver.interfaces.quad_pts',
            value: [ iniFile[interfaces[0]]['quad-pts'] ]
          }
        };
      }

      return {
        "solver.interfaces.flux_pts": {
          id: el + '.solver.interfaces.flux_pts',
          value: [ index % 2 === 0 ? "gauss-legendre" : "williams-shunn"]
        },
        "solver.interfaces.quad_deg": {
          id: el + '.solver.interfaces.quad_deg',
          value: []
        },
        "solver.interfaces.quad_pts": {
          id: el + '.solver.interfaces.quad_pts',
          value: [null]
        }
      };
    });

    output.data['solver-interfaces'] = [{
      name: 'Solver Interfaces',
      InterfacesOr: {
        "or": {
          id: 'InterfacesOr.or',
          value: [ orVal ]
        }
      },
      'Linear-int': orVals[0],
      'Triangular-int': orVals[1],
      'Quadrilateral-int': orVals[2]
    }];
  }

  // solver elements
  var elements = Object.keys(iniFile).filter(function(el) { return /solver-elements-.*$/.test(el) });
  if (elements.length) {
    output.data['solver-elements'] = [];
    elements.forEach(function(el, index) {
      var orVal = ['tri', 'quad', 'hex', 'tet', 'pri', 'pyr'].indexOf(el.split('-').pop());
      var elementProp = elementsFactory(iniFile[el], orVal, el);
      output.data['solver-elements'].push(elementProp);
    });
  }

  // bcs conditions
  var bcs = Object.keys(iniFile).filter(function(el) { return /soln-bcs-.*$/.test(el) });
  if (bcs.length) {
    output.data['solution-bcs'] = [];
    bcs.forEach(function(el, index) {
      var elementProp = elementsFactory(iniFile[el], el);
      output.data['solution-bcs'].push(elementProp);
    });
  };

  // solution fluidforce
  var fluidforce = Object.keys(iniFile).filter(function(el) { return /soln-plugin-fluidforce-.*$/.test(el) });
  if (fluidforce.length) {
    output.data['solution-ff'] = [];
    fluidforce.forEach(function(el) {
      var expectedAttrs = ['name', 'nsteps', 'file', 'header'];
      var attrs = {};
      expectedAttrs.forEach(function(prop){
        var attrId = 'solution.plugin_fluidforce.' + prop;
        assign(attrs, 'PluginFluidforceName', attrId, iniFile[el][prop]);
      });
      var ffProp = { name: el, PluginFluidforceName: attrs };
      output.data['solution-ff'].push(ffProp);
    });
  }

  // soln
  var solnRegex = /soln-(plugin-(writer|sampler|nancheck|tavg|sampler|residual)$|(filter|ics)$)/
  var soln = Object.keys(iniFile).filter(function(el) { return solnRegex.test(el) });
  if (soln.length) {
    var props = [];
    soln.forEach(function(el) {
      var soln = solnFactory(iniFile[el], el);
      props.push(soln);
    });
    output.data['solution'] = props;
  }

  return output;
};
