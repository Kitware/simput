var template = require('./templates/output.hbs');

function get(obj, prop) {
  var parts = prop.split('.'),
    last = parts.pop(),
    falseyReturn = parts[parts.length - 1] === 'length' ? 0 : undefined;

  if (!obj) {
    return falseyReturn;
  }

  while (prop = parts.shift()) {
    obj = obj[prop];
    if (obj == null) {
      return falseyReturn;
    }
  }

  // we don't want to return undefined
  if (obj[last] == null) {
    return falseyReturn;
  }

  return obj[last];
}

module.exports = function (model) {
    var templateData = { data: {}, valid: true , errors: []},
        viewInstance = null,
        count = 0,
        list = null;

    console.log('model: ', model);

    //last in array shortcut, used with arr.split below
    function last(arr) {
        return arr[arr.length-1];
    }

    //assigns item to dest[key]
    function tryAssign(dest, key, item) {
        if (item === undefined) return;
        // convert the key to a valid pyfr name
        key = last(key.split('.')).replace(/_/g, '-');
        try {
            dest[key] = item;
        } catch (e) {
            console.log(`problem assigning ${item} to templateData`);
        }
    }

    //backend settings
    if (get(model, 'data.backend.0')) {
        var dest = {},
            backend = model.data.backend[0]['Backend-settings'];
        tryAssign(dest, 'precision', get(backend['backend.precision'], 'value.0'));
        tryAssign(dest, 'rank-allocator', get(backend['backend.rank_allocator'], 'value.0'));
        templateData.data.backend = dest;
    }

    //backend model 'Open-MP', 'Open-CL', 'CUDA'
    if (get(model, 'data.backend.0.BackendOr.or.value.0') >= 0) {
        var dest = {},
            enumVal = model.data.backend[0].BackendOr.or.value[0],
            orVal = ['Open-MP', 'Open-CL', 'CUDA'][enumVal],
            orObj = model.data.backend[0][orVal];

        Object.keys(orObj).forEach( (key) => {
            tryAssign(dest, key, orObj[key].value[0]);
        });

        templateData.data[orVal] = dest;
    }

    // constants
    if (get(model, 'data.constants.0.Constants')) {
        var dest = {},
            constants = model.data.constants[0].Constants;

        Object.keys(constants).forEach( (el) => {
            if (el === 'constants.custom') {
              return;
            }
            tryAssign(dest, el, constants[el].value[0]);
        });

        if (constants['constants.custom'] && constants['constants.custom'].value) {
          constants['constants.custom'].value.forEach(el => {
            dest[el.name] = el.value;
          });
        }

        templateData.data.constants = dest;
    }

    //solver - settings
    if (get(model, 'data.solver.0.Solver-settings')) {
        var dest = {},
            ss = model.data.solver[0]['Solver-settings'];

        Object.keys(ss).forEach( (el) => {
            tryAssign(dest, el, ss[el].value[0]);
        });

        templateData.data.solver_settings = dest;
    }

    // solver - time integrator
    if (get(model, 'data.solver.0.TimeIntegrator')) {
        var dest = {},
            ti = model.data.solver[0]['TimeIntegrator'];

        Object.keys(ti).forEach( (el) => {
            tryAssign(dest, el, ti[el].value[0]);
        });

        templateData.data.solver_ti = dest;
    }

    // solver - time integrator - rkscheme
    if (get(model, 'data.solver.0.rkScheme')) {
        var dest = {},
            rk = model.data.solver[0]['rkScheme'];

        Object.keys(rk).forEach( (el) => {
            tryAssign(dest, el, rk[el].value[0]);
        });

        templateData.data.solver_ti = Object.assign(templateData.data.solver_ti, dest);
    }

    // solver - artificail visc
    if (get(model, 'data.solver.0.ArtificialViscosity')) {
        var dest = {},
            av = model.data.solver[0]['ArtificialViscosity'];

        Object.keys(av).forEach( (el) => {
            tryAssign(dest, el, av[el].value[0]);
        });

        templateData.data.solver_av = dest;
    }

    // solver - source terms
    if (get(model, 'data.solver.0.Solver-source-terms')) {
        var dest = {},
            sst = model.data.solver[0]['Solver-source-terms'];

        Object.keys(sst).forEach( (el) => {
            tryAssign(dest, el, sst[el].value[0]);
        });

        templateData.data.solver_source_terms = dest;
    }

    //solver - interfaces
    if (get(model, 'data.solver.0.Interfaces')) {
        var dest = {},
            interfaces = model.data.solver[0]['Interfaces'];

        Object.keys(interfaces).forEach( (el) => {
            tryAssign(dest, el, interfaces[el].value[0]);
        });

        templateData.data.solver_interfaces = dest;
    }

    // solver line, tri, quad interfaces
    if (get(model, 'data.solver-interfaces.0.InterfacesOr.or.value.0') >= 0) {
        var dest = {},
            enumVal = model.data['solver-interfaces'][0].InterfacesOr.or.value[0],
            orVal = ['Linear-int', 'Triangular-int', 'Quadrilateral-int'][enumVal],
            types = {'linear': 'line', 'triangular': 'tri', 'quadrilateral': 'quad'},
            orObj = model.data['solver-interfaces'][0][orVal];


        Object.keys(orObj).forEach( (key) => {
            tryAssign(dest, key, orObj[key].value[0]);
        });

        dest.type = types[orVal.split('-')[0].toLowerCase()];
        templateData.data.solver_interfaces_type = dest;
    }

    //solver elements
    if (model.data['solver-elements'] && model.data['solver-elements'].length) {
        var dest = [],
            vals = model.data['solver-elements'],
            enumVals = ['Triangular-el', 'Quadrilateral-el', 'Hexahedral-el',
                'Tetrahedral-el', 'Prismatic-el', 'Pyramidal-el'],
            types = {'triangular': 'tri', 'quadrilateral': 'quad',
                    'hexahedral': 'hex', 'tetrahedral': 'tet',
                    'prismatic': 'pri', 'pyramidal': 'pyr'};

        vals.forEach( (el) => {
            const orVal = enumVals[el['ElementsOr'].or.value[0]],
                orSrc  = el[orVal],
                orDest = {};

            if (!orVal) {return; }

            orDest.type = types[orVal.split('-')[0].toLowerCase()];
            Object.keys(orSrc).forEach( (key) => {
                tryAssign(orDest, key, orSrc[key].value[0]);
            });

            dest.push(orDest);
        });


        templateData.data.solver_elements = dest;
    }

    // fluidforce
    if (model.data['solution-ff'] && model.data['solution-ff'].length) {
        var dest = [];

        model.data['solution-ff'].forEach((el) => {
            const fluidforce = {},
                params = el['PluginFluidforceName'];
            Object.keys(params).forEach((param) => {
                tryAssign(fluidforce, param, params[param].value[0]);
            });
            fluidforce.type = fluidforce.name;
            delete fluidforce.name;
            dest.push(fluidforce);
        });

        templateData.data.soln_ff = dest;
    }

    //solution
    if (model.data.solution && model.data.solution.length) {
        var dest = [],
            vals = model.data.solution,
            types = {'Filter': 'soln-filter',
                 'PluginWriter': 'soln-plugin-writer',
                 'PluginNaNcheck': 'soln-plugin-nancheck',
                 'Pluginresidual': 'soln-plugin-residual',
                 'Pluginsampler': 'soln-plugin-sampler',
                 'PluginTimeaverage': 'soln-plugin-tavg',
                 'ics': 'soln-ics'
            },
            enumVals = ['Filter',
             'PluginWriter',
             'PluginNaNcheck',
             'Pluginresidual',
             'Pluginsampler',
             'PluginTimeaverage',
             'ics'
            ]; //order matters, cannot Object.keys(types);


        vals.forEach( (el) => {
            const orVal = enumVals[el['SolutionOr'].or.value[0]],
                orSrc  = el[orVal],
                orDest = {};

            if (!orVal) { return; }

            orDest.type = types[orVal];
            Object.keys(orSrc).forEach( (key) => {
                if (key === 'ics.custom') {
                    orSrc[key].value.forEach((func) => {
                        orDest[func.name] = func.value;
                    });
                } else {
                    tryAssign(orDest, key, orSrc[key].value[0]);
                }
            });

            dest.push(orDest);
        });

        templateData.data.solution = dest;
    }

    //bcs
    if (model.data['solution-bcs'] && model.data['solution-bcs'].length) {
        var dest = [],
            vals = model.data['solution-bcs'],
            enumVals = ['char-riem-inv',
             'no-slp-adia-wall',
             'no-slp-isot-wall',
             'slp-adia-wall',
             'sub-in-frv',
             'sub-in-ftpttang',
             'sub-out-fp',
             'sup-in-fa',
             'sup-out-fn'];

        vals.forEach( (el) => {
            const orVal = enumVals[el.bcsOr.or.value[0]],
                orSrc  = el[orVal],
                orDest = {};

            if (!orVal) { return; }

            Object.keys(orSrc).forEach((key) => {
                tryAssign(orDest, key, orSrc[key].value[0]);
            });
            orDest.typeAttr = orVal;
            orDest.type = orDest.name;
            delete orDest.name;
            dest.push(orDest);
        });

        templateData.data.bcs = dest;
    }

    console.log('template:', templateData);
    return {
        errors: templateData.errors,
        model: model,
        results: {
            'pyfr.ini': template(templateData.data).replace(/\n{3,}/g, '\n\n')
        }
    };
}
