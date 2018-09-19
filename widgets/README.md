# VeraInView ![Version](https://badge.fury.io/js/%40doe-casl%2Fverain-view.svg)


VeraInView is a standalone HTML file that can act as an application to visualize your VERAin XML files.

## To build

We depend on `node` to build and bundle the application. All other dependencies will be downloaded and installed when running `npm i` which includes vtk.js for the 3D rendering.

To build and bundle the application, you will need to run these commands:

```
npm i                    # Install build tools and dependencies
npm run build:release    # Transpile the application into ./dist/vera.js
```

## To run

Copy the resultant `dist/simput-external-vera.js` to your `simput/dist` folder and run Simput.

