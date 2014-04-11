(function ($) {

/**
 * Open links to Mollom.com in a new window.
 *
 * Required for valid XHTML Strict markup.
 */
Drupal.behaviors.mollomTarget = function (context) {
  $(context).find('.mollom-target').click(function () {
    this.target = '_blank';
  });
};

/**
 * Attach click event handlers for CAPTCHA links.
 */
Drupal.behaviors.mollomCaptcha = function (context) {
  $('a.mollom-switch-captcha', context).click(getMollomCaptcha);
};

/**
 * Fetch a Mollom CAPTCHA and output the image or audio into the form.
 */
function getMollomCaptcha() {
  // Get the current requested CAPTCHA type from the clicked link.
  var newCaptchaType = $(this).hasClass('mollom-audio-captcha') ? 'audio' : 'image';

  var context = $(this).parents('form');

  // Extract the form build ID and Mollom content ID from the form.
  var formBuildId = $('input[name="mollom[mollom_build_id]"]', context).val();
  var mollomContentId = $('input.mollom-content-id', context).val();

  var path = 'mollom/captcha/' + newCaptchaType + '/' + formBuildId;
  if (mollomContentId) {
    path += '/' + mollomContentId;
  }

  // Retrieve a new CAPTCHA.
  $.ajax({
    url: Drupal.settings.basePath + Drupal.settings.mollomPathPrefix + path,
    type: 'POST',
    dataType: 'json',
    success: function (data) {
      if (!(data && data.content)) {
        return;
      }
      // Inject new CAPTCHA.
      $('.mollom-captcha-content', context).parent().html(data.content);
      // Update CAPTCHA ID.
      $('input[name="mollom[captchaId]"]', context).val(data.captchaId);
      // Add an onclick-event handler for the new link.
      Drupal.attachBehaviors(context);
      // Focus on the CAPTCHA input.
      if (newCaptchaType == 'image') {
          $('input[name="mollom[captcha]"]', context).focus();
      } else {
        // Focus on audio player.
        // Fallback player code is responsible for setting focus upon embed.
        if ($('#mollom_captcha_audio').is(":visible")) {
            $('#mollom_captcha_audio').focus();
        }
      }
    }
  });
  return false;
}

})(jQuery);
