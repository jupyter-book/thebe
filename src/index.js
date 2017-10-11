import { renderAllCells, requestKernel, hookupKernel } from "./thebelab";

window.onload = function() {
  let cells = renderAllCells();

  requestKernel({
    serverSettings: {
      baseUrl: "http://127.0.0.1:8888/",
      token: "secret",
    },
    name: "python3",
  }).then(kernel => {
    window.kernel = kernel;
    renderAllCells();
    hookupKernel(kernel, cells);
  });
};
