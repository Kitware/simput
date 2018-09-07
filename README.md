## Simput

### Goal

To provide a simple way to write input simpulation files.

## Installation

```sh
$ npm install -g simput
```

## Usage

After installing the package you will get one executable **Simput** with
the following set of options:

```sh
$ Simput

  Usage: Simput [options]

  Options:

    -h, --help                    output usage information
    -V, --version                 output the version number

    -i, --input [file|directory]  Input file or directory
    -o, --output [directory]      Output directory to output to
    -t, --type [type]             Type of input

    -s, --silent                  Do not open the browser

    -c, --compile [directory]     Directory to compile files
    -m, --minify                  Minify compiled file

```

## Examples

```sh
$ Simput -p
```

Starts a server and opens your web browser, showing a landing page with a choice of inputs which you can create.

## Demos

There are a few supplied demos in the folder `types`, each have their own README.

* vCard is the simplest example, with a single type of output.
* oscillator is a bit more complex, because it derives from a real benchmarking application meant to exercise in-situ analyses on hpc systems.
* pyfr and vera produce input files for real applications, and are realistically complex.

## Development

```sh
$ git clone --recursive https://github.com/Kitware/simput.git
$ cd simput
$ npm install
$ npm run build
$ npm link
$ Simput

  Usage: Simput [options]

  Options:

    -h, --help                    output usage information
    -V, --version                 output the version number

    -i, --input [file|directory]  Input file or directory
    -o, --output [directory]      Output directory to output to
    -t, --type [type]             Type of input

    -s, --silent                  Do not open the browser

    -c, --compile [directory]     Directory to compile files
    -m, --minify                  Minify compiled file

```

Then to compile pyfr and open a development server which watches for another compile:

```sh
$ npm run type:pyfr
$ npm run dev
```

## Creating a new simulation type

In a separate location create a folder for your type:

```sh
# Replace [mytype] with your type name.
mkdir [mytype]
cd [mytype]
git init
```

Create the folder and file structure:

- `/src`
    - `/lang`
        - `/[language]` e.g. "en", "fr"
            - `label.json`, attribute and property labels.
            - `/help`, help dialogs, _recommended, not required_
                - `/[folders for each attribute]`
                    - `[file for each property, contents are html]`
    - `/templates`
        - [template file and helpers]
    - `model.js`, primary data structure.
    - `convert.js`, converts the model into the simulation deck format.
    - `parse.js`, converts a complete input file to the simput model; _recommended, not required_.
- `/samples`, empty or partially full sample datasets; _recommended, not required_.
- `/versions`, an output folder for your compiled type; _recommended, not required_.
- `README.md`, a description of your type; _recommended, not required_.

For examples of each take a look at `types/demo`

### **Optional**: Add the type as a submodule to this repository
__It's critical that these are executed in order__

```sh
# start in the [mytype] directory from above. Replace [mytype] with your type name below.
git checkout -b type-[mytype] #replace 'mytype' with the name of the new type
git commit -m "initial commit"
git remote add origin https://github.com/Kitware/simput.git
git push origin type-[mytype] # where 'mytype-branch' is the current branch name
cd [your simput repo] # usually cd ../..
git submodule add -b type-[mytype] https://github.com/kitware/simput types/[mytype]
git add .gitmodules types/
git commit -m "added [mytype]"
git push
```

## Add to compilation and landing page

Simput changed to a Vue.js framework, and no longer has the ability to dynamically add and load types - they must be present when Simput is built by webpack.

Add another script to `package.json` which compiles your type.

Add a call to `Simput.registerType()` for your type in `static/index.html`

This will likely change soon.

## Licensing

**Simput** is licensed under [BSD Clause 3](LICENSE).

## Getting Involved

Fork our repository and do great things. At [Kitware](http://www.kitware.com), we've been contributing to open-source software for 15 years and counting, and want to make **Simput** useful to as many people as possible.
