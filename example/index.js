window.onload = function() {
  let cells = thebelab.renderAllCells();

  thebelab
    .requestKernel({
      serverSettings: {
        baseUrl: "http://127.0.0.1:8888/",
        token: "test-secret",
      },
      name: "python3",
    })
    .then(kernel => {
      thebelab.hookupKernel(kernel, cells);
    });
};
