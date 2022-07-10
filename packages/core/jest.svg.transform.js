module.exports = {
  process() {
    console.log('process!!!');
    return { code: 'module.exports = {};' };
  },
  getCacheKey() {
    // The output is always the same.
    return 'svgTransform';
  },
};
