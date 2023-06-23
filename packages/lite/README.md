# `thebe-lite`

Connect to a `pyodide` kernel via `juptyerlite` in `thebe-core` & `thebe`.

## Usage

### in `thebe`

To use JupyterLite with `thebe`, load this module on your page using a script tag **before** loading `thebe` itself.

```html
<script src="thebe-lite.min.js"></script>
<script src="https://unpkg.com/thebe@latest/dist/lib/index.js"></script>
```

`thebe` will then feature detect the library and use the module when appropriate option is set.

**Note:** at the moment, in order for `thebe-lite` to work, the entire package must be available at at the root of the host domain as `pyolite` currently requires wheels to be available at `/build/pypi`.
## with `npm`
First install the package:

`npm i thebe-core thebe-lite`

Thebe is loaded asynchronously so you need to copy the build artifacts into your project static directory (e.g. `public` in `react`) you can do that using:
`npx copy-thebe-assets <output_dir>`

e.g:
`npx copy-thebe-assets public/thebe`

## Interface

`thebe-lite` will extend the global `thebe` namespace, making the following available on `window`:

```javascript
 window.thebe = {
    ...,
    thebeLite: {
        startJupyterLiteServer: () => Promise<ServiceManager>
    }
 }
```

In order to connect to a `jupyterlite` kernel with `thebe` use set the following options:

```javascript
{
    useBinder: false,
    useJupyterLite: true
}
```

When loading in typescript this interface is available as `ThebeLiteBundle` and a connection can be established by:

```typescript
import { makeConfiguration, ThebeServer } from 'thebe-core';
import { setupThebeLite } from 'thebe-lite';

setupThebeLite();

const config = makeConfiguration({});
const server = new ThebeServer(config);

await server.connectToJupyterLiteServer();
```

## Read More

For more examples of `thebe-lite` in use, see `apps/simple` and `apps/demo-core`.
