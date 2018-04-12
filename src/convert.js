const vCardTemplate = require('./templates/vcard.hbs');

module.exports = function convert(dataModel) {
  const results = {};

  dataModel.data.AddressBook.forEach((attributes) => {
    const person = {};
    Object.keys(attributes.person).forEach((fieldName) => {
      person[fieldName] = attributes.person[fieldName].value[0];
    });
    results[`${person.firstName} ${person.lastName}.vcf`] = vCardTemplate(
      person
    );
  });

  return { results, model: dataModel };
};
