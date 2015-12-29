var vCardTemplate = require('./templates/vcard.hbs');

export default function(dataModel) {
    const results = {}, 
        error = null;

    dataModel.data.AddressBook.forEach( person => {
        const key = [ person.firstName, person.lastName ].join(' ');
        results[key+'.vcf'] = vCardTemplate(person);
    });

    return { results, error };
}