# OpenFOAM Tutorials

## What is OpenFOAM Tutorials?

OpenFOAM Tutorials let you generate the script that should be run using a docker environment to run any tutorial example available.

This will generate a `DockerOpenFOAM_run.sh` file based on the selected tutorial example.

Then the execution should be done as follow:

```sh
$ chmod +x $PWD/DockerOpenFOAM_run.sh
$ xhost +local:of_v1612_plus
$ docker start of_v1612_plus
$ docker exec -t of_v1612_plus $PWD/DockerOpenFOAM_run.sh $PWD
```

## Simput Integration

Simput provides a simple way to write any kind of text file.

This project is meant to illustrate how Simput can be used to generate
templated files for multiple cases. Simput requires a javascript description of
any user input. To build a Simput package use;

```sh
$ Simput -c src/ -o versions/ -t openfoam_tutorials
```

Add the compiled package to Simput (already done)

```
cp ./versions/openfoam_tutorials.js ../{static|dist}/types/
```

Register it in the `../{static|dist}/index.html` (already done)

```
Simput.registerType('openfoam_tutorials', ['./types/openfoam_tutorials.js']);
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
  "type": "openfoam_tutorials",
  "data": {}
}
```
