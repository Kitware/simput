module.exports = function(source, name) {
  var types = ['char-riem-inv', 'no-slp-adia-wall',
             'no-slp-isot-wall', 'slp-adia-wall',
             'sub-in-frv', 'sub-in-ftpttang',
             'sub-out-fp', 'sup-in-fa', 'sup-out-fn'];
  var bcsKey = source.type;
  var orVal = types.indexOf(bcsKey);

  // quotes around keys are left over from copying this structure from a json file.
  var defaults = {
    "name": name,
    "bcsOr": {
      "or": {
        "id": "bcsOr.or",
        "value": [orVal]
      }
    },
    "char-riem-inv": {
      "name": {
        "id": "char-riem-inv.name",
        "value": [""]
      },
      "rho": {
        "id": "char-riem-inv.rho",
        "value": []
      },
      "u": {
        "id": "char-riem-inv.u",
        "value": []
      },
      "v": {
        "id": "char-riem-inv.v",
        "value": []
      },
      "w": {
        "id": "char-riem-inv.w",
        "value": []
      },
      "p": {
        "id": "char-riem-inv.p",
        "value": []
      }
    },
    "no-slp-adia-wall": {
      "name": {
        "id": "no-slp-adia-wall.name",
        "value": [""]
      }
    },
    "no-slp-isot-wall": {
      "name": {
        "id": "no-slp-isot-wall.name",
        "value": [""]
      },
      "u": {
        "id": "no-slp-isot-wall.u",
        "value": []
      },
      "v": {
        "id": "no-slp-isot-wall.v",
        "value": []
      },
      "w": {
        "id": "no-slp-isot-wall.w",
        "value": []
      },
      "cpTw": {
        "id": "no-slp-isot-wall.cpTw",
        "value": []
      }
    },
    "slp-adia-wall": {
      "name": {
        "id": "slp-adia-wall.name",
        "value": [""]
      }
    },
    "sub-in-frv": {
      "name": {
        "id": "sub-in-frv.name",
        "value": [""]
      },
      "rho": {
        "id": "sub-in-frv.rho",
        "value": []
      },
      "u": {
        "id": "sub-in-frv.u",
        "value": []
      },
      "v": {
        "id": "sub-in-frv.v",
        "value": []
      },
      "w": {
        "id": "sub-in-frv.w",
        "value": []
      }
    },
    "sub-in-ftpttang": {
      "name": {
        "id": "sub-in-ftpttang.name",
        "value": [""]
      },
      "pt": {
        "id": "sub-in-ftpttang.pt",
        "value": []
      },
      "cpTt": {
        "id": "sub-in-ftpttang.cpTt",
        "value": []
      },
      "theta": {
        "id": "sub-in-ftpttang.theta",
        "value": []
      },
      "phi": {
        "id": "sub-in-ftpttang.phi",
        "value": []
      }
    },
    "sub-out-fp": {
      "name": {
        "id": "sub-out-fp.name",
        "value": [""]
      },
      "p": {
        "id": "sub-out-fp.p",
        "value": []
      }
    },
    "sup-in-fa": {
      "name": {
        "id": "sup-in-fa.name",
        "value": [""]
      },
      "rho": {
        "id": "sup-in-fa.rho",
        "value": []
      },
      "u": {
        "id": "sup-in-fa.u",
        "value": []
      },
      "v": {
        "id": "sup-in-fa.v",
        "value": []
      },
      "w": {
        "id": "sup-in-fa.w",
        "value": []
      },
      "p": {
        "id": "sup-in-fa.p",
        "value": []
      }
    }
  };
  var bcs = defaults[bcsKey];
  bcs.name = {
    id: bcsKey + '.name',
    value: [ name.replace('soln-bcs-', '') ]
  };
  Object.keys(source).forEach(function(el) {
    bcs[el] = {
      id: bcsKey + '.' + el,
      value: source[el] !== undefined ? [source[el]] : []
    };
  });

  defaults[bcsKey] = bcs;
  return defaults;
}
