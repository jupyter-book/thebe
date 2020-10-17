===============
Configure Thebe
===============

You control Thebe's behavior with a configuration block that is placed somewhere
in a page's HTML. The block has the following structure:

.. code-block:: html

   <script type="text/x-thebe-config">
      {
          a: collection
          of: key
          val: pairs
      }
   </script>

For example, the following configuration tells Thebe to use a BinderHub for its
sessions, as well as the repository to use with Binder:

.. code-block:: html

    <script type="text/x-thebe-config">
    {
        requestKernel: true,
        binderOptions: {
            repo: "binder-examples/requirements",
            ref: "master",
        },
    }
    </script>

When Thebe is launched on a page, this configuration is used to control
its behavior.

See the sections below for things that you can control with Thebe configuration.


Configure the kernel that will be launched
==========================================

To configure the kernel that Thebe requests when it launches, use the
following section in the Thebe configuration:

.. code-block:: javascript

   kernelOptions: {
     kernelName: "python3",
   },

When Thebe is launched, it will request a kernel of this name for the page.
Note that currently there can be only one kernel per page.

.. note::

   You must ensure that the value of ``kernelName`` exists in the environment that
   Thebe tries to launch. Some short-hands for certain languages (like ``python``)
   may also work.


Configure the working directory of the launched kernel
======================================================

In addition to choosing the kernel, you may also choose the *path* where the
kernel is launched. This will be relative to the root of the launched Jupyter server
(e.g., if using a BinderHub, this will be relative to the root of the repository).

To configure the path of the working directory, use the following configuration:

.. code-block:: javascript

   kernelOptions: {
     kernelName: "python3",
     path: "path/to/directory"
   }


Customize CodeMirror
====================

CodeMirror is the tool used to convert your code cells into editable cells.
It has a number of configuration options, such as theming and syntax highlighting.
You can edit all of these attributes in a cell with the following thebe configuration:

.. code:: html


   // Additional options to pass to CodeMirror instances
   codeMirrorConfig: {},

You can use any of `the available CodeMirror configurations <https://codemirror.net/doc/manual.html#config>`_.
For example, the following configuration changes the `CodeMirror theme <https://codemirror.net/theme/>`_:

.. code:: html

   codeMirrorConfig: {
       theme: "abcdef"
   }

The below code cell demonstrates this theme:

.. raw:: html

   <!-- Configure and load Thebe !-->
   <script type="text/x-thebe-config">
     {
       requestKernel: true,
       binderOptions: {
         repo: "binder-examples/requirements",
       },
       codeMirrorConfig: {
           theme: "abcdef"
       },
     }
   </script>
   <script src="https://unpkg.com/thebelab@latest/lib/index.js"></script>

   <pre data-executable="true" data-language="python">
   %matplotlib inline
   import numpy as np
   import matplotlib.pyplot as plt
   plt.ion()
   fig, ax = plt.subplots()
   ax.scatter(*np.random.randn(2, 100), c=np.random.randn(100))
   ax.set(title="Wow, an interactive plot!")
   </pre>

.. raw:: html

   <button id="activateButton" style="width: 120px; height: 40px; font-size: 1.5em;">Activate</button>
   <script>
   document.querySelector("#activateButton").addEventListener('click', thebelab.bootstrap)
   </script>

The above code should be styled according to the
`CodeMirror abcdef theme <https://codemirror.net/demo/theme.html#abcdef>`_.
