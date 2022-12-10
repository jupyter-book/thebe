---
venue: Quickstart
---

# Quickstart

Install with `npm`:

```bash
    npm i thebe-core
```

Import and use in typescript:

```typescript
    ...
    const config = makeConfiguration({}); // use default options
    config.events.on('status',
        (evt, {status, message}) => console.log(status, message))

    const notebook = ThebeNotebook.fromIPynb(ipynb)

    // attach last cell to the DOM
    notebook.last().attachToDOM(myHTMLDivElement)

    const server = new ThebeServer(config);

    await server.connectToServerViaBinder();

    const session = await server.startNewSession();
    if (session != null) notebook.attachSession(session);

    await notebook.executeAll();
    ...
```

For more see `apps/demos-simple` for `thebe` and `apps/demo-core` for `thebe-core`.
