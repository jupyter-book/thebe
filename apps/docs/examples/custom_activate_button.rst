.. _custom_activate_button:

======================
Custom activate button
======================

There are many ways you can activate Thebe. In this case, we'll add a
custom button to our page (instead of using the built in UI widgets) and
configure it to **bootstrap** Thebe once it is clicked.

As before we setup Thebe with a basic configuration.

.. raw:: html

   <!-- Configure and load Thebe !-->
   <script type="text/x-thebe-config">
     {
       requestKernel: true,
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
       binderOptions: {
         repo: "binder-examples/requirements",
       },
     }
   </script>

Then we'll load Thebe from a CDN:

.. raw:: html

   <script src="../_static/lib/index.js"></script>

.. code:: html

   <script src="https://unpkg.com/thebe@latest/lib/index.js"></script>

Adding a custom button to activate Thebe
========================================

In order to add a custom button, we add a little bit of Javascript.

.. raw:: html

   <button id="activateButton" style="width: 150px; height: 75px; font-size: 1.5em; background-color: darkseagreen;">Activate</button>
   <script>
   var bootstrapThebe = function() {
       thebe.bootstrap();
   }

   document.querySelector("#activateButton").addEventListener('click', bootstrapThebe)
   </script>

Placing the button and adding the JavaScript to enable Thebe was done with the
code below:

.. code:: html

   <button id="activateButton"  style="width: 150px; height: 75px; font-size: 1.5em;">Activate</button>
   <script>
   var bootstrapThebe = function() {
       thebe.bootstrap();
   }

   document.querySelector("#activateButton").addEventListener('click', bootstrapThebe)
   </script>

When we press activate, Thebe will bootstrap following code cell should render with controls.
The Cell can be run and will execute when the kernel becomes available.

.. raw:: html

   <pre data-executable="true" data-language="python">print("Hello!")</pre>

Here's the code that created the cell above:

.. code:: html

   <pre data-executable="true" data-language="python">print("Hello!")</pre>


For more examples, check out :ref:`more_examples`.
