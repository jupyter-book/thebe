---
'demo-react': patch
'thebe-react': patch
---

Changed core library loading strategy to load bundled code directly to the page. This is implemented as a new provider for now, so the previous core provider can still be used.
