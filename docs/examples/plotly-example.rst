==============
Plotly Example
==============

Thebe can display output from plotly.py_.

.. _plotly.py: https://github.com/plotly/plotly.py

Setup
=====

Be sure to load require.js before any of your thebe activation code so that the
Jupyter widgets can function:

.. code-block:: html

   <script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.4/require.min.js"></script>

Configure thebe and load it:

.. code-block:: html

   <script type="text/x-thebe-config">
     {
       requestKernel: true,
       binderOptions: {
         repo: "plotly/plotly.py",
         ref: "doc-prod",
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

   <script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.4/require.min.js"></script>
   <script type="text/x-thebe-config">
     {
       requestKernel: true,
       binderOptions: {
         repo: "plotly/plotly.py",
         ref: "doc-prod",
         repoProvider: "github",
       },
     }
   </script>
   <script src="../_static/lib/index.js"></script>

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

Here is a distribution plot example from https://plotly.com/python/distplot/
(MIT License):

.. raw:: html

   <pre data-executable="true" data-language="python">
   import plotly.express as px
   df = px.data.tips()
   fig = px.histogram(df, x="total_bill", y="tip", color="sex", marginal="rug",
                      hover_data=df.columns)
   fig.show()
   </pre>
