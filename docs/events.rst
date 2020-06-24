Event hooks in Thebelab
=======================

When Thebelab is launched (with ``thebelab.bootstrap``), it will emit a series
of events corresponding to the state of the launch process. You can plug into
these events to control the behavior on your page.

To do so, use the ``status`` event within Thebelab, like so:

.. code-block:: javascript

       thebelab.on("status", function (evt, data) {
        console.log("Status changed:", data.status, data.message);
    });

In the above code, the ``data`` object contains a collection of information about
Thebelab, and ``data.status`` will reflect the current state of Thebelab. This will
cycle between these states:

* ``building``
* ``built``
* ``launching``
* ``ready``

These events can be used to do things like running code once the Jupyter Kernels is
ready, or manipulating the page DOM before launching Thebelab to result in certain
behavior (e.g. a "loading status" button).
