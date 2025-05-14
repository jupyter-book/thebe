# Changelog

## 0.8.3 - To be confirmed

### Deprecations

- `thebe` has been added as an alias for `thebelab` and all css classes beginning with `thebelab-` duplicated as `thebe-`. The `thebelab` global object, exposed functions and user code reliant on css classes `thebelab-*`, will continue to work and any DOM elements created during operation will be decorated with `thebelab-` classes as expected, until removed in version 0.9.0.
  [#230](https://github.com/jupyter-book/thebe/issues/230)

## 0.8.2 - 2021-10-26

### Fixed

- Fixed broken distribution on `npm`/`unpkg.com` for last release.
  [#509](https://github.com/jupyter-book/thebe/issues/509)

## 0.8.1 - 2021-10-25

### Fixed

- Fixed import of jupyterlab css which was clobbering on page css in downstream usage.
  [#464](https://github.com/jupyter-book/thebe/issues/464)

### Added

- Added a built in status indicator and activate button that can be enabled via configuration options.
  [#470](https://github.com/jupyter-book/thebe/issues/470)

### Improved

- Latest version of Thebe is built and used in the documentation and in local development builds.
  [#285](https://github.com/jupyter-book/thebe/issues/285)
- Improved and updated examples in the documentation
- `yarn install` no longer builds the library automatically, `yarn build` or `yarn build:prod` should be called explicitly.

## 0.8.0 - 2021-08-16

### Added

- Added a busy indicator to provide feedback about computation.
  [#424](https://github.com/jupyter-book/thebe/pull/424)
- Added convenience commands for testing with local kernels.
  [#425](https://github.com/jupyter-book/thebe/pull/425)

### Documented

- Added a pythreejs example.
  [#262](https://github.com/jupyter-book/thebe/pull/262)
- Added an ipywidgets example.
  [#418](https://github.com/jupyter-book/thebe/pull/418)

### Improved

- Switched to the jupyterlab manager to control output display, fixes issues
  with ipywidgets. [#418](https://github.com/jupyter-book/thebe/pull/418)
- Switched package managers from npm to yarn.
  [#428](https://github.com/jupyter-book/thebe/pull/428)

## 0.7.1 - 2021-04-09

### Fixed

- Pressing "Restart and Run All" now starts a kernel if none has been started
  already. [#345](https://github.com/jupyter-book/thebe/pull/345)
- Fixed kernel communication connection in ThebeManager.
  [#330](https://github.com/jupyter-book/thebe/pull/330)

## 0.6.0 - 2020-12-23

### Added

- New versions of thebe (>=0.5.1) should be loaded from
  https://unpkg.com/thebe@latest/lib/index.js instead of
  https://unpkg.com/thebelab@latest/lib/index.js
- End to end integration tests using Jest [#282](https://github.com/jupyter-book/thebe/pull/282), [#297](https://github.com/jupyter-book/thebe/pull/297)
- Read-only option for code blocks [#274](https://github.com/jupyter-book/thebe/pull/274)
- Persistence of Binder sessions across pages [#266](https://github.com/jupyter-book/thebe/pull/266)
- Restart and run all buttons [#270](https://github.com/jupyter-book/thebe/pull/270)
- Show an error message when the kernel is dead [#279](https://github.com/jupyter-book/thebe/pull/279)
- GitHub workflows to publish on NPM [#236](https://github.com/jupyter-book/thebe/pull/236)
- Load CodeMirror Themes [#194](https://github.com/jupyter-book/thebe/pull/194)
- Add development page for testing [#193](https://github.com/jupyter-book/thebe/pull/193)
- Add CSS with Jupyter ANSI colors [#176](https://github.com/jupyter-book/thebe/pull/176)

### Improved

- Adds more user options for persisting saved Binder sessions [#280](https://github.com/jupyter-book/thebe/pull/280)
- Updated the development HTML page for more test code cells and configs [#267](https://github.com/jupyter-book/thebe/pull/267)
- Fail linter on diffs [#258](https://github.com/jupyter-book/thebe/pull/258)
- Restores full jQuery to ensure compatiblity with jQuery UI [#189](https://github.com/jupyter-book/thebe/pull/189)
- Changes to test layout (when Thebe was still using Karma, as of writing, Thebe now uses Jest) [#257](https://github.com/jupyter-book/thebe/pull/257)
- Update Thebe to use the latest JupyterLab 3.0 APIs [#268](https://github.com/jupyter-book/thebe/pull/268)

### Fixed

- Fix Python mode in CodeMirror configuration [#172](https://github.com/jupyter-book/thebe/pull/172)
- Use merged options in CodeMirror configuration [#171](https://github.com/jupyter-book/thebe/pull/171)

### Documented

- Moved example pages into their own subdirectory [#281](https://github.com/jupyter-book/thebe/pull/281)
- Added example pages for using Thebe with other Jupyter widgets
  - Bqplot [#295](https://github.com/jupyter-book/thebe/pull/295), [#301](https://github.com/jupyter-book/thebe/pull/301)
  - Ipycytoscape [#283](https://github.com/jupyter-book/thebe/pull/283)
  - Plotly [#269](https://github.com/jupyter-book/thebe/pull/269)
  - Ipyleaflet [#265](https://github.com/jupyter-book/thebe/pull/265)
  - ipympl [#294](https://github.com/jupyter-book/thebe/pull/294)
- Documented read-only code-blocks [#287](https://github.com/jupyter-book/thebe/pull/287), [#286](https://github.com/jupyter-book/thebe/pull/286)
- Updated repository links and other references due to migrating the repository to [executablebooks](https://github.com/executablebooks) [#275](https://github.com/jupyter-book/thebe/pull/275), [#273](https://github.com/jupyter-book/thebe/pull/273), [#232](https://github.com/jupyter-book/thebe/pull/232)
- Contribution information
  - Instructions on how to build the docs [#260](https://github.com/jupyter-book/thebe/pull/260)
  - Commits, architecture, etc. [#248](https://github.com/jupyter-book/thebe/pull/248)
  - Releases [#236](https://github.com/jupyter-book/thebe/pull/236)
  - Contributing guide [#232](https://github.com/jupyter-book/thebe/pull/232)
- Event hooks [#222](https://github.com/jupyter-book/thebe/pull/222)
- Security concerns on XXS (Cross-Site Scripting) [#263](https://github.com/jupyter-book/thebe/pull/264)
- Use JSDoc to build JS API docs [#248](https://github.com/jupyter-book/thebe/pull/248)
- Configuration information, getting started, CircleCI jobs, Sphinx book theme [#218](https://github.com/jupyter-book/thebe/pull/218)
- Clarify kernelName in README [#180](https://github.com/jupyter-book/thebe/pull/180)
- CodeMirror configuration page [#174](https://github.com/jupyter-book/thebe/pull/174/files)
- Use the latest Thebe version [#173](https://github.com/jupyter-book/thebe/pull/173)
