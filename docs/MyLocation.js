/**
 * Encompasses functionality for getting my location. For usage, see
 * index.html.
 */
MyLocation = {
  /**
   * Customize using a custom settings object to integrate with your web page.
   *
   * Your custom object can implement any method is which defined in the
   * MyLocationDefaultCustomSettings object below.
   */
  customize: function(customObject) {
    this._customObject = customObject;
    return this;
  },
  /**
   * Get the custom settings object to integrate with your web page.
   *
   * If your custom object does not exist or does not implement any method
   * defined in MyLocationDefaultCustomSettings, below, then the method from
   * MyLocationDefaultCustomSettings will be used.
   */
  settings: function() {
    if (typeof this._customObject === 'undefined') {
      this._customObject = {};
    }
    return {...MyLocationDefaultCustomSettings, ...this._customObject};
  },
  /**
   * Set the backend. The backend is what actually does the work of getting
   * the location. See MyLocationLiveBackend, or MyLocationMockBackend, for
   * examples.
   */
  setBackend: function(backend) {
    this._backend = backend;
    return this;
  },
  /**
   * Get the backend.
   */
  backend: function() {
    if (typeof this._backend === 'undefined') {
      this._backend = MyLocationLiveBackend;
    }
    return this._backend;
  },
  /**
   * Log a message.
   *
   * Severity can be notice, ok, or error.
   *
   * Category can be debug, mock-vs-real, or user-facing.
   */
  log: function(message, severity, category) {
    this.settings().log(message, severity, category);
  },
  /**
   * Use the live backend and reinitialize. You can change this by running
   * MyLocation. useMockBackend(), then switch back by using
   * MyLocation.useLiveBackend().
   */
  useLiveBackend: function() {
    this.log('Using the live location services. You might want to try alternating between mock location services and real location services during local development by running MyLocation.useMock() and MyLocation.useReal().', 'ok', 'mock-vs-real');
    this
      .setBackend(MyLocationLiveBackend)
      .init();
  },
  /**
   * Initialize, or reinitilize, the system.
   */
  init: function() {
    if (!this.backend().https()) {
      this.log('We cannot use location services over http. Please use https.', 'error', 'user-facing');
      this.settings().fatal();
    }
    else {
      locationCheckIfWeHavePermission();
    }
    return this;
  },
}

/**
 * Default settings for MyLocation. You can override any of these methods by
 * defining a custom object and passing it to MyLocation.customize().
 */
MyLocationDefaultCustomSettings = {
  /**
   * Log information.
   *
   * @param {*} message
   *   The actual message as an untranslated string, for example,
   *   "Hello my name is %s".
   * @param {*} severity
   *   Can be "info", "error" or "notice".
   * @param {*} category
   *   A category for the message, "mock-vs-real" or "user-facing" or "debug".
   */
  log: function(message, severity, category) {
    console.log('[' + category + '] [' + severity + '] ' + message);
  },
  /**
   * A fatal problem has occurred such as using http instead of https, which
   * prevents us from using location services. This might be a queue to remove
   * the "use your location" button, for example.
   */
  fatal: function() {
    console.log('[fatal] cannot use location.');
  }
}

/**
 * The live backend.
 */
MyLocationLiveBackend = {
  https: function() {
    return location.protocol === 'https:';
  },
}

// MyLocation2 = {
//   customize: function(customObject) {
//     this._customObject = customObject;
//   },
//   customObject: function() {
//     if (typeof this._customObject === 'undefined') {
//       this._customObject = {};
//     }
//     return {...DefaultCustomOject, ...this._customObject};
//   },
//   init: function() {
//     this.customObject.setBackend();
//     this.populateHtml();
//     if (!this.backend().https()) {
//       locationSetError('We cannot use location services over http. Please use https.');
//       locationRemoveButton();
//     }
//     else {
//       locationCheckIfWeHavePermission();
//     }
//     return this;
//   },
//   populateHtml: function() {
//     this.customObject().populateHtml();
//     this.customObject().enableLocationButton();


//     var element = document.getElementById('location-button');
//     element.innerHTML = label;

//   //   <div id="location-mock-vs-real" class="location-info location-section location-message-ok">
//   //   Using the live location services. You might want to try alternating between mock location services and real location services during local development by running MyLocation.useMock() and MyLocation.useReal().
//   // </div>
//   // <div id="location-user-facing" class="location-message location-section location-message-ok">
//   //   Click "use your location" below to allow us to access your location.
//   // </div>
//   // <div id="location-action" class="location-action location-section">
//   //   <div class="location-action-use-your-location">
//   //     <a id="location-button" class="location-button">Use your location</a>.
//   //   </div>
//   // </div>
//   // <div id="location-display" class="location-display location-section">
//   //   We currently do not know your location.
//   // </div>

