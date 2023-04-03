# thebe-react

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
