module.exports = {
  order: ['General', 'CaseBook'],
  views: {
    General: {
      id: 'General',
      label: 'General',
      attributes: [],
      hooks: [],
      readOnly: true
    },
    CaseBook: {
      id: 'CaseBook',
      label: 'Case Book',
      attributes: ['other', 'inputs'],
      size: -1,
      hooks: [
        {
          type: 'caseNameToView'
        }
      ],
      readOnly: true
    }
  },
  definitions: {
    other: {
      label: 'Other',
      parameters: [
        {
          id: 'name',
          label: 'Name',
          type: 'string',
          size: 1,
          default: 'MyCase'
        }
      ]
    },
    inputs: {
      label: 'Inputs',
      parameters: [
        {
          id: 'reynolds_number',
          label: 'Reynolds number',
          type: 'double',
          size: 1,
          default: 1.0
        },
        {
          id: 'cell_count',
          label: 'Normal cell count',
          type: 'integer',
          size: 1,
          default: 10
        }
      ]
    }
  }
}
