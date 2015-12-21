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

## Documentation

See the [documentation](https://kitware.github.io/simput) for a
getting started guide, advanced documentation, and API descriptions.

#### Licensing

**Simput** is licensed under [BSD Clause 3](LICENSE).

#### Getting Involved

Fork our repository and do great things. At [Kitware](http://www.kitware.com),
we've been contributing to open-source software for 15 years and counting, and
want to make **Simput** useful to as many people as possible.
