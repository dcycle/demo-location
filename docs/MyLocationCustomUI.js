MyLocationCustomUI = {
  cannotGetLocation: function(message) {
    MyLocationCustomUI.hideButton();
    MyLocationCustomUI.fatal();
    MyLocationCustomUI.setMessage('Could not get your location: ' + message.message, 'error');
  },
  waiting: function() {
    MyLocationCustomUI.setMessage('Waiting for permission to use location.', 'notice');
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
    MyLocationCustomUI.setMessage('Click below to allow us to use your location.', 'ok');
    MyLocationCustomUI.showButton();
    document.getElementById('location-action').innerHTML = 'Click here to use your location.';
    document.getElementById('location-action').onclick = MyLocationCustomUIPrompt;
  },
  gotLocation: function(location) {
    MyLocationCustomUI.hideButton();
    MyLocationCustomUI.setMessage('Successfully got your coordinates.', 'ok');
    const text = location.coords.latitude + ', ' + location.coords.longitude + ' with accuracy ' + location.coords.accuracy;
    const element = document.getElementById('location-display');
    element.innerHTML = text;
  },
  init: function() {
    MyLocationCustomUI.hideButton();
    document.getElementById('location-display').innerHTML = 'We do not know your location.';
  },
  fatal: function() {
    MyLocationCustomUI.hideButton();
  },
  hideButton: function() {
    const element = document.getElementById('location-action');
    element.classList.add('location-display-none');
  },
  showButton: function() {
    const element = document.getElementById('location-action');
    element.classList.remove('location-display-none');
  },
}

MyLocationCustomUIPrompt = function() {
  MyLocation.prompt();
}
