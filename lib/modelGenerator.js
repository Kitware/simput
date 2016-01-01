import clone from 'mout/src/lang/clone';

const uiCache = {};
const parameterCache = {};
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

function generateUI(attributeData) {
    // FIXME !!!!
    const ui = { "propType": "Cell", componentLabels: [] },
        allowedKey = ['id', 'size', 'layout', 'domain', 'default'];

    for(const key in attributeData) {
        if(allowedKey.indexOf(key) !== -1) {
            ui[key] = attributeData[key];
        }
    }

    if(attributeData.ui) {
        ui.propType = uiPropTypeMapping[attributeData.ui];
    }

    return ui;
}

function getUI(model, attrName, paramId) {
    if(!uiCache[attrName]) {
        uiCache[attrName] = {};
        return generateUI(getParameter(model, attrName, paramId));
    }

    if(!uiCache[attrName][paramId]) {
        const newUI = generateUI(getParameter(model, attrName, paramId));
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
            id: parameterId,
            value: [].concat(clone(getParameter(model, attrName, parameterId).default)),
        }
    }

    return containerData[attrName][parameterId];
}

// --- Get the full list

function getParameterData(model, fullData, selectedViewId, viewIdx, attrName, parameterId) {
    const ui = getUI(model, attrName, parameterId),
        data = getData(model, fullData, selectedViewId, viewIdx, attrName, parameterId);

    return { ui, data };
}

// ---- Public API ----

export default function generateDataModel(model, fullData, selectedViewId, viewIdx) {
    var propertyList = [],
        attrs = model.views[selectedViewId].attributes || [];

    // FIXME should add attribute separator + or management
    attrs.forEach( attrName => {
        if(Array.isArray(attrName)) {
            attrName.forEach( name => {
                model.definitions[name].parameters.forEach( p => {
                   propertyList.push(getParameterData(model, fullData, selectedViewId, viewIdx, name, p.id)); 
                });
            });
        } else {
            model.definitions[attrName].parameters.forEach( p => {
                propertyList.push(getParameterData(model, fullData, selectedViewId, viewIdx, attrName, p.id)); 
            });
        }
    });

    return propertyList;
}