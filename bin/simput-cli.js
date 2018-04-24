#! /usr/bin/env node

const shell = require('shelljs');

const path = require('path');
const fs = require('fs');
const program = require('commander');
const express = require('express');
const bodyParser = require('body-parser');
const open = require('open');

const simputCompiler = require('./compile');
const simputManager = require('./manager');
const simputConverter = require('./converter');
const toAbsolutePath = require('./utils').toAbsolutePath;
const pkg = require('../package.json');

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
  const app = express();
  app.use(bodyParser.json({ limit: 10000000 }));
  app.use(express.static(`${__dirname}/../dist`));

  shell.ls(simputFolder).forEach((file) => {
    /* eslint-disable */
    require(path.join(simputFolder, file));
    /* eslint-enable */
  });

  let inputFile = null;
  const modelInOutput = path.resolve(path.join(program.output, 'model.json'));
  if (program.input) {
    // load input
    /* eslint-disable */
    if (path.isAbsolute(program.input)) {
      inputFile = require(program.input);
    } else {
      inputFile = require(path.join(process.env.PWD, program.input));
    }
    /* eslint-enable */
  } else if (shell.test('-f', modelInOutput)) {
    /* eslint-disable */
    inputFile = require(modelInOutput);
    /* eslint-enable */
  }

  if (inputFile === null) {
    console.log('No valid json found in', program.output);
  }

  app.route('/type/:type').get((req, res) => {
    const homeFile = path.join(simputFolder, req.params.type);
    const distFile = path.join(__dirname, '../dist', 'types', req.params.type);

    if (shell.test('-f', homeFile)) {
      res.sendFile(homeFile);
    } else if (shell.test('-f', distFile)) {
      res.sendFile(distFile);
    } else {
      res.status(404).send(`no files of given type "${req.params.type}" found`);
    }
  });

  app
    .route('/data')
    .get((req, res) => {
      if (inputFile) {
        // send input file
        res.send({ input: true, data: inputFile });
      } else if (program.type) {
        // send empty type
        res.send({ input: true, data: { type: program.type, data: {} } });
      } else {
        // send possible types for input
        res.send({ input: false, data: Object.keys(Simput.types) });
      }
    })
    .post((req, res) => {
      // Results --------------------------------
      const keys = Object.keys(req.body.results);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        shell.mkdir(
          '-p',
          toAbsolutePath(path.dirname(path.join(program.output, key)))
        );
        fs.writeFileSync(path.join(program.output, key), req.body.results[key]);
      }

      // Copies --------------------------------
      if (req.body.copies) {
        req.body.copies.forEach((entry) => {
          const source = path.join(...entry.src.split('/'));
          const destination = path.join(program.output, entry.dst);

          shell.mkdir('-p', path.dirname(destination));
          shell.cp(source, destination);
        });
      }

      // Model --------------------------------
      fs.writeFileSync(
        path.join(program.output, 'model.json'),
        JSON.stringify(req.body.model, null, '    ')
      );

      // Return --------------------------------
      res.send('Data saved');
    });

  app.listen(program.port);
  console.log('Simput listening on port', program.port);

  if (!program.silent) {
    open(`http://localhost:${program.port}`);
  }
} else if (program.add) {
  simputManager.add(program.add);
} else if (program.list) {
  simputManager.list();
} else if (program.remove) {
  simputManager.remove(program.remove);
}
