Google Maps XBlock
------------------

This XBlock provides a Google Map to an edX course.

Installation
------------

First clone the xblock-google-maps git repository by running the 
following command:

.. code:: bash

	$ git clone https://github.com/ExtensionEngine/xblock-google-maps.git

After you have cloned the repository you need to install the Google Maps 
XBlock by running the following command:

.. code:: bash

	$ pip install -e xblock-google-maps

Enabling in Studio
------------------

You can enable the Google Maps XBlock in Studio through the advanced 
settings.

1. From the main page of a specific course, navigate to
   ``Settings -> Advanced Settings`` from the top menu.
2. Check for the ``Advanced Module List`` policy key, and 
   add ``"google_maps"`` to the policy value list.
3. Click the "Save changes" button.

License
-------

The Google Maps XBlock is available under the MIT License.