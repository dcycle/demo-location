Demo: Fetching a user's location
=====

This demo is available at <https://location.demo.dcycle.com>.

How to fetch a user's location
-----

The basic functionality to fetch a user's location can be something like this:

    navigator.geolocation.getCurrentPosition(successCallback, failureCallback);
    successCallback(location) {
      console.log('Your coordinates are:')
      console.log(location.coords.latitude + ', ' + location.coords.longitude);
    }
    function failureCallback(error) {
      locationSetError(error.message);
    }

If it's that simple, then why this project?
-----

This project adds the features listed below, so you might find it useful. Instead of the above, you would use this project like this:

    MyLocationCustomSettings = {
      showCoords(coords) {
        console.log('Your coordinates are:')
        console.log(location.coords.latitude + ', ' + location.coords.longitude);
      }
      log(message, severity, category) {
        if (severity === 'error' && category === 'user-facing') {
          console.log(message);
        }
      }
    }
    MyLocation
      .customize(MyLocationCustomSettings)
      .init();

You can see an example in the enclosed index.html file and at <https://location.demo.dcycle.com>.

So what features have we added?

Feature: use mock backend for development (for example to http instead of https)
-----

If you visit <http://location.demo.dcycle.com> (using http instead of https), you will see an error:

    We cannot use location services over http. Please use https.

This means that no location services can be used over http, you must use https.

However we can provide a mock backend which will simulate using https. This can be done by running this code in your browser's console:

    MyLocation.useMockBackend();

You can then use the following:

* [default] `MyLocationMockBackend._https = false; MyLocation.init();` to simulate using http.
* `MyLocationMockBackend._https = true; MyLocation.init();` to simulate using https.
* [default] `MyLocationMockBackend._permission = 'prompt'; MyLocation.init();` to simulate a case where the user has never allowed your site to use permissions.
* `MyLocationMockBackend._permission = 'granted'; MyLocation.init();` to simulate a case where the user has already granted your site permission to use their location.
* `MyLocationMockBackend._permission = 'denied'; MyLocation.init();` to simulate a case where you cannot use location for whatever reason (either it's blocked at the OS level or the user has already denied access), so it's no use even asking for it.
* [default] `MyLocationMockBackend._userAllow = true; MyLocation.init();` to simulate the case where a site visitor allows a site to use their location.
* `MyLocationMockBackend._userAllow = false; MyLocation.init();` to simulate the case where a site visitor denies a site usage of their location.

Feature: check permissions
-----

We are using the Permissions API to figure out if we have access, or should not have access, to the user's location.

Resetting the geolocation permission
-----

When this page is loaded, we will attempt to check if geolocation permission has been previously given, or denied.

To simulate the case where it has never been given or denied, we can do the following:

* In Chrome, go to Privacy and security &gt; Site Settings &gt; Location, then click the trash icon next to the website.
* In Firefox, go to Preferences, then search for "Location", then click Settings next to Location, then remove the website.
* In Safari, click Settings, then Websites, then Location, then either remove the website or set it to "Ask".

Resources
-----

* [The web permissions API revoke() method is deprecated; what is the best way to revoke a permission such as 'geolocation'?, StackOverflow, Dec. 10, 2023](https://stackoverflow.com/questions/77635774)
