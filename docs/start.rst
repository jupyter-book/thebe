===========
Get started
===========

In order to use Thebe, you must take the following steps on a page:

Load the thebe javascript bundle
================================

The Thebe Javascript is most-easily obtained from a CDN.
You can load the javascript library from a CDN by including this on a page:

.. code:: html

   <script src="https://unpkg.com/thebelab@latest/lib/index.js"></script>

Alternatively, you can download the bundle and include it along with your site.

Configure Thebe in your page's HTML
===================================

Thebe looks for a specific HTML block for its configuration. This happens
when Thebe is "bootstrapped" (i.e., launched).

The configuration block has the following structure:

.. code-block:: html

   <script type="text/x-thebe-config">
      {
          a: collection
          of: key
          val: pairs
      }
   </script>

See :doc:`configure` for information about how and what to configure with Thebe.


Bootstrap Thebe on the page
===========================

If the Thebe Javascript bundle is loaded, and the configuration file is present,
you may bootstrap (i.e., launch) Thebe by calling the following Javascript function:

``thebelab.bootstrap()``

This will take one or more of the following actions:

* Re render the code cells to make them live cells. (the rendering can handle cells that contain a mixture of inputs and ouputs distinguished by prompts)
* (optional) Request a notebook server from Binder
* (optional) Request a Jupyter kernel from a notebook server.

Calling the bootstrap function is generally accomplished by connecting it to the
"click" event of a button on the page.

.. tip::

   If ``bootstrap: true`` is in the Thebe configuration, this will be triggered
   automatically upon page load.
