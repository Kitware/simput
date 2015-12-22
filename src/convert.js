var template = require('./templates/output.jade');

module.exports = function (model) {
    var templateDataModel = { data: {}, valid: true , errors: []},
        viewInstance = null,
        count = 0,
        list = null;

    //BACKEND
    templateDataModel.data.backend = {}
    try {
        var backend = model.data.backend[0]['Backend-settings'];
        templateDataModel.data.backend.precision = backend['backend.precision'];
        templateDataModel.data.backend.rank_allocator = backend['backend.rank_allocator'];
    } catch(error) {
        templateDataModel.errors.push("Backend Settings not valid");
        templateDataModel.errors.push("=> " + error.message);
        templateDataModel.valid = false;
    }

    try {
        var backend = model.data.backend[0],
            active = backend.or[1].active,
            prefixToDrop = active.toLowerCase() + '.';
        templateDataModel.data.backend[active] = {};
        
        for (var key in backend[active]) {
            var newKey = key.replace(prefixToDrop, '');
            templateDataModel.data.backend[active][newKey] = backend[active][key];
        }
    } catch(error) {
        templateDataModel.errors.push("Backend multiprocessing method not valid");
        templateDataModel.errors.push("=> " + error.message);
        templateDataModel.valid = false;
    }
    
    // CONSTANTS
    var constants = model.data.constants[0];
    templateDataModel.data.constants = {};
    ['gamma', 'mu', 'pr', 'cpTref', 'cpTs'].forEach(function(el) {
        if (constants.Constants['constants.' + el]) {
            templateDataModel.data.constants[el] = constants.Constants['constants.' + el];
        }
    });

    //SOLVER
    templateDataModel.data.solver = {};
    try {
        var solver = model.data.solver[0]['Solver-settings'];
        templateDataModel.data.solver.system = solver['solver.system'];
        templateDataModel.data.solver.order = solver['solver.order'];
        templateDataModel.data.solver.anti_alias = solver['solver.anti_alias'];
        templateDataModel.data.solver.viscosity_correction = solver['solver.viscosity_correction'];
        templateDataModel.data.solver.shock_capturing = solver['solver.shock_capturing'];
    } catch(error) {
        templateDataModel.errors.push('Solver settings not valid');
        templateDataModel.errors.push('=> ' + error.message);
        templateDataModel.valid = false;
    }

    // SOLVER TIME-INTEGRATOR
    templateDataModel.data.solver.ti = {};
    try {
        var solver = model.data.solver[0]['Time Integrator'];
        templateDataModel.data.solver.ti.scheme = solver['solver.scheme'];
        templateDataModel.data.solver.ti.tstart = solver['solver.tstart'];
        templateDataModel.data.solver.ti.tend = solver['solver.tend'];
        templateDataModel.data.solver.ti.dt = solver['solver.dt'];
        templateDataModel.data.solver.ti.controller = solver['solver.controller'];
        if (solver['solver.controller'] === 'pi' && 
                (solver['solver.scheme'] === 'rk34' || solver['solver.scheme'] === 'rk35')) {
            templateDataModel.data.solver.ti.atol = solver['solver.atol'];
            templateDataModel.data.solver.ti.rtol = solver['solver.rtol'];
            templateDataModel.data.solver.ti.safety_fact = solver['solver.safety_fact'];
            templateDataModel.data.solver.ti.min_fact = solver['solver.min_fact'];
            templateDataModel.data.solver.ti.max_fact = solver['solver.max_fact'];
        } else if (solver['solver.controller'] === 'pi' && 
                (solver['solver.scheme'] !== 'rk34' && solver['solver.scheme'] !== 'rk35')) {
            throw Error('pi only works with rk34 and rk35');            
        }
    } catch (error) {
        templateDataModel.errors.push('Solver Time-integrator not valid');
        templateDataModel.errors.push('=> ' + error.message);
        templateDataModel.valid = false;
    }

    // SOLVER ARTIFICIAL VISCOSITY
    templateDataModel.data.solver.av = {};
    try {
        var solver = model.data.solver[0]['Artificial Viscosity'];
        templateDataModel.data.solver.av.max_amu = solver['solver.max_amu'];
        templateDataModel.data.solver.av.s0 = solver['solver.s0'];
        templateDataModel.data.solver.av.kappa = solver['solver.kappa'];
    } catch (error) {
        templateDataModel.errors.push('Solver Artificial Viscosity not valid');
        templateDataModel.errors.push('=> ' + error.message);
        templateDataModel.valid = false;
    }

    // SOLVER SOURCE
    templateDataModel.data.solver.source = {};
    try {
        var solver = model.data.solver[0]['Source'];
        templateDataModel.data.solver.source.rho = solver['solver.source.rho'];
        templateDataModel.data.solver.source.rhou = solver['solver.source.rhou'];
        templateDataModel.data.solver.source.rhov = solver['solver.source.rhov'];
        templateDataModel.data.solver.source.rhow = solver['solver.source.rhow'];
        templateDataModel.data.solver.source.E = solver['solver.source.E'];
    } catch(error) {
        templateDataModel.errors.push('Solver source not valid');
        templateDataModel.errors.push('=> ' + error.message);
        templateDataModel.valid = false;
    }

    // SOLVER INTERFACE
    templateDataModel.data.solver.interfaces = {};
    try {
        var interfaces = model.data.solver[0]['Interfaces'];
        templateDataModel.data.solver.interfaces.riemann = interfaces['solver.riemann'];
        templateDataModel.data.solver.interfaces.ldg_beta = interfaces['solver.ldg_beta'];
        templateDataModel.data.solver.interfaces.ldg_tau = interfaces['solver.ldg_tau'];
    } catch (error) {
        templateDataModel.errors.push('Solver interfaces not valid');
        templateDataModel.errors.push('=> ' + error.message);
        templateDataModel.valid = false;
    }
    
    //SOLVER INTERFACE TYPE
    templateDataModel.data.solver_interfaces = {};
    try {
        var interfaces = model.data['solver-interfaces'][0],
            active = interfaces.or[0].active,
            types = {'linear': 'line', 'triangular': 'tri', 'quadrilateral': 'quad'},
            valuesKey = active + '-int';
            
        templateDataModel.data.solver_interfaces.type = 'solver-interfaces-' + types[active.toLowerCase()];
        templateDataModel.data.solver_interfaces.flux_pts = interfaces[valuesKey]['solver.interfaces.flux_pts'];
        templateDataModel.data.solver_interfaces.quad_deg = interfaces[valuesKey]['solver.interfaces.quad_deg'];
        templateDataModel.data.solver_interfaces.quad_pts = interfaces[valuesKey]['solver.interfaces.quad_pts'];
    } catch(error) {
        templateDataModel.errors.push('Solver interface type not valid');
        templateDataModel.errors.push('=> ' + error.message);
        templateDataModel.valid = false;
    }

    // SOLVER ELEMENTS
    templateDataModel.data.solver_elements = {};
    try {
        var elements = model.data['solver-elements'][0],
            active = elements.or[0].active,
            types = {'triangular': 'tri', 'quadrilateral': 'quad', 
                'hexahedral': 'hex', 'tetrihedral': 'tet', 
                'prismatic': 'pri', 'pyramidal': 'pyr'},
            valuesKey = active + '-el';
            
        templateDataModel.data.solver_elements.type = 'solver-elements-' + types[active.toLowerCase()];
        templateDataModel.data.solver_elements.soln_pts = elements[valuesKey]['solver.elements.soln_pts'];
        templateDataModel.data.solver_elements.quad_deg = elements[valuesKey]['solver.elements.quad_deg'];
        templateDataModel.data.solver_elements.quad_pts = elements[valuesKey]['solver.elements.quad_pts'];
    } catch(error) {
        templateDataModel.errors.push('Solver interface type not valid');
        templateDataModel.errors.push('=> ' + error.message);
        templateDataModel.valid = false;
    }
    
    // SOLVER SOURCE TERMS
    templateDataModel.data.solver.source_terms = {};
    try {
        var solver = model.data.solver[0]['Solver-source-terms'];
        templateDataModel.data.solver.source_terms.rho = solver['solver.source-terms.rho'];
        templateDataModel.data.solver.source_terms.rhou = solver['solver.source-terms.rhou'];
        templateDataModel.data.solver.source_terms.rhov = solver['solver.source-terms.rhov'];
        templateDataModel.data.solver.source_terms.rhw = solver['solver.source-terms.rhw'];
        templateDataModel.data.solver.source_terms.E = solver['solver.source-terms.E'];
    } catch(error) {
        templateDataModel.errors.push('Solver source terms not valid');
        templateDataModel.errors.push('=> ' + error.message);
        templateDataModel.valid = false;
    }
    
    templateDataModel.data.solution = {};
    
    //SOLUTIONS
    model.data.solution.forEach(function(el) {
        var active = el.or[0].active,
            lowerActive = active.toLowerCase().replace(/ /g, '_'),
            current = el[active];
            
        try {
            templateDataModel.data.solution[lowerActive] = {};
            for (var item in current) {
                var shortItem = item.substr(item.lastIndexOf('.') + 1);
                templateDataModel.data.solution[lowerActive][shortItem] = el[active][item];
            }
        } catch(error) {
            templateDataModel.errors.push('Solution ' + active + ' not valid');
            templateDataModel.errors.push('=> ' + error.message);
            templateDataModel.valid = false;
        }
    });
    
    templateDataModel.data.bcs = [];
    model.data['solution-bcs'].forEach(function(el) {
        var active = el.or[0].active,
            current = el[active],
            output = {name: current['name'], items: []};
            
            delete current['name']
        try {
            var items = [];
            for (var item in current) {
                items.push({name: item, value: current[item]});
            }
            output.items = items;
        } catch(error) {
            templateDataModel.errors.push('BCS ' + active + ' not valid');
            templateDataModel.errors.push('=> ' + error.message);
            templateDataModel.valid = false;
        }
        
        templateDataModel.data.bcs.push(output);
    });
    
    console.log(templateDataModel);
    return {
        errors: templateDataModel.errors,
        results: {
            'pyfr.ini': template(templateDataModel)
        }
    };
}
