title: Conversion helper
---

Once the view model is filled up by the user, we rely on a function to validate and convert the data into a structure easy to handle within a template.

On the other hand if the proper __output__ annotations have been used in the model definition, such method can be automatically generated for you.

The function definition is as follow:

```
module.exports = function (viewModel) {
  // Do your work

  return {
    model: viewModel,
    errors: ['The password should match', 'The email address is not valid'], // Or null/undefined if no error detected
    results: {
      'path/to/destination/file.txt': 'Content of the file\nto be written on disk.',
      'file.json': JSON.stringify(viewModel, null, 2),
      'file-min.json': JSON.stringify(viewModel),
      'run.sh': 'ls -al >> listing.txt',
    },
    copies: [
      { src: '/path/to/a/file.binary', dst: './path/to/copy/that/file/to/file.binary' },
    ],
    permissions: {
      'run.sh': '+x',
    },
  };
}
```

- __model__: Pass the data model as you receive it.
- __errors__: Is an array of error message as strings. Should be null or undefined if no error.
- __results__: Is a map where the key is the file path that needs to be created and the value its content.
- __copies__: Is a list of files that needs to be copied over without modification. The source path need to be absolute while the destination one will be relative to the target directory of where the files will be created.
- __permissions__: Is a map for which default permission should be altered such as adding execution support for a shell script.


## View Model structure

The view model is what you get from the outside world that you need to convert into a set of files. That structure is related to the definition you wrote and what the user actually filled in.

```model.js
{
  views: {
    viewName1: { attributes: ['attributeNameA', 'attributeNameB', 'attributeNameC'] },
    viewName2: { attributes: ['attributeNameD', 'attributeNameE'], size: -1 },
    viewName3: { children: ['viewName3a', 'viewName3b', 'viewName3c'] },
    viewName3a: { attributes: ['attributeName3A'] },
    viewName3b: { attributes: ['attributeName3B'] },
    viewName3c: { attributes: ['attributeName3C'] },
  }
}
```

```ViewModel
{
  type: 'your-simput-type-name',
  data: {
    viewName1: [
      {
        name: "View 1 label",
        attributeNameA: {
          paramId1: {
            id: 'attributeNameA.paramId1',
            value: ['user input'],
          },
          paramId2: {
            id: 'attributeNameA.paramId2',
            value: ['other user input'],
          },
        },
        attributeNameB: {...},
        attributeNameC: {...},
      },
    ],
    viewName2: [
      {
        name: "View 2 - name given by user in menu",
        attributeNameD: {...},
        attributeNameE: {...},
      },
      {
        name: "View 2 - name given by user in menu",
        attributeNameD: {...},
        attributeNameE: {...},
      },
      ...
    ],
    viewName3a: [
      {
        name: "Label for viewName3a",
        attributeName3A: {...},
      },
    ],
    viewName3b: [
      {
        name: "Label for viewName3b",
      },
      {
        attributeName3B: {...},
      },
    ],
    viewName3c: [
      {
        name: "Label for viewName3c",
      },
      {},
      {
        attributeName3C: {...},
      },
    ],
  }
}
```
