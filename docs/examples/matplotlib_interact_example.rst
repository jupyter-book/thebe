========================================
Matplotlib + Ipywidgets Interact Example
========================================

Thebe can display interactive plots using matplotlib and ipywidget's interact.

Setup
=====

Be sure to load require.min.js and Font Awesome 4 before any of your thebe activation code, it is required for the widget and its icons to work:

.. code-block:: html

   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css" integrity="sha512-5A8nwdMOWrSz20fDsjczgUidUBR8liPYU+WymTZP1lmY9G6Oc7HlZv156XqnsgNUzTyMefFTcsFH/tnJE/+xBg==" crossorigin="anonymous" />
   <script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.4/require.min.js"></script>

Configure thebe and load it:

.. code-block:: html

   <script type="text/x-thebe-config">
     {
       requestKernel: true,
       binderOptions: {
         repo: "matplotlib/ipympl",
         ref: "0.6.1",
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
         repo: "matplotlib/ipympl",
         ref: "0.6.1",
         repoProvider: "github",
       },
     }
   </script>
   <script src="_static/lib/index.js"></script>

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

Here is a simple interactive sine plot example:

.. raw:: html

   <pre data-executable="true" data-language="python">
   %matplotlib widget
   import ipywidgets as widgets
   import matplotlib.pyplot as plt
   import numpy as np

   x = np.linspace(0,10)

   def sine_func(x, w, amp):
       return amp*np.sin(w*x)

   @widgets.interact(w=(0, 4, 0.25), amp=(0, 4, .1))
   def update(w = 1, amp = 1):
       plt.clf()
       plt.ylim(-4, 4)
       plt.plot(x, sine_func(x, w, amp))
   </pre>
