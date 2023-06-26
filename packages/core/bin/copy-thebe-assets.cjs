#!/usr/bin/node
const fs = require('fs');
const path = require('path');
const glob = require('glob');

if (process.argv.length < 3) {
  console.error('Usage: node copyThebeAssets.cjs <output_dir>');
  process.exit(1);
}

const outputDir = process.argv[2];

if (!fs.existsSync(outputDir)) {
  console.log(`Output directory ${outputDir} does not exist, creating...`);
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('Copying thebe assets...');

try {
  require.resolve('thebe-core');
} catch (err) {
  console.error('thebe-core not found, please run `npm install` in the theme directory.');
  process.exit(1);
}

let usingThebeLite = false
try {
  require.resolve('thebe-lite');
  usingThebeLite = true
} catch (err) {
  console.error('thebe-lite not found, please run `npm install` in the theme directory.');
}

let assets = [];

const pathToThebeCoreLibFolder = path.resolve(
  path.dirname(require.resolve('thebe-core')),
  '..',
  'lib',
);
const thebeCoreFiles = glob.sync(path.join(pathToThebeCoreLibFolder, '*.js'));

assets = [
  ...thebeCoreFiles,
  path.join(pathToThebeCoreLibFolder, 'thebe-core.css'),
];

if (usingThebeLite) {
  const pathToThebeLite = path.dirname(require.resolve('thebe-lite'));
  const thebeLiteFiles = glob.sync(path.join(pathToThebeLite, '*.js'));

  assets = [...assets, ...thebeLiteFiles]
}

console.log('Found thebe assets:');
console.log(assets);
console.log(`Copying assets to ${outputDir} now...`);

for (const asset of assets) {
  const basename = path.basename(asset);
  const dest = path.join(outputDir, basename);
  fs.copyFileSync(asset, dest);
  console.log(`Copied ${basename} to ${dest}`);
}

console.log('Done.');
