# 2D Euler Vortex - Example

More information on that example can be found here:

- http://pyfr.org/user_guide.php

But this guide will walk you through how to use Simput to generate
the ini file that can be used with the following mesh in the PyFr examples.

Mesh file: 

- https://raw.githubusercontent.com/vincentlab/PyFR/develop/examples/euler_vortex_2d/euler_vortex_2d.msh

## Configuration

Start Simput with the following command line

```sh
$ mkdir -p ~/pyfr/examples/2DEulerVortex
$ Simput -t pyfr -o ~/pyfr/examples/2DEulerVortex
```

Inside your browser, perform those edits:

### Constants

- cpTref : ` `
- Custom constants: (+3)
  - S: `13.5`
  - M: `0.4`
  - R: `1.5`

### Solver

#### Settings

- Order                 : `3`
- Viscosity correction  : ` `
- Shock capturing       : ` `

#### Time Integrator

- Initial time  : `0`
- Final time    : `50`
- Time step     : `0.005`

#### Interfaces

- LDG Beta  : ` `
- LDG Tau   : ` `

### Solver Interfaces

#### Interfaces

- Type  : `Linear`

### Solution

Add 3 views

#### NaN

- Type    : `Plugin NaN check`
- nsteps  : `50`

#### Writer

- Type                      : `Plugin Writer`
- Disk write time interval  : `10`
- Basedir                   : `.`
- Output name pattern       : `euler_vortex_2d-{t:.1f}`

#### ICS

- Type : `ics`
- Initial Density: 
  - `pow(1 - S*S*M*M*(gamma - 1)*exp(2*%(f)s)/(8*pi*pi), 1/(gamma - 1))`
- Initial X velocity:
  - `S*y*exp(%(f)s)/(2*pi*R)`
- Initial Y velocity: 
  - `1 - S*x*exp(%(f)s)/(2*pi*R)`
- Initial static pressure distribution  : 
  - `1/(gamma*M*M)*pow(1 - S*S*M*M*(gamma - 1)*exp(2*%(f)s)/(8*pi*pi), gamma/(gamma - 1))`
- Helper functions : (+1)
  - f : `((1 - x*x - y*y)/(2*R*R))`

