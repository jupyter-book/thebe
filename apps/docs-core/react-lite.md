---
title: React & Lite
venue: React
---

If you are using `thebe-react` you can add `thebe-lite` into your app and enable it at runtime via the `useJupyterLite` option. It's worth noting `thebe-lite` is **always** directly loaded onto your page via a script tag and accessed globally, while we **prefer** to load `thebe-core` lazily by the same method. This is for considerations such as package size, build system compatibility and for uniformity while playing nicely with serverside rendering frameworks like Remix.

## Aync loading

To load `thebe-core` the package use the `ThebeBundleLoaderProvider` component:

```html
<ThebeBundleLoaderProvider loadThebeLite publicPath="/thebe">
  <ThebeServerProvider> ... </ThebeServerProvider>
</ThebeBundleLoaderProvider>
```

This makes the `core` API availalbe to the child component tree via the `useThebeLoader` hook, to load `thebe-lite` add the `loadThebeLite` boolean prop.

This will load the appropriate javascript directly to the page either on render (if a `start` prop is passed) or when the `load` function from the `useThebeLoader` hook is called from a child component.

```{important} Deploying javascript bundles is your responsibility
The provider above handles async loading of the javascript bundles by adding them to DOM directly based on relative paths. By default, the provider will add tags to the files at `/thebe-core.js` and `/thebe-lite.js` unless a path prefix is provided in the `publicPath` prop.

In the example above with `publicPath="/thebe"`, the script tags would be pointing to `/thebe/thebe-core.js` and `/thebe/thebe-lite.js`.

Your build system should be updated to copy the bundles into place appropraitely.

**Note:** currently `thebe-react` is configured to always load the `pyodide` and other base wheels from CDN, so there is no need to deploy those.
```
