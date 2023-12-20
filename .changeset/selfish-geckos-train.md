---
'thebe-core': patch
---

Repo providers now also return the storage key for saved sessions so that they can make informed decisions about how to cache the session details based on the url/repo-spec.
