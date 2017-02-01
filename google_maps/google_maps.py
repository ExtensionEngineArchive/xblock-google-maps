""" Google Maps XBlock """

import pkg_resources

from xblock.core import XBlock
from xblock.fields import Scope, Integer
from xblock.fragment import Fragment


class GoogleMapsXBlock(XBlock):
    """
    XBlock providing a Google Map to a course.
    """

    def resource_string(self, path):
        """Handy helper for getting resources from our kit."""
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")


    def student_view(self, context=None):
        """
        The primary view of the GoogleMapsXBlock, shown to students
        when viewing courses.
        """
        html = self.resource_string("public/html/google_maps.html")
        frag = Fragment(html.format(self=self))
        frag.add_css(self.resource_string("public/css/google_maps.css"))
        frag.add_javascript(self.resource_string("public/js/src/google_maps.js"))
        frag.initialize_js('GoogleMapsXBlock')
        return frag


    def studio_view(self, context=None):
        """
        The primary view of the GoogleMapsXBlock, shown to staff members
        when editing courses.
        """
        html = self.resource_string("public/html/google_maps_edit.html")
        frag = Fragment(html.format(self=self))
        frag.add_css(self.resource_string("public/css/google_maps_edit.css"))
        frag.add_javascript(self.resource_string("public/js/src/google_maps_edit.js"))
        frag.initialize_js('GoogleMapsEditXBlock')
        return frag


    @XBlock.json_handler
    def studio_submit(self,data,suffix=''):
        """
        Called when submitting the form in studio.
        """

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
