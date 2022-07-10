import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

function getJupyterLiteDependencyVersion() {
  const json = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../package.json'), {
      encoding: 'utf8',
    })
  );

  return json.devDependencies['@jupyterlite/server']
    .replace('^', '')
    .replace('-beta.', 'b')
    .replace('-alpha.', 'a')
    .trim();
}

function getWheelsAndSpec(
  litePath: string,
  pyoliteVersion: string
): {
  json: any;
  wheels: { filename: string; filepath: string }[];
} {
  const readPath = path.join(litePath, 'lib', 'pypi');
  const jsonPath = path.join(readPath, 'all.json');
  const json: { [x: string]: { releases: { [x: string]: { filename: string }[] } } } = JSON.parse(
    fs.readFileSync(jsonPath, { encoding: 'utf8' })
  );

  const wheels: string[] = Object.entries(json).reduce((acc, [dependency, item]) => {
    if (dependency === 'piplite' || dependency === 'pyolite') {
      return acc.concat(item.releases[pyoliteVersion].map((r) => r.filename));
    }
    const versions = Object.keys(item.releases);
    if (versions.length > 1) {
      console.warn(
        chalk.yellow(
          `Multiple versions of ${dependency} found: ${versions.join(', ')}, using ${versions[0]}`
        )
      );
    }
    return acc.concat(item.releases[versions[0]].map((r) => r.filename));
  }, [] as string[]);

  return {
    json: jsonPath,
    wheels: wheels.map((w) => ({ filename: w, filepath: path.join(readPath, w) })),
  };
}

async function main(copyIndex = false, outdir = path.join(__dirname, '..', 'demo')) {
  const dependencyVersion = await getJupyterLiteDependencyVersion();
  console.log(chalk.green(`Using jupyterlite ${dependencyVersion}`));

  const distPath = path.join(__dirname, '..', 'dist');
  if (!fs.existsSync(distPath)) {
    console.error(chalk.red(`Can't find lite output folder at ${distPath}`));
    console.error(chalk.red('Maybe `jupyter lite build` did not complete'));
    process.exit(1);
  }

  const { json, wheels } = getWheelsAndSpec(distPath, dependencyVersion);
  console.log(
    chalk.green(`Found ${wheels.length} wheels: ${wheels.map(({ filename }) => filename)}`)
  );

  const buildPyPi = path.join(outdir, 'build', 'pypi');
  fs.mkdirSync(buildPyPi, { recursive: true });
  console.log(chalk.green(`Created ${buildPyPi}`));

  fs.copyFileSync(json, path.join(buildPyPi, 'all.json'));
  console.log(chalk.green(`Copied ${json} to ${path.join(buildPyPi, 'all.json')}`));
  wheels.forEach((w) => {
    fs.copyFileSync(w.filepath, path.join(buildPyPi, w.filename));
    console.log(chalk.green(`Copied ${w.filepath} to ${path.join(buildPyPi, w.filename)}`));
  });

  console.log(chalk.green('Adding stub api/contents'));
  const apiContents = path.join(outdir, 'api', 'contents');
  fs.mkdirSync(apiContents, { recursive: true });
  fs.copyFileSync(path.join(__dirname, 'contents.json'), path.join(apiContents, 'all.json'));
  console.log(
    chalk.green(
      `Copied ${path.join(__dirname, 'contents.json')} to ${path.join(apiContents, 'all.json')}`
    )
  );

  console.log(chalk.green('Success!!'));
}

const myArgs = process.argv.slice(2);
if (myArgs.length > 0 && myArgs[0] === '--help') {
  console.log('You may supply an alternative output folder');
  process.exit(0);
}

if (myArgs.length > 0) {
  console.log(chalk.bgGreen(`Building demo/starter assets in ${myArgs[0]}`));
  main(true, myArgs[0]);
} else {
  main();
}
