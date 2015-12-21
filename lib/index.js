import * as Factory from './factory.js';

require('font-awesome/css/font-awesome.css');
require('normalize.css');
require('tonic-ui/lib/css/state.css');

export function load (url, container) {
    Factory.createViewer(url, (viewer) => {
        if(!viewer) {
            return console.log("The metadata format seems to be unsupported.");
        }

        Factory.createUI(viewer, container);
    });
    
}