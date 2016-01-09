import clone from 'mout/src/lang/clone';

const uiCache = {};
const showCache = {};
const parameterCache = {};
const alwaysShow = () => true;
const uiPropTypeMapping = { 
    checkbox    : 'Checkbox',
    enum        : 'Enum',
};

// --- Helpers ---

function getParameter(model, attrName, paramId) {
    if(!parameterCache[attrName]) {
        parameterCache[attrName] = {};
    }
    if(!parameterCache[attrName][paramId]) {
        model.definitions[attrName].parameters.forEach( param => {
            parameterCache[attrName][param.id] = param;
        });
    }
    return parameterCache[attrName][paramId];
}

// --- UI handling ---

function generateUI(parameter, label, help) {
    // FIXME !!!!
    const ui = { "propType": "Cell", componentLabels: [] },
        allowedKey = ['id', 'size', 'layout', 'domain', 'default', 'type'];

    for(const key in parameter) {
        if(allowedKey.indexOf(key) !== -1) {
            ui[key] = parameter[key];
        }
    }

    if(parameter.ui) {
        ui.propType = uiPropTypeMapping[parameter.ui];
    }
    
    ui.label = label;
    ui.help = help;
    
    return ui;
}

function getUI(model, attrName, paramId, labels, help) {
    if(!uiCache[attrName]) {
        uiCache[attrName] = {};
        return generateUI(getParameter(model, attrName, paramId), 
            labels[attrName].parameters[paramId], help[attrName][paramId]);
    }

    if(!uiCache[attrName][paramId]) {
        const newUI = generateUI(getParameter(model, attrName, paramId), 
            labels[attrName].parameters[paramId], help[attrName][paramId]);
        uiCache[attrName][paramId] = newUI;
        return newUI;
    }

    return uiCache[attrName][paramId];
}

// --- DATA handling ---

function getData(model, fullData, selectedViewId, viewIdx, attrName, parameterId) {
    if(!fullData[selectedViewId]) {
        fullData[selectedViewId] = [];
    }
    while(fullData[selectedViewId].length <= viewIdx) {
        fullData[selectedViewId].push({});
    }
    const containerData = fullData[selectedViewId][viewIdx];

    if(!containerData[attrName]) {
        containerData[attrName] = {};
    }

    if(!containerData[attrName][parameterId]) {
        containerData[attrName][parameterId] = {
            id: attrName + '.' + parameterId,
            value: [].concat(clone(getParameter(model, attrName, parameterId).default)),
        };
    }

    return containerData[attrName][parameterId];
}

// --- Get the full list

function getParameterData(model, fullData, selectedViewId, viewIdx, attrName, parameterId, labels, help) {
    const ui = getUI(model, attrName, parameterId, labels, help),
        data = getData(model, fullData, selectedViewId, viewIdx, attrName, parameterId);

    return { ui, data, show: alwaysShow };
}

// ---- Show functions ----

function getShowFunction(model, attrName, orAttr) {
    if (!showCache[attrName]) {
        showCache[attrName] = {};
    }
    
    if (!showCache[attrName][orAttr]) {
        const attrList = [attrName].concat(Object.keys(model.definitions[attrName].children)),
            boolExpr = model.definitions[attrName].children[orAttr],
            funcTemplate = [
            `var global = {}; 
            for (var attr in viewData) {
                global[attr] = {};
                for (var key in viewData[attr]) {
                    global[attr][key] = viewData[attr][key].value;
                }
            }`,
        ];

        attrList.forEach((attr) => {
            funcTemplate.push(`var ${attr} = global.${attr};`) // `attr1 = global.attr1,`
        });
        funcTemplate.push(`return ${boolExpr};`);
        showCache[attrName][orAttr] = new Function('viewData', funcTemplate.join('\n'));
    }
    
    return showCache[attrName][orAttr];
}

function getShowParamFunction(model, attrName, boolExpr) {
    var funcTemplate = [];
    model.definitions[attrName].parameters.map( (param) => {
        funcTemplate.push(`var ${param.id} = viewData.${attrName}.${param.id}.value`)
    });
    
    funcTemplate.push(`return ${boolExpr};`);
    return new Function('viewData', funcTemplate.join('\n'));
}

// ---- Public API ----

export default function generateDataModel(model, fullData, selectedViewId, viewIdx, labels, help) {
    var propertyList = [],
        viewData = fullData[selectedViewId][viewIdx],
        viewAttrs = model.views[selectedViewId].attributes || [];

    // FIXME should add attribute separator + or management
    viewAttrs.forEach( (attrName) => {
        const attr = {title: labels[attrName].title},
            contents = [];
        model.definitions[attrName].parameters.forEach( (paramAttr, idx) => {
            if (Array.isArray(paramAttr)) { //OR prop
                paramAttr.forEach( (orAttr) => {
                    model.definitions[orAttr].parameters.forEach( (param) => {
                        var prop = getParameterData(model, fullData, selectedViewId, viewIdx, orAttr,
                            param.id, labels, help);
                        prop.viewData = viewData;
                        if (model.definitions[attrName].children[orAttr]) {
                            prop.show = getShowFunction(model, attrName, orAttr);
                        }
                        contents.push(prop);
                    });
                });
            } else {
                const prop = getParameterData(model, fullData, selectedViewId, viewIdx, attrName, 
                    paramAttr.id, labels, help);
                prop.viewData = viewData;
                if (paramAttr.show) {
                    prop.show = getShowParamFunction(model, attrName, paramAttr.show);
                }
                contents.push(prop);
            }
        });
        attr.contents = contents;
        propertyList.push(attr);
    });

    return propertyList;
}