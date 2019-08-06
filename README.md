# ParFlow CONUS

## What is ParFlow CONUS?

ParaFlow is a parallel ground water simulation code while CONUS stands for Continental US.
This example aims to provide a way to crop the CONUS domain so additional simulation could be performed on a smaller scale.

## Simput Integration

Simput provides a simple way to write any kind of text file.

This project is meant to illustrate how Simput can be used to generate
templated files for multiple cases. Simput requires a javascript description of
any user input. To build a Simput package use;

```sh
$ Simput -c src/ -o versions/ -t parflow-conus
```

Add the compiled package to Simput (already done)

```
cp ./versions/parflow-conus.js ../{static|dist}/types/
```

Register it in the `../{static|dist}/index.html` (already done)

```
Simput.registerType('parflow-conus', ['./types/parflow-conus.js']);
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
  "type": "parflow-conus",
  "data": {}
}
```
