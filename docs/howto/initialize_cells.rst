===============================
Running cells when Thebe starts
===============================

Sometimes it is helpful to automatically run some cells when Thebe starts.
For example, if you'd like to pre-define some variables or import a function
that you'll use later on. This lets you focus the code that users read on the
ideas that you want to convey.

Thebe can be controlled via Javascript after it has been initialized. Below
are two ways that you can configure your Javascript to run code under-the-hood.

Running cells when Thebe is initialized
=======================================

A straightforward way to run code is to simply *simulate a click* on the buttons that
are created when you launch Thebe. By selecting the Thebe button and calling
the ``click()`` method, the code in that cell will be run (and outputs will show)
once the Thebe kernel is ready.

Here's a code sample that selects all cells with a tag called ``thebelab-init`` and
simulates a click on the button.

.. code-block:: javascript

   thebelab.events.on("request-kernel")(() => {
       // Find any cells with an initialization tag and ask Thebe to run them when ready
       var thebeInitCells = document.querySelectorAll('.thebelab-init');
       thebeInitCells.forEach((cell) => {
           console.log("Initializing Thebe with cell: " + cell.id);
           const initButton = cell.querySelector('.thebelab-run-button');
           initButton.click();
       });
   });

Running custom code with Thebe
==============================

In addition, you can run your own custom code from the Thebe object with
Javascript using the ``requestExecute`` method. Below is a code snippet that
uses the same event trigger, but in this case runs some custom code against the kernel
once it is ready.

.. code-block:: javascript

   thebelab.events.on("request-kernel")((kernel) => {
       // Find any cells with an initialization tag and ask Thebe to run them when ready
       kernel.requestExecute({code: "import numpy"})
   });

In both of the cases above, you'll likely need to customize the Javascript calls depending
on how your code is structured and what behavior you'd like when users land on a page.