//   },
//   setLogCallback: function(callback) {
//     this.logCallback = callback;
//     return this;
//   },
//   setCoordinatesCallback: function(callback) {
//     this.coordsCallback = callback;
//     return this;
//   },
//   waitForCallbackInsteadOfAskingRightAway: function(callback) {
//     this.askCallback = callback;
//     return this;
//   },
//   debug: function(message) {
//     this.log(message, {}, 'notice', 'debug');
//   },
//   log: function(message, args, severity, category) {
//     if (this.logCallback) {
//       this.logCallback(message, args, severity, category);
//     }
//     else {
//       console.log();
//     }
//   },
//   backend: function() {
//     if (typeof this._backend === 'undefined') {
//       this._backend = MyLocationLiveBackend;
//     }
//     return this._backend;
//   },
//   useMock: function() {
//     this.log('Using the mock location services. You might want to try alternating between mock location services and real location services during local development by running MyLocation.useMock() and MyLocation.useReal().', {}, 'ok', 'mock-vs-real');
//     this
//       .setBackend(MyLocationMockBackend)
//       .init();
//   },
//   useReal: function() {
//   }
// }

// // https://stackoverflow.com/questions/10077606/check-if-geolocation-was-allowed-and-get-lat-lon

// // https://stackoverflow.com/questions/77635774/the-web-permissions-api-revoke-method-is-deprecated-what-is-the-best-way-to-r




// MyLocationLiveBackend = {
//   https: function() {
//     if (typeof this._https === 'undefined') {
//       this._https = true;
//     }
//     MyLocation.debug('Simulating using https: ' + this._https);
//     return this._https;
//   },
// }

// function locationCheckIfWeHavePermission() {
//   navigator.permissions.query({name:'geolocation'}).then(function(result) {
//     switch (result.state) {
//       case 'granted':
//         useYourLocation();
//         break;

//       case 'prompt':
//         locationSetPrompt();
//         break;

//       case 'denied':
//         locationSetError('Your browser does not seem to have access to location services, or the user has previously denied access. You might need to allow geolocaiton in your settings, or see the "Resetting the geolocation permission" section, below.');
//         break;

//       default:
//         locationSetError('When checking for permission, we got the unexpected state ' + result.state + '.');
//         break;
//     }
//   }).catch(e => locationSetPrompt());
// }

// function locationSetPrompt() {
//   document.getElementById('location-button').onclick = useYourLocation;
// }

// function useYourLocation() {
//   locationSetWaiting('Waiting for permission to use location.');
//   // See
//   // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition.
//   try {
//     navigator.geolocation.getCurrentPosition(useYourLocationSuccess, useYourLocationFailure, {
//       maximumAge: 0,
//       timeout: Infinity,
//       enableHighAccuracy: false,
//     });
//   }
//   catch (error) {
//     console.log(error);
//   }
// }

// function locationSetError(message) {
//   MyLocation.log(message, {}, 'error', 'user-facing');
// }

// function locationSetWaiting(message) {
//   MyLocation.log(message, {}, 'waiting', 'user-facing');
// }

// function locationSetSuccess(message) {
//   MyLocation.log(message, {}, 'ok', 'user-facing');
// }

// function locationSetButtonLabel(label) {
//   var element = document.getElementById('location-button');
//   element.innerHTML = label;
// }

// /**
//  * @param GeolocationPositionError error
//  *   An error.
//  */
// function useYourLocationFailure(error) {
//   locationSetError(error.message);
//   locationSetButtonLabel('Try again (if this does not work you might need to reload the page)');
// }

// function locationRemoveButton() {
//   var element = document.getElementById('location-action');
//   element.classList.add('location-display-none');
// }

// /**
//  * @param GeolocationPosition location
//  *   A location.
//  */
// function useYourLocationSuccess(location) {
//   locationSetSuccess('Congratulations, we got your location!');
//   locationRemoveButton();
//   locationSetCoords(location);
// }

// function locationSetCoords(location) {
//   console.log('Here is the location object:');
//   console.log(location);
//   const text = location.coords.latitude + ', ' + location.coords.longitude + ' with accuracy ' + location.coords.accuracy;
//   var element = document.getElementById('location-display');
//   element.innerHTML = text;
// }
