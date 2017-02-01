/* Javascript for GoogleMapsXBlock studio view */
function GoogleMapsEditXBlock(runtime, element) {
  /* Function for submiting input elements in edit mode */
  $(element).on('click', '.save-button', function() {
    var handlerUrl = runtime.handlerUrl(element, 'studio_submit');

    $.post(handlerUrl, JSON.stringify({ })).done(function(response) {
      window.location.reload(false);
    });
  });

  /* Function for canceling */
  $(element).on('click', '.cancel-button', function() {
    runtime.notify('cancel', {});
  });
}
