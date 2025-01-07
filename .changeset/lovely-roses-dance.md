---
'thebe-react': minor
'thebe-lite': minor
'demo-simple': minor
---

Clients no longer have to explicitly supply `litePluginSettings` unless they explicitly want to override them. This simplifies upgrades as clients should just bump packages, and the correct plugin settings for the bundled pyodide kernel will be applied by default.
