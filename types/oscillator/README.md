# Oscillator

This Simput type is meant to illustrate a basic usage of simput for generating a descriptor file that can be used for an oscillator simulator such as the [vtkm source](https://gitlab.kitware.com/vtk/vtk-m/tree/master/examples/oscillator) or [Sensei example](https://gitlab.kitware.com/sensei/sensei/tree/master/miniapps/oscillators).

## Using Simput to generate your system definition file

Simput helps us provide a simple user interface to define a set of oscillators, and output a configuration file for use by either of the oscillator simulation codes listed above.

The Sensei oscillator has now been used as a model application for benchmarking in-situ analyses, so is more complete. This example also provides an interface for specifying two types of analyses to run, and parameters for launching the oscillator app in a multi-process environment. Three separate templates are used to output these two configuration files and the batch script for running the oscillator app. A [detailed tutorial](http://kitware.github.io/simput/docs/oscillator.html) explains how this data model, convert method, and templates work together.

## Development

 To change the templates, start a development server:

```sh
$ npm run dev
```

In a separate window, as you make changes, compile the package:

```sh
$ npm run type:oscillator
```

The development server will watch for changes and reload as needed.

When your changes are final, run:

```sh
$ npm run build:release
```

to generate a final package. See the [Simput readme](https://github.com/Kitware/simput) for more information.

## Running Simput

### Running interactively
The following command will start a server which shows Simput's landing page:

```sh
$ Simput -p
```

Then drag a model json or zip file to the "Open an existing model" box, or start a new model.

### Running on the command line
The following command will generate a new set of output files.

```sh
$ Simput -i samples/example/each_type.json -o samples/example/
```

The output directory defaults to the directory of the input file.
