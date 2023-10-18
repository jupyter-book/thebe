---
title: History
---

`thebe` was originally written with `jquery` and aimed primarily at use in static webpages or websites using a minimal amount of javascript. `thebe` is part of the [Executable Books](https://executablebooks.org/en/latest/) project, and can be used in [Jupyter Books](https://jupyterbook.org/en/stable/intro.html) via the [`sphinx-thebe`](https://github.com/executablebooks/sphinx-thebe) plugin.

Prior to the `thebe-core` refactor, `thebe` was a small but powerful library for connecting any front end to a jupyter compute service.

However, it was `jquery` centric and focussed on making a web page containing static code elements "live" in an opinionated way -- with little scope for configuration or interaction with the resources once initialized and error handling.

The purpose of `thebe-core` is to isolate and expand the core functionality in `thebe` so that it could be used in different ways in a wider range of web contexts, from simple html pages through to web applications using frameworks like `React` or `Next.js`, whilst still being used internally in `thebe` providing a **like-for-like** behaviour there.

Refactoring the `thebe` like this, allows interesting enhancements to be made including connecting to a `jupyterlite` kernel and providing a simplified runtime interface for interacting with Jupyter servers and sessions.
