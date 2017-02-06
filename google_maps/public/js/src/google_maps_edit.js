/* Javascript for GoogleMapsXBlock studio view */
function GoogleMapsEditXBlock(runtime, element) {
  var displayNameClearButton = $('.clear-display-name', element);
  var displayNameDefaultValue = $('.edit-display-name', element).attr('data-default-value');
  var displayNameInput = $('input[id=display-name-input]');
  var iframeWidthClearButton = $('.clear-iframe-width', element);
  var iframeWidthDefaultValue = $('.edit-iframe-width', element).attr('data-default-value');
  var iframeWidthInput = $('input[id=iframe-width-input]');
  var iframeHeightClearButton = $('.clear-iframe-height', element);
  var iframeHeightDefaultValue = $('.edit-iframe-height', element).attr('data-default-value');
  var iframeHeightInput = $('input[id=iframe-height-input]');

  /**
   * Sends input element values to the backend side
   */
  function saveXBlockData() {
    var handlerUrl = runtime.handlerUrl(element, 'studio_submit');

    var data = {
      display_name: displayNameInput.val(),
      place_name: $(element).find('input[id=place-name-input]').val(),
      iframe_width: iframeWidthInput.val(),
      iframe_height: iframeHeightInput.val(),
      api_key: $(element).find('input[id=api-key-input]').val()
    };

    $.post(handlerUrl, JSON.stringify(data)).done(function(response) {
      window.location.reload(false);
    });
  }

  /**
   * Closes studio editing modal window
   */
  function exitEditMode() {
    runtime.notify('cancel', {});
  }

  /**
   * Sets input element value to default and disables clear button
   * @param {object} input element whose value needs to be set to default value
   * @param {string} input element's default value
   * @param {object} input element's clear button
   */
  function setDefaultValue(inputElement, defaultValue, clearButton) {
    inputElement.val(defaultValue);
    clearButton.prop('hidden', true);
  }

  $(document).ready(function() {
    displayNameClearButton.prop('hidden', displayNameInput.val() === displayNameDefaultValue);
    iframeWidthClearButton.prop('hidden', iframeWidthInput.val() === iframeWidthDefaultValue);
    iframeHeightClearButton.prop('hidden', iframeHeightInput.val() === iframeHeightDefaultValue);
  });

  $(element).on('keyup', 'input[id=display-name-input]', function() {
    displayNameClearButton.prop('hidden', displayNameInput.val() === displayNameDefaultValue);
  });

  $(element).on('click', '.clear-display-name', function() {
    setDefaultValue(displayNameInput, displayNameDefaultValue, displayNameClearButton);
  });

  $(element).on('keyup mouseup', 'input[id=iframe-width-input]', function() {
    iframeWidthClearButton.prop('hidden', iframeWidthInput.val() === iframeWidthDefaultValue);
  });

  $(element).on('click', '.clear-iframe-width', function() {
    setDefaultValue(iframeWidthInput, iframeWidthDefaultValue, iframeWidthClearButton);
  });

  $(element).on('keyup mouseup', 'input[id=iframe-height-input]', function() {
    iframeHeightClearButton.prop('hidden', iframeHeightInput.val() === iframeHeightDefaultValue);
  });

  $(element).on('click', '.clear-iframe-height', function() {
    setDefaultValue(iframeHeightInput, iframeHeightDefaultValue, iframeHeightClearButton);
  });
  
  $(element).on('click', '.save-button', saveXBlockData);

  $(element).on('click', '.cancel-button', exitEditMode);
}
