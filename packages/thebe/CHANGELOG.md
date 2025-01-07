# thebe

## 0.9.3

### Patch Changes

- thebe-core@1.0.0

## 0.9.2

### Patch Changes

- 8c8a55a: Version numbers are printed in debug messages to aid in debugging
- Updated dependencies [8c8a55a]
- Updated dependencies [3d82f84]
- Updated dependencies [80dfbb9]
- Updated dependencies [4b7434e]
  - thebe-core@0.4.10

## 0.9.1

### Patch Changes

- 268ebed: `Esc` will blur editor, fix to avoid keyboard trap (wcag 2.1.2) @tonyfast
- Updated dependencies [7214737]
  - thebe-core@0.4.7

## 0.9.0

### Patch Changes

- 0757602: Removing unneeded undefined guards
- a080c19: Fixed inconsistent case: `mountRestartallButton` renamed to `mountRestartAllButton`.

  Thanks to @kno10.

  - thebe-core@0.4.6

## 0.9.0-rc.12

- updated `thebe-core` dependency

## 0.9.0-rc.11

### Minor Changes

- c78bb6f: Updated jupyter dependencies and pyodide kernel.

### Patch Changes

- 092b05c: Packages now ship their source to enable sourcemaps in development workflows
- Updated dependencies [c78bb6f]
- Updated dependencies [fda8021]
- Updated dependencies [26a8fb8]
- Updated dependencies [092b05c]
  - thebe-core@1.0.0

## 0.9.0-rc.9

### Patch Changes

- 🛠 explicit setting of files to include contents of the `dist` or `lib` folders to avoid missing package files
- Updated dependencies
  - thebe-core@0.3.5

## 0.9.0-rc.8

### Patch Changes

- Updated to `thebe-core@0.3.2`

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
