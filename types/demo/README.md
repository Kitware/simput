# Demo

This Simput type is meant to highlight the capabilities behind Simput and all
the possible way the information can be presented to the user.

It has no other goal than to show example on how to cover and show the full
capabilities of Simput.

## Simput Integration

Simput provides a simple way to write any kind of text file.
This project is meant to illustrate how Simput can be used to generate templated files. Simput requires a javascript description of any user input. To build a Simput package use; 

```sh
$ Simput -c src/ -o versions/ -t demo
```

Add the compiled package to Simput:

```sh
$ Simput -a versions/demo.js
```

## Running Simput

### Running interactively
The following command will start a server which serves Simput's interactive form.

```sh
$ Simput -i sample/empty/demo-empty.json -o sample/empty/.
```

### Running on the command line
The following command will generate an new set of output.

```sh
$ Simput -i sample/full/demo-full.json -o sample/full/ --no-gui
```


