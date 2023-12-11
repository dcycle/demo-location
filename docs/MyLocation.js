/**
 * Encompasses functionality for getting my location. For usage, see
 * index.html.
 */
MyLocation = {
  customize: function(customObject) {
    this._customObject = customObject;
  },
  customObject: function() {
    if (typeof this._customObject === 'undefined') {
      this._customObject = {};
    }
    return {...DefaultCustomOject, ...this._customObject};
  },
  init: function() {
    this.customObject.setBackend();
    this.populateHtml();
    if (!this.backend().https()) {
      locationSetError('We cannot use location services over http. Please use https.');
      locationRemoveButton();
    }
    else {
      locationCheckIfWeHavePermission();
    }
    return this;
  },
  populateHtml: function() {
    this.customObject().populateHtml();
    this.customObject().enableLocationButton();


    var element = document.getElementById('location-button');
    element.innerHTML = label;

  //   <div id="location-mock-vs-real" class="location-info location-section location-message-ok">
  //   Using the live location services. You might want to try alternating between mock location services and real location services during local development by running MyLocation.useMock() and MyLocation.useReal().
  // </div>
  // <div id="location-user-facing" class="location-message location-section location-message-ok">
  //   Click "use your location" below to allow us to access your location.
  // </div>
  // <div id="location-action" class="location-action location-section">
  //   <div class="location-action-use-your-location">
  //     <a id="location-button" class="location-button">Use your location</a>.
  //   </div>
  // </div>
  // <div id="location-display" class="location-display location-section">
  //   We currently do not know your location.
  // </div>

  },
  setLogCallback: function(callback) {
    this.logCallback = callback;
    return this;
  },
  setCoordinatesCallback: function(callback) {
    this.coordsCallback = callback;
    return this;
  },
  waitForCallbackInsteadOfAskingRightAway: function(callback) {
    this.askCallback = callback;
    return this;
  },
  debug: function(message) {
    this.log(message, {}, 'notice', 'debug');
  },
  log: function(message, args, severity, category) {
    if (this.logCallback) {
      this.logCallback(message, args, severity, category);
    }
    else {
      console.log();
    }
  },
  setBackend: function(backend) {
    this._backend = backend;
  },
  backend: function() {
    if (typeof this._backend === 'undefined') {
      this._backend = MyLocationLiveBackend;
    }
    return this._backend;
  },
  useMock: function() {
    this.log('Using the mock location services. You might want to try alternating between mock location services and real location services during local development by running MyLocation.useMock() and MyLocation.useReal().', {}, 'ok', 'mock-vs-real');
    this
      .setBackend(MyLocationMockBackend)
      .init();
  },
  useReal: function() {
    this.log('Using the live location services. You might want to try alternating between mock location services and real location services during local development by running MyLocation.useMock() and MyLocation.useReal().', {}, 'ok', 'mock-vs-real');
    this
      .setBackend(MyLocationLiveBackend)
      .init();
  }
}

// https://stackoverflow.com/questions/10077606/check-if-geolocation-was-allowed-and-get-lat-lon

// https://stackoverflow.com/questions/77635774/the-web-permissions-api-revoke-method-is-deprecated-what-is-the-best-way-to-r

DefaultCustomObject = {
  setBackend: function() {
    MyLocation.setBackend(MyLocationLiveBackend);
  }
}


MyLocationMockBackend = {
  https: function() {
    return location.protocol === 'https:';
  },
}

MyLocationLiveBackend = {
  https: function() {
    if (typeof this._https === 'undefined') {
      this._https = true;
    }
    MyLocation.debug('Simulating using https: ' + this._https);
    return this._https;
  },
}

function locationCheckIfWeHavePermission() {
  navigator.permissions.query({name:'geolocation'}).then(function(result) {
    switch (result.state) {
      case 'granted':
        useYourLocation();
        break;

      case 'prompt':
        locationSetPrompt();
        break;

      case 'denied':
        locationSetError('Your browser does not seem to have access to location services, or the user has previously denied access. You might need to allow geolocaiton in your settings, or see the "Resetting the geolocation permission" section, below.');
        break;

      default:
        locationSetError('When checking for permission, we got the unexpected state ' + result.state + '.');
        break;
    }
  }).catch(e => locationSetPrompt());
}

function locationSetPrompt() {
  document.getElementById('location-button').onclick = useYourLocation;
}

function useYourLocation() {
  locationSetWaiting('Waiting for permission to use location.');
  // See
  // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition.
  try {
    navigator.geolocation.getCurrentPosition(useYourLocationSuccess, useYourLocationFailure, {
      maximumAge: 0,
      timeout: Infinity,
      enableHighAccuracy: false,
    });
  }
  catch (error) {
    console.log(error);
  }
}

function locationSetError(message) {
  MyLocation.log(message, {}, 'error', 'user-facing');
}

function locationSetWaiting(message) {
  MyLocation.log(message, {}, 'waiting', 'user-facing');
}

function locationSetSuccess(message) {
  MyLocation.log(message, {}, 'ok', 'user-facing');
}

function locationSetButtonLabel(label) {
  var element = document.getElementById('location-button');
  element.innerHTML = label;
}

/**
 * @param GeolocationPositionError error
 *   An error.
 */
function useYourLocationFailure(error) {
  locationSetError(error.message);
  locationSetButtonLabel('Try again (if this does not work you might need to reload the page)');
}

function locationRemoveButton() {
  var element = document.getElementById('location-action');
  element.classList.add('location-display-none');
}

/**
 * @param GeolocationPosition location
 *   A location.
 */
function useYourLocationSuccess(location) {
  locationSetSuccess('Congratulations, we got your location!');
  locationRemoveButton();
  locationSetCoords(location);
}

function locationSetCoords(location) {
  console.log('Here is the location object:');
  console.log(location);
  const text = location.coords.latitude + ', ' + location.coords.longitude + ' with accuracy ' + location.coords.accuracy;
  var element = document.getElementById('location-display');
  element.innerHTML = text;
}
