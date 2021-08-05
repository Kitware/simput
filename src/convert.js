module.exports = dataModel => {
  const pftools = {};
  Object.values(dataModel.data).forEach(views => {
    views.forEach(view => addView(pftools, view));
  });

  return { pftools, dataModel };
};

function addView(pftools, view) {
  // Find dynamic names if dynamic view
  let dynamicKey = null;
  let dynamicName = null;
  const attributes = Object.values(view).filter(
    attribute => typeof attribute !== "string"
  );
  if (attributes.length == 1) {
    const isNameId = ([key]) => key.indexOf("/") === -1;
    const name = Object.entries(attributes[0]).find(isNameId);
    if (name) {
      const [nameId, nameProp] = name;
      if (nameProp.value[0]) {
        dynamicName = nameProp.value[0];
        dynamicKey = nameId;
      }
    }
  }

  Object.values(view).forEach(properties => {
    Object.entries(properties).forEach(([propertyName, property]) => {
      if (propertyName.indexOf("/") === -1) return;
      let pftoolsName = propertyName.replaceAll("/", ".");
      if (dynamicKey && dynamicName) {
        pftoolsName = pftoolsName.replaceAll(dynamicKey, dynamicName);
      }

      if (property.value.length > 1) {
        console.error("Encountered property with length > 1", property);
        return;
      }

      if (!property.value[0]) {
        return;
      }

      if (property.value[0].rows) {
        addTable(pftools, property.value[0].rows, dynamicKey, dynamicName);
        return;
      }

      pftools[pftoolsName] = property.value[0];
    });
  });
}

function addTable(pftools, rows, dynamicKey, dynamicName) {
  rows.forEach(row => {
    Object.entries(row.rowValues).forEach(([propertyName, property]) => {
      // Redo naming for properties in table
      let pftoolsName = propertyName.replaceAll("/", ".");
      if (dynamicKey && dynamicName) {
        pftoolsName = pftoolsName.replaceAll(dynamicKey, dynamicName);
      }

      Object.entries(row.rowKeys).forEach(([rowKey, rowName]) => {
        const { length: l, [l - 1]: rowKind } = rowKey.split("/");
        pftoolsName = pftoolsName.replaceAll(rowKind, rowName);
      });

      if (property.data.value.length > 1) {
        console.error("Encountered property with length > 1", property);
        return;
      }

      if (!property.data.value[0]) {
        return;
      }

      pftools[pftoolsName] = property.data.value[0];
    });
  });
}
