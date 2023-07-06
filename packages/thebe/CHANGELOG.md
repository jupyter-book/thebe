# thebe

## 0.9.0

### Patch Changes

- Updated dependencies [600a932]
  - thebe-core@1.0.0

## 0.9.0-rc.6

### Patch Changes

- 6eea92e: Made changes to the `thebe-core` APIs to make rendermime registries external, the caller now has to manage how registries are used across the other session nd notebook object. Updates the demos, `thebe` and `thebe-react` to reflect this base change. `thebe-react` now has a new provider making it easy to add a rendermine registry in the component tree.
- Updated dependencies [6eea92e]
  - thebe-core@0.2.2

## 0.9.0-rc.5

### Patch Changes

- Improves styling, fixed codemirroor mode and theme handling
- Update main readme
- Updated dependencies
  - thebe-core@0.2.2

## 0.9.0-rc.4

### Patch Changes

- 7279d5b: fixed interact based ipywidgets and ipympl functionality, now aligning with behaviour seen in voila and jputyerlab. See [issue 608](https://github.com/executablebooks/thebe/issues/608)
- Updated dependencies [7279d5b]

  - thebe-core@0.1.4

- bfe8ede: fall back to `kernelName` when `name` not specified (issue 595)[https://github.com/executablebooks/thebe/issues/595]

## 0.9.0-rc.3

### Patch Changes

- Using latest `thebe-core@0.1.3`
