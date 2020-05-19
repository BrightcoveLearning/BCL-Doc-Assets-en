      var h1 = document.querySelector('h1'),
      new_location = '', // set to full URL of new location
      message = '<h3>This page has moved to <a href="' + new_location + '">' + new_location + '</a>. Please update your bookmark! You will be redirected in 5 seconds.<h3>';

      h1.insertAdjacentHTML('afterend', message);
      redirect();

      function redirect() {
        var t = window.setTimeout(go_to_new_location, 5000);
      }

      function go_to_new_location() {
        window.location.href = new_location;
      }
