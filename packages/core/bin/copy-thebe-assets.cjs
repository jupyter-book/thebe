#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const fs = require('fs');
const path = require('path');
const glob = require('glob');

if (process.argv.length === 3 && process.argv[2] === '--help') {
  console.log('Usage: node copyThebeAssets.cjs <output_dir> [all,core,lite,thebe]');
  console.log(
    "[all,core,lite,thebe] can be 'all' or any of 'core', 'lite', 'thebe' as a comma separated list (deflault: all)",
  );
  process.exit(1);
}

if (process.argv.length < 3) {
  console.error('Usage: node copyThebeAssets.cjs <output_dir> [libs-to-copy]');
  process.exit(1);
}

let libsToCopy = 'all';
if (process.argv.length === 4) {
  console.log(`Only copying ${process.argv[3]}`);
  libsToCopy = process.argv[3];
}
const outputDir = process.argv[2];

if (!fs.existsSync(outputDir)) {
  console.log(`Output directory ${outputDir} does not exist, creating...`);
  fs.mkdirSync(outputDir, { recursive: true });
}

let assets = [];
console.log('discovering installed thebe assets...');

function checkForLib(libName) {
  try {
    require.resolve(libName);
    return true;
  } catch (err) {
    console.error(
      `Skipping Copy Step! ${libName} not found, please run npm install or npm install ${libName}`,
    );
    return false;
  }
}

let copyCore = false;
let copyLite = false;
let copyThebe = false;
if (libsToCopy.includes('all')) {
  copyCore = checkForLib('thebe-core');
  copyLite = checkForLib('thebe-lite');
  copyThebe = checkForLib('thebe');
} else {
  if (libsToCopy.includes('core')) {
    copyCore = checkForLib('thebe-core');
  }
  if (libsToCopy.includes('lite')) {
    copyLite = checkForLib('thebe-lite');
  }
  if (libsToCopy.includes('thebe')) {
    copyThebe = checkForLib('thebe');
  }
}

if (copyCore) {
  console.log('discovering core assets...');
  const pathToThebeCoreLibFolder = path.resolve(
    path.dirname(require.resolve('thebe-core')),
    '..',
    'lib',
  );
  const thebeCoreFiles = glob.sync(path.join(pathToThebeCoreLibFolder, '*.js'));
  assets = [...thebeCoreFiles, path.join(pathToThebeCoreLibFolder, 'thebe-core.css')];
}

if (copyLite) {
  console.log('discovering lite assets...');
  const pathToThebeLite = path.dirname(require.resolve('thebe-lite'));
  const thebeLiteFiles = glob.sync(path.join(pathToThebeLite, '*.js'));
  assets = [...assets, ...thebeLiteFiles];
}

if (copyThebe) {
  console.log('discovering thebe assets...');
  const pathToThebeLibFolder = path.resolve(path.dirname(require.resolve('thebe')), '..', 'lib');
  const thebeFiles = glob.sync(path.join(pathToThebeLibFolder, '*.js'));
  assets = [...assets, ...thebeFiles, path.join(pathToThebeLibFolder, 'thebe.css')];
}

console.log('Found assets:');
console.log(assets);
console.log(`Copying assets to ${outputDir} now...`);

for (const asset of assets) {
  const basename = path.basename(asset);
  const dest = path.join(outputDir, basename);
  fs.copyFileSync(asset, dest);
  console.log(`Copied ${basename} to ${dest}`);
}

console.log('Done.');
