---
title: Using thebe-lite
venue: Guides
---

## Enabling JupyterLite

In order to access JupyterLite functionality and the pyodide kernel the `thebe-lite` library must be loaded and initialized.

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
