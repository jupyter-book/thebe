# Contributing

## Clone the repo

```
  git clone git@github.com:executablebooks/thebe-core.git
  cd thebe-core
  npm install
```

For local development of `thebe-core`, there are two ways to build the library or start a watch.

## Building Typesript and Bundle

Firstly, to build both Typescript and webpack bundles run:

```
  npm run build:watch
```

This will build a Typescript module and a javascript bundle in the `dist/` folder.

## Building and serving the bundle

Running

```
 npm run start
```

Will start a watch and serve example pages from the `/demo` folder containing minimal working examples on [http://localhost:3003](http://localhost:3003).

### Testing with a local Juptyer server

Using the Local Jupyter option in the demo will require an instance of Jupyter running within a suitable python envionment on your local machine. You should start your Jupyter instance using the following command:

```
  jupyter notebook --NotebookApp.token=test-secret --NotebookApp.allow_origin="*"
```

### Testing with JupyterLite

Accessing JupyterLite from the demo application requires that additional dependencies are copied into place, this in turn requires a working local installation of the jupyterlite command line tool.

See the [JupyterLite CLI Documentation](https://jupyterlite.readthedocs.io/en/latest/reference/cli.html) for guidance on installation.

Once the CLI is available the following command will pull the correct binaries into place.

```
  npm run build:lite:demo
```

Check the `demo/` folder to see the files used in creating the html demo app.
