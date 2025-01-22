# thebe-lite

## 0.5.0

### Minor Changes

- ada3353: Clients no longer have to explicitly supply `litePluginSettings` unless they explicitly want to override them. This simplifies upgrades as clients should just bump packages, and the correct plugin settings for the bundled pyodide kernel will be applied by default.
- ada3353: Upgrading `@jupyterlite/pyodide-kernel-extension` to fix ipywidget disconnect issues.

## 0.4.10

### Patch Changes

- 8c8a55a: Version numbers are printed in debug messages to aid in debugging
- 4b7434e: Upgrading to `@jupyterlite/pyodide-*` 0.4.2, updating all `@jupyter*` deps to latest

## 0.4.9

## 0.4.8

## 0.4.7

### Patch Changes

- a9a06ab: Updated `pyodide-kernel` for Juptyerlite to get latest stubbed `widgetsnbextension`

## 0.4.6

### Patch Changes

- a080c19: Update pyodide-kernel.

  Thanks to @jpto.

## 0.4.5

## 0.4.4

## 0.4.3

## 0.4.2

## 0.4.1

## 0.4.0

### Minor Changes

- c78bb6f: Updated jupyter dependencies and pyodide kernel.
- 1ce79f6: Added a custom service worker for jupyterlite based on the default jupyterlite sw but with no caching, added build steps for this to be included in `thebe-lite` builds.

### Patch Changes

- 092b05c: Packages now ship their source to enable sourcemaps in development workflows

## 0.3.5

### Patch Changes

- 🛠 explicit setting of files to include contents of the `dist` or `lib` folders to avoid missing package files

## 0.3.4

## 0.3.3

## 0.3.2

### Patch Changes

- 404be08: Updated `@jupyterlite/pyodide-kernel` and other `@jupyterlite` deps to `0.1.0`

## 0.3.1

## 0.3.0

## 0.2.9

## 0.2.8

## 0.2.7

## 0.2.6

## 0.2.5

## 0.2.4

## 0.2.3

## 0.2.2

### Patch Changes

- 0a62e50: Upgraded default `pyodide-kernel` to `0.0.8`

## 0.2.1

### Patch Changes

- Updated interface to allow jupyterlite options to be passed into bundle. React provider updated to access useJupyterLite prop and react-demo updated to use the new prop.

## 0.2.0

### Minor Changes

- Linking packages for a minor version bump

### Patch Changes

- Update to jupyterlite 0.1.0
