import 'normalize.css';

import Factory from './factory';

/* eslint-disable import/prefer-default-export */
export function load(url, container) {
  Factory.createViewer(url, (viewer) => {
    if (!viewer) {
      console.log('The metadata format seems to be unsupported.');
      return;
    }

    Factory.createUI(viewer, container);
  });
}
