// eslint-disable-next-line no-undef, @typescript-eslint/no-var-requires
require('esbuild').buildSync({
  entryPoints: ['src/index.css'],
  bundle: true,
  loader: {
    '.eot': 'file',
    '.svg': 'dataurl',
    '.ttf': 'file',
    '.woff': 'file',
    '.woff2': 'file',
  },
  outfile: 'dist/lib/thebe-core.css',
});
