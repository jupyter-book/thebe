========
ThebeLab
========

`Thebe Lab <https://github.com/minrk/thebelab>`_ is an experiment attempting
to rebuild `Thebe <https://github.com/oreillymedia/thebe>`_ with javascript
APIs provided by `JupyterLab <https://github.com/jupyterlab/jupyterlab>`_.
This should make Thebe a smaller,
more sustainable project.

.. toctree::
   :caption: Table of Contents

   config_reference
   minimal_example


How ThebeLab works
==================

Starting ThebeLab involves the following steps:

1. Loading the thebelab javascript, typically `from a CDN <https://unpkg.com/thebelab>`_
2. Fetching the ThebeLab configuration from the page header
3. Bootstrapping ThebeLab:
   * Re rendering the code cells to make them live cells. Optionally, the rendering can handle cells that contain a mixture of inputs and ouputs distinguished by prompts (see the stripPrompts option);
   * (optional) Requesting a notebook server from Binder;
   * (optional) Requesting a Jupyter kernel from the Jupyter server.
4. Bootstrap Thebelab by calling ``thebelab.bootstrap()``.

   If ``bootstrap: true`` is in the Thebelab configuration (see below), this will be triggered automatically upon page load.


Getting Started
===============

To get started, we check out :ref:`minimal_example`.


.. _more_examples:

More examples
=============

For more examples showing how to configure, use, and activate Thebelab, see
the list below. We recommend browsing the raw HTML of each one in order to
see how Thebelab is used.

* `Making use of Jupyter interactive widgets <examples/widgets.html>`_
* `Status field and styling <examples/status_field.html>`_
* `Activate/Status button <examples/activate_button.html>`_
* `Alternative computational environments; code cells with prompts and outputs <examples/prompts.html>`_
* `Using a local Jupyter server as kernel provider <examples/local.html>`_
* `ThebeLab in use for SageMath documentation <http://sage-package.readthedocs.io/en/latest/sage_package/sphinx-demo.html>`_
  (`about <http://sage-package.readthedocs.io/en/latest/sage_package/thebe.html>`_)
  Showcases a fancy activate button, and fetching thebe and running computations locally when possible. Relevant files:
  
  * `thebe.html <https://github.com/sagemath/sage-package/blob/master/sage_package/themes/sage/thebe.html>`_
  * `thebe_status_field.js <https://github.com/sagemath/sage-package/tree/master/sage_package/themes/sage/static/thebe_status_field.js>`_
  * `thebe_status_field.js <https://github.com/sagemath/sage-package/tree/master/sage_package/themes/sage/static/thebe_status_field.js>`_
* `ThebeLab in use for GAP documentation <https://sebasguts.github.io/thebelab_test_gap/chap42>`_


Acknowledgements
================

``thebelab`` was originally developed as a part of `OpenDreamKit <http://opendreamkit.org/>`_ -
Horizon 2020 European Research Infrastructure project (676541).