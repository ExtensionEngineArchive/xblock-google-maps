"""Google Maps XBlock utilities"""


def _(text):
    """
    Dummy `gettext` replacement to make string extraction tools
    scrape strings marked for translation.
    """
    return text


def ngettext_fallback(text_singular, text_plural, number):
    """
    Dummy `ngettext` replacement to make string extraction tools
    scrape strings marked for translation.
    """
    if number == 1:
        return text_singular
    else:
        return text_plural


class DummyTranslationService(object):  # pylint: disable=too-few-public-methods
    """
    Dummy drop-in replacement for i18n XBlock service.
    Whole implementation shamelessly copied from
    https://github.com/edx-solutions/xblock-drag-and-drop-v2
    """
    gettext = _
    ngettext = ngettext_fallback
