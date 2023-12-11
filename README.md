Demo: Fetching a user's location
=====

This demo is available at <location.demo.dcycle.com>.

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

You can see an example in the enclosed index.html file and at <location.demo.dcycle.com>.

So what features have we added?












    <h2>Resetting the geolocation permission</h2>
    <p>When this page is loaded, we will attempt to check if geolocation permission has been previously given, or denied.</p>
    <p>To simulate the case where it has never been given or denied, we can do the following:</p>
    <ul>
      <li>In Chrome, go to Privacy and security &gt; Site Settings &gt; Location, then click the trash icon next to the website.</li>
      <li>In Firefox, go to Preferences, then search for "Location", then click Settings next to Location, then remove the website.</li>
      <li>In Safari, click Settings, then Websites, then Location, then either remove the website or set it to "Ask".</li>
    </ul>
    <h2>Resources</h2>
    <ul>
      <li><a href="https://stackoverflow.com/questions/77635774">The web permissions API revoke() method is deprecated; what is the best way to revoke a permission such as 'geolocation'?, StackOverflow, Dec. 10, 2023</a></li>
    </ul>
