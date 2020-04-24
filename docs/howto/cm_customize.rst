======================
Customizing CodeMirror
======================

CodeMirror is the tool used to convert your code cells into editable cells.
It has a number of configuration options, such as theming and syntax highlighting.
You can edit all of these attributes in a cell with the following thebelab configuration:

.. code:: html

   <!-- Configure and load Thebe !-->
   <script type="text/x-thebe-config">
     {
        // Additional options to pass to CodeMirror instances
        codeMirrorConfig: {},
     }
   </script>

You can use any of `the available CodeMirror configurations <https://codemirror.net/doc/manual.html#config>`_.
For example, the following configuration changes the `CodeMirror theme <https://codemirror.net/theme/>`_:

.. code:: html

   <!-- Configure and load Thebe !-->
   <script type="text/x-thebe-config">
     {
       codeMirrorConfig: {
           theme: "abcdef"
       },
     }
   </script>

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