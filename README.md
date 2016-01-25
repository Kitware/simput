## Simput

### Goal

To provide a simple way to write input simpulation files.

## Installation

```
$ npm install -g simput
```

After installing the package you will get one executable **Simput** with
the following set of options:

```
$ Simput

  Usage: Simput [options]

  Options:

    -h, --help                    output usage information
    -V, --version                 output the version number

    -i, --input [file|directory]  Input file or directory
    -o, --output [directory]      Output directory to output to
    -t, --type [type]             Type of input

    --no-gui                      Just generate output
    -s, --silent                  Do not open the browser

    -c, --compile [directory]     Directory to compile files
    -a, --add [file]              Add model to list of available inputs
    -l, --list                    List model types of available as inputs
    -r, --remove [type]           Remove model to list of available inputs

```

## Development

```sh
$ git clone https://github.com/Kitware/tonic.git
$ cd tonic
$ npm run global
$ npm install
$ cd tonic-applications/simput
```

## Production

```
$ git clone https://github.com/Kitware/simput.git
$ cd simput
$ git submodule update --init
$ npm install
$ npm link
```

### Uninstall
In the folder you ran npm link from:
```
$ npm unlink
```
N.B: npm version >=2.4.1 is recommended for this or else you'll get an error and a warning.

## Demos

There are a few supplied demos in the folder `types`, each have their own README.

#### Licensing

**Simput** is licensed under [BSD Clause 3](LICENSE).

#### Getting Involved

Fork our repository and do great things. At [Kitware](http://www.kitware.com),
we've been contributing to open-source software for 15 years and counting, and
want to make **Simput** useful to as many people as possible.
