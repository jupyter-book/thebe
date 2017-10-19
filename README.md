# ThebeLab

Experiment rebuilding [Thebe](https://github.com/oreillymedia/thebe) on JupyterLab.

See the [examples directory](examples/) for examples, and browse the
[live output](https://minrk.github.io/thebelab/).

## Configuring ThebeLab

You can configure thebelab with a script tag.
The script should have `type=text/x-thebe-config`
and populate a `thebeConfig` object.

```html
<script type="text/x-thebe-config">
thebeConfig = {
    binderOptions: {
        repo: "minrk/ligo-binder",
        ref: "master",
    }
}
</script>
```

A full config script with defaults:

```html
<script type="text/x-thebe-config">
thebeConfig = {
    cellSelector: "[data-executable]",
    binderOptions: {
        repo: "minrk/ligo-binder",
        ref: "master",
        binderUrl: "https://beta.mybinder.org",
    },
    kernelOptions: {
        name: "python3",
    },
}
</script>
```
