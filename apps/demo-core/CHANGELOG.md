# demo-core

## 2.2.1

### Patch Changes

- thebe-core@1.0.0

## 2.2.0

### Minor Changes

- 68ba668: Removing `test-secret` as a suggested token and enabling unique (timestamp based) tokens per user "session"

### Patch Changes

- Updated dependencies [8c8a55a]
- Updated dependencies [3d82f84]
- Updated dependencies [80dfbb9]
- Updated dependencies [4b7434e]
  - thebe-core@0.4.10

## 2.1.2

### Patch Changes

- Updated dependencies [c78bb6f]
- Updated dependencies [fda8021]
- Updated dependencies [26a8fb8]
- Updated dependencies [092b05c]
  - thebe-core@1.0.0

## 2.1.1

### Patch Changes

- Updated dependencies [600a932]
  - thebe-core@0.3.0

## 2.1.0

### Minor Changes

- 6eea92e: Made changes to the `thebe-core` APIs to make rendermime registries external, the caller now has to manage how registries are used across the other session nd notebook object. Updates the demos, `thebe` and `thebe-react` to reflect this base change. `thebe-react` now has a new provider making it easy to add a rendermine registry in the component tree.

### Patch Changes

- 0a62e50: Upgraded default `pyodide-kernel` to `0.0.8`
- Updated dependencies [6eea92e]
  - thebe-core@0.2.2

## 2.0.3

### Patch Changes

- Improved all demos and setup autodeploy for the simple demo
- Updated dependencies
  - thebe-core@0.2.1

## 2.0.2

### Patch Changes

- 7279d5b: fixed interact based ipywidgets and ipympl functionality, now aligning with behaviour seen in voila and jputyerlab. See [issue 608](https://github.com/executablebooks/thebe/issues/608)
- Updated dependencies [7279d5b]
  - thebe-core@0.1.4

## 2.0.1

### Patch Changes

- Using latest `thebe-core@0.1.3`

## 2.0.0

### Major Changes

- Updated the `core` demo to propertly use typescript interfaces.
