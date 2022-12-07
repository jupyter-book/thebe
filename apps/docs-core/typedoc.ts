module.exports = {
  entryPoints: ['../../packages/core/src/'],
  tsconfig: '../../packages/core/tsconfig.json',
  plugin: ['typedoc-plugin-markdown'],
  out: 'reference',
  name: 'thebe-core',
  readme: '../../packages/core/entrypoint.md',
};
