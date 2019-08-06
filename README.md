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

Simput provides a simple way to write any kind of text file.

This project is meant to illustrate how Simput can be used to generate
templated files for multiple cases. Simput requires a javascript description of
any user input. To build a Simput package use;

```sh
$ Simput -c src/ -o versions/ -t pyfr
```

Add the compiled package to Simput (already done)

```
cp ./versions/pyfr.js ../{static|dist}/types/
```

Register it in the `../{static|dist}/index.html` (already done)

```
Simput.registerType('pyfr', ['./types/pyfr.js']);
```

## Running Simput

### Running interactively
The following command will start a server which serves Simput's interactive form.

```sh
$ Simput -p 8080
```

Then drag a file with the following content or the following example file `samples/empty/pyfr-empty-externals.json`

```
{
  "type": "pyfr",
  "data": {}
}
```
