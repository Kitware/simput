# Simput Vera workflow

These example show how to recreate VERAin .inp files from [VERAin](). First,
start Simput with the following command line, with your choice of directory:

```sh
$ mkdir -p ~/vera/examples/1a
$ Simput -t pyfr -o ~/vera/examples/1a
```

Inside your browser, perform the edits for the examples below.

## Example file 1a.inp

This is one of the simplest sample inputs for VERA that represents a core composed of a single cell in a single assembly.

### Global specifications

Set the number of pins per assembly and the number of assemblies across the core. The pitches and core height determine the physical size of the reactor.

Specifications catergory, Core specifications:
* set "Title" to "CASL AMA Benchmark Problem 1A - Pin Cell- Public"
* Size: 1
* Assembly pitch: 1.26
* Rated power and flow: 0.000183 0.01
* Core height: 1

Assembly Specifications:
* Size: 1
* Rod pitch: 1.26

### Materials and Fuels

Add default materials and any custom materials that might be used. Add fuels used in the assembly.

Default materials (TODO new workflow)
* he, zirc4

Click the "Fuel" category to add a fuel:
* Name: U31
* Choose a color
* Density: 10.257
* Theoretical density: 94.5
* U235 enrichment: 3.1
* Heavy metal enrichment: click + to add one 
  * Name: u-234
  * Value: 0.026347

### Cells

Add cells in the order you want them to appear in the file and in the interface. Typical order is assembly, insert, control, detector. This example uses a single cell.

Cells category, click +:
* Name PIN1
* Pick a color
* Below the visualization, click "Add new item" three times:
  * Material / Fuel: U31, Radius: 0.4096
  * Material / Fuel: he, Radius: 0.418
  * Material / Fuel: zirc4, Radius: 0.475

### Rods

Cells used in a rod can't be deleted. Heights listed in a .inp file must be converted to a length. Choose which map type the rod will be used in.

Rods category, click +:
* Name: r1 (does not appear in the output file)
* Pick a color
* Below the visualization, click "Add new item" once:
  * Cell: PIN1, Axial Length: 1.0

### Rod maps

These maps place rods in a grid, spaced according to the rod pitch.

Rod maps category, click +:
* Name: ASSY1
* Choose a color
* In the map editor, click the "r1" button to place this rod, then click the empty square in the map.

### Core maps

The assembly map places assembly rod maps in a grid in the core, spaced according to the assembly pitch. This simple example uses a size of 1, so places a single rod map (with a single cell in it).

Core maps category, click Assembly:
* Core map description, Title: pin cell
* In the map editor, click the "ASSY1" button to place this rod map, then click the empty square in the map.

### Core Definition and other structures

Three advanced parameters are needed.

Core definition category, Advanced Core Specification section:
* bc_bot: Reflecting
* bc_top: Reflecting
* bc_rad: Reflecting

This simple example does not include nozzles, grids, baffles, or a reactor vessel, so none of these need to be specified.

### Simulation parameters

Each simulation code that can be run has its own input block, specifying any parameters that need to be changed from their default values.

MPACT category:
* click the "enabled" checkbox
* No other parameters are changed from their defaults

SHIFT category:
* click the "enabled" checkbox
* Np: 100000
* num_cycles: 1100
* num_inactive_cycles: 100

### State

States specify parameters that can change over the course of the simulation. This example includes a single state. Several parameters can only be specified in the first state block.

State Initialization category:
* Symmetry: full
* Feedback: off

Other parameters can change in each state block, but this example only has one.

State category, click +:
* Power: 0.0
* Inlet temperature: 565
* Inlet temperature Units: Kelvin
* Fuel temperature: 565
* Fuel temperature Units: Kelvin
* Moderator density: 0.743
* Boron: 1300

### 1a.inp complete

This simple example shows the sections that are required to produce a complete .inp file that can be used in a simulation.

## Example file 3a.inp 

This example also has a single assembly in the core, however that assembly is a full-size 17x17 grid. It also adds grid, nozzle and plate sections, and the Edits list.

