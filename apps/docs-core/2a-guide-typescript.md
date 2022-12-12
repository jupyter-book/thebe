---
venue: Guides
---

# Getting started in Typescript

`thebe-core` is available from npm as an `esm` or `commonjs` module and as a bundled package with typescript types.

`thebe-core` is primarily intended for use in a web application using a bundler such as `webpack` or `esbuild` but can also be directly loaded and used in the browser. This guide covers in-browser usage, for typescript usage see []()

Install via npm:

```bash
    npm i thebe-core
```

And import classes and types directly in your code.

```typescript
import { makeConfiguration, ThebeServer, ThebeSession } from 'thebe-core';
```

If you are using `thebe-core` with a server-side rendering framework such as `remix.run` or `next.js`; `thebe-core` can be dynamically loaded in client-side code to avoid build issues when loading dependencies containing side-effects.

```typescript
async function myLoaderFn() {
  const core = await import('thebe-core');
}
```
