---
title: UI Components
venue: React
---

The `react-thebe` package does not ship any UI components (we didn't want to bundle css or tailwind here) although we have built a few components that you might want to reuse.

Those are included in the demo application (see [apps/demo-react](https://github.com/executablebooks/thebe/tree/main/apps/demo-react/src)) and you'll need to make a copy to use them in your own application.

ErrorTray
: Used to display out-of-band error messages from ThebeNotebook. As errors could occur in notebook cells that are not attached to you page, the `ErrorTray` will help you display those with the standard Jupyter formatting for errors and tracebacks.

JupyterOutputDecoration
: Can be used to a bounding box and Juptyer Logo to your jupyter output areas.
