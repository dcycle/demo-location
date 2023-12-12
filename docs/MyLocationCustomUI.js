MyLocationCustomUI = {
  cannotGetLocation: function(message) {
    this.setMessage('Could not get your location: ' + message, 'error');
  },
  waiting: function() {
    this.setMessage('Waiting for permission to use location.', 'notice');
  },
  setMessage: function(message, severity) {
    const element = document.getElementById('location-user-facing');
    element.classList.remove('location-message-ok');
    element.classList.remove('location-message-error');
    element.classList.remove('location-message-notice');
    element.classList.add('location-message-' + severity);
    element.innerHTML = message;
  },
  canPromptForLocation: function() {

  },
  gotLocation: function(location) {

  },

  /**
   * Log information.
   *
   * @param {*} message
   *   The actual message as an untranslated string, for example,
   *   "Hello my name is %s".
   * @param {*} severity
   *   Can be "info", "error" or "notice".
   * @param {*} category
   *   A category for the message, "user-facing" or "debug".
   */
  log: function(message, severity, category) {
    alert(message);
    if (category === 'debug') {
      console.log('[DEBUG] ' + message);
      return;
    }
    const element = document.getElementById('location-' + category);
    element.classList.remove('location-message-ok');
    element.classList.remove('location-message-error');
    element.classList.remove('location-message-notice');
    element.classList.add('location-message-' + severity);
    element.innerHTML = message;
  },
  fatal: function() {
    this.hideButton();
  },
  hideButton: function() {
    const element = document.getElementById('location-action');
    element.classList.add('location-display-none');
  },
  showButton: function() {
    const element = document.getElementById('location-action');
    element.classList.remove('location-display-none');
  },
  allowPrompting() {
    this.setMessage('Click below to allow us to use your location.', 'ok');
    this.showButton();
    document.getElementById('location-action').innerHTML = 'Click here to use your location.';
    document.getElementById('location-action').onclick = MyLocationCustomUIPrompt;
  },
  init: function() {
    this.hideButton();
    document.getElementById('location-display').innerHTML = 'We do not know your location.';
  },
  promptSuccess: function(location) {
    this.hideButton();
    this.setMessage('Successfully got your coordinates.', 'ok');
    const text = location.coords.latitude + ', ' + location.coords.longitude + ' with accuracy ' + location.coords.accuracy;
    const element = document.getElementById('location-display');
    element.innerHTML = text;
  },
  promptFailure: function(reason) {
    this.hideButton();
    this.fatal();
    this.cannotGetLocation(reason.message);
  }
}

MyLocationCustomUIPrompt = function() {
  MyLocation.prompt();
}
