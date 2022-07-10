# Javascript

WARNING - out of date

For use in place javascript load `dist/lib/index.js` onto you page, in this scenario `setupThebeCore()` is called automatically
and `thebe-core` will be available on `window.thebeCore`. That object contains a ThebeContext and an JsApi with functions intended
to be used from browser based scripts.

```
  window.thebeCore = {
    ctx: ThebeContext,
    api: JsApi
  }

  interface ThebeContext {
    store: EnhancedStore<State>; // redux store
    kernels: Record<string, ThebeKernel>; // runtime objects containing kenrel connections
    notebooks: Record<string, Notebook>;  // runtime objects containing notebooks and cell renderers
  }

  interface JsApi {
    configure: (options: Partial<Options>) => void;
    connect: (options: Partial<Options>) => Promise<ThebeKernel>;
    binder: (options: Partial<Options>) => Promise<ThebeKernel>;
    jupyter: (options: Partial<Options>) => Promise<ThebeKernel>;
    setupNotebook: (blocks: CodeBlock[]) => Notebook;
    restartKernel: (kernelId: string) => void;
    clear: () => void;
  }
```
