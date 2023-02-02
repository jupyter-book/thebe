# Security Considerations

Thebe allows users to run **arbitrary** code both in Python and, potentially, in Javascript.
This allows interactive figures, and custom outputs to be run in your documentation,
which is the benefit that Thebe brings! ✨

## Cross Site Scripting

However, this can also lead to
[Cross-Site Scripting](https://en.wikipedia.org/wiki/Cross-site_scripting>)
({abbr}`XSS (Cross-Site Scripting)`) attacks,
with the most likely case being an Self-{abbr}`XSS (Cross-Site Scripting)` attack.
This happens when someone executes code that they do not understand, or is malicious.

For example, the `%%html` and the `%%javascript` cell-magics in Jupyter can directly insert
script tags into your page. They can potentially modify the DOM, make API calls on the users behalf,
or run untrusted code.

We recommend that you run Thebe in a static environment (e.g. ReadTheDocs or similar)
that has no access to user credentials such as cookies or API keys.
