MyLocationCustomUI = {
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
  informBackendChange: function(label) {
    const element = document.getElementById('location-backend');
    element.innerHTML = ('Now using ' + label + '<div id="location-backend-info"></div>');

    const list = document.getElementById('location-backend-info');
    if (label == 'Mock Backend') {
      let content = '<ul>';
      content += '<li>_https: ' + MyLocationMockBackend.https() + '</li>';
      content += '<li>_permission: ' + MyLocationMockBackend.permission() + '</li>';
      content += '<li>_userAllow: ' + MyLocationMockBackend.userAllow() + '</li>';
      content += '<li><a href="#" id="location-mock-http">Simulate using HTTP</a></li>';
      content += '<li><a href="#" id="location-mock-prompt-accept">Simulate permission prompt and user accepts</a></li>';
      content += '<li><a href="#" id="location-mock-prompt-deny">Simulate permission prompt and user denies</a></li>';
      content += '<li><a href="#" id="location-mock-granted">Simulate permission granted</a></li>';
      content += '<li><a href="#" id="location-mock-deny">Simulate permission denied</a></li>';
      content += '<li><a href="#" id="location-switch-backend">Use live backend</a></li>';
      content += '</ul>';
      list.innerHTML = content;
    }
    else {
      let content = '<ul>';
      content += '<li><a href="#" id="location-switch-backend">Use mock backend</a></li>';
      content += '</ul>';
      list.innerHTML = content;
    }
    const switchBackend = document.getElementById('location-switch-backend');
    if (label == 'Mock Backend') {
      switchBackend.onclick = MyLocationCustomUIUseLive;
      const mockHttp = document.getElementById('location-mock-http');
      mockHttp.onclick = MyLocationCustomUISimulateHttp;
      const mockPromptAccept = document.getElementById('location-mock-prompt-accept');
      mockPromptAccept.onclick = MyLocationCustomUISimulatePromptAccept;
      const mockPromptDeny = document.getElementById('location-mock-prompt-deny');
      mockPromptDeny.onclick = MyLocationCustomUISimulatePromptDeny;
      const mockGranted = document.getElementById('location-mock-granted');
      mockGranted.onclick = MyLocationCustomUISimulateGranted;
      const mockDenied = document.getElementById('location-mock-deny');
      mockDenied.onclick = MyLocationCustomUISimulateDenied;
    }
    else {
      switchBackend.onclick = MyLocationCustomUIUseMock;
    }

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
    const text = location.coords.latitude + ', ' + location.coords.longitude + ' with accuracy ' + location.coords.accuracy;
    const element = document.getElementById('location-display');
    element.innerHTML = text;
  },
  promptFailure: function(reason) {
    this.hideButton();
    this.fatal();
    this.log('Could not get location: ' + reason.message, 'error', 'user-facing');
  }
}

MyLocationCustomUIPrompt = function() {
  MyLocation.prompt();
}

MyLocationCustomUIUseMock = function() {
  MyLocation.useMockBackend();
}

MyLocationCustomUIUseLive = function() {
  MyLocation.useLiveBackend();
}

MyLocationCustomUISimulateHttp = function() {
  MyLocationMockBackend._https = false;
  MyLocation.useMockBackend();
}

MyLocationCustomUISimulatePromptAccept = function() {
  MyLocationMockBackend._https = true;
  MyLocationMockBackend._permission = 'prompt';
  MyLocationMockBackend._userAllow = true;
  MyLocation.useMockBackend();
}

MyLocationCustomUISimulatePromptDeny = function() {
  MyLocationMockBackend._https = true;
  MyLocationMockBackend._permission = 'prompt';
  MyLocationMockBackend._userAllow = false;
  MyLocation.useMockBackend();
}

MyLocationCustomUISimulateGranted = function() {
  MyLocationMockBackend._https = true;
  MyLocationMockBackend._permission = 'granted';
  MyLocationMockBackend._userAllow = true;
  MyLocation.useMockBackend();
}

MyLocationCustomUISimulateDenied = function() {
  MyLocationMockBackend._https = true;
  MyLocationMockBackend._permission = 'denied';
  MyLocationMockBackend._userAllow = false;
  MyLocation.useMockBackend();
}
