function localKernel() {
  // request a kernel from a local notebook server
  // assumes notebook was started with:
  //   jupyter notebook --NotebookApp.allow_origin=* --NotebookApp.token=test-secret
  return thebelab.RequestKernel({
    name: "python3",
  });
}

function binderKernel() {
  // request a kernel from Binder
  return thebelab.requestBinderKernel({
    kernelOptions: {
      name: "python3",
    },
    binderOptions: {
      repo: "minrk/ligo-binder",
    },
  });
}

window.onload = function() {
  thebelab.bootstrap();
};
