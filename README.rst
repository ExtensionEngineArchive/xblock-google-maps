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

	$ make requirements

Enabling in Studio
------------------

You can enable the Google Maps XBlock in Studio through the advanced
settings.

1. From the main page of a specific course, navigate to
   ``Settings -> Advanced Settings`` from the top menu.
2. Check for the ``Advanced Module List`` policy key, and
   add ``"google_maps"`` to the policy value list.
3. Click the "Save changes" button.

Adding Google Maps API key
--------------------------

This Xblock requires a Google Maps API key to work properly. Visit
https://developers.google.com/maps/documentation/javascript/get-api-key
for more instructions about Google Maps API key.

After acquiring the API key, enable the following APIs in the Google Developers Console
(https://console.developers.google.com/):
    1. Google Maps Embed API
    2. Google Maps JavaScript API
    3. Google Places API Web Service

Add the following entry to XBLOCK_SETTINGS in both lms.env.json and cms.env.json:

.. code:: json

    "XBLOCK_SETTINGS": {
        "GoogleMapsXBlock": {
            "API_KEY": "YOUR API KEY GOES HERE"
        }
    },

Replace "YOUR API KEY GOES HERE" with the API key.

Compile Sass
------------

This XBlock uses Sass for writing style rules. This Sass is compiled by
running the following command:

.. code:: bash

	$ make static

License
-------

The Google Maps XBlock is available under the MIT License.
