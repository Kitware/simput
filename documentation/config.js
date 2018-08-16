module.exports = {
  baseUrl: '/simput',
  work: './build-tmp',
  config: {
    title: 'SimPut',
    description: '"Who doesn\'t need \'Simple input\'?"',
    subtitle: '"Define your data model and get interactive form with proper file generation"',
    author: 'Kitware Inc.',
    timezone: 'UTC',
    url: 'https://kitware.github.io/simput',
    root: '/simput/',
    github: 'kitware/simput',
    google_analytics: 'UA-90338862-11',
  },
  copy: [
    {
      src: '../dist/*',
      dest: './build-tmp/public/app',
    },
  ],
};
