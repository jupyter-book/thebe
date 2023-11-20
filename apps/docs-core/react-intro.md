---
title: Getting Started
venue: React
---

## Installation

Install with `npm`:

```bash
    npm i thebe-react
```

## Overview

`thebe-react` is a react wrapper for `thebe-core`. Integrating `thebe-core` into a React based web application presents similar challenges to integrating any stateful 3rd party library that directly manipulates the DOM.

The best approach likely depends on how your application uses jupyter backed components and handles concerns like data (notebook) loading, navigation and dynamic rendering. The components in this library represent a good starting point, but you may need to build your own react components on `thebe-core` to achieve the behaviour you want.

The `thebe-react` library uses the React Context API and gives you a set of [Providers and hooks for Server and Session management](./react-providers.md) as well as [hooks for working with notebook and source code fragments](./react-notebooks.md). These work well in certain application setups and one such setup is the demo `create-react-app` application that you can find in [`apps/demo-react`](https://github.com/executablebooks/thebe/tree/main/apps/demo-react), this is an excellent point of reference.

It will also help to review the [`thebe-core`'s underlying API](./using-thebe-core) as these `thebe-core` runtime objects are exposed by the react providers and hooks.

```{attention} Help Wanted
So far `thebe-react` has been developed with visibility of only a few use cases, with an exploratory focus. In some places, the API is overloaded could be tighter.

Feedback, issues and PR's are very welcome.

```
