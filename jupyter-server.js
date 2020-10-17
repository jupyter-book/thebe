import { JupyterServer } from "@jupyterlab/testutils";
const server = new JupyterServer();

server
  .start()
  .then((msg) => {
    console.log("Started Jupyter Server", msg);
  })
  .catch((msg) => {
    console.log("Server start failed", msg);
  });
