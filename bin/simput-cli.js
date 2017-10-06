#! /usr/bin/env node

require('shelljs/global');

const path       = require('path'),
      fs         = require('fs'),
      program    = require('commander'),
      express    = require('express'),
      bodyParser = require('body-parser');

const simputCompiler  = require('./compile'),
      simputManager   = require('./manager'),
      simputConverter = require('./converter'),
      toAbsolutePath = require('./utils').toAbsolutePath,
      pkg = require('../package.json');

const home = process.env.HOME,
      simputFolder = path.join(home, '.Simput/'),
      version = /semantically-release/.test(pkg.version) ? 'development version' : pkg.version;


function getPort(val) {
  if (!isNaN(parseInt(val, 10))) {
    return parseInt(val, 10);
  }
  throw Error('port option requires a number');
}

program
    .version(version)

    // inout
    .option('-i, --input [file|directory]',  'Input file or directory')
    .option('-o, --output [directory]', 'Output directory to output to')
    .option('-t, --type [type]',   'Type of input\n')

    .option('-n, --no-gui', 'Just generate output')
    .option('-s, --silent', 'Do not open the browser')
    .option('-p, --port [8080]', 'Server port\n', getPort, 8080)

    // management
    .option('-c, --compile [directory]', 'Directory to compile files')
    .option('-m, --minify', 'Minify compiled file')
    .option('-a, --add [file]',    'Add model to list of available inputs')
    .option('-l, --list',          'List model types of available as inputs')
    .option('-r, --remove [type]', 'Remove model from list of available inputs')
    // .option('-g --generate', 'Generate blank language files from the model')

  .parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
    process.exit(0);
}

// inout
if (program.input && program.output && !program.gui) {
    mkdir('-p', toAbsolutePath(program.output));
    simputConverter(program.input, program.output);
} else if (program.compile) {
    mkdir('-p', toAbsolutePath(program.output));
    var addFunc = null;
    if (program.add) {
      addFunc = () => { simputManager.add(program.output + '/' + program.type + '.js'); };
    }
    simputCompiler(toAbsolutePath(program.compile), program.type, program.output, program.minify, addFunc);
} else if (program.output) {
    const app = express();
    app.use(bodyParser.json({limit: 10000000}));
    app.use(express.static(__dirname + "/../dist"));

    ls(simputFolder).forEach(function(file) {
        require(path.join(simputFolder, file));
    });

    var inputFile = null;
    if (program.input) {
        //load input
        if(path.isAbsolute(program.input)) {
            inputFile = require(program.input);
        } else {
            inputFile = require(path.join(process.env.PWD, program.input));
        }
    }

    if (inputFile === null) {
        console.log('No valid json found in ' + program.output);
    }

    app.route('/type/:type')
        .get(function(req, res) {
            var homeFile = path.join(simputFolder, req.params.type),
                distFile = path.join(__dirname, '../dist', 'types', req.params.type);

            if (test('-f', homeFile)) {
                res.sendFile(homeFile);
            } else if (test('-f', distFile)) {
                res.sendFile(distFile);
            } else {
                res.status(404).send('no files of given type "' + req.params.type + '" found');
            }
    });

    app.route('/data')
        .get(function(req, res) {
        if (program.input) {
            // send input file
            res.send({input: true, data: inputFile});
        } else {
            // send options for input
            res.send({input: true, data: {type: program.type, data:{}} });
        }
    })
    .post(function(req, res) {

        /* Results */

        for (var key in req.body.results) {
            mkdir('-p', toAbsolutePath(path.dirname(path.join(program.output, key))));
            fs.writeFileSync(path.join(program.output, key), req.body.results[key]);
        }

        /* Copies */

        if (typeof(req.body.copies) !== 'undefined') {
	        req.body.copies.forEach((filePath) => {
	            const cleanFilePath = path.join(...filePath.split('/'));
	            const source = path.join(process.env.PWD, 'types', req.body.model.data.type, 'src', 'templates', cleanFilePath);
	            const destination = path.join(program.output, cleanFilePath);

		        mkdir('-p', path.dirname(destination));
		        cp(source, destination);
            });
        }

        /* Model */

        fs.writeFileSync(path.join(program.output, 'model.json'),
        JSON.stringify(req.body.model, null, '    '));

        /* Return */

        res.send('Data saved');
    });

    app.listen(program.port);
    console.log('Simput listening on port ' + program.port);

    if (!program.silent) {
        require('open')('http://localhost:' + program.port);
    }
} else if (program.add) {
    simputManager.add(program.add);
} else if (program.list) {
    simputManager.list();
} else if (program.remove) {
    simputManager.remove(program.remove);
}
