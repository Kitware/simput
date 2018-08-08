#! /usr/bin/env node

const shell = require('shelljs');

const path = require('path');
const fs = require('fs');
const program = require('commander');
const open = require('open');

const simputCompiler = require('./compile');
const simputManager = require('./manager');
const simputConverter = require('./converter');
const toAbsolutePath = require('./utils').toAbsolutePath;
const pkg = require('../../package.json');

const home = process.env.HOME;
const simputFolder = path.join(home, '.Simput/');
const version = /semantically-release/.test(pkg.version)
  ? 'development version'
  : pkg.version;

function getPort(val) {
  if (!Number.isNaN(Number(val))) {
    return Number(val);
  }
  throw Error('port option requires a number');
}

program
  .version(version)

  // inout
  .option('-i, --input [file|directory]', 'Input file or directory')
  .option('-o, --output [directory]', 'Output directory to output to')
  .option('-t, --type [type]', 'Type of input\n')

  .option('-n, --no-gui', 'Just generate output')
  .option('-s, --silent', 'Do not open the browser')
  .option('-p, --port [8080]', 'Server port\n', getPort, 8080)

  // management
  .option('-c, --compile [directory]', 'Directory to compile files')
  .option('-m, --minify', 'Minify compiled file')
  .option('-a, --add [file]', 'Add model to list of available inputs')
  .option('-l, --list', 'List model types of available as inputs')
  .option('-r, --remove [type]', 'Remove model from list of available inputs')
  // .option('-g --generate', 'Generate blank language files from the model')

  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
  process.exit(0);
}

// input
if (program.input && program.output && !program.gui) {
  shell.mkdir('-p', toAbsolutePath(program.output));
  simputConverter(program.input, program.output);
} else if (program.compile) {
  shell.mkdir('-p', toAbsolutePath(program.output));
  let addFunc = null;
  if (program.add) {
    addFunc = () => {
      simputManager.add(`${program.output}/${program.type}.js`);
    };
  }
  simputCompiler(
    toAbsolutePath(program.compile),
    program.type,
    program.output,
    program.minify,
    addFunc
  );
} else if (program.output) {
  const handler = require('serve-handler');
  const http = require('http');
  const server = http.createServer(handler);

  server.listen(Number(program.port), () => {
    console.log(`Simput running at http://localhost:${program.port}`);
    if (!program.silent) {
      open(`http://localhost:${program.port}`);
    }
  });
} else if (program.add) {
  simputManager.add(program.add);
} else if (program.list) {
  simputManager.list();
} else if (program.remove) {
  simputManager.remove(program.remove);
}
