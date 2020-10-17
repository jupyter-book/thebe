# Contribute to `thebe`

Thanks for your interest in contributing to `thebe`, your contributions are welcome and appreciated 🎉. This page contains some information to help you get started.

```{note}
`thebe` was recently called `thebelab`, so you may see mentions of `thebelab` scattered throughout the repository. Feel free to flag these and suggest we rename them to `thebe`.
```

## Contributing guide

See the [ExecutableBooks developer guidelines](https://executablebooks.org/en/latest/contributing.html) for conventions and practices around developing `thebe`. However, note that some practices, such as creating releases, may be different because `thebe` is primarily an `npm` package rather than a Python package.

## Repository structure

`thebe` is primarily written in Javascript, and structured as an NPM package.

- `src/` contains the code and assets that make up `thebe`. This is what you'll edit to make changes to the project.
- `examples/` provides a few HTML examples of how `thebe` can be used. It is mostly for documentation

## Set up a development environment

In order to get Thebe running locally, you'll need to have Node installed on your system. You can install it in several ways, the most common being:

- Install Node by [following the nodejs instructions](https://nodejs.org/en/download/)
- Install Node through `conda`

  ```bash
  conda install -c conda-forge nodejs
  ```

Once installed, this also includes `npm` (Node Package Manager) which is what you will run in order to run Thebe locally.

Next, clone the repository and set up your `npm` environment for this repo:

```bash
git clone https://github.com/executablebooks/thebe
cd thebe
npm install
```

This will install all dependencies needed to run `thebe` (specified in `package.json`).

## Build and demo `thebe` locally

To use your local copy of `thebe` (e.g., if you make any changes to the `src/` folder), you can run a local build and serve a sample web page. To do so, run:

```bash
npm run build:watch
```

This will build `thebe/` locally (including any changes you've made to the source code).

You can now demo the latest `thebe/` changes by opening the file at `development.html`. Open this file to see Thebe running.

The content of `development.html` is a simple HTML page that demonstrates Thebe functionality. You can edit it to test out new features or configurations.

Running the `npm run develop` command will start building the source code with webpack and serve it along with `development.html`.
As you change the code in `src/`,
the javascript will automatically be re-built,
but you'll be required to refresh the page.

# Committing changes

Thebe uses code autoformatting so you don't need to worry about style lint,
so whenever you are ready to commit changes
run `npm run fmt` to autoformat the javascript.
You can put this script in `.git/hooks/pre-commit`:

```bash
#!/bin/sh
if [[ -f package.json ]]; then
    npm run fmt
fi
```

to run auto-formatting prior to each commit.

# Testing Thebe

You can run the tests locally with `npm test` or `npm run test:watch`.
Alternately, you can push your changes to GitHub and let the tests run automatically via GitHub Actions.

Test code is in the `test` directory, and you can write new tests in there see **Adding Tests** below.

You can also test manually interactively by running `npm run develop` to open and serve `development.html` with the current build of thebe.

TODO: get testing infrastructure to a point where we can reasonably request tests for new features.
## Adding Tests

 - [karma](https://karma-runner.github.io/latest/index.html) is used for automated testing and configured in [karma.conf.js](.karma.conf.js)
 - `karma` uses the same `webpack` configuration as the build from [webpack.config.js](./webpack.config.js)
 - Test files are in the `test` directory and currently setup in a single entry-point fashion, with all tests being required by the `test_entrypoint.js` file. This has pros and cons:
    - pro - `webpack` builds a single bundle which is faster
    - pro - we have a single top level describe block that we know will execute first, so can use before/after to start and shutdown a Jupyter server
    - con - we cannot run single tests, only the full bundle

TODO: create some exemplar tests that:
 - [ ] test starting thebe with different options and controlling on page state at bootstrap
 - [ ] test the initial thebe render
 - [ ] test interacting with the server and rendering results

# Thebe Docs

Thebe uses [Sphinx](https://www.sphinx-doc.org/) and [JupyterBook](https://jupyterbook.org/) for building documentation.
You will need Python installed, and can install the requirements for the documentation using:

```bash
cd docs
pip install -r doc-requirements.txt
```

Once you are in the documentation folder:

```bash
make html
```

# Releasing Thebe

To release thebe, follow the [EBP guidelines](https://executablebooks.org/en/latest/contributing.html#releases-and-change-logs) to make sure the repo is ready for release.

Once prepared, bump the version with:

1. update version and create tag with `npm version NEW_VERSION`, e.g. `npm version 0.5.1`
2. publish version to github: `git push --follow-tags`

# Thebe architecture

Thebe consumes three principal APIs:

1. [jQuery][] for manipulating elements on the page
2. [JupyterLab][] for talking to a running Jupyter server to execute code and display outputs
3. [BinderHub][] for requesting kernels from a BinderHub instance, such as mybinder.org.

## Manipulating the page

The first thing Thebe does is find elements on the page
that should be made executable.
It does this with [jQuery][],
finding (by default) elements that look like `<div data-executable="true">...`,
with a query such as the `$("[data-executable])` (this is the default, but can be customized).
Once it has found these elements,
Cell objects are created (more on Cells in the JupyterLab API), which then *replace* the elements that were found.

## JupyterLab APIs

The main thing Thebe does is execute code and display output.
This is done with JupyterLab APIs.
A Cell is an element wrapping a code input area and associated OutputArea for displaying the outputs that result from execution.

Main APIs used:

- OutputArea for rendering outputs on the page
- Session for starting kernels
- Kernel for sending/receiving messages to/from a connected kernel
- WidgetManager for working with interactive widgets

## Configuration

Configuration is handled by adding a `script` tag with type="text/x-thebe-config". This should specify a javascript object.

More information in the README (TODO: move it here?)

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


[jQuery]: https://jquery.com
[JupyterLab]: https://jupyterlab.readthedocs.io
[BinderHub]: https://binderhub.readthedocs.org
