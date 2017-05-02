/* Javascript for GoogleMapsXBlock studio view */
/*jslint browser: true, unparam: true*/
/*global $, jQuery, alert*/
var googleMapsXBlockApp = googleMapsXBlockApp || {};

/**
 * Changes the src attribute of Embedded Google Map iframe
 */
googleMapsXBlockApp.changeEmbeddedMapLocation = function(parameters) {
    $('#google-map').attr('src', 'https://www.google.com/maps/embed/v1/place?' + $.param(parameters));
};

/**
 * Toggles is-disabled class for input fields with setting-input class
 * @param {Bool} indicator for adding/removing the class
 */
googleMapsXBlockApp.disableInputFields = function(addClass) {
    $('input.setting-input').toggleClass('is-disabled', addClass)
      .attr('tabIndex', addClass ? '-1' : '1');
};

/**
 * Toggles is-disabled class for buttons with setting-clear class
 * @param {Bool} indicator for adding/removing the class
 */
googleMapsXBlockApp.disableResetButtons = function(addClass) {
    $('button.setting-clear').toggleClass('is-disabled', addClass)
      .attr('tabIndex', addClass ? '-1' : '1');
};

/**
 * Disables/enables the edit form save button
 * @param {Bool} indicator for disabling/enabling the save button
 */
googleMapsXBlockApp.disableSaveButton = function(addClass) {
    $('.save-button').toggleClass('is-disabled', addClass)
      .attr('tabIndex', addClass ? '-1' : '1');
};

/**
 * Toggles error message depending on the second parameter
 * @param {object} element for which the error message should be displayed
 * @param {bool} value that determines whether to show or hide the error message
 */
googleMapsXBlockApp.toggleErrorMessage = function(element, show) {
    googleMapsXBlockApp.disableSaveButton(show);
    element.toggleClass('invalid-input', show).focus().attr('aria-invalid', show)
      .siblings('.error-message').toggleClass('hidden', !show);
};

/**
 * Toggles loading gif on edit modal and disables save button, input fields,
 * reset buttons
 * @param {bool} indicator for displaying/hidding the loading gif
 */
googleMapsXBlockApp.toggleLoadingGif = function(show) {
    googleMapsXBlockApp.disableSaveButton(show);
    googleMapsXBlockApp.disableInputFields(show);
    googleMapsXBlockApp.disableResetButtons(show);
    $('#loading-gif-container').toggleClass('hidden', !show);
};

/**
 * Main XBlock entry point
 */
