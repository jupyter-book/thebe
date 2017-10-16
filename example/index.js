function localKernel() {
  // request a kernel from a local notebook serve4r
  // assumes notebook was started with:
  //   jupyter notebook --NotebookApp.allow_origin=* --NotebookApp.token=test-secret
  return thebelab.RequestKernel({
    serverSettings: {
      baseUrl: "http://127.0.0.1:8888/",
      token: "test-secret",
    },
    name: "python3",
  });
}

function binderKernel() {
  // request a kernel from Binder
  return thebelab
    .requestBinder({
      repo: "minrk/ligo-binder",
    })
    .then(serverSettings => {
      console.log("binder settings", serverSettings);
      return thebelab.requestKernel({
        serverSettings,
        name: "python3",
      });
    });
}

window.onload = function() {
  let cells = thebelab.renderAllCells();
  binderKernel().then(kernel => {
    thebelab.hookupKernel(kernel, cells);
  });
};
