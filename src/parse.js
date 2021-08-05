import { set, forEach } from "lodash";
import ModelManager from "simput/src/core/ModelManager";

class ParflowViewBuilder {
  constructor() {
    // Global Simput is set by module <script> in public/index.html
    //eslint-disable-next-line
    this.simput = Simput;
    this.type = "parflow";
    this.definitions = this.simput.types[this.type].model.definitions;
    this.dynamicFields = {};
  }

  run(pfRun) {
    // Find all values to transfer from pf to simput
    const transfers = [];
    const views = this.simput.types[this.type].model.views;
    forEach(views, ({ attributes, size }, viewName) => {
      forEach(attributes, attributeName => {
        const parameters = this.definitions[attributeName].parameters;
        forEach(parameters, ({ id: paramDst }) => {
          const paramSrc = paramDst.replaceAll("/", ".");
          const viewIsDynamic = size === -1;
          if (viewIsDynamic) {
            // Pattern match all pf keys to find parameters in dynamic views
            const parameterMatches = this.parameterMatches(paramDst, pfRun);
            const dynamicParamNames = {};
            parameterMatches.forEach(
              ({ paramSrc, dynamicViewIndex, dynamicPfName, nameDst }) => {
                transfers.push({
                  viewName,
                  attributeName,
                  paramDst,
                  paramSrc,
                  dynamicViewIndex
                });
                dynamicParamNames[dynamicPfName] = {
                  dynamicViewIndex,
                  nameDst
                };
              }
            );
            // Set name parameter for each dynamic view
            Object.entries(dynamicParamNames).forEach(
              ([dynamicPfName, { dynamicViewIndex, nameDst }]) => {
                transfers.push({
                  viewName,
                  attributeName,
                  paramDst: nameDst,
                  dynamicPfName,
                  dynamicViewIndex
                });
              }
            );
          } else {
            transfers.push({
              viewName,
              attributeName,
              paramDst,
              paramSrc,
              dynamicViewIndex: 0
            });
          }
        });
      });
    });

    // Get values
    transfers.forEach(transfer => {
      if (transfer.paramSrc) {
        transfer.value = [pfRun[transfer.paramSrc]]; //FIXME Check size -1 (Do we ever set more than one value?)
      } else {
        transfer.value = [transfer.dynamicPfName];
      }
    });

    // Set values
    const data = {};
    transfers.forEach(
      ({ paramDst, attributeName, viewName, dynamicViewIndex, value }) => {
        const setPath = [viewName, dynamicViewIndex, attributeName, paramDst];
        set(data, setPath, { id: attributeName + "." + paramDst, value });
      }
    );

    const { type } = this;
    const module = this.simput.types[type];
    const external = this.simput.types[type].model.external;
    const dataModel = new ModelManager(module, { data, type, external });

    return dataModel;
  }

  parameterMatches(paramDst, pfRun) {
    const matches = [];
    let dynamicViewIndexCounter = 0;
    const splitParam = paramDst.split("/");
    for (const pfKey in pfRun) {
      const splitPfKey = pfKey.split(".");
      // Check that keys could be the same
      const lastPfKey = splitPfKey[splitPfKey.length - 1];
      const lastParam = splitParam[splitParam.length - 1];
      if (splitPfKey[0] === splitParam[0] && lastPfKey === lastParam) {
        // Check that keys are the same except once for the variable name
        let matchingPathPieceCounter = 0;
        let dynamicPfName;
        let dynamicParam;
        for (var i = 0; i < splitPfKey.length; i++) {
          if (splitPfKey[i] === splitParam[i]) {
            matchingPathPieceCounter += 1;
          } else {
            dynamicPfName = splitPfKey[i];
            dynamicParam = splitParam[i];
          }
        }
        const allPiecesCount = splitParam.length;
        if (matchingPathPieceCounter === allPiecesCount - 1) {
          matches.push({
            dynamicPfName: dynamicPfName,
            paramSrc: pfKey,
            dynamicViewIndex: dynamicViewIndexCounter++,
            nameDst: dynamicParam
          });
        }
      }
    }
    return matches;
  }
}

export default ParflowViewBuilder;