function GoogleMapsEditXBlock(runtime, element) {
    'use strict';
    var displayNameClearButton = $('.clear-display-name', element),
        displayNameDefaultValue = $('.edit-display-name', element).attr('data-default-value'),
        displayNameInput = $('input[id=display-name-input]'),
        iframeWidthClearButton = $('.clear-iframe-width', element),
        iframeWidthDefaultValue = $('.edit-iframe-width', element).attr('data-default-value'),
        iframeWidthInput = $('input[id=iframe-width-input]'),
        iframeHeightClearButton = $('.clear-iframe-height', element),
        iframeHeightDefaultValue = $('.edit-iframe-height', element).attr('data-default-value'),
        iframeHeightInput = $('input[id=iframe-height-input]'),
        iframePlaceNameClearButton = $('.clear-iframe-place-name', element),
        iframePlaceNameDefaultValue = $('.edit-place-name', element).attr('data-default-name-value'),
        iframePlaceNameInput = $('input[id=place-name-input]');
    googleMapsXBlockApp.googleMapsApiKey = backendData.googleMapsApiKey;
    googleMapsXBlockApp.place = backendData.place;

    /**
     * Sends input element values to the backend side
     */
    function saveXBlockData() {
        var handlerUrl = runtime.handlerUrl(element, 'studio_submit'),
            data = {
                display_name: displayNameInput.val(),
                iframe_height: iframeHeightInput.val(),
                iframe_width: iframeWidthInput.val(),
                place: googleMapsXBlockApp.place
            };

        $.post(handlerUrl, JSON.stringify(data)).done(function (response) {
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

    $(document).ready(function () {
        displayNameClearButton.prop('hidden', displayNameInput.val() === displayNameDefaultValue);
        iframeWidthClearButton.prop('hidden', iframeWidthInput.val() === iframeWidthDefaultValue);
        iframeHeightClearButton.prop('hidden', iframeHeightInput.val() === iframeHeightDefaultValue);
    });

    /**
     * Checks if the value was selected from Google Maps autocomplete dropdown
     */
    function validatePlaceNameField() {
        if (iframePlaceNameInput.val() === googleMapsXBlockApp.place.name ) {
            googleMapsXBlockApp.toggleErrorMessage($('#place-name-input'), false);
            saveXBlockData();
        } else {
            googleMapsXBlockApp.toggleErrorMessage($('#place-name-input'), true);
        }
    }

    $(function() {
        displayNameClearButton.prop('hidden', displayNameInput.val() === displayNameDefaultValue);
        iframeWidthClearButton.prop('hidden', iframeWidthInput.val() === iframeWidthDefaultValue);
        iframeHeightClearButton.prop('hidden', iframeHeightInput.val() === iframeHeightDefaultValue);
        iframePlaceNameClearButton.prop('hidden', iframePlaceNameInput.val() === iframePlaceNameDefaultValue);
    });

    if (google.maps.places) {
        googleMapsXBlockApp.initMap();
    }

    $(element).on('keyup', 'input[id=display-name-input]', function () {
        displayNameClearButton.prop('hidden', displayNameInput.val() === displayNameDefaultValue);
    });

    $(element).on('click', '.clear-display-name', function () {
        setDefaultValue(displayNameInput, displayNameDefaultValue, displayNameClearButton);

    $(element).on('keyup', 'input[id=place-name-input]', function () {
        iframePlaceNameClearButton.prop('hidden', iframePlaceNameInput.val() === iframePlaceNameDefaultValue);
    });

    $(element).on('click', '.clear-iframe-place-name', function () {
        googleMapsXBlockApp.place = {
            id: $('.edit-place-name', element).attr('data-default-id-value'),
            name: iframePlaceNameDefaultValue
        };
        googleMapsXBlockApp.changeEmbeddedMapLocation({
            key: googleMapsXBlockApp.googleMapsApiKey,
            q: 'place_id:' + googleMapsXBlockApp.place.id,
        });
        setDefaultValue(iframePlaceNameInput, iframePlaceNameDefaultValue, iframePlaceNameClearButton);
        googleMapsXBlockApp.toggleErrorMessage(iframePlaceNameInput, false);
    });

    $(element).on('keyup mouseup', 'input[id=iframe-width-input]', function () {
        iframeWidthClearButton.prop('hidden', iframeWidthInput.val() === iframeWidthDefaultValue);
    });

    $(element).on('click', '.clear-iframe-width', function () {
        setDefaultValue(iframeWidthInput, iframeWidthDefaultValue, iframeWidthClearButton);
    });

    $(element).on('keyup mouseup', 'input[id=iframe-height-input]', function () {
        iframeHeightClearButton.prop('hidden', iframeHeightInput.val() === iframeHeightDefaultValue);
    });

    $(element).on('click', '.clear-iframe-height', function () {
        setDefaultValue(iframeHeightInput, iframeHeightDefaultValue, iframeHeightClearButton);
    });

    $(element).on('click', '.save-button', validatePlaceNameField);

    $(element).on('click', '.cancel-button', exitEditMode);

    $(element).on('blur', 'input[id=api-key-input]', function () {
        googleMapsXBlockApp.googleMapsApiKey = $('input[id=api-key-input]').val();
    });

    $('#google-map').on('load', function() {
        googleMapsXBlockApp.toggleLoadingGif(false);
    });
}

/**
 * Initialize google maps functionalities
 */
googleMapsXBlockApp.initMap = function () {
  var placeNameInput = $('#place-name-input'),
      autocomplete = new google.maps.places.Autocomplete(placeNameInput[0]),
      getParameters = {};

  autocomplete.addListener('place_changed', function () {
      var place = autocomplete.getPlace();

      if (!place.geometry) {
          // User entered the name of a Place that was not suggested and
          // pressed the Enter key or the Place Details request failed.
          googleMapsXBlockApp.toggleErrorMessage(placeNameInput, true);
          return;
      }

      googleMapsXBlockApp.toggleErrorMessage(placeNameInput, false);
      googleMapsXBlockApp.toggleLoadingGif(true);
      googleMapsXBlockApp.place = {
          'id': place.place_id,
          'name': placeNameInput.val()
      };
      getParameters = {
          key: googleMapsXBlockApp.googleMapsApiKey,
          q: 'place_id:' + place.place_id,
      };

      googleMapsXBlockApp.changeEmbeddedMapLocation(getParameters);
  });
};
