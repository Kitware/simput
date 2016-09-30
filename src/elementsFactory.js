module.exports = function(source, orVal, name) {
  var elemKey = ['Triangular-el', 'Quadrilateral-el', 'Hexahedral-el', 'Tetrahedral-el', 'Prismatic-el', 'Pyramidal-el'][orVal];
  var elem = {
    'solver.elements.soln_pts': {
      'id': elemKey + '.solver.elements.soln_pts',
      'value': source['soln-pts'] !== undefined ? [source['soln-pts']] : [],
    },
    'solver.elements.quad_deg': {
      'id': elemKey + '.solver.elements.quad_deg',
      'value': source['quad-deg'] !== undefined ? [source['quad-deg']] : [],
    },
    'solver.elements.quad_pts': {
      'id': elemKey + '.solver.elements.quad_pts',
      'value': source['quad-pts'] !== undefined ? [source['quad-pts']] : [],
    }
  };
  // quotes around keys are left over from copying this structure from a json file.
  var defaults = {
    'name': name,
    'ElementsOr': {
      'or': {
        'id': 'ElementsOr.or',
        'value': [orVal]
      }
    },
    'Triangular-el': {
      'solver.elements.soln_pts': {
        'id': 'Triangular-el.solver.elements.soln_pts',
        'value': ['williams-shunn']
      },
      'solver.elements.quad_deg': {
        'id': 'Triangular-el.solver.elements.quad_deg',
        'value': []
      },
      'solver.elements.quad_pts': {
        'id': 'Triangular-el.solver.elements.quad_pts',
        'value': [null]
      }
    },
    'Quadrilateral-el': {
      'solver.elements.soln_pts': {
        'id': 'Quadrilateral-el.solver.elements.soln_pts',
        'value': ['gauss-legendre']
      },
      'solver.elements.quad_deg': {
        'id': 'Quadrilateral-el.solver.elements.quad_deg',
        'value': []
      },
      'solver.elements.quad_pts': {
        'id': 'Quadrilateral-el.solver.elements.quad_pts',
        'value': [null]
      }
    },
    'Hexahedral-el': {
      'solver.elements.soln_pts': {
        'id': 'Hexahedral-el.solver.elements.soln_pts',
        'value': ['gauss-legendre']
      },
      'solver.elements.quad_deg': {
        'id': 'Hexahedral-el.solver.elements.quad_deg',
        'value': []
      },
      'solver.elements.quad_pts': {
        'id': 'Hexahedral-el.solver.elements.quad_pts',
        'value': [null]
      }
    },
    'Tetrahedral-el': {
      'solver.elements.soln_pts': {
        'id': 'Tetrahedral-el.solver.elements.soln_pts',
        'value': ['shunn-ham']
      },
      'solver.elements.quad_deg': {
        'id': 'Tetrahedral-el.solver.elements.quad_deg',
        'value': []
      },
      'solver.elements.quad_pts': {
        'id': 'Tetrahedral-el.solver.elements.quad_pts',
        'value': [null]
      }
    },
    'Prismatic-el': {
      'solver.elements.soln_pts': {
        'id': 'Prismatic-el.solver.elements.soln_pts',
        'value': ['williams-shunn~gauss-legendre']
      },
      'solver.elements.quad_deg': {
        'id': 'Prismatic-el.solver.elements.quad_deg',
        'value': []
      },
      'solver.elements.quad_pts': {
        'id': 'Prismatic-el.solver.elements.quad_pts',
        'value': [null]
      }
    },
    'Pyramidal-el': {
      'solver.elements.soln_pts': {
        'id': 'Pyramidal-el.solver.elements.soln_pts',
        'value': ['gauss-legendre']
      },
      'solver.elements.quad_deg': {
        'id': 'Pyramidal-el.solver.elements.quad_deg',
        'value': []
      },
      'solver.elements.quad_pts': {
        'id': 'Pyramidal-el.solver.elements.quad_pts',
        'value': [null]
      }
    }
  };

  defaults[elemKey] = elem;
  return defaults;
}
