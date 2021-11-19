.. _minimal_example:

=================
A minimal example
=================

This page illustrates a minimal setup to get Thebe running, using
`mybinder <http://mybinder.org/>`_ as a
kernel (i.e. computation backend) provider. This guide will go step-by-step
in loading Thebe and activating it so that your code cells become active.

Loading and configuring Thebe
=============================

In order to use Thebe, we must first set its configuration. This must be
done **before** Thebe is loaded from a CDN or a local script.

There are many ways you can activate Thebe. In this case, we'll add a
button to our page, using the built in UI widgets, this will **bootstrap**
Thebe once clicked. We'll do this with a little bit of Javascript.

Here's a sample configuration for Thebe

.. raw:: html

   <!-- Configure and load Thebe !-->
   <script type="text/x-thebe-config">
     {
       requestKernel: true,
       mountActivateWidget: true,
       mountStatusWidget: true,
       binderOptions: {
         repo: "binder-examples/requirements",
       },
     }
   </script>

.. code:: html

   <!-- Configure and load Thebe !-->
   <script type="text/x-thebe-config">
     {
         requestKernel: true,
         mountActivateWidget: true,
         mountStatusWidget: true,
         binderOptions: {
         repo: "binder-examples/requirements",
         },
     }
   </script>

In this case, ``requestKernel: true`` asks Thebe to request a kernel
immediately upon being loaded, and ``binderOptions`` provides the repository
that Binder will use to give us a Kernel.

Next, we'll load Thebe from a CDN:

.. raw:: html

   <script src="../_static/lib/index.js"></script>

.. code:: html

   <script src="https://unpkg.com/thebe@latest/lib/index.js"></script>


Adding a Thebe UI widgets to your page
======================================

When the configuration options are set to mount the activate button and status field, you will need
to include mount points in your page which will be used to place the widgets.

We can do this by adding the following `div` elements:

.. code:: html

   <div class="thebe-activate"></div>
   <div class="thebe-status"></div>

The following UI widgets are then mounted on the page.

.. raw:: html

   <style>
      .thebe-activate, .thebe-status {
         margin-bottom: 10px;
      }
   </style>
   <div class="thebe-activate"></div>
   <div class="thebe-status"></div>

These widgets are minimally styled, but can be modified by overrriding or extending the following classes; `thebe-status`, `thebe-status-mounted`, `thebe-status-stub`, `thebe-status-field`, `thebe-status-message`, `thebe-status-building`, `thebe-status-launching`, `thebe-status-starting`, `thebe-status-ready`, `thebe-status-failed`, `thebe-status-busy`.

Adding code cells
=================

Finally, we'll add code cells that Thebe can activate. By default, Thebe
will look for any HTML elements with ``data-executable="true"``. We'll also add
a ``data-language="python"`` attribute to enable syntax highlighting with CodeMirror.


.. raw:: html

   <pre data-executable="true" data-language="python">print("Hello!")</pre>

Here's the code that created the cell above:

.. code:: html

   <pre data-executable="true" data-language="python">print("Hello!")</pre>

Press the Thebe button above to activate this cell, then press the "Run" button,
or "Shift-Enter" to execute this cell.

.. note::

   When Thebe is activated in this example, it must first ask Binder for a kernel.
   This may take several seconds.

Now let's try another cell that generates a Matplotlib plot. Because we've
configured Thebe to use Binder with an environment that has Numpy and
Matplotlib, this works as expected. Try modifying the cell contents and
re-running!

This is another cell, with plotting. Shift-Enter again!

.. raw:: html

   <pre data-executable="true" data-language="python">
   %matplotlib inline
   import numpy as np
   import matplotlib.pyplot as plt
   x = np.linspace(0,10)
   plt.plot(x, np.sin(x))
   plt.plot(x, np.cos(x))
   </pre>

Here's the HTML for the cell above:

.. code:: html

   <pre data-executable="true" data-language="python">
   %matplotlib inline
   import numpy as np
   import matplotlib.pyplot as plt
   x = np.linspace(0,10)
   plt.plot(x, np.sin(x))
   plt.plot(x, np.cos(x))
   </pre>

And here's an example where the contents cannot be modified once instantiated:

.. raw:: html

   <pre data-executable="true" data-language="python" data-readonly>print("My contents cannot be changed!")</pre>

For more examples, check out :ref:`more_examples`.
