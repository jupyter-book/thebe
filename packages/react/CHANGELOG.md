# thebe-react

## 0.0.3

### Patch Changes

- a5c180f: Updated ThebeCoreProvider to provide a `load` option to child components. This allows the providers to be nested at high level in a render tree, and in SSR scenarios outside of a ClientOnly boundary. Library load can them be triggered be calling the load function from any child.

## 0.0.2

### Patch Changes

- 9fc9f3b: Fixed a packaging issue that prevented import

## 0.0.2

### Patch Changes

- 9fc9f3b: Initial Release
