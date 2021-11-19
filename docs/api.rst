=========
Thebe API
=========

When adding Thebe to a page one only needs to know about the bootstrap process and option object.
By configuring the options you can already manipulate

.. js:autofunction:: thebe.bootstrap

Configuration Options
---------------------

.. js:autoclass:: Options
    :members:
    :exclude-members: Options

.. note::

    Above we document the javascript Thebe Options class which provides the default options for Thebe
    and is a good reference for all current options.

    In typical usage, we add any desired options as an object literal in a script tag on our page,
    see :doc:`./configure`. for details. Option specified on page will be override the defaults
    listed above.

High Level JQuery API
---------------------

.. js:autofunction:: ./render.renderCell
.. js:autofunction:: ./render.renderAllCells
.. js:autofunction:: thebe.mountActivateWidget
.. js:autofunction:: thebe.mountStatusWidget
