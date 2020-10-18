=================
Ipyleaflet Example
=================

Thebe can display output from ipyleaflet_ Jupyter widgets. This example_ is repurposed from the
ipyleaflet documentation and is licensed under the MIT License (MIT).

.. _ipyleaflet: https://github.com/jupyter-widgets/ipyleaflet

.. _example: https://github.com/jupyter-widgets/ipyleaflet/blob/master/examples/Heatmap.ipynb

Setup
=====

Be sure to load require.min.js before any of your thebe activation code, it is required for Jupyter widgets to work:

.. code-block:: html

   <script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.4/require.min.js"></script>

Configure thebe and load it:

.. code-block:: html

   <script type="text/x-thebe-config">
     {
       requestKernel: true,
       binderOptions: {
         repo: "jupyter-widgets/ipyleaflet",
         ref: "0.13.3",
         binderUrl: "https://mybinder.org",
         repoProvider: "github",
       },
     }
   </script>
   <script src="https://unpkg.com/thebelab@latest/lib/index.js"></script>

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

   <script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.4/require.min.js"></script>
   <script type="text/x-thebe-config">
     {
       requestKernel: true,
       binderOptions: {
         repo: "jupyter-widgets/ipyleaflet",
         ref: "0.13.3",
         binderUrl: "https://mybinder.org",
         repoProvider: "github",
       },
     }
   </script>
   <script src="https://unpkg.com/thebelab@latest/lib/index.js"></script>

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

Here we will display a basic leaflet map:

.. raw:: html

   <pre data-executable="true" data-language="python">
   from ipyleaflet import Map, Heatmap
   from random import uniform
   import time

   def create_random_data(length):
       "Return a list of some random lat/lon/value triples."
       return [[uniform(-80, 80),
            uniform(-180, 180),
            uniform(0, 1000)] for i in range(length)]

   m = Map(center=[0, 0], zoom=2)
   m
   </pre>

Now we add a heatmap:

.. raw:: html

   <pre data-executable="true" data-language="python">
   heat = Heatmap(locations=create_random_data(1000), radius=20, blur=10)
   m.add_layer(heat)
   </pre>

Finally, we add some animation to our heatmap:

.. raw:: html

   <pre data-executable="true" data-language="python">
   for i in range(100):
       heat.locations = create_random_data(1000)
       time.sleep(0.1)
   </pre>
