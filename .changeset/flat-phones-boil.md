---
'thebe-core': patch
---

The refresh function has been removed and the beahviour of render and reset tweaked to remove the hideWidgets option. This means that `stripWidgets` is no longer called and the consumer must implement any functionality to manipulate MimeBundles that contain `ipywidgets`, if they want to acheive better default rendering. `stripWidgets` and the defualt `placeholder` generation functions have been exposed on the `thebe-core` apip to make this easier.
