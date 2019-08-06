# OpenFOAM Wind Tunnel

## What is OpenFOAM Wind Tunnel?

OpenFOAM Wind Tunnel let you generate the input deck to run a incompressible wind tunnel simulation.
Some information regarding the mesh you are droping in that tunnel will be needed.

## Simput Integration

Simput provides a simple way to write any kind of text file.

This project is meant to illustrate how Simput can be used to generate
templated files for multiple cases. Simput requires a javascript description of
any user input. To build a Simput package use;

```sh
$ Simput -c src/ -o versions/ -t openfoam-windtunnel
```

Add the compiled package to Simput (already done)

```
cp ./versions/openfoam-windtunnel.js ../{static|dist}/types/
```

Register it in the `../{static|dist}/index.html` (already done)

```
Simput.registerType('openfoam-windtunnel', ['./types/openfoam-windtunnel.js']);
```

## Running Simput

### Running interactively
The following command will start a server which serves Simput's interactive form.

```sh
$ Simput -p 8080
```

Then drag a file with the following content

```
{
  "type": "openfoam-windtunnel",
  "data": {}
}
```
