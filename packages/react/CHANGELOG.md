# thebe-react

## 1.0.0

### Minor Changes

- c78bb6f: Updated jupyter dependencies and pyodide kernel.
- 26a8fb8: Improved handling of connection errors for local server and binder during the connection attempt and if the kernel or server connection fails. Also simplified the binder connection functionality.

### Patch Changes

- 092b05c: Packages now ship their source to enable sourcemaps in development workflows
- 358b62e: ThebeServerProvider's connect function returns a promise
- Updated dependencies [c78bb6f]
- Updated dependencies [fda8021]
- Updated dependencies [26a8fb8]
- Updated dependencies [092b05c]
  - thebe-core@1.0.0

## 0.3.5

### Patch Changes

- 🛠 explicit setting of files to include contents of the `dist` or `lib` folders to avoid missing package files
- Updated dependencies
  - thebe-core@0.3.5

## 0.3.4

### Patch Changes

- Updated dependencies
  - thebe-core@0.3.4

## 0.3.3

### Patch Changes

- 08e008e: Move error handler for the server out of hook and up into the ThebeServerProvider allowing for consistent reactions to an error state across page navigation.
- 57dcdaf: ThebeServerProvider will no longer replace an existing server on rerender if that server is ready and has user server URL.
- 57dcdaf: Hooks no longer throw but return empty or uninitialised objects instead, this allows for much more flexibility in how respective providers are rendered.
- Updated dependencies [87395cb]
- Updated dependencies [08e008e]
- Updated dependencies [57dcdaf]
- Updated dependencies [08e008e]
  - thebe-core@0.3.3

## 0.3.2

### Patch Changes

- 404be08: Updated `@jupyterlite/pyodide-kernel` and other `@jupyterlite` deps to `0.1.0`
- Updated dependencies [404be08]
  - thebe-core@0.3.2

## 0.3.1

### Patch Changes

- Updated dependencies [a2ed6b9]
- Updated dependencies [37ff7a8]
- Updated dependencies [0500e93]
- Updated dependencies [0d2ead2]
  - thebe-core@0.3.1

## 0.3.0

### Patch Changes

- Updated dependencies [600a932]
  - thebe-core@1.0.0

## 0.2.9

### Patch Changes

- Updated dependencies
  - thebe-core@0.2.9

## 0.2.8

### Patch Changes

- Updated dependencies [dad3d19]
  - thebe-core@0.2.8

## 0.2.7

### Patch Changes

- a19ca30: Extend timeout for async loading of the `thebe-core` and `thebe-lite` bundles
  - thebe-core@0.2.7

## 0.2.6

### Patch Changes

- Updated dependencies [35b3b02]
  - thebe-core@0.2.6

## 0.2.5

### Patch Changes

- a3f8e6f: Reverting bad relative url change in bundle loader
  - thebe-core@0.2.5

## 0.2.4

### Patch Changes

- Changed the default bundle loading paths to be relative for both `thebe-core` and `thebe-lite` bundles
- Updated dependencies
  - thebe-core@0.2.4

## 0.2.4

### Patch Changes

- b61fa4e: Changed core library loading strategy to load bundled code directly to the page. This is implemented as a new provider for now, so the previous core provider can still be used.
  - thebe-core@0.2.3
- Provide option to set public path for deployed bundles
- 7b3fd21: Changed core library loading strategy to load bundled code directly to the page. This is implemented as a new provider for now, so the previous core provider can still be used.

## 0.2.2

### Minor Changes

- 6eea92e: Made changes to the `thebe-core` APIs to make rendermime registries external, the caller now has to manage how registries are used across the other session nd notebook object. Updates the demos, `thebe` and `thebe-react` to reflect this base change. `thebe-react` now has a new provider making it easy to add a rendermine registry in the component tree.

### Patch Changes

- 0a62e50: Upgraded default `pyodide-kernel` to `0.0.8`
- Updated dependencies [6eea92e]
  - thebe-core@0.2.2

## 0.2.1

### Patch Changes

- Updated interface to allow jupyterlite options to be passed into bundle. React provider updated to access useJupyterLite prop and react-demo updated to use the new prop.
  - thebe-core@0.2.1

## 0.2.0

### Minor Changes

- Linking packages for a minor version bump

### Patch Changes

- Updated dependencies
  - thebe-core@1.0.0

## 0.0.7

### Patch Changes

- better control over session shutdown and disposal
- Updated dependencies
  - thebe-core@0.1.6

## 0.0.6

### Patch Changes

- 3bd3195: Changed DOM attachement and passive rendering behaviour for integration with the [myst-theme](https://github.com/executablebooks/myst-theme/pull/21)
- Updated dependencies [3bd3195]
  - thebe-core@0.1.5

## 0.0.5

### Patch Changes

- 7279d5b: fixed interact based ipywidgets and ipympl functionality, now aligning with behaviour seen in voila and jputyerlab. See [issue 608](https://github.com/executablebooks/thebe/issues/608)
- Updated dependencies [7279d5b]
  - thebe-core@0.1.4

## 0.0.4

### Patch Changes

- Using latest `thebe-core@0.1.3`

## 0.0.3

### Patch Changes

- a5c180f: Updated ThebeCoreProvider to provide a `load` option to child components. This allows the providers to be nested at high level in a render tree, and in SSR scenarios outside of a ClientOnly boundary. Library load can them be triggered be calling the load function from any child.

## 0.0.2

### Patch Changes

- 9fc9f3b: Fixed a packaging issue that prevented import

## 0.0.2

### Patch Changes

- 9fc9f3b: Initial Release
