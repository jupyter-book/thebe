====================
IPyCytoscape Example
====================

Thebe can display output from ipycytoscape_, which could visualize graphs using Cytoscape.js_.

.. _ipycytoscape: https://github.com/QuantStack/ipycytoscape 
.. _Cytoscape.js: https://js.cytoscape.org/ 

Setup
=====

Be sure to load require.js before any of your thebe activation code so that the
Cytoscape visualizations can function:

.. code-block:: html

   <script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.4/require.min.js"></script>


Configure thebe and load it:

.. code-block:: html

   <script type="text/x-thebe-config">
     {
       requestKernel: true,
       binderOptions: {
         repo: "QuantStack/ipycytoscape",
         ref: "1.0.4",
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

Using Cytoscape, you can display a graph with several nodes. This example_ is
from the ipycytoscape repository and is licensed under the BSD 3-Clause
License.

.._example: https://github.com/QuantStack/ipycytoscape/blob/master/examples/Text%20on%20node.ipynb

Press the "Activate" button below to connect to a Jupyter server:

.. raw:: html

   <script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.4/require.min.js"></script>

   <button id="activateButton" style="width: 120px; height: 40px; font-size: 1.5em;">
     Activate
   </button>
   <script>
   var bootstrapThebe = function() {
       thebelab.bootstrap();
   }
   document.querySelector("#activateButton").addEventListener('click', bootstrapThebe)
   </script>

.. raw:: html

   <script type="text/x-thebe-config">
     {
       requestKernel: true,
       binderOptions: {
         repo: "QuantStack/ipycytoscape",
         ref: "1.0.4",
         repoProvider: "github",
       },
     }
   </script>
   <script src="https://unpkg.com/thebe@latest/lib/index.js"></script>


.. raw:: html

   <pre data-executable="true" data-language="python">
   import ipycytoscape
   data = {
     'nodes': [
         { 'data': { 'id': 'desktop', 'name': 'Cytoscape', 'href': 'http://cytoscape.org' } },
         { 'data': { 'id': 'a', 'name': 'Grid', 'href': 'http://cytoscape.org' } },
         { 'data': { 'id': 'b', 'name': 'Cola', 'href': 'http://cytoscape.org' } },
         { 'data': { 'id': 'c', 'name': 'Popper', 'href': 'http://cytoscape.org' } },
         { 'data': { 'id': 'js', 'name': 'Cytoscape.js', 'href': 'http://js.cytoscape.org' } }
     ],
     'edges': [
         {'data': { 'source': 'desktop', 'target': 'js' }},
         {'data': { 'source': 'a', 'target': 'b' }},
         {'data': { 'source': 'a', 'target': 'c' }},
         {'data': { 'source': 'b', 'target': 'c' }},
         {'data': { 'source': 'js', 'target': 'b' }}
     ]
   }
   cytoscapeobj = ipycytoscape.CytoscapeWidget()
   cytoscapeobj.graph.add_graph_from_json(data)
   cytoscapeobj.set_style([{
     'selector': 'node',
     'css': {
         'content': 'data(name)',
         'text-valign': 'center',
         'color': 'white',
         'text-outline-width': 2,
         'text-outline-color': 'green',
         'background-color': 'green'
     }
     },
     {
     'selector': ':selected',
     'css': {
         'background-color': 'black',
         'line-color': 'black',
         'target-arrow-color': 'black',
         'source-arrow-color': 'black',
         'text-outline-color': 'black'
     }}
     ])
   cytoscapeobj
   </pre>
