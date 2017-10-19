// unused kernel-request functions:

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
  thebelab.on("status", function(evt, data) {
    console.log("Status changed:", data.status, data.message);
    $(".thebe-status-button")
      .attr("class", "thebe-status-button thebe-status-" + data.status)
      .text(data.status);
  });
  thebelab.bootstrap();
};
