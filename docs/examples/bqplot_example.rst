==================
Bqplot Example
==================

Thebe can display output from bqplot_ Jupyter widgets, a 2D plotting library. This example_ is repurposed from the
bqplot documentation and is licensed under the Apache License 2.0 License. Note that this example does not 
fix the pan/zoom feature on plots.

.. _bqplot: https://github.com/bqplot/bqplot

.. _example: https://github.com/bqplot/bqplot/blob/master/examples/Introduction.ipynb

Setup
=====

Be sure to load require.min.js and Font Awesome 4 before any of your thebe activation code, it is required for the bqplot widget and navigation icons to work:

.. code-block:: html

   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css" integrity="sha512-5A8nwdMOWrSz20fDsjczgUidUBR8liPYU+WymTZP1lmY9G6Oc7HlZv156XqnsgNUzTyMefFTcsFH/tnJE/+xBg==" crossorigin="anonymous" />
   <script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.4/require.min.js"></script>

Configure thebe and load it:

.. code-block:: html

   <script type="text/x-thebe-config">
     {
       requestKernel: true,
       binderOptions: {
         repo: "bqplot/bqplot",
         ref: "0.12.18",
         binderUrl: "https://mybinder.org",
         repoProvider: "github",
       },
     }
   </script>
   <script src="https://unpkg.com/thebe@latest/lib/index.js"></script>

Create a button to activate thebe:

.. code-block:: html

   <button id="activateButton" style="width: 120px; height: 40px; font-size: 1.5em;">
     Activate
   </button>
   <script>
   var bootstrapThebe = function() {
       thebelab.bootstrap();
   }
   document.querySelector("#activateButton").addEventListener('click', bootstrapThebe)
   </script>

Now add code cells between these HTML tags:

.. code-block:: html

   <pre data-executable="true" data-language="python"></pre>

Example
=======

.. raw:: html

   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css" integrity="sha512-5A8nwdMOWrSz20fDsjczgUidUBR8liPYU+WymTZP1lmY9G6Oc7HlZv156XqnsgNUzTyMefFTcsFH/tnJE/+xBg==" crossorigin="anonymous" />
   <script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.4/require.min.js"></script>
   <script type="text/x-thebe-config">
     {
       requestKernel: true,
       binderOptions: {
         repo: "bqplot/bqplot",
         ref: "0.12.18",
         binderUrl: "https://mybinder.org",
         repoProvider: "github",
       },
     }
   </script>
   <script src="https://unpkg.com/thebe@latest/lib/index.js"></script>

Press the "Activate" button below to connect to a Jupyter server:

.. raw:: html

   <button id="activateButton" style="width: 120px; height: 40px; font-size: 1.5em;">
     Activate
   </button>
   <script>
   var bootstrapThebe = function() {
       thebelab.bootstrap();
   }
   document.querySelector("#activateButton").addEventListener('click', bootstrapThebe)
   </script>

Here we will display a basic 2D plot:

.. raw:: html

   <pre data-executable="true" data-language="python">
   import numpy as np
   from bqplot import pyplot as plt
   
   size = 100
   np.random.seed(0)
   x_data = np.arange(size)
   y_data = np.cumsum(np.random.randn(size)  * 100.0)
   
   plt.figure(title='My First Plot')
   plt.plot(x_data, y_data)
   plt.show()
   </pre>
