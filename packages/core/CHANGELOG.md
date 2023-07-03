# thebe-core

## 0.2.6

### Patch Changes

- 35b3b02: Fix to how initial outputs re read from the DOM, expose executionCount from the kernel, add caching of notebooks and reset functionality on cells and the notebook.
  - thebe-lite@0.2.6

## 0.2.5

### Patch Changes

- thebe-lite@0.2.5

## 0.2.4

### Patch Changes

- Added script to copy thebe assets to the `thebe-core` package distribution (@shaielc)
  - thebe-lite@0.2.4

## 0.2.3

### Patch Changes

- thebe-lite@0.2.3

## 0.2.2

### Minor Changes

- 6eea92e: Made changes to the `thebe-core` APIs to make rendermime registries external, the caller now has to manage how registries are used across the other session nd notebook object. Updates the demos, `thebe` and `thebe-react` to reflect this base change. `thebe-react` now has a new provider making it easy to add a rendermine registry in the component tree.

### Patch Changes

- Updated dependencies [0a62e50]
  - thebe-lite@0.2.2

## 0.2.1

### Patch Changes

- Updated dependencies
  - thebe-lite@0.2.1

## 0.2.0

### Minor Changes

- Linking packages for a minor version bump

### Patch Changes

- Updated dependencies
- Updated dependencies
  - thebe-lite@1.0.0

## 0.1.6

### Patch Changes

- better control over session shutdown and disposal

## 0.1.5

### Patch Changes

- 3bd3195: Changed DOM attachement and passive rendering behaviour for integration with the [myst-theme](https://github.com/executablebooks/myst-theme/pull/21)

## 0.1.4

### Patch Changes

- 7279d5b: fixed interact based ipywidgets and ipympl functionality, now aligning with behaviour seen in voila and jputyerlab. See [issue 608](https://github.com/executablebooks/thebe/issues/608)

## 0.1.3

### Patch Changes

- Removed shadow rendering via a second OutputArea. This was not helpful and causing issues with some `ipywidgets` rendering.
