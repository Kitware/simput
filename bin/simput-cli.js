#! /usr/bin/env node

require('shelljs/global');

const path = require('path'),
      program = require('commander'),
      express = require('express');
      
const simputCompiler  = require('./compile'),
      simputManager   = require('./manager'),
      simputConverter = require('./converter');

const home = process.env.HOME,
      simputFolder = path.join(home, '.Simput/');

function toAbsolutePath(relPath) {
  var ret;
  if (!path.isAbsolute(relPath)) {
    ret = path.join(process.env.PWD, relPath);
  } else {
    ret = relPath;
  }
  return path.normalize(ret);
}

program
  .version('0.0.1')

  // inout
  .option('-i, --input [file|directory]',  'Input file or directory')
  .option('-o, --output [directory]', 'Output directory to output to')
  .option('-t, --type [type]',   'Type of input\n')
  
  .option('-n, --no-gui', 'Just generate output')
  .option('-s, --silent', 'Do not open the browser')
  .option('-p, --port [8080]', 'Server port\n', (n) => Number(n), 8080)
  
  //management
  .option('-c, --compile [directory]','Directory to compile files')
  .option('-a, --add [file]',    'Add model to list of available inputs')
  .option('-l, --list',          'List model types of available as inputs')
  .option('-r, --remove [type]', 'Remove model from list of available inputs')
  //.option('-g --generate', 'Generate blank language files from the model')

  .parse(process.argv);
  
if (!process.argv.slice(2).length) {
    program.outputHelp();
    process.exit(0);
}

// inout
if (program.input && program.output && !program.gui) {
  simputConverter(program.input, program.output);
} else if (program.compile) {
  simputCompiler(toAbsolutePath(program.compile), program.type, program.output);
} else if (program.output) {
  const app = express();
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
  
  // app.route('/')
  //   .get(function(req, res) {
  //     res.send('index.html');
  //   });

  app.route('/type/:type')
    .get(function(req, res) {
      var fileToServe = path.join(simputFolder, req.params.type);
      res.sendFile(fileToServe);
    });
  
  app.route('/data')
    .get(function(req, res) {
      if (program.input) { 
        // send input file
        res.send({input: true, data: inputFile});
      } else {
        // send options for input
        res.send({input: false, data: Object.keys(GLOBAL.Simput.types)});
      }
    })
    .post(function(req, res) {
      //receive new file content and update the file at program.input
      console.log('POST');
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
