var ini = require('ini');

var elementsFactory = require('./elementsFactory');
var bcsFactory = require('./bcsFactory');
var solnFactory = require('./solnFactory');

function assign(target, prefix, id, value) {
  var newId = prefix + '.' + id;
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

module.exports = function (type, fileContents) {
  var contents = fileContents['pyfr.ini'];
  var iniFile = ini.parse(contents);
  var output = { type: type };

  output.backend = [{ name: 'Backend' }];
  if (iniFile.hasOwnProperty('backend')) {
    var bsettings = {};
    Object.keys(iniFile.backend).forEach(function (el) {
      var attrId = 'backend.' + el.replace(/-/g, '_');
      assign(bsettings, 'Backend-settings', attrId, iniFile.backend[el]);
    });
    output.backend = [{ name: 'Backend', 'Backend-settings': bsettings }];
  }

  var backends = Object.keys(iniFile).filter(function (el) { return /backend-.*$/.test(el) });
  if (backends.length) {
    // if the backend section gets bigger it might be worth having a factory for this section
    var key = backends[0];
    var iniEnds   = ['openmp', 'opencl', 'cuda'];
    var modelEnds = ['Open-MP', 'Open-CL', 'CUDA'];
    var orVal = iniEnds.indexOf(key.split('-')[1]);

    var defaults = {
      'BackendOr': {
        'or': {
          'id': 'BackendOr.or', 'value': [ orVal ]
        }
      },
      'Open-MP': {
        'open-mp.cc': {
          'id': 'Open-MP.open-mp.cc', 'value': []
        },
        'open-mp.cflags': {
          'id': 'Open-MP.open-mp.cflags', 'value': []
        },
        'open-mp.cblas': {
          'id': 'Open-MP.open-mp.cblas', 'value': []
        },
        'open-mp.cblas_type': {
          'id': 'Open-MP.open-mp.cblas_type',
          'value': [null]
        }
      },
      'Open-CL': {
        'open-cl.platform_id': {
          'id': 'Open-CL.open-cl.platform_id', 'value': []
        },
        'open-cl.device_type': {
          'id': 'Open-CL.open-cl.device_type', 'value': [0]
        },
        'open-cl.device_id': {
          'id': 'Open-CL.open-cl.device_id', 'value': []
        }
      },
      'CUDA': {
        'cuda.device_id': {
          'id': 'CUDA.cuda.device_id', 'value': ['']
        }
      }
    };

    var enumProp = defaults[modelEnds[orVal]];
    Object.keys(iniFile[key]).forEach(function(el) {
      if (iniFile[key][el] === undefined) {
        return;
      }
      enumProp[modelEnds[orVal].toLowerCase() + '.' + el.replace(/-/g, '_')].value = [ iniFile[key][el] ];
    });

    output.backend[0] = Object.assign({}, output.backend[0], defaults);
  }

  // constants section
  output.constants = [{ name: 'Constants' }];
  if (iniFile.hasOwnProperty('constants')) {
    var constantsSection = {};
    var expectedAttrs = ['gamma', 'mu', 'Pr', 'cpTref', 'cpTs', 'cpTs'];

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

    output.constants = [{
      name: 'Constants',
      Constants: constantsSection,
    }];
  }

  // Solver-settings
  output.solver = [{ name: 'Solver' }];
  if (iniFile.hasOwnProperty('solver')) {
    var settings = {};

    Object.keys(iniFile.solver).forEach(function(el) {
      var attrId = 'solver.' + el.replace(/-/g, '_');
      assign(settings, 'Solver-settings', attrId, iniFile.solver[el]);
    });

    output.solver[0]['Solver-settings'] = settings;
  }

  // solver time-integrator
  if (iniFile.hasOwnProperty('solver-time-integrator')) {
    var integrator = {};
    var expectedAttrs = ['scheme', 'tstart', 'tend', 'dt', 'controller'];

    expectedAttrs.forEach(function(el) {
      var attrId = 'solver.' + el;
      assign(integrator, 'TimeIntegrator', attrId, iniFile['solver-time-integrator'][el]);
    });
    output.solver[0]['TimeIntegrator'] = integrator;

    //  time integrator has a special secition if scheme is rk34 or rk45
    if (iniFile['solver-time-integrator'].scheme.match(/34$|45$/)) {
      var rkScheme = {};
      var rkAttrs = ['atol', 'rtol', 'safety-fact', 'min-fact', 'max-fact'];
      rkAttrs.forEach(function(el) {
        var attrId = 'solver.' + el.replace(/-/g, '_');
        assign(rkScheme, 'rkScheme', attrId, iniFile['solver-time-integrator'][el]);
      });

      output.solver[0].rkScheme = rkScheme;
    }
  }

  // artificial viscosity
  if (iniFile['solver-artificial-viscosity']) {
    var av = {};
    Object.keys(iniFile['solver-artificial-viscosity']).forEach(function(el) {
      var attrId = 'solver.' + el.replace(/-/g, '_');
      assign(av, 'ArtificialViscosity', attrId, iniFile['solver-artificial-viscosity'][el]);
    });
    output.solver[0]['ArtificialViscosity'] = av;
  }

  if (iniFile['solver-source-terms']) {
    var solverSourceTerms = {};
    Object.keys(iniFile['solver-source-terms']).forEach(function(el) {
      var attrId = 'solver.source-terms.' + el;
      assign(solverSourceTerms, 'Solver-source-terms', attrId, iniFile['solver-source-terms'][el]);
    });
    output.solver[0]['Solver-source-terms'] = solverSourceTerms;
  }

  if (iniFile['solver-interfaces']) {
    var solverInterfaces = {};
    Object.keys(iniFile['solver-interfaces']).forEach(function(el) {
      var attrId = 'solver.' + el;
      assign(solverInterfaces, 'Interfaces', attrId, iniFile['solver-interfaces'][el]);
    });
    output.solver[0]['Interfaces'] = solverInterfaces;
  }

  // specific solver interfaces
  var interfaces = Object.keys(iniFile).filter(function(el) { return /solver-interfaces-.*$/.test(el) });
  output['solver-interfaces'] = [{ name: 'Solver Interfaces' }];
  if (interfaces.length) {
    var orVal = ['line', 'tri', 'quad'].indexOf(interfaces[0].split('-').pop());
    var orVals = ['Linear-int', 'Triangular-int', 'Quadrilateral-int'].map(function(el, index) {
      if (index === orVal) {
        return {
          "solver.interfaces.flux_pts": {
            id: el + '.solver.interfaces.flux_pts',
            value: [ iniFile[interfaces[0]]['flux-pts'] ]
          },
          "solver.interfaces.quad_deg": {
            id: el + '.solver.interfaces.quad_deg',
            value: [ iniFile[interfaces[0]]['quad-deg'] ]
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

    output['solver-interfaces'] = [{
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
    output['solver-elements'] = [];
    elements.forEach(function(el, index) {
      var orVal = ['tri', 'quad', 'hex', 'tet', 'pri', 'pyr'].indexOf(el.split('-').pop());
      var elementProp = elementsFactory(iniFile[el], orVal, el);
      output['solver-elements'].push(elementProp);
    });
  }

  // bcs conditions
  var bcs = Object.keys(iniFile).filter(function(el) { return /soln-bcs-.*$/.test(el) });
  if (bcs.length) {
    output['solution-bcs'] = [];
    bcs.forEach(function(el, index) {
      var elementProp = bcsFactory(iniFile[el], el);
      output['solution-bcs'].push(elementProp);
    });
  };

  // solution fluidforce
  var fluidforce = Object.keys(iniFile).filter(function(el) { return /soln-plugin-fluidforce-.*$/.test(el) });
  if (fluidforce.length) {
    output['solution-ff'] = [];
    fluidforce.forEach(function(el) {
      var expectedAttrs = ['name', 'nsteps', 'file', 'header'];
      var attrs = {};
      expectedAttrs.forEach(function(prop){
        var attrId = 'solution.plugin_fluidforce.' + prop;
        if (prop === 'name') {
          assign(attrs, 'PluginFluidforceName', attrId, el.replace('soln-plugin-fluidforce-', ''));
        } else {
          assign(attrs, 'PluginFluidforceName', attrId, iniFile[el][prop]);
        }
      });
      var ffProp = { name: el, PluginFluidforceName: attrs };
      output['solution-ff'].push(ffProp);
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
    output['solution'] = props;
  }

  // go through found and proper sections, if there are any that fall outside of it, throw an error
  var allSections = ['backend', 'solver', 'constants', 'solver-time-integrator',
    'solver-artificial-viscosity', 'solver-source-terms', 'solver-interfaces'].concat(
    backends, interfaces, elements, bcs, fluidforce, soln);
  Object.keys(iniFile).forEach(function(el) {
    if (allSections.indexOf(el) === -1) {
      throw new Error('Unrecognized section in ini file"' + el + '"');
    }
  });

  console.log('parsed: ', output);
  return output;
};
