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

Running the `npm run` command will start Webpack which will bundle and serve the source code along with `development.html`. As you change the code in Thebelab, the javascript will automatically be re-built, but you'll be required to refresh the page.