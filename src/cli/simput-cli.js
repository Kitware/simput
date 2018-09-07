#! /usr/bin/env node

const shell = require('shelljs');

const path = require('path');
const fs = require('fs');
const program = require('commander');
const open = require('open');

const simputCompiler = require('./compile');
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

  // server
  .option('-s, --silent', 'Do not open the browser')
  .option('-p, --port [8080]', 'Server port\n', getPort, 8080)

  // type conversion
  .option('-i, --input [file|directory]', 'Input file or directory')

  // type compilation
  .option('-c, --compile [directory]', 'Directory to compile files')
  .option('-t, --type [type]', 'Type of input\n')
  .option('-o, --output [directory]', 'Output directory to output to')
  .option('-m, --minify', 'Minify compiled file')

  .parse(process.argv);

// console.log(process.argv);
// console.log(process.argv.slice(2));
if (!process.argv.slice(2).length) {
  program.outputHelp();
  process.exit(0);
}

// input
if (program.input) {
  if (program.output) shell.mkdir('-p', toAbsolutePath(program.output));
  // output optional, default is directory of input file.
  simputConverter(program.input, program.output);
} else if (program.compile) {
  shell.mkdir('-p', toAbsolutePath(program.output));
  let addFunc = null;

  // default type is last part of compile dir
  // default output is compile dir.
  simputCompiler(
    toAbsolutePath(program.compile),
    program.type,
    program.output,
    program.minify,
    addFunc
  );
} else if (program.port && !program.output) {
  const handler = require('serve-handler');
  const http = require('http');
  const simputDir = path.join(__dirname, '../..');
  // server starts from the cwd, need to change so Simput cli works from anywhere.
  process.chdir(simputDir);
  const config = {
    public: 'dist',
    // rewrites: [{ source: 'types/*', destination: simputFolder }],
  };
  const server = http.createServer((request, response) =>
    handler(request, response, config)
  );

  server.listen(Number(program.port), () => {
    console.log(`Simput running at http://localhost:${program.port}`);
    if (!program.silent) {
      open(`http://localhost:${program.port}`);
    }
  });
} else {
  program.outputHelp();
  process.exit(0);
}
