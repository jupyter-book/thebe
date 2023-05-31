# demo-core

## 2.1.0

### Minor Changes

- 6eea92e: Made changes to the `thebe-core` APIs to make rendermime registries external, the caller now has to manage how registries are used across the other session nd notebook object. Updates the demos, `thebe` and `thebe-react` to reflect this base change. `thebe-react` now has a new provider making it easy to add a rendermine registry in the component tree.

### Patch Changes

- 0a62e50: Upgraded default `pyodide-kernel` to `0.0.8`
- Updated dependencies [6eea92e]
  - thebe-core@0.2.2

## 2.0.3

### Patch Changes

- Improved all demos and setup autodeply for the simple demo
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
