import { renderAllCells, requestKernel, hookupKernel } from "./thebelab";

window.onload = function() {
  let cells = renderAllCells();

  requestKernel({
    baseUrl: "http://127.0.0.1:8888/",
    name: "python3",
    token: "secret",
  }).then(kernel => {
    window.kernel = kernel;
    hookupKernel(kernel, cells);
  });
};
