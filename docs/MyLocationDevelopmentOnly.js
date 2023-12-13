MyLocationDevelopmentOnly = {
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
      switchBackend.onclick = MyLocationDevelopmentOnlyUseLive;
      const mockHttp = document.getElementById('location-mock-http');
      mockHttp.onclick = MyLocationDevelopmentOnlySimulateHttp;
      const mockPromptAccept = document.getElementById('location-mock-prompt-accept');
      mockPromptAccept.onclick = MyLocationDevelopmentOnlySimulatePromptAccept;
      const mockPromptDeny = document.getElementById('location-mock-prompt-deny');
      mockPromptDeny.onclick = MyLocationDevelopmentOnlySimulatePromptDeny;
      const mockGranted = document.getElementById('location-mock-granted');
      mockGranted.onclick = MyLocationDevelopmentOnlySimulateGranted;
      const mockDenied = document.getElementById('location-mock-deny');
      mockDenied.onclick = MyLocationDevelopmentOnlySimulateDenied;
    }
    else {
      switchBackend.onclick = MyLocationDevelopmentOnlyUseMock;
    }

  },
  init: function() {
    this.displayVersionNumber();
    MyLocationCustomUI.init();
  },
  displayVersionNumber: function() {
    const element = document.getElementById('location-version-number');
    element.innerHTML = MyLocation.version();
  },
}

MyLocationDevelopmentOnlyUseMock = function() {
  MyLocation.useMockBackend();
}

MyLocationDevelopmentOnlyUseLive = function() {
  MyLocation.useLiveBackend();
}

MyLocationDevelopmentOnlySimulateHttp = function() {
  MyLocationMockBackend._https = false;
  MyLocation.useMockBackend();
}

MyLocationDevelopmentOnlySimulatePromptAccept = function() {
  MyLocationMockBackend._https = true;
  MyLocationMockBackend._permission = 'prompt';
  MyLocationMockBackend._userAllow = true;
  MyLocation.useMockBackend();
}

MyLocationDevelopmentOnlySimulatePromptDeny = function() {
  MyLocationMockBackend._https = true;
  MyLocationMockBackend._permission = 'prompt';
  MyLocationMockBackend._userAllow = false;
  MyLocation.useMockBackend();
}

MyLocationDevelopmentOnlySimulateGranted = function() {
  MyLocationMockBackend._https = true;
  MyLocationMockBackend._permission = 'granted';
  MyLocationMockBackend._userAllow = true;
  MyLocation.useMockBackend();
}

MyLocationDevelopmentOnlySimulateDenied = function() {
  MyLocationMockBackend._https = true;
  MyLocationMockBackend._permission = 'denied';
  MyLocationMockBackend._userAllow = false;
  MyLocation.useMockBackend();
}
