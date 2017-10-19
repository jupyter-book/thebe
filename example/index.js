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
  thebelab.bootstrap();
};

function set_status_button_not_connected() {
  $('.status_button').attr('class','status_button status_button_status_not_connected');
}

function set_status_button_connected() {
  $('.status_button').attr('class','status_button status_button_status_connected');
}

function set_status_button_busy() {
  $('.status_button').attr('class','status_button status_button_status_busy');
}

function set_status_button_dead() {
  $('.status_button').attr('class','status_button status_button_status_dead');
}
