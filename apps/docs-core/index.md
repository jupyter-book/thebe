# `thebe-core`

![Thebe[core] Logo](public/core_logo_wide.svg)

A typescript library for web based interactive computing with Jupyter backends.

```{tip}
TL;DR? see [Quick Start](1-quickstart.md).
```

## When to use `thebe-core`

If you are looking to make code on your website interavctive and executable quickly and easily you probably should be using [`thebe`](https://thebe.readthedocs.org).

Consider using `thebe-core` if:

- You are adding jupyter based computation into a typescript application
- You want Jupyter outputs on your webpage but you don't want to show all the code
- You want `thebe`-like behaviour, but want to ontrol the UI yourself
- You want more control over the servers and sessions you're connecting to

## Background

`thebe` is a javascript library enabling it's users to turn html tags on a webpage containing code into a executable cells that can be run interactively after establishing a connection with a Jupyter server.

`thebe` was originally written with `jquery` and aimed primarily at use in static webpages or websites using a minimal amount of javascript. `thebe` is part of the [Executable Books](https://executablebooks.org/en/latest/) project, and can be used in [Jupyter Books](https://jupyterbook.org/en/stable/intro.html) via the [`sphinx-thebe`](https://github.com/executablebooks/sphinx-thebe) plugin.

```{note}
`thebe-core` and an updated version of `thebe` are currently in the release candidate phase and documented on this website.

For documentation on the latest released version of `thebe` see the [Thebe Documentation on Read the Docs](https://thebe.readthedocs.io/en/latest/).
```

## Motivation

Prior to the `thebe-core` refactor, `thebe` was a small but powerful library for connecting any front end to a jupyter compute service.

However, it was `jquery` centric and focussed on making a web page containing static code elements "live" in an opinionated way -- with little scope for configuration or interaction with the resources once initialized and error handling.

The purpose of `thebe-core` is to isolate and expand the core functionality in `thebe` so that it could be used in different ways in a wider range of web contexts, from simple html pages through to web applications using frameworks like `React` or `Next.js`, whilst still being used internally in `thebe` providing a **like-for-like** behaviour there.

Refactoring the `thebe` like this, allows interesting enhancements to be made including connecting to a `juptyerlite` kernel and providing a simplified runtime interfave for interacting with Jupyter servers and sessions.

## Packages

The repository is contins a `monorepo` for building the following packages:

- `thebe-core` headless typescript connectivity to Jupyter backends
- `thebe` typescript version of the original `thebe` library, making webpages with code interactive
- `thebe-lite` a drop in component that provides the Jupyterlite server and pyolite kernel

See [architecture]() for more details on building these packages locally.
