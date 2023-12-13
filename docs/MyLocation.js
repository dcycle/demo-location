/**
 * Encompasses functionality for getting my location. For usage, see
 * index.html.
 *
 * See https://github.com/dcycle/demo-location.
 */
MyLocation = {
  /**
   * Customize using a custom UI object to integrate with your web page.
   *
   * Your custom object can implement any method is which defined in the
   * MyLocationDefaultCustomUI object below.
   *
   * You can customize any number of times.
   *
   * Omit the argument to reset to the default UI.
   */
  customize: function(customUI) {
    let ui = this.ui();
    if (typeof customUI === 'undefined') {
      this._customUI = MyLocationDefaultCustomUI;
    }
    else {
      this._customUI = {...ui, ...customUI};
    }
    return this;
  },
  reactToPermission: function(permission) {
    switch (permission.state) {
      case 'granted':
        // This won't actually prompt because the permission is already granted.
        this.prompt();
        break;

      case 'prompt':
        this.ui().debug("The permission is set to prompt, meaning that we can ask for the user's location.");
        this.ui().canPromptForLocation();
        break;

      case 'denied':
        this.promptFailure({
          message: 'User denied access to location services.',
        });
        break;

      default:
        this.ui().debug('When checking for permission, we got the unexpected state ' + permission.state + '.');
        break;
    }
  },
  gotLocation: function(position) {
    MyLocation.ui().gotLocation(position);
  },
  promptFailure: function(failure) {
    MyLocation.ui().promptFailure(failure);
  },
  /**
   * Get the custom UI object to integrate with your web page.
   *
   * This will include any customizations you have made using the customize()
   * function.
   */
  ui: function() {
    if (typeof this._customUI === 'undefined') {
      this._customUI = MyLocationDefaultCustomUI;
    }
    return this._customUI;
  },
  /**
   * Set the backend. The backend is what actually does the work of getting
   * the location. See MyLocationLiveBackend, or MyLocationMockBackend, for
   * example.
   */
  setBackendAndInit: function(backend) {
    this.setBackend(backend);
    this.init();
    return this;
  },
  setBackend: function(backend) {
    this.ui().informBackendChange(backend.label());
    this._backend = backend;
  },
  /**
   * Get the backend.
   */
  backend: function() {
    if (typeof this._backend === 'undefined') {
      this.setBackend(MyLocationLiveBackend);
    }
    return this._backend;
  },
  prompt: function() {
    this.ui().waiting();
    this.backend().prompt();
  },
  /**
   * Use the live backend and reinitialize. You can change this by running
   * MyLocation.useMockBackend(), then switch back by using
   * MyLocation.useLiveBackend().
   */
  useLiveBackend: function() {
    this.ui().debug('Using the live location services. You might want to try alternating between mock location services and real location services during local development by running MyLocation.useMock() and MyLocation.useReal().', 'ok', 'debug');
    this
      .setBackendAndInit(MyLocationLiveBackend);
  },
  useMockBackend: function() {
    this.ui().debug('Using the mock location services. You might want to try alternating between mock location services and real location services during local development by running MyLocation.useMock() and MyLocation.useReal().', 'ok', 'debug');
    this
      .setBackendAndInit(MyLocationMockBackend);
  },
  /**
   * Initialize, or reinitilize, the system.
   */
  init: function() {
    this.ui().init();
    this.backend().init();
    this.ui().debug('Ready.', 'ok', 'user-facing');
    if (!this.backend().https()) {
      this.ui().cannotGetLocation('We cannot use location services over http. Please use https.');
      this.ui().fatal();
    }
    else {
      this.backend().checkPermission();
    }
    return this;
  },
}

/**
 * Default UI for MyLocation. You can override any of these methods by
 * defining a custom object and passing it to MyLocation.customize().
 */
MyLocationDefaultCustomUI = {
  debug: function(message) {
    console.log('[location debug] ' + message);
  },
  waiting: function() {
    console.log('Waiting for permission to use location.');
  },
  informBackendChange: function(label) {
    console.log('Now using ' + label);
  },
  init: function() {
    // Do nothing.
  },
  /**
   * A fatal problem has occurred such as using http instead of https, which
   * prevents us from using location services. This might be a queue to remove
   * the "use your location" button, for example.
   */
  fatal: function() {
    console.log('[fatal] cannot use location.');
  },
  canPromptForLocation: function() {
    // You can override this to have a button which allows the user to ask for
    // their location, instead of asking for it right away, which can be
    // obtrusive.
    MyLocation.prompt();
  },
  gotLocation: function(location) {
    console.log('Here is the location object:');
    console.log(location);
  },
  promptFailure: function(failure) {
    console.log('Could not fetch the location due to:');
    console.log(failure);
  }
}

/**
 * The live backend.
 */
MyLocationLiveBackend = {
  label: function() {
    return 'Live Backend';
  },
  https: function() {
    return location.protocol === 'https:';
  },
  init: function() {
    // Do nothing.
  },
  checkPermission: function() {
    navigator.permissions.query({name:'geolocation'}).then(function(result) {
      MyLocation.reactToPermission(result);
    }).catch(e => MyLocation.reactToPermission('prompt'));
  },
  prompt: function() {
    // See
    // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition.
    try {
      navigator.geolocation.getCurrentPosition(MyLocation.gotLocation, MyLocation.promptFailure, {
        maximumAge: 0,
        timeout: Infinity,
        enableHighAccuracy: false,
      });
    }
    catch (error) {
      MyLocation.fatal(error);
    }
  },
}

/**
 * The mock backend.
 */
MyLocationMockBackend = {
  label: function() {
    return 'Mock Backend';
  },
  https: function() {
    if (typeof this._https === 'undefined') {
      this._https = false;
    }
    return this._https;
  },
  init: function() {
    console.log('Welcome to the mock location backend.');
    console.log('');
    console.log('See https://github.com/dcycle/demo-location for usage.');
    console.log('');
  },
  userAllow: function() {
    if (typeof this._userAllow === 'undefined') {
      this._userAllow = true;
    }
    return this._userAllow;
  },
  permission: function() {
    if (typeof this._permission === 'undefined') {
      this._permission = 'prompt';
    }
    return this._permission;
  },
  checkPermission: function() {
    MyLocation.reactToPermission({state: this.permission()});
  },
  prompt: function() {
    const that = this;
    setTimeout(function() {
      if (that.userAllow()) {
        MyLocation.gotLocation({
          coords: {
            latitude: Math.random() * 180 - 90,
            longitude: Math.random() * 360 - 180,
            accuracy: Math.floor(Math.random() * 100),
          }
        });
      }
      else {
        MyLocation.promptFailure({
          message: 'User denied access to location services.',
        });
      }
    }, 750);
  },
}
