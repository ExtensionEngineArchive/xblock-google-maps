""" Google Maps XBlock """
import pkg_resources
import urllib
from urlparse import urlunparse

from django.utils.translation import ugettext_lazy as _

from xblock.core import XBlock
from xblock.fields import Dict, Integer, Scope, String
from xblock.fragment import Fragment
from xblockutils.resources import ResourceLoader
from xblockutils.settings import XBlockWithSettingsMixin

loader = ResourceLoader(__name__)


@XBlock.needs('settings')
class GoogleMapsXBlock(XBlock, XBlockWithSettingsMixin):
    """
    XBlock providing a Google Map to a course.
    """

    # Class level constants
    block_settings_key = 'GoogleMapsXBlock'
    GOOGLE_EMBEDDED_MAPS_API_BASE_URL = 'www.google.com'
    GOOGLE_EMBEDDED_MAPS_PLACE_API_PATH = 'maps/embed/v1/place'
    GOOGLE_MAPS_API_BASE_URL = 'maps.googleapis.com'
    GOOGLE_MAPS_JS_API_PATH = 'maps/api/js'

    # Instance level fields
    display_name = String(
        display_name=_('Display Name'),
        default=_('Google Maps XBlock'),
        help=_('The display name for this component.'),
        scope=Scope.settings
    )

    iframe_height = Integer(
        display_name=_('Map height'),
        default=450,
        scope=Scope.settings
    )

    iframe_width = Integer(
        display_name=_('Map width'),
        default=600,
        scope=Scope.settings
    )

    place = Dict(
        display_name=_('Information about the place being searched'),
        default={
            'id': 'ChIJCwHM0mF344kRAWE3Rmv-RcY',  # ExtensionEngine, Boston headquarters
            'name': '196 Broadway, Cambridge, MA 02139, USA'
        },
        scope=Scope.settings
    )

    @property
    def api_key(self):
        """
        Returns the Google Maps API key from Settings Service.

        The API key should be set in both lms/cms env.json files inside XBLOCK_SETTINGS.

        Example:
            "XBLOCK_SETTINGS": {
                "GoogleMapsXBlock": {
                    "API_KEY": "YOUR API KEY GOES HERE"
                }
            },
        """
        return self.get_xblock_settings().get('API_KEY', '')

    @property
    def embedded_google_maps_url(self):
        """Returns the Google Embedded Maps URL"""
        return urlunparse(self.create_urlunparse_tuple(
            netloc=self.GOOGLE_EMBEDDED_MAPS_API_BASE_URL,
            path=self.GOOGLE_EMBEDDED_MAPS_PLACE_API_PATH,
            query=self.embedded_google_maps_url_parameters
        ))

    @property
    def embedded_google_maps_url_parameters(self):
        """
        Returns:
            parameters (dict): Dictionary that contains all the get parameters for the API call
        """
        return {'q': 'place_id:{}'.format(self.place_id), 'key': self.api_key}

    @property
    def google_maps_js_api_parameters(self):
        """
        Returns:
            parameters (dict): Dictionary that contains all the get parameters for the API call
        """
        return {'callback': 'googleMapsXBlockApp.initMap', 'key': self.api_key, 'libraries': 'places'}

    @property
    def place_id(self):
        """Returns the Google Maps place id string from place dictionary."""
        return self.place['id']

    @property
    def place_name(self):
        """Returns the Google Maps place name string from place dictionary."""
        return self.place['name']

    # TODO: If needed, replace create_urlunparse_tuple with properties

    @staticmethod
    def create_urlunparse_tuple(scheme='https', netloc='', path='', params='', query='', fragment=''):
        """
        Helper method that creates the tuple for urlunparse.

        For more information about the arguments read https://docs.python.org/2/library/urlparse.html#urlparse.urlparse

        Returns:
            urlunparse parameter (tuple): Parameters for building the url
        """
        return (scheme, netloc, path, params, urllib.urlencode(query), fragment)

    def resource_string(self, path):
        """Handy helper for getting resources from our kit."""
        data = pkg_resources.resource_string(__name__, path)
        return data.decode('utf8')

    def student_view(self, context=None):
        """
        The primary view of the GoogleMapsXBlock, shown to students
        when viewing courses.
        """
        context = {
            'self': self
        }

        html = self.resource_string('public/html/google_maps.html')
        frag = Fragment()
        frag.add_content(loader.render_template('/public/html/google_maps.html', context))
        frag.add_css(self.resource_string('public/css/google_maps.css'))
        frag.add_javascript(self.resource_string('public/js/src/google_maps.js'))
        frag.initialize_js('GoogleMapsXBlock')
        return frag

    def studio_view(self, context=None):
        """
        The primary view of the GoogleMapsXBlock, shown to staff members
        when editing courses.
        """

        context = {
            'fields': self.fields,
            'loading_gif_src': self.runtime.local_resource_url(self, 'public/images/loading.gif'),
            'self': self,
        }

        html = self.resource_string('public/html/google_maps_edit.html')
        frag = Fragment()
        frag.add_content(loader.render_template('/public/html/google_maps_edit.html', context))
        frag.add_css(self.resource_string('public/css/google_maps_edit.css'))
        frag.add_javascript(self.resource_string('public/js/src/google_maps_edit.js'))
        frag.add_javascript_url(urlunparse(self.create_urlunparse_tuple(
            netloc=self.GOOGLE_MAPS_API_BASE_URL,
            path=self.GOOGLE_MAPS_JS_API_PATH,
            query=self.google_maps_js_api_parameters
        )))
        frag.initialize_js(
            'GoogleMapsEditXBlock',
            {
                'googleMapsApiKey': self.api_key,
                'place': self.place
            }
        )
        return frag

    @XBlock.json_handler
    def studio_submit(self, data, suffix=''):
        """
        Called when submitting the form in studio.
        """

        for key in data:
            setattr(self, key, data[key])

        return {'result': 'success'}

    @staticmethod
    def workbench_scenarios():
        """A canned scenario for display in the workbench."""
        return [
            ("GoogleMapsXBlock",
             """<google_maps/>
             """),
            ("Multiple GoogleMapsXBlock",
             """<vertical_demo>
                <google_maps/>
                <google_maps/>
                <google_maps/>
                </vertical_demo>
             """),
        ]
