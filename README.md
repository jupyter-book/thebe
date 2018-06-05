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

```javscript
{
  // bootstrap thebe on page load
  bootstrap: false,
  // arbitrary pre-render function called as part of bootstrap
  preRenderHook: false,
  // if present, should be an object
  // with inPrompt and continuationPrompt strings to be replaces
  stripPrompts: false,
  // whether to request the kernel immediately on page load
  // instead of on first execute
  requestKernel: false,
  // selector for identifying which elements on the page should
  // be made interactive
  selector: "[data-executable]",
  // options for requesting a notebook server from mybinder.org
  binderOptions: {
    repo: "minrk/ligo-binder",
    ref: "master",
    binderUrl: "https://mybinder.org",
  },
  // options when requesting a kernel from a notebook server
  kernelOptions: {
    name: "python3",
  },
}
```
