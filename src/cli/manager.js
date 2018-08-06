const shell = require('shelljs');
const path = require('path');
const toAbsolutePath = require('./utils').toAbsolutePath;

const home = process.env.HOME;
const simputFolder = path.join(home, '.Simput/');
let Simput = null;

// ----------------------------------------------------------------------------

function folderCheck() {
  if (!shell.test('-d', simputFolder)) {
    shell.mkdir('-p', simputFolder);
  }
}

// ----------------------------------------------------------------------------

function populateSimput() {
  shell.ls(simputFolder).forEach((file) => {
    /* eslint-disable */
    require(path.join(simputFolder, file));
    /* eslint-enable */
  });
  Simput = GLOBAL.Simput;
}

// ----------------------------------------------------------------------------

exports.add = function add(file) {
  folderCheck();
  shell.cp('-f', toAbsolutePath(file), simputFolder);
  console.log(`Added "${file.split('/').pop()}" to types`);
};

// ----------------------------------------------------------------------------

exports.list = function list() {
  folderCheck();
  populateSimput();

  console.log('______________________');
  console.log('---- Simput Types ----');
  console.log('¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯');

  if (!Simput || Object.keys(Simput.types).length === 0) {
    console.log('No inputs available\n');
    return;
  }

  const types = Object.keys(Simput.types);
  for (let i = 0; i < types.length; i++) {
    const type = types[i];
    const name = Simput.types[type].type;
    const languages = Object.keys(Simput.types[type].lang);

    console.log(` - ${name} \t: ${languages.toString()}`);
  }
  console.log();
};

// ----------------------------------------------------------------------------

exports.remove = function remove(type) {
  folderCheck();
  populateSimput();

  if (Simput.types[type]) {
    shell.rm(path.join(simputFolder, `${type}.js`));
  } else {
    console.log('No simulation with given type found');
  }
};
