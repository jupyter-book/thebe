const fs = require('fs');
const glob = require("glob");

const argIndex = process.argv.length-1;
const env = process.argv[argIndex];

const prod = '<script src="https://unpkg.com/thebelab@latest/lib/index.js"></script>'
const staging = '<script src="LOCAL/index.js"></script>' // Need to change this

glob('docs/*.rst', function (err, files) {
  console.log(err, files)
  files.forEach(file => {
    fs.readFile(file, 'utf8', function (err, data) {
      if (err) return console.log(err);
      const result = env == 'staging' ? data.replace(prod, staging) : data.replace(staging, prod);

      fs.writeFile(file, result, 'utf8', function (err) {
        if (err) return console.log(err);
      });
    });
  });
});