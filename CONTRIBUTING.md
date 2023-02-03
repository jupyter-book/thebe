# Contributing

# Local Development

`thebe` is composed of several packages setup within a `monorepo` enabling easy builds of all modules while making local changes across them. `thebe` uses `npm` as package manager and `turborepo` for builds and is written in `typescript`.

The main `thebe` packages are located in `packages/` and are:

- `thebe-core` - object based API for connecting to and executing against juptyer servers
- `thebe-lite` - a side-loaded extension to `thebe-core` enabling use of a `JupyterLiteServer`
- `thebe` - top-level library for use directly in html pages

Additional packages in `apps/` are:

- `demo-core` - a plain html/js using the `thebe-core` API
- `simple` - simplest possible html/js demo of using `thebe`
- `docs` - the `thebe` documentation build

## Setup

Install `node@16` and `npm@8` or above

## Building Thebe

The following commands should be issued from the repository root.

```
    npm install
    npm run build
```

This will install dependencies and run a `turborepo` build, building all packages.

To build the demos, run:

```
    npm run demo
```

Then start a demo using one of:

- `npm run start:simple`
- `npm run start:core`

## Changesets

We are now using the `@changesets/cli` to manage package versioning and publishing across the monorepo.

See [`@changesets/cli`](https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md) for more info.
