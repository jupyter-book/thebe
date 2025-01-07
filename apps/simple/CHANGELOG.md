# demo-simple

## 1.2.0

### Minor Changes

- ada3353: Clients no longer have to explicitly supply `litePluginSettings` unless they explicitly want to override them. This simplifies upgrades as clients should just bump packages, and the correct plugin settings for the bundled pyodide kernel will be applied by default.

## 1.1.0

### Minor Changes

- 68ba668: Removing `test-secret` as a suggested token and enabling unique (timestamp based) tokens per user "session"

### Patch Changes

- 4b7434e: Upgrading to `@jupyterlite/pyodide-*` 0.4.2, updating all `@jupyter*` deps to latest

## 1.0.4

### Patch Changes

- a9a06ab: Updated `pyodide-kernel` for Juptyerlite to get latest stubbed `widgetsnbextension`

## 1.0.3

### Patch Changes

- 404be08: Updated `@jupyterlite/pyodide-kernel` and other `@jupyterlite` deps to `0.1.0`

## 1.0.2

### Patch Changes

- 0a62e50: Upgraded default `pyodide-kernel` to `0.0.8`

## 1.0.1

### Patch Changes

- Improved all demos and setup autodeploy for the simple demo
