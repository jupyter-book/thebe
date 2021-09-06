==============
Ipympl Example
==============

Thebe can display output from ipympl_, which enables interactivity with matplotlib_.

.. _ipympl: https://github.com/matplotlib/ipympl
.. _matplotlib: https://matplotlib.org/

Setup
=====

Be sure to load require.js and Font Awesome 4 before any of your thebe activation code so that the
matplotlib widgets can function.

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

Now add  between these HTML tags:

.. code-block:: html

   <pre data-executable="true" data-language="python">
   %matplotlib widget

   </pre>

Examples
========

Using ipympl, you can display a variety of interactive plots.

Press the "Activate" button below to connect to a Jupyter server:

.. raw:: html

   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css" integrity="sha512-5A8nwdMOWrSz20fDsjczgUidUBR8liPYU+WymTZP1lmY9G6Oc7HlZv156XqnsgNUzTyMefFTcsFH/tnJE/+xBg==" crossorigin="anonymous" />
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
         repo: "matplotlib/ipympl",
         ref: "0.6.1",
         repoProvider: "github",
       },
     }
   </script>
   <script src="../_static/lib/index.js"></script>


2D plot
-------

.. raw:: html

   <pre data-executable="true" data-language="python">
   %matplotlib widget

   import matplotlib.pyplot as plt

   fig, ax = plt.subplots()
   fig.canvas.layout.width = '7in'
   fig.canvas.layout.height= '5in'
   ax.plot([1,2,3], [4,5,3])
   </pre>

3D plot
-------

.. raw:: html

  <pre data-executable="true" data-language="python">
  %matplotlib widget

  from mpl_toolkits.mplot3d import axes3d

  fig = plt.figure()
  ax = fig.add_subplot(111, projection='3d')
  X, Y, Z = axes3d.get_test_data(0.05)
  ax.plot_wireframe(X, Y, Z, rstride=10, cstride=10)
  plt.show()
   </pre>
