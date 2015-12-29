var fs = require('fs'),
    path = require('path'),
    home = process.env.HOME,
    simputFolder = path.join(home, '.Simput/'),
    Simput = null;

require('shelljs/global');

function toAbsolutePath(relPath) {
  var ret;
  if (!path.isAbsolute(relPath)) {
    ret = path.join(process.env.PWD, relPath);
  } else {
    ret = relPath;
  }
  return path.normalize(ret);
}

exports.add = function(file) {
    folderCheck();
    cp('-f', toAbsolutePath(file), simputFolder);
};

exports.list = function() {
    folderCheck();
    populateSimput();
    
    console.log('______________________');
    console.log('---- Simput Types ----');
    console.log('¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯');
    
    if (!Simput || Object.keys(Simput.types).length === 0) {
        console.log('No inputs available\n');
        return;
    }
    
    for (var type in Simput.types) {
        var name = Simput.types[type].type,
            languages = Object.keys(Simput.types[type].lang);
        
        console.log(' - ' + name + ' \t: ' + languages.toString()); 
    }
    console.log();
};

exports.remove = function(type) {
    folderCheck();
    populateSimput();
    
    if (Simput.types[type]) {
        rm(path.join(simputFolder, type) + '.js');   
    } else {
        console.log('No simulation with given type found');
    }
};

function populateSimput() {
    ls(simputFolder).forEach(function(file) {
        require(path.join(simputFolder, file));
    });
    Simput = GLOBAL.Simput;
}

function folderCheck() {
    if (!test('-d', simputFolder)) {
        mkdir('-p', simputFolder);
    }
}