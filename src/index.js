import * as Factory from './factory.js';

require('normalize.css');

export function load (url, container) {
    Factory.createViewer(url, (viewer) => {
        if(!viewer) {
            return console.log("The metadata format seems to be unsupported.");
        }

        Factory.createUI(viewer, container);
    });
}
