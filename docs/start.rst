===========
Get started
===========

In order to use Thebelab, you must take the following steps on a page:

Load the thebelab javascript bundle
===================================

The Thebelab Javascript is most-easily obtained from a CDN.
You can load the javascript library from a CDN by including this on a page:

.. code:: html

   <script src="https://unpkg.com/thebelab@latest/lib/index.js"></script>

Alternatively, you can download the bundle and include it along with your site.

Configure Thebelab in your page's HTML
======================================

Thebelab looks for a specific HTML block for its configuration. This happens
when Thebelab is "bootstrapped" (i.e., launched).

The configuration block has the following structure:

.. code-block:: html

   <script type="text/x-thebe-config">
      { 
          a: collection
          of: key
          val: pairs
      }
   </script>

See :doc:`configure` for information about how and what to configure with Thebelab.


Bootstrap Thebelab on the page
==============================

If the Thebelab Javascript bundle is loaded, and the configuration file is present,
you may bootstrap (i.e., launch) Thebelab by calling the following Javascript function:

``thebelab.bootstrap()``

This will take one or more of the following actions:

* Re render the code cells to make them live cells. (the rendering can handle cells that contain a mixture of inputs and ouputs distinguished by prompts)
* (optional) Request a notebook server from Binder
* (optional) Request a Jupyter kernel from a notebook server.

Calling the bootstrap function is generally accomplished by connecting it to the
"click" event of a button on the page.

.. tip::

   If ``bootstrap: true`` is in the Thebelab configuration, this will be triggered
   automatically upon page load.