module.exports = function(source, name) {
  var types = ['soln-filter', 'soln-plugin-writer', 'soln-plugin-nancheck', 'soln-plugin-residual', 'soln-plugin-sampler', 'soln-plugin-tavg', 'soln-ics'];
  var keys  = ['Filter',       'PluginWriter',      'PluginNaNcheck',       'Pluginresidual',       'Pluginsampler',       'PluginTimeaverage', 'ics'];
  var orVal = types.indexOf(name);
  var solnKey = keys[orVal];

  // quotes around keys are left over from copying this structure from a json file.
  var defaults = {
    name: name,
    SolutionOr: {
      or: {
        id: 'SolutionOr.or',
        value: [orVal]
      }
    },
    Filter: {
      'solution.filter.nsteps': {
        id: 'Filter.solution.filter.nsteps',
        value: []
      },
      'solution.filter.alpha': {
        id: 'Filter.solution.filter.alpha',
        value: []
      },
      'solution.filter.order': {
        id: 'Filter.solution.filter.order',
        value: []
      },
      'solution.filter.cutoff': {
        id: 'Filter.solution.filter.cutoff',
        value: []
      }
    },
    PluginWriter: {
      'solution.plugin_writer.dt_out': {
        id: 'PluginWriter.solution.plugin_writer.dt_out',
        value: []
      },
      'solution.plugin_writer.basedir': {
        id: 'PluginWriter.solution.plugin_writer.basedir',
        value: []
      },
      'solution.plugin_writer.basename': {
        id: 'PluginWriter.solution.plugin_writer.basename',
        value: []
      }
    },
    PluginNaNcheck: {
      'solution.plugin_nancheck.nsteps': {
        id: 'PluginNaNcheck.solution.plugin_nancheck.nsteps',
        value: []
      }
    },
    Pluginresidual: {
      'solution.plugin_residual.nsteps': {
        id: 'Pluginresidual.solution.plugin_residual.nsteps',
        value: []
      },
      'solution.plugin_residual.file': {
        id: 'Pluginresidual.solution.plugin_residual.file',
        value: []
      },
      'solution.plugin_residual.header': {
        id: 'Pluginresidual.solution.plugin_residual.header',
        value: []
      }
    },
    Pluginsampler: {
      'solution.plugin_sampler.nsteps': {
        id: 'Pluginsampler.solution.plugin_sampler.nsteps',
        value: []
      },
      'solution.plugin_sampler.samp_pts': {
        id: 'Pluginsampler.solution.plugin_sampler.samp_pts',
        value: []
      },
      'solution.plugin_sampler.format': {
        id: 'Pluginsampler.solution.plugin_sampler.format',
        value: [null]
      },
      'solution.plugin_sampler.file': {
        id: 'Pluginsampler.solution.plugin_sampler.file',
        value: []
      },
      'solution.plugin_sampler.header': {
        id: 'Pluginsampler.solution.plugin_sampler.header',
        value: []
      }
    },
    PluginTimeaverage: {
      'solution.plugin_tavg.nsteps': {
        id: 'PluginTimeaverage.solution.plugin_tavg.nsteps',
        value: []
      },
      'solution.plugin_tavg.dt_out': {
        id: 'PluginTimeaverage.solution.plugin_tavg.dt_out',
        value: []
      },
      'solution.plugin_tavg.basedir': {
        id: 'PluginTimeaverage.solution.plugin_tavg.basedir',
        value: []
      },
      'solution.plugin_tavg.basename': {
        id: 'PluginTimeaverage.solution.plugin_tavg.basename',
        value: []
      },
      'solution.plugin_tavg.avg_name': {
        id: 'PluginTimeaverage.solution.plugin_tavg.avg_name',
        value: []
      }
    },
    ics: {
      'ics.rho': { id: 'ics.ics.rho', value: [] },
      'ics.u': { id: 'ics.ics.u', value: [] },
      'ics.v': { id: 'ics.ics.v', value: [] },
      'ics.w': { id: 'ics.ics.w', value: [] },
      'ics.p': { id: 'ics.ics.p', value: [] },
      'ics.custom': { id: 'ics.ics.custom', value: [] }
    }
  };

  var soln = defaults[solnKey];
  if (solnKey !== 'ics') {
    var keyName = name.substr(5).replace(/-/g, '_');
    Object.keys(source).forEach(function(el) {
      var keyEl = el.replace(/-/g, '_');
      var key = 'solution.' + keyName + '.' + keyEl;
      soln[key] = {
        id: solnKey + '.' + key,
        value: source[el] !== undefined ? [ source[el] ] : []
      };
    });
  // custom soln-ics
  } else {
    var expectedKeys = ['rho', 'u', 'v', 'w', 'p'];
    expectedKeys.forEach(function(el) {
      soln['ics.' + el] = {
        id: 'ics.ics.' + el,
        value: source[el] !== undefined ? [ source[el].trim() ] : []
      };
    });

    var customIcs = { id: 'ics.ics.custom', value: [] };
    Object.keys(source).forEach(function(el) {
      if (expectedKeys.indexOf(el) !== -1) {
        return;
      }
      customIcs.value.push({ name: el, value: [source[el].trim()] });
    });
    soln['ics.custom'] = customIcs;
  }

  defaults[solnKey] = soln;
  return defaults;
}
