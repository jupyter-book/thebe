export default {
  test: {
    environment: 'happy-dom',
    server: {
      deps: {
        inline: ['@jupyterlab/codemirror', '@jupyter-widgets/controls'],
      },
    },
  },
};
