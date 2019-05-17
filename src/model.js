module.exports = {
    scripts: [],
    defaultActiveView: 'Welcome',
    order: ['Welcome', 'RegionSelection', 'MaterialDefinition'],
    views: {
        Welcome: {
            label: 'ParFlow CONUS extract',
            attributes: ['Hello', 'AreaSelector'],
        },
        RegionSelection: {
            label: 'Region selection',
            attributes: ['AreaSelector'],
        },
        MaterialDefinition: {
            label: 'Material definition',
            attributes: ['Hello'],
        },
    },
    definitions: {
        Hello: {
            label: 'My hello world',
            parameters: [
                {
                  id: 'title',
                  type: 'string',
                  size: 1,
                  label: 'Title',
                  help: 'Just to get some content',
                },
                {
                  id: 'helloWidget',
                  label: 'Yo',
                  propType: 'HelloWorld',
                  size: 1,
                  default: {},
                }
            ],
        },
        AreaSelector: {
            label: 'Select area of interest',
            parameters: [
                {
                  id: 'title',
                  type: 'string',
                  size: 1,
                  label: 'Title',
                },
                {
                  id: 'selector',
                  label: 'Yo',
                  propType: 'RegionSelector',
                  size: 1,
                  default: {},
                }
            ],
        },
    },
};