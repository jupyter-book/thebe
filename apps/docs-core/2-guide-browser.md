---
venue: Guides
---

# Getting started in the Browser

`thebe-core` is available from npm as an `esm` or `commonjs` module and as a bundled package with typescript types.

`thebe-core` can be used in the browser via a minimal API on exposed on `window`, see [JS Bundle API Functions](reference/README.md#js-bundle-api-functions) for a listing.

Load `thebe-core` on a web page using a script tag, either from `unpkg.com` as show or from your own server:

```html
<script src="https://unpkg.com/thebe-core@latest/dist/lib/thebe-core.min.js"></script>
```

## Options & Configuration

`thebe-core` uses an options object (types as [`CoreOptions`](reference/interfaces/CoreOptions.md)) based on the original on-page options defined in `thebe`.

The same mechanism is used in typescript and with js in the browser.

Read more in [Options & Configuration](3a-configuration.md), then come back here to continue and setup your connection.

## Listening to events

`thebe-core` objects use promised during async interactions with the Jupyter backend which allows you to build a UI that responds to async changes. However, an event syatem is also available allowing you to receive finer grained status messages as well as react to events that originate from the server.

To listen to all events withing the scope of a particular Config object register your event handlers below.

```typescript
const config = makeConfiguration({ useBinder: true });

config.events.on('status', (evt, { status, message }) => console.log(status, message));

config.events.on('error', (evt, { status, message }) => console.error(status, message));
```

## Establishing a Connection

The asynchronous [`connect`](reference/modules.md#connect) function will establish a server connection based on a `Config` object.

```typescript
...
const server = await connect(config);
```

Once resolved it provides a `ThebeServer` object that can be used to start a new session / kernel. The configuration object is availble on `server.config`.

```typescript
...
const session = await server.startNewSession();
```

```{tip}
For more control over server connections use the ThebeServer and ThebeSession runtime objects directly, see [`demo-core`](https://github.com/executablebooks/thebe/tree/feat/integrate-thebe-core/apps/demo-core) for an example.
```

## Setting up a Notebook

- loading code
- attaching to the session
- attaching to the DOM

## Running code

## Next Steps

- Enable WASM based kernels using [JupyterLite](#enabling-jupyterlite)
