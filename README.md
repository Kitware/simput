# VERA

## What is VERA?
[Sourced from [here](https://github.com/CASL/VERAin)]

CASL's modeling and simulation technology, the Virtual Environment for Reactor Applications (VERA), incorporates coupled physics and science-based models, state-of-the-art numerical methods, modern computational science, integrated uncertainty quantification (UQ) and validation against data from operating pressurized water reactors (PWRs), single-effect experiments, and integral tests. The computational simulation component of VERA is the VERA Core Simulator (VERA-CS). The core simulator is the specific collection of multi-physics computer codes used to model and deplete a LWR core over multiple cycles. The core simulator has a single common input file that drives all of the different physics codes. The parser code, VERAIn, converts VERA Input into an XML file that is used as input to different VERA codes.

## Simput Integration
Simput provides a simple way to write simulation input files. This project is meant to manage PyFR simulation code. Simput requires a JSON description of an input deck. To build a Simput package use:

```sh
$ Simput -c src/ -o versions/ -t vera
```

Add the compiled package to Simput (already done)

```
cp ./versions/vera.js ../{static|dist}/types/
```

Register it in the `../{static|dist}/index.html` (already done)

```
Simput.registerType('vera', ['./types/vera.js']);
```

## Running Simput

### Running interactively
The following command will start a server which serves Simput's interactive form.

```sh
$ Simput -p 8080
```

Then drag the file `samples/empty/vera-empty.json` which has the following content that is used to speciafically load the `vera` type.

```
{
  "type": "vera",
  "data": {}
}
```
