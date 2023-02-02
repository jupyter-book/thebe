# Thebe: turn static HTML pages into live documents

![test](https://github.com/executablebooks/thebe/workflows/test/badge.svg)
[![Documentation Status](https://readthedocs.org/projects/thebe/badge/?version=latest)](https://thebe.readthedocs.io/en/latest/?badge=latest)

Have a static HTML page with code snippets? Your readers can edit and execute them right there. All it takes is:

- A brief header in the HTML page
- The Thebe javascript library (which can be fetched from the web)
- A computing backend (typically [binder](https://mybinder.org))

![Demo](apps/docs/_static/demo.png)

Thebe is a based on the [Jupyter](jupyter.org) technology, and thus supports [a wealth of programming languages](https://github.com/jupyter/jupyter/wiki/Jupyter-kernels). The original implementation, called [Thebe](https://github.com/oreillymedia/thebe) was a fork of the Jupyter code base.

See [the Thebe Documentation](https://thebe.readthedocs.io/en/latest/) for more information. See also this [blog post](https://blog.ouseful.info/2017/12/18/run-python-code-embedded-in-html-via-a-jupyter-kernel/).

> For the latest `thebe-core` documentation, see [https://thebe-core.curve.space/](https://thebe-core.curve.space/)

**Deprecation Notice**

> `thebe` has been added as an alias for `thebelab` and all css classes beginning with `thebelab-` duplicated as `thebe-` (as of 0.8.3).
>
> The `thebelab` global object, exposed functions and user code reliant on css classes `thebelab-*`, will continue to work and any DOM elements created during operation will be decorated with `thebelab-` classes as expected, until it is removed in version 0.9.0.

## How Thebe works

Starting Thebe involves the following steps:

- Loading the thebe javascript, typically [from a CDN](https://unpkg.com/thebe);
- Fetching the Thebe configuration from the page header;
- Bootstrapping Thebe:
  - Re rendering the code cells to make them live cells.
    Optionally, the rendering can handle cells that contain
    a mixture of inputs and ouputs distinguished by prompts
    (see the stripPrompts option);
  - (optional) Requesting a notebook server from Binder;
  - (optional) Requesting a Jupyter kernel from the Jupyter server.

Bootstrap Thebe by calling `thebelab.bootstrap()`. If `bootstrap: true` is
in the Thebe configuration (see below), this will be triggered automatically
upon page load.

## Configuring Thebe

For complete information about configuring Thebe, see
[the Thebe documentation](https://thebe.readthedocs.io/en/latest/).

You can configure thebe with a script tag.
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
  // Whether thebe should automatically trigger the bootstrap upon page load
  // if set to false, the page should contain some additional javascript
  // responsible for triggering the javascript when desired (e.g. connected to a button click).
  bootstrap: false,

  // arbitrary pre-render function called as part of bootstrap
  preRenderHook: false,

  // Whether to request the kernel immediately when thebe is bootstrapped
  // instead of on executing code for the first time
  requestKernel: false,

  // Whether thebe should look for predefined output of cells before execution
  // If this option is enabled and the next div after the cell has the attribute
  // data-output=true (default), then the content of this div is rendered as output
  predefinedOutput: false,

  // The selector for identifying whether an element should be treated as output
  outputSelector: '[data-output]',

  // Options for requesting a notebook server from mybinder.org
  binderOptions: {
    repo: "minrk/ligo-binder",

    // only repo is required, the rest below are defaults:
    ref: "master",
    binderUrl: "https://mybinder.org",
    // select repository source (optional). Supports Github(default), Gitlab, and Git
    repoProvider: "github",
    savedSession: {
      // if enabled, thebe will store and try to re-use
      // connections (with credentials!) to running servers
      enabled: true,
      maxAge: 86400, // the max age in seconds to consider re-using a session
      storagePrefix: "thebe-binder-",
    }
  },

  // Options for requesting a kernel from the notebook server
  kernelOptions: {
    name: "python3",
    kernelName: "python3",
    path: "."
    // notebook server configuration; not needed with binder
    // serverSettings: {
    //      "baseUrl": "http://127.0.0.1:8888",
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

  // URL from which to load mathjax
  // set to `false` to disable mathjax
  mathjaxUrl: "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js",

  // mathjax configuration string
  mathjaxConfig: "TeX-AMS_CHTML-full,Safe",

  // Additional options to pass to CodeMirror instances
  codeMirrorConfig: {},
}
```

### Examples

To see examples of `thebe` in use, check the project documentation on [read the docs](https://thebe.readthedocs.io/en/latest/).

Alternatively,you can also check the HTML based examples included in the in `docs/_static/html_examples/` folder. To run these either [setup a local development environment](https://thebe.readthedocs.io/en/latest/contribute.html) or replace the `<script>` element in each file with the following:

```
<script type="text/javascript" src="https://unpkg.com/thebe@latest"></script>
```

Also include the css bundle on your page:

```
<link rel="stylesheet" href="https://unpkg.com/thebe@latest/lib/thebe.css">
```

## Contribute to `thebe`

For the latest information on setting up a local development environment see [CONTRIBUTING.md](./CONTRIBUTING.md) in this repository.

### Legacy information on `thebe` builds is here

For more information on contributing to `thebe`, see [the `thebe` contributing documentation](https://thebe.readthedocs.io/en/latest/contribute.html) although note that

## Acknowledgements

`thebe` was developed as a part of [OpenDreamKit](http://opendreamkit.org/) – Horizon 2020 European Research Infrastructure project (676541).
It is currently stewarded by [the Executable Books Project](https://executablebooks.org/en/latest/#acknowledgements).
Additional support was provided by the U.S. Department of Education Open Textbooks Pilot Program funding for the LibreTexts project (P116T180029).
