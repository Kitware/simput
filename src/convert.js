var template = require('./templates/output.hbs');

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
        try {
            dest[key] = item;
        } catch (e) {
            console.log(`problem assigning ${item} to templateData`);
        }
    }
    
    //backend settings
    if (model.data.backend && model.data.backend[0]) {
        var dest = {},
            backend = model.data.backend[0]['Backend-settings'];
        tryAssign(dest, 'precision', backend['backend.precision'].value[0]);
        tryAssign(dest, 'rank-allocator', backend['backend.rank_allocator'].value[0]);
        templateData.data.backend = dest;
    }
    
    //backend model "Open-MP", "Open-CL", "CUDA"
    if (model.data.backend && model.data.backend[0].BackendOr.or.value) {
        var dest = {},
            enumVal = model.data.backend[0].BackendOr.or.value[0],
            orVal = ["Open-MP", "Open-CL", "CUDA"][enumVal],
            orObj = model.data.backend[0][orVal];
        
        Object.keys(orObj).forEach( (key) => {
            tryAssign(dest, last(key.split('.')).replace(/_/g, '-'), orObj[key].value[0]);
        });
            
        templateData.data[orVal] = dest;
    }
    
    //constants
    if (model.data.constants && model.data.constants[0]) {
        var dest = {},
            constants = model.data.constants[0].Constants;
            
        Object.keys(constants).forEach( (el) => {
            tryAssign(dest, last(el.split('.')), constants[el].value[0]); 
        });
            
        templateData.data.constants = dest;
    }
    
    //solver - settings
    if (model.data.solver && model.data.solver[0] && model.data.solver[0]['Solver-settings']) {
        var dest = {},
            ss = model.data.solver[0]['Solver-settings'];
        
        Object.keys(ss).forEach( (el) => {
            tryAssign(dest, last(el.split('.')).replace(/_/g, '-'), ss[el].value[0]); 
        });
        
        templateData.data.solver_settings = dest;
    }
    
    //solver - time integrator
    if (model.data.solver && model.data.solver[0] && model.data.solver[0]['TimeIntegrator']) {
        var dest = {},
            ti = model.data.solver[0]['TimeIntegrator'];
        
        Object.keys(ti).forEach( (el) => {
            tryAssign(dest, last(el.split('.')).replace(/_/g, '-'), ti[el].value[0]); 
        });
        
        templateData.data.solver_ti = dest;
    }
    
    //solver - artificail visc
    if (model.data.solver && model.data.solver[0] && model.data.solver[0]['ArtificialViscosity']) {
        var dest = {},
            av = model.data.solver[0]['ArtificialViscosity'];
        
        Object.keys(av).forEach( (el) => {
            tryAssign(dest, last(el.split('.')).replace(/_/g, '-'), av[el].value[0]);
        });
        
        templateData.data.solver_av = dest;
    }
    
    //solver - source terms
    if (model.data.solver && model.data.solver[0] && model.data.solver[0]['Solver-source-terms']) {
        var dest = {},
            sst = model.data.solver[0]['Solver-source-terms'];
        
        Object.keys(sst).forEach( (el) => {
            tryAssign(dest, last(el.split('.')).replace(/_/g, '-'), sst[el].value[0]); 
        });
        
        templateData.data.solver_source_terms = dest;
    }
    
    //solver - interfaces
    if (model.data.solver && model.data.solver[0] && model.data.solver[0]['Interfaces']) {
        var dest = {},
            interfaces = model.data.solver[0]['Interfaces'];
        
        Object.keys(interfaces).forEach( (el) => {
            tryAssign(dest, last(el.split('.')).replace(/_/g, '-'), interfaces[el].value[0]); 
        });
        
        templateData.data.solver_interfaces = dest;
    }
    
    //solver line, tri, quad interfaces 
    if (model.data['solver-interfaces'] && model.data['solver-interfaces'][0]) {
        var dest = {},
            enumVal = model.data['solver-elemets'].InterfacesOr.or.value[0],
            orVal = ["Linear-int", "Triangular-int", "Quadrilateral-int"][enumVal],
            types = {'linear': 'line', 'triangular': 'tri', 'quadrilateral': 'quad'},
            orObj = model.data.backend[0][orVal];
        
        Object.keys(orObj).forEach( (key) => {
            tryAssign(dest, last(key.split('.')).replace(/_/g, '-'), orObj[key].value[0]);
        });
        
        dest.type = types[orVal.split('-')[0].toLowerCase()];
        templateData.data.solver_interfaces_type = dest;
    }
    
    //solver elements
    if (model.data['solver-elements'] && model.data['solver-elements'].length) {
        var dest = [],
            vals = model.data['solver-elements'],
            enumVals = ["Triangular-el", "Quadrilateral-el", "Hexahedral-el", 
                "Tetrahedral-el", "Prismatic-el", "Pyramidal-el"],
            types = {'triangular': 'tri', 'quadrilateral': 'quad', 
                    'hexahedral': 'hex', 'tetrahedral': 'tet', 
                    'prismatic': 'pri', 'pyramidal': 'pyr'};
        
        vals.forEach( (el) => {
            const orVal = enumVals[el['ElementsOr'].or.value[0]],
                orSrc  = el[orVal],
                orDest = {};
                
            orDest.type = types[orVal.split('-')[0].toLowerCase()];
            Object.keys(orSrc).forEach( (key) => {
                tryAssign(orDest, last(key.split('.')).replace(/_/g, '-'), orSrc[key].value[0]);
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
                tryAssign(fluidforce, last(param.split('.')).replace(/_/g, '-'), params[param].value[0]);
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
            enumVals = ["Filter",
             "PluginWriter",
             "PluginNaNcheck",
             "Pluginresidual",
             "Pluginsampler",
             "PluginTimeaverage",
             "ics"
            ]; //order matters, cannot Object.keys(types);
        
        vals.forEach( (el) => {
            const orVal = enumVals[el['SolutionOr'].or.value[0]],
                orSrc  = el[orVal],
                orDest = {};
                
            orDest.type = types[orVal];
            Object.keys(orSrc).forEach( (key) => {
                tryAssign(orDest, last(key.split('.')), orSrc[key].value[0]);
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
            const orVal = enumVals[el['bcsOr'].or.value[0]],
                orSrc  = el[orVal],
                orDest = {};
                
            Object.keys(orSrc).forEach( (key) => {
                tryAssign(orDest, last(key.split('.')), orSrc[key].value[0]);
            });
            orDest.type = orDest.name;
            delete orDest.name;
            dest.push(orDest);
        });
        
        templateData.data.bcs = dest;
    }
    
    console.log('template:', templateData);
    return {
        errors: templateData.errors,
        results: {
            'pyfr.ini': template(templateData.data)
        }
    };
}
