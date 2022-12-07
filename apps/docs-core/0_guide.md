---
venue: guide
---

# Guide

`thebe-core` is available from npm as an `esm` or `commonjs` module and as a bundled package with typescript types. `thebe-core` is primarily intended for use in a web application using a bundler such as `webpack` or `esbuild` but can also be directly loaded into the browser.

Install via npm:

```bash
    npm i thebe-core
```

And import classes and types directly in your code.

```typescript
import { makeConfiguration, ThebeServer, ThebeSession } from 'thebe-core';
```

If you are using `thebe-core` with a server-side rendering framework such as `remix.run` or `next.js`, `thebe-core` can be dynamically loaded in client-side code to avoid build issues in dependencies with side-effects.

```typescript
async function myLoaderFn() {
  const core = await import('thebe-core');
}
```

## Loading `thebe-core` in the browser

`thebe-core` can be used in the browser and exposes a minimal API on `window`, see [JS Bundle API Functions](reference/README.md#js-bundle-api-functions). Include `thebe-core` on a web page using the following script tag:

```html
<script src="https://unpkg.com/thebe-core@latest/dist/lib/thebe-core.min.js"></script>
```

## Configuration

`thebe-core` uses an options object ([`CoreOptions`](reference/interfaces/CoreOptions.md)) based on the original on-page optyions defined in `thebe`.

An options object is used to create a [`Config`](reference/classes/Config.md) instance, any options supplied will be automatically patched with default values. This means it's easy to start using `thebe-core` with little knowledge of the various options but when customize options it's necessary to look carefully at how to provide overrides.

An instance of a `Config` object is then used to construct the different runtime objects like `ThebeServer` and `ThebeNotebook` as well as hold an instance of the `ThebeEvents` object.

### Important options and their default values

A default configuration is created by:

```typescript
const config = makeConfiguration({});
```

#### Connecting to a binderhub

To connect to the public `mybinder.org` binderhub set:

```typescript
const config = makeConfiguration({
  useBinder: true,
});
```

Override specific settings for binder with the following fields (defaults are shown):

```typescript
const config = makeConfiguration({
  useBinder: true,
  binderOptions: {
    repo: 'binder-examples/requirements',
    ref: 'master',
    binderUrl: 'https://mybinder.org',
    repoProvider: RepoProvider.github,
  },
});
```

#### Connect to a Jupyter server

If you already have a Jupyter server available, connect directly using the appropraite own server settings (default settings shown):

```typescript
const config = makeConfiguration({
  useBinder: false,
  useJupyterLite: false,
  serverSettings: {
    baseUrl: 'http://localhost:8888',
    token: 'test-secret',
    appendToken: true,
    ...settings,
  },
});
```

Note: default values are setup to connect to a local Jupyter server. To start local server **for development purposes only**, use the following command:

```bash
jupyter lab --NotebookApp.token=test-secret --NotebookApp.allow_origin='*'
```

#### Connect to a Jupyterlite kernel

See [Enabling JupyterLite](#enabling-jupyterlite) below.

## Establishing a Connection

In both the browser and typescript the [`connect`](reference/modules.md#connect) function can be used. This function accepts the `CoreOptions` object, will automatically create a `Config` instance and begin establishing a server connection. Once a server connection is established start a new session/kernel.

```typescript
const server = await connect({ useBinder: true });

const session = await server.startNewSession();
```

For more control over server connections use the ThebeServer and ThebeSession runtime objects directly, see [`demo-core`](https://github.com/executablebooks/thebe/tree/feat/integrate-thebe-core/apps/demo-core) for an example.

## Enabling JupyterLite

In order to access JupyterLite functionality the `thebe-lite` library must be loaded and initialized.

### In the browser & typescript

**TODO: Publish thebe-lite to npm**

Add the following script tag to your page, and the `window.thebeLite` object will be availalbe to `thebe-core`.

```html
<script src="https://unpkg.com/thebe-lite@latest/dist/lib/thebe-lite.min.js"></script>
```

**TODO: a better loading mechanism / example for typescript via dynamic import?**

### Connecting to kernel via JupyterLite

Supply the following options:

```typescript
const config = makeConfiguration({
  useBinder: false,
  useJupyterLite: true,
});
```
