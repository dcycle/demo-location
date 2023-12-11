MyCustomScript = {
  /**
   * Log information.
   *
   * @param {*} message
   *   The actual message as an untranslated string, for example,
   *   "Hello my name is %s".
   * @param {*} args
   *   Arguments to the message, for example, {"%s": "John"}.
   * @param {*} severity
   *   Can be "info", "error" or "notice".
   * @param {*} category
   *   A category for the message, "mock-vs-real" or "user-facing" or "debug".
   */
  log: function(message, args, severity, category) {
    if (category === 'debug') {
      console.log('[DEBUG] ' + message);
      return;
    }
    var element = document.getElementById('location-' + category);
    element.classList.remove('location-message-ok');
    element.classList.remove('location-message-error');
    element.classList.remove('location-message-notice');
    element.classList.add('location-message-' + severity);
    element.innerHTML = message;
  },
  setCoordinates: function(coords) {

  },
  waitForCallbackInsteadOfAskingRightAway: function(callback) {

  }
}
