    var BCLS = (function(window, document) {
      var $client_id = document.getElementById("client_id"),
        $client_secret = document.getElementById("client_secret"),
        $requestBody = document.getElementById("requestBody"),
        $requestType = document.getElementById("requestType"),
        $url = document.getElementById("url"),
        $submit = document.getElementById("submit"),
        $response = document.getElementById("response");

      // is defined
      function isDefined(x) {
        if (x === "" || x === null || x === undefined) {
          return false;
        }
        return true;
      }
      // function to remove spaces and line breaks
      function cleanString(str) {
        if (str !== "") {
          // remove line breaks
          str = str.replace(/(\r\n|\n|\r)/gm, "");
          // remove spaces
          // here we have to be careful - spaces fine within strings
          // but not outside them
          str = JSON.stringify(JSON.parse(str));
          return str;
        } else {
          return;
        }
      }
      /*
       * tests to see if a string is json
       * @param {String} str string to test
       * @return {Boolean}
       */
      function isJson(str) {
        try {
          JSON.parse(str);
        } catch (e) {
          return false;
        }
        return true;
      }
      // function to submit Request
      submitRequest = function() {
        var httpRequest = new XMLHttpRequest(),
          parsedData,
          proxyURL = 'https://solutions.brightcove.com/bcls/bcls-proxy/brightcove-learning-proxy-v2.php',
          options = {};
        if (isDefined($client_id.value) && isDefined($client_secret.value)) {
          options.client_id = $client_id.value;
          options.client_secret = $client_secret.value;
        }
        if (isDefined($requestBody.value)) {
          options.requestBody = cleanString($requestBody.value);
        }
        options.requestType = $requestType.value;
        options.url = $url.value;
        console.log('options', options);
        getResponse = function() {
          try {
            if (httpRequest.readyState === 4) {
              if (httpRequest.status >= 200 && httpRequest.status < 300) {
                console.log('response', httpRequest.responseText);
                if (isJson(httpRequest.responseText)) {
                  parsedData = JSON.parse(httpRequest.responseText);
                  $response.textContent = JSON.stringify(parsedData, null, '  ');
                } else {
                  $response.textContent = httpRequest.responseText;
                }
              } else {
                alert('There was a problem with the request. Request returned ' + httpRequest.status);
              }
            }
          } catch (e) {
            alert('Caught Exception: ' + e);
          }
        };
        // set up request data
        // open the request
        httpRequest.open('POST', proxyURL);
        // open and send request
        httpRequest.send(JSON.stringify(options));
      };
      $submit.addEventListener("click", submitRequest);
    })(window, document);
