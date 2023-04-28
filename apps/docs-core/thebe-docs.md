# Plceholder for thebe related docs

## Codemirror setup

The following is available in the thebe options object:

```typescript
{
  codeMirrorConfig?: {
    theme?: string;         (default: 'default')
    readOnly?: boolean;     (default: false)
    mode?: string;          (default: 'python')
    autoRefresh?: boolean;  (default: true)
    lineNumbers?: boolean;  (default: true)
    styleActiveLine?: boolean;  (default: true)
    matchBrackets?: boolean;  (default: true)
  };
}
```

`mode` and `readOnly` will also be read from code cells on the page, and the values provided on those cells will **override** those set in the options object

### modes

thebe is preloaded with the python mode and will try to load additional modes on the setting. Should this fail or to preload a mode on your page, load directly to a script tag using CDN e.g. for rust here: https://unpkg.com/browse/codemirror@5.61.1/mode/rust/rust.js

### preloaded themes

Only a few themes are bundled with thebe:

- default
- abcdef
- darcula
- idea

To load additional themes, make the css available on you page and set the `theme` field to the correct theme name in the `CodeMirror` options object.

Find the [full list of themes](https://codemirror.net/5/demo/theme.html) here and CDN based resources for loading them for example, for twilight here: https://unpkg.com/codemirror@5.61.1/theme/twilight.css
