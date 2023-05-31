---
'demo-react': minor
'demo-core': minor
'thebe-react': minor
'thebe-core': minor
'thebe': patch
---

Made changes to the `thebe-core` APIs to make rendermime registries external, the caller now has to manage how registries are used across the other session nd notebook object. Updates the demos, `thebe` and `thebe-react` to reflect this base change. `thebe-react` now has a new provider making it easy to add a rendermine registry in the component tree.
