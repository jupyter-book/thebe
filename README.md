# ThebeLab

[![Greenkeeper badge](https://badges.greenkeeper.io/minrk/thebelab.svg)](https://greenkeeper.io/)

Experiment rebuilding [Thebe](https://github.com/oreillymedia/thebe) on JupyterLab.

See the [examples directory](examples/) for examples, and browse the
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
  cellSelector: "[data-executable]",
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
