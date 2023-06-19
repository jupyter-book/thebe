---
title:
venue: Reference
---

# Options & Configuration

A [CoreOptions](reference/interfaces/CoreOptions.md) object is used to create a [`Config`](reference/classes/Config.md) object, where any options supplied will be automatically patched with [default values](4_defaultOptions.md).

This makes it easy to start using `thebe-core` with minimal knowledge of the various options available, while also overriding specific defaults as needed.

An instance of a `Config` object is then used to construct the different runtime objects like `ThebeServer` and `ThebeNotebook`. `Config` by default will also create instance of the `ThebeEvents` object, allowing you to scope event based messaging in your app.

## Connect via a BinderHub

We can configure `thebe-core` to connect to the public `mybinder.org` service by setting a single option.

```typescript
const config = makeConfiguration({
  useBinder: true,
});
```

Override specific settings for binder by setting any of the following fields (defaults are shown):

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

## Connect directly to a Jupyter server

If you already have a Jupyter server available, connect directly by simply:

```typescript
const config = makeConfiguration({});
```

This will use default settings to connect to a local Jupyter server. To start local server **for development purposes only**, use the following command:

```bash
jupyter lab --NotebookApp.token=test-secret --NotebookApp.allow_origin='*'
```

To connect to a different server update the server settings:

```typescript
const config = makeConfiguration({
  useBinder: false, // or omit
  useJupyterLite: false, // or omit
  serverSettings: {
    baseUrl: 'http://localhost:8888',
    token: 'test-secret',
    appendToken: true,
    ...settings,
  },
});
```

```{tip}
  The two key options governing connection behaviour are `useBinder` and `useJupyterLite`. When these are both `false` or `undefined`, `thebe-core` will attempt to connect to a Jupyter server directly based on `options.serverSettings`.
```

## Next Steps

- Head back to the [browser guide](2-guide-browser.md#establishing-a-connection)
- Head back to the [typescript guide](2a-guide-typescript#establishing-a-connection)
- Explore the full set of [default options](4-default-options.md)
