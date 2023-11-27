---
'demo-react': patch
'thebe-core': patch
---

Fixed `server.listRunningSession` to use the new iterator returned by `sessionManager.running()` properly. This fixed an unhandle exception that was breaking `myst-theme` based sites.
