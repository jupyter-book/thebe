---
'thebe-react': patch
---

`ThebeSessionProvider` monitors status events for session/kernel shutdown messages and promotes this to an error if the corresponding session has shutdown.
