# thebe-core

## 0.1.5

### Patch Changes

- 3bd3195: Changed DOM attachement and passive rendering behaviour for integration with the [myst-theme](https://github.com/executablebooks/myst-theme/pull/21)

## 0.1.4

### Patch Changes

- 7279d5b: fixed interact based ipywidgets and ipympl functionality, now aligning with behaviour seen in voila and jputyerlab. See [issue 608](https://github.com/executablebooks/thebe/issues/608)

## 0.1.3

### Patch Changes

- Removed shadow rendering via a second OutputArea. This was not helpful and causing issues with some `ipywidgets` rendering.