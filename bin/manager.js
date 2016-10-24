require('shelljs/global');

var fs = require('fs'),
    path = require('path'),
    home = process.env.HOME,
    simputFolder = path.join(home, '.Simput/'),
    toAbsolutePath = require('./utils').toAbsolutePath,
    Simput = null;

function folderCheck() {
    if (!test('-d', simputFolder)) {
        mkdir('-p', simputFolder);
    }
}

exports.add = function(file) {
    folderCheck();
    cp('-f', toAbsolutePath(file), simputFolder);
    console.log('Added "' + file.split('/').pop() + '" to types');
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
