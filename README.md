# ThebeLab: turning static HTML pages into live documents

[![Greenkeeper badge](https://badges.greenkeeper.io/minrk/thebelab.svg)](https://greenkeeper.io/)

Have a static HTML page with code snippets? Your readers can edit and execute them right there. All it takes is:
- A brief header in the HTML page
- The ThebeLab javascript library (which can be fetched from the web)
- A computing backend (typically [binder](https://mybinder.org))

TODO: add screenshots.

ThebeLab is a based on the [Jupyter](jupyter.org) technology, and thus supports [a wealth of programming languages](https://github.com/jupyter/jupyter/wiki/Jupyter-kernels). The original implementation, called [Thebe](https://github.com/oreillymedia/thebe) was a fork of the Jupyter code base. ThebeLab is a reimplementation of Thebe as a thin layer on top of [JupyterLab](https://github.com/jupyterlab/jupyterlab), making it more sustainable.

See the [examples directory](examples/), and browse the
[live output](https://minrk.github.io/thebelab/).
See also this
[blog post](https://blog.ouseful.info/2017/12/18/run-python-code-embedded-in-html-via-a-jupyter-kernel/).

## How ThebeLab works

Starting ThebeLab involves the following steps:
- Loading the thebelab javascript, typically from a CDN;
- Fetching the ThebeLab configuration from the page header;
- Bootstraping ThebeLab:
  - Re rendering the code cells to make them live cells.
    Optionally, the rendering can handle cells that contain
    a mixture of inputs and ouputs distinguished by prompts
    (see the stripPrompts option);
  - (optional) Requesting a notebook server from Binder;
  - (optional) Requesting a Jupyter kernel from the Jupyter server.

## Configuring ThebeLab

You can configure thebelab with a script tag.
The script should have `type=text/x-thebe-config`
with a javascript object containing configuration options.

```html
<script type="text/x-thebe-config">
{
  binderOptions: {
    repo: "minrk/ligo-binder",
    ref: "master",
  }
}
</script>
```

A full config script with defaults:

```javascript
{
  // Whether thebelab should automatically trigger the bootstrap upon page load
  // if set to false, the page should contain some additional javascript
  // responsible for triggering the javascript when desired.
  bootstrap: false,

  // arbitrary pre-render function called as part of bootstrap
  preRenderHook: false,
  
  // Whether to request the kernel immediately on page load
  // instead of on first execute
  requestKernel: false,
  
  // Options for requesting a notebook server from mybinder.org
  binderOptions: {
    repo: "minrk/ligo-binder",
    ref: "master",
    binderUrl: "https://mybinder.org",
    // select repository source (optional). Supports Github(default), Gitlab, and Git
    repoProvider: "github",
  },
  
  // Options for requesting a kernel from the notebook server
  kernelOptions: {
    name: "python3",
    // notebook server configuration; not needed with binder
    // serverSettings: {
    //       "baseUrl": "http://127.0.0.1:8888",
    //      "token": "test-secret"
    //    }
  },

  // Selector for identifying which elements on the page should
  // be made interactive
  selector: "[data-executable]",
  
  // Optional prompt handling during the rendering phase
  // Either false or a dictionary as in the example below
  stripPrompts: false,
  // stripPrompts: {
  //      inPrompt: 'sage: ',
  //      continuationPrompt: '....: ',
  //      // only apply the prompt stripping to cells matching this selector (optional)
  //      selector: '.sage-input',
  //    },
}
```

## Acknowledgements

`thebelab` was developed as a part of [OpenDreamKit](http://opendreamkit.org/) – Horizon 2020 European Research Infrastructure project (676541).
