import Images from 'simput/src/samples/images';

// prettier-ignore
export default [
  {
    label: 'Oscillator',
    image: Images.oscillator,
    description: 'Oscillator source for In-Situ simulation',
    acknowledgement: 'Example by Kitware Inc.',
    model: {
      type: 'oscillator',
      data: {},
    },
  },
  {
    label: 'Address book',
    icon: 'contact_mail',
    description: 'Address book which generate vcs files',
    acknowledgement: 'Example by Kitware Inc.',
    model: {
      type: 'vcard',
      data: {},
    },
  },
  {
    label: 'OpenFOAM periodic',
    image: Images.OpenFOAM,
    description: 'Simple OpenFOAM input files case manager',
    acknowledgement: 'Example by OpenFOAM community. (Robert Sawko)',
    model: {
      type: 'openfoam-periodic',
      data: {},
    },
  },
  {
    label: 'Create your own model type',
    icon: 'note_add',
    description: 'Click here to learn how to create your own type.',
    goTo: 'http://kitware.github.io/simput/docs/vcard.html'
  },
];
