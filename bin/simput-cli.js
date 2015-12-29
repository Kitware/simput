#! /usr/bin/env node

require('shelljs/global');

var fs = require('fs'),
    path = require('path'),
    program = require('commander'),
    express = require('express'),
    
    home = process.env.HOME,
    simputFolder = path.join(home, '.Simput/'),
    
    simputCompiler = require('./compile'),
    simputManager  = require('./manager'),
    simputConverter= require('./converter');

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
  var app = express();
  app.use(express.static(__dirname + "/../dist"));
    
  ls(simputFolder).forEach(function(file) {
      require(path.join(simputFolder, file.split('.').shift()));
  });
  
  var inputFile = null;
  if (program.input) {
    //load input
    //inputFile = input
  }
  
  if (inputFile === null) {
    console.log('No valid json found in ' + program.output);
  }
  
  app.route('/')
    .get(function(req, res) {
      req.send('index.html');
    });
  
  app.route('/data')
    .get(function(req, res) {
      if (program.input) { 
        // send input file
        res.send({input: true, data: file});
      } else {
        // send options for input
        res.send({input: false, data: Object.keys(Simput.types)});
      }
    })
    .post(function(req, res) {
      //receive new file content and update
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
