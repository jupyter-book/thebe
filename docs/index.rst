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
       binderOptions: {
         repo: "binder-examples/requirements",
       },
     }
   </script>
   <script src="_static/thebe/index.js"></script>
   
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

   <button id="activateButton" style="width: 120px; height: 40px; font-size: 1.5em;">Activate</button>
   <script>
   var bootstrapThebe = function() {
       thebelab.bootstrap();
   }

   document.querySelector("#activateButton").addEventListener('click', bootstrapThebe)
   </script>

You can press "run" in order to run the contents of the cell and display the
result (be patient, it will take a few moments for Binder to start the kernel).


Getting Started
===============

To get started, check out :doc:`start`.


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
   examples/bqplot_example
   examples/ipyleaflet_example
   examples/plotly-example
   examples/ipycytoscape_example

* `Making use of Jupyter interactive widgets <_static/widgets.html>`_
* `Status field and styling <_static/status_field.html>`_
* `Activate/Status button <_static/activate_button.html>`_
* `Alternative computational environments; code cells with prompts and outputs <_static/prompts.html>`_
* `Using a local Jupyter server as kernel provider <_static/local.html>`_
* `Setting predefined output for cells <_static/demo-preview.html>`_
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

