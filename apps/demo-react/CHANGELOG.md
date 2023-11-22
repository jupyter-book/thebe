# demo-react

## 0.2.6

### Patch Changes

- 26a8fb8: Updated the demo to add examples of curfacing the different status and error feeds available; connection (server, session, kernel) vs execution (notebook, cell)
- Updated dependencies [c78bb6f]
- Updated dependencies [26a8fb8]
- Updated dependencies [092b05c]
- Updated dependencies [358b62e]
  - thebe-react@1.0.0

## 0.2.5

### Patch Changes

- 57dcdaf: ThebeServerProvider will no longer replace an existing server on rerender if that server is ready and has user server URL.
- 57dcdaf: Hooks no longer throw but return empty or uninitialised objects instead, this allows for much more flexibility in how respective providers are rendered.
- Updated dependencies [08e008e]
- Updated dependencies [57dcdaf]
- Updated dependencies [57dcdaf]
  - thebe-react@0.3.3

## 0.2.4

### Patch Changes

- thebe-react@0.3.0

## 0.2.3

### Patch Changes

- b61fa4e: Changed core library loading strategy to load bundled code directly to the page. This is implemented as a new provider for now, so the previous core provider can still be used.
- Updated dependencies [b61fa4e]
  - thebe-react@0.2.4

## 0.2.1

### Patch Changes

- 7b3fd21: Changed core library loading strategy to load bundled code directly to the page. This is implemented as a new provider for now, so the previous core provider can still be used.
- Updated dependencies
- Updated dependencies [7b3fd21]
  - thebe-react@0.2.3

## 0.2.0

### Minor Changes

- 6eea92e: Made changes to the `thebe-core` APIs to make rendermime registries external, the caller now has to manage how registries are used across the other session nd notebook object. Updates the demos, `thebe` and `thebe-react` to reflect this base change. `thebe-react` now has a new provider making it easy to add a rendermine registry in the component tree.

### Patch Changes

- Updated dependencies [0a62e50]
- Updated dependencies [6eea92e]
  - thebe-react@0.2.2

## 0.1.5

### Patch Changes

- Updated interface to allow jupyterlite options to be passed into bundle. React provider updated to access useJupyterLite prop and react-demo updated to use the new prop.
- Updated dependencies
  - thebe-react@0.2.1

## 0.1.4

### Patch Changes

- Improved all demos and setup autodeploy for the simple demo
- Updated dependencies
  - thebe-react@1.0.0

## 0.1.3

### Patch Changes

- Updated dependencies
  - thebe-react@0.0.7

## 0.1.2

### Patch Changes

- Updated dependencies [3bd3195]
  - thebe-react@0.0.6

## 0.1.1

### Patch Changes

- 7279d5b: fixed interact based ipywidgets and ipympl functionality, now aligning with behaviour seen in voila and jputyerlab. See [issue 608](https://github.com/executablebooks/thebe/issues/608)
- Updated dependencies [7279d5b]
  - thebe-react@0.0.5
