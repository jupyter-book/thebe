---
'thebe-react': patch
---

Updated ThebeCoreProvider to provide a `load` option to child components. This allows the providers to be nested at high level in a render tree, and in SSR scenarios outside of a ClientOnly boundary. Library load can them be triggered be calling the load function from any child.
