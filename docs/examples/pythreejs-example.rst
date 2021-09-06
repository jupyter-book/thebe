=================
Pythreejs Example
=================

Thebe can display output from pythreejs_. The `examples <https://pythreejs.readthedocs.io/en/stable/examples/>`_ are taken from the
pythreejs documentation and are licensed under the BSD 3-Clause License.

.. _pythreejs: https://github.com/jupyter-widgets/pythreejs

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
         repo: "jupyter-widgets/pythreejs",
         ref: "2.2.1",
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

Examples
========

.. raw:: html

   <script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.4/require.min.js"></script>
   <script type="text/x-thebe-config">
     {
       requestKernel: true,
       binderOptions: {
         repo: "jupyter-widgets/pythreejs",
         ref: "2.2.1",
         binderUrl: "https://mybinder.org",
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

Primitive shapes can be displayed:

.. raw:: html

   <pre data-executable="true" data-language="python">
   from pythreejs import BoxGeometry
   BoxGeometry(
       width=5,
       height=10,
       depth=15,
       widthSegments=5,
       heightSegments=10,
       depthSegments=15)
   </pre>

More complex shapes can be constructed and viewed:

.. raw:: html

   <pre data-executable="true" data-language="python">
   from IPython.display import display
   from pythreejs import (ParametricGeometry, Mesh, PerspectiveCamera, Scene,
                          MeshLambertMaterial, DirectionalLight, AmbientLight,
                          Renderer, OrbitControls, PerspectiveCamera)

   f = """
   function f(origu, origv, out) {
       // scale u and v to the ranges I want: [0, 2*pi]
       var u = 2*Math.PI*origu;
       var v = 2*Math.PI*origv;

       var x = Math.sin(u);
       var y = Math.cos(v);
       var z = Math.cos(u+v);

       out.set(x,y,z);
   }
   """
   surf_g = ParametricGeometry(func=f, slices=16, stacks=16)

   surf = Mesh(geometry=surf_g, material=MeshLambertMaterial(color='green', side='FrontSide'))
   surf2 = Mesh(geometry=surf_g, material=MeshLambertMaterial(color='yellow', side='BackSide'))
   c = PerspectiveCamera(position=[5, 5, 3], up=[0, 0, 1],
                         children=[DirectionalLight(color='white',
                                                    position=[3, 5, 1],
                                                    intensity=0.6)])
   scene = Scene(children=[surf, surf2, c, AmbientLight(intensity=0.5)])
   renderer = Renderer(camera=c, scene=scene, controls=[OrbitControls(controlling=c)], width=400, height=400)
   display(renderer)
   </pre>
