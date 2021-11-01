=====
Thebe
=====

.. toctree::
   :hidden:
   :caption: General

   start
   configure
   security
   events
   ui
   config_reference
   howto/initialize_cells
   contribute
   api

`Thebe <https://github.com/executablebooks/thebe>`_ turns your static HTML pages
into interactive ones, powered by a kernel. It is the evolution of the
`original Thebe project <https://github.com/oreillymedia/thebe>`_ with javascript
APIs provided by `JupyterLab <https://github.com/jupyterlab/jupyterlab>`_.

For example, see the following code cell:

.. raw:: html


   <!-- Configure and load Thebe !-->
   <script type="text/x-thebe-config">
     {
       requestKernel: true,
       mountActivateWidget: true,
       binderOptions: {
         repo: "binder-examples/requirements",
       },
     }
   </script>

   <pre data-executable="true" data-language="python">
   %matplotlib inline
   import numpy as np
   import matplotlib.pyplot as plt
   plt.ion()
   fig, ax = plt.subplots()
   ax.scatter(*np.random.randn(2, 100), c=np.random.randn(100))
   ax.set(title="Wow, an interactive plot!")
   </pre>

It is static for now. You can activate Thebe by pressing the button below.
This will ask `mybinder.org <https://mybinder.org>`_ for a Python kernel, and
turn the code cell into an interactive one with outputs!

Try clicking the button. The cell will be come active!

.. raw:: html

   <div class="thebe-activate"></div>
   <script src="./_static/lib/index.js"></script>


You can press "run" in order to run the contents of the cell and display the
result (be patient, it will take a few moments for Binder to start the kernel).


Getting Started
===============

To get started, check out :doc:`start`.

.. DANGER::

  References to `thebelab` will be removed in version 0.9.0.

  As part of the library migration to an executable books project (`#230 <https://github.com/executablebooks/thebe/issues/230>`_), `thebe` has been added as an alias for `thebelab` and all css classes beginning with `thebelab-` duplicated as `thebe-`. The `thebelab` global object, exposed functions and user code reliant on css classes `thebelab-*`, will continue to work and any DOM elements created during operation will be decorated with `thebelab-` classes as expected, until removed in version 0.9.0.

  Please migrate existing code to use the new `thebe` object and `thebe-*` css classes.

.. _more_examples:

Examples
========

For more examples showing how to configure, use, and activate Thebe, see
the list below. We recommend browsing the raw HTML of each one in order to
see how Thebe is used.

.. toctree::
   :caption: Examples
   :maxdepth: 1

   examples/minimal_example
   examples/custom_activate_button
   examples/bqplot_example
   examples/ipyleaflet_example
   examples/ipympl_example
   examples/plotly-example
   examples/ipycytoscape_example
   examples/pythreejs-example
   examples/matplotlib_interact_example



HTML based examples
-------------------

* `Built in status field and styling <_static/html_examples/demo-status-widget.html>`_
* `Built in activate button <_static/html_examples/demo-activate-button.html>`_
* `Step-by-step demo <_static/html_examples/demo.html>`_
* `Making use of Jupyter interactive widgets <_static/html_examples/widgets.html>`_
* `Alternative computational environments; code cells with prompts and outputs <_static/html_examples/prompts.html>`_
* `Using a local Jupyter server as kernel provider <_static/html_examples/local.html>`_
* `Setting predefined output for cells <_static/html_examples/demo-preview.html>`_
* `Example of a custom launch button, loading from unpgk.com <_static/html_examples/demo-launch-button.html>`_

Source code for these examples can be found in `thebe/docs/_static/html_examples folder <https://github.com/executablebooks/thebe/tree/master/examples>`_

.. IMPORTANT::
  All examples build a _local_ version of `thebe` in order to show off the latest features.
  If you'd like to instead load the latest _release_ of Thebe, replace the `<script>` elements with the following:

  ```html
  <script type="text/javascript" src="https://unpkg.com/thebe@latest"></script>
  ```

.. IMPORTANT::

  Serve the HTML examples indepenently by running `yarn serve:examples` in your local development environment.

External Examples
-----------------

* `Thebe in use for SageMath documentation <http://sage-package.readthedocs.io/en/latest/sage_package/sphinx-demo.html>`_
  (`about <http://sage-package.readthedocs.io/en/latest/sage_package/thebe.html>`_)
  Showcases a fancy activate button, and fetching thebe and running computations locally when possible. Relevant files:

  * `thebe.html <https://github.com/sagemath/sage-package/blob/master/sage_package/themes/sage/thebe.html>`_
  * `thebe_status_field.js <https://github.com/sagemath/sage-package/tree/master/sage_package/themes/sage/static/thebe_status_field.js>`_
  * `thebe_status_field.js <https://github.com/sagemath/sage-package/tree/master/sage_package/themes/sage/static/thebe_status_field.js>`_
* `Thebe in use for GAP documentation <https://sebasguts.github.io/thebelab_test_gap/chap42>`_

Acknowledgements
================

``thebe`` was originally developed as a part of `OpenDreamKit <http://opendreamkit.org/>`_ -
Horizon 2020 European Research Infrastructure project (676541).
