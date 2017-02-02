# OpenFOAM Wind Tunnel

## What is OpenFOAM Wind Tunnel?

OpenFOAM Wind Tunnel let you generate the input deck to run a incompressible wind tunnel simulation.
Some information regarding the mesh you are droping in that tunnel will be needed.

## Simput Integration

Simput provides a simple way to write any kind of text file.
This project is meant to illustrate how Simput can be used to generate templated files. Simput requires a javascript description of any user input. To build a Simput package use; 

```sh
$ Simput -c src/ -o versions/ -t openfoam-windtunnel
```

Add the compiled package to Simput:

```sh
$ Simput -a versions/openfoam-windtunnel.js
```

## Running Simput

### Running interactively
The following command will start a server which serves Simput's interactive form.

```sh
$ Simput -i samples/empty/openfoam-empty.json -o samples/empty/.
```
