""" Google Maps XBlock """

import pkg_resources
from django.utils.translation import ugettext_lazy as _

from xblock.core import XBlock
from xblock.fields import Scope, Integer, String
from xblock.fragment import Fragment
from xblockutils.resources import ResourceLoader

loader = ResourceLoader(__name__)


class GoogleMapsXBlock(XBlock):
    """
    XBlock providing a Google Map to a course.
    """

    display_name = String(
        display_name=_('Display Name'),
        default=_('Google Maps XBlock'),
        help=_('The display name for this component.'),
        scope=Scope.settings
    )

    api_key = String(
        display_name=_('Google Maps API key'),
        default='',
        scope=Scope.content
    )

    place_name = String(
        display_name=_('Search for a place'),
        default='',
        scope=Scope.settings
    )

    iframe_width = Integer(
        display_name=_('Map width'),
        default=600,
        scope=Scope.settings
    )

    iframe_height = Integer(
        display_name=_('Map height'),
        default=450,
        scope=Scope.settings
    )

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
            'self': self,
            'fields': self.fields
        }

        html = self.resource_string('public/html/google_maps_edit.html')
        frag = Fragment()
        frag.add_content(loader.render_template('/public/html/google_maps_edit.html', context))
        frag.add_css(self.resource_string('public/css/google_maps_edit.css'))
        frag.add_javascript(self.resource_string('public/js/src/google_maps_edit.js'))
        frag.initialize_js('GoogleMapsEditXBlock')
        return frag

    @XBlock.json_handler
    def studio_submit(self,data,suffix=''):
        """
        Called when submitting the form in studio.
        """

        for key in data:
            setattr(self, key, data[key])

        return { 'result':'success' }

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
