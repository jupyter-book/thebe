# thebe-core

## 0.4.10

### Patch Changes

- 8c8a55a: Version numbers are printed in debug messages to aid in debugging
- 3d82f84: Adding explicit rendermime factor for handling errors, follow an upstream change in lab 4.3
- 80dfbb9: Reverts previous erroneous breaking changes in a patch release
- 4b7434e: Upgrading to `@jupyterlite/pyodide-*` 0.4.2, updating all `@jupyter*` deps to latest
- Updated dependencies [8c8a55a]
- Updated dependencies [4b7434e]
  - thebe-lite@0.4.10

## 0.4.9

### Patch Changes

- 95eb9b5: Fixes a cross package import from `core` to `react` that caused downstream SSR to fail
  - thebe-lite@0.4.9

## 0.4.8

### Patch Changes

- 30f569e: Added a passive widget manager and integrated into `thebe-react` and `demo-react`
  - thebe-lite@0.4.8

## 0.4.7

### Patch Changes

- 7214737: Notebooks in subfolders will not have relative paths honoured in `thebe-lite`
- Updated dependencies [a9a06ab]
  - thebe-lite@0.4.7

## 0.4.6

### Patch Changes

- Updated dependencies [a080c19]
  - thebe-lite@0.4.6

## 0.4.5

### Patch Changes

- cbeab97: Repo providers now also return the storage key for saved sessions so that they can make informed decisions about how to cache the session details based on the url/repo-spec.
  - thebe-lite@0.4.5

## 0.4.4

### Patch Changes

- 1ba03ed: Storage key prefixes for saved sessions are based on url origin and pathname only, hash and query params are ignored
  - thebe-lite@0.4.4

## 0.4.3

### Patch Changes

- 43dfd6a: Await session manager before trying to start a new sessions and change exception condition
- a730cb3: Fixed `server.listRunningSession` to use the new iterator returned by `sessionManager.running()` properly. This fixed an unhandle exception that was breaking `myst-theme` based sites.
  - thebe-lite@0.4.3

## 0.4.2

### Patch Changes

- thebe-lite@0.4.2

## 0.4.1

### Patch Changes

- 6d29986: Added default arguments to clear sesion storage utility functions
  - thebe-lite@0.4.1

## 0.4.0

### Minor Changes

- c78bb6f: Updated jupyter dependencies and pyodide kernel.
- 26a8fb8: Improved handling of connection errors for local server and binder during the connection attempt and if the kernel or server connection fails. Also simplified the binder connection functionality.

### Patch Changes

- fda8021: Added and exported utility functions `clearAllSavedSessions`,`clearSavedSession` to assist apps with managing saved binder sessions in local storage
- 092b05c: Packages now ship their source to enable sourcemaps in development workflows
- Updated dependencies [c78bb6f]
- Updated dependencies [1ce79f6]
- Updated dependencies [092b05c]
  - thebe-lite@1.0.0

## 0.3.5

### Patch Changes

- 🛠 explicit setting of files to include contents of the `dist` or `lib` folders to avoid missing package files
- Updated dependencies
  - thebe-lite@0.3.5

## 0.3.4

### Patch Changes

- 🔧 fix missing `lib/` folder in released package
  - thebe-lite@0.3.4

## 0.3.3

### Patch Changes

- 87395cb: Changed how binder urls are built to use a RepoProviderSpec which can be extended by callers of ThebeServer to include custom specs.
- 08e008e: Fixed error in event trigger invocation that caused an exception on binder conneciton failures
- 57dcdaf: Add check call for user server status
- 08e008e: Emit an error event for exceptions thrown during the binder url formation, including for unknown providers.
  - thebe-lite@0.3.3

## 0.3.2

### Patch Changes

- 404be08: Updated `@jupyterlite/pyodide-kernel` and other `@jupyterlite` deps to `0.1.0`
- Updated dependencies [404be08]
  - thebe-lite@0.3.2

## 0.3.1

### Patch Changes

- a2ed6b9: Override a jupyter style to allow pages to control scroll behaviour on their output areas
- 37ff7a8: Updating shebang for any node location
- 0500e93: Updated copy script to handle multiple libraries with options
- 0d2ead2: Export ThebeMarkdownCell in place of ThebeNonExecutableCell.
  - thebe-lite@0.3.1

## 0.3.0

### Minor Changes

- 600a932: Adds a `kind` (`CellKind`) files to all `IThebeCell`s making it easy for consumers to differentiate between code and content cells. `NonExecutableCell` has also now been renamed to `MarkdownCell` in preparation for additional rendering and inline execution calabilities being introduced in future.

### Patch Changes

- thebe-lite@0.3.0

## 0.2.9

### Patch Changes

- Fixing missing exports
  - thebe-lite@0.2.9

## 0.2.8

### Patch Changes

- dad3d19: The refresh function has been removed and the beahviour of render and reset tweaked to remove the hideWidgets option. This means that `stripWidgets` is no longer called and the consumer must implement any functionality to manipulate MimeBundles that contain `ipywidgets`, if they want to achieve better default rendering. `stripWidgets` and the defualt `placeholder` generation functions have been exposed on the `thebe-core` apip to make this easier.
  - thebe-lite@0.2.8

## 0.2.7

### Patch Changes

- thebe-lite@0.2.7

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
