# `thebe-lite`

A bundled javascript package providing a simple api to allow a JupyterLite server to be started from `thebe-core` & `thebe`.

Bundling the JupyterLite dependencies at this level allows certain details such as handling of `pypi` wheels and inline webpack loader to be isolated from an web application or page that uses `thebe-core` and itself may not use webpack for it's build.

To use JupyterLite with `thebe`, this module should be loaded onto the page separately. `thebe-core` will then feature detect and use the module when appropriate option is set.

## Interface

`thebe-lite` will extend the global `thebe` namespace, making the following available on `window`:

```
 window.thebe = {
    ...,
    lite: {
        startJupyterLiteServer: () => Promise<ServiceManager>
    }
 }
```

When loading in typescript this interface is available as `ThebeLiteBundle`;
