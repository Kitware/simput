#PyFR

##What is PyFR?
[Sourced from [here](http://www.pyfr.org/#overview)]

PyFR is an open-source Python based framework for solving advection-diffusion type problems on streaming architectures using the Flux Reconstruction approach of Huynh. The framework is designed to solve a range of governing systems on mixed unstructured grids containing various element types. It is also designed to target a range of hardware platforms via use of an in-built domain specific language derived from the Mako templating engine. The current release (PyFR 1.2.0) has the following capabilities:

- Governing Equations - Euler, Navier Stokes
- Dimensionality - 2D, 3D
- Element Types - Triangles, Quadrilaterals, Hexahedra, Prisms, Tetrahedra, Pyramids
- Platforms - CPU Clusters, Nvidia GPU Clusters, AMD GPU Clusters
- Spatial Discretisation - High-Order Flux Reconstruction
- Temporal Discretisation - Explicit Runge-Kutta
- Precision - Single, Double
- Mesh Files Imported - Gmsh (.msh)
- Solution Files Exported - Unstructured VTK (.vtu, .pvtu)

## Simput Integration
Simput provides a simple way to write input simulation files. This project is meant to manage PyFR simulation code. Simput requires a javascript description of an input deck. To build a Simput package use; 

```sh
$ Simput -c src/ -o versions/ -t PyFR-1-2-0
```

Add the compiled package to Simput:

```sh
$ Simput -a versions/PyFR-1-2-0.js
```

## Running Simput

### Running interactively
The following command will start a server which serves Simput's interactive form.

```sh
$ Simput -i sample/empty/empty.json -o sample/empty/.
```

### Running on the command line
The following command will generate an new .ini file based on the data.

```sh
$ Simput -i sample/2d-couette-flow/data.json -o sample/2d-couette-flow/ --no-gui
```


