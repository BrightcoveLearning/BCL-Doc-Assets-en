var BCLS = ( function (window, document) {
  var clientId   = document.getElementById('clientId'),
    clientSecret = document.getElementById('clientSecret'),
    submitButton = document.getElementById('submitButton'),
    accessToken  = document.getElementById('accessToken'),
    apiResponse  = document.getElementById('apiResponse'),
    options      = {},
    proxyURL     = 'https://solutions.brightcove.com/bcls/bcls-proxy/access-token-proxy.php',
    access_token;

// event handlers
submitButton.addEventListener('click', function() {
  var responseParsed;
  if (isDefined(clientId.value) && isDefined(clientSecret.value)) {
    options.client_id     = clientId.value;
    options.client_secret = clientSecret.value;
    makeRequest(options, function(response) {
      if (isJson(response)) {
        responseParsed          = JSON.parse(response);
        access_token            = responseParsed.access_token;
        accessToken.textContent = access_token;
        apiResponse.textContent = JSON.stringify(responseParsed, null, '  ');
      } else {
        // didn't get JSON back, just dump responseRaw
        apiResponse.textContent = response;
      }
    });
  } else {
    alert('Client id and secret are required.');
  }
});

accessToken.addEventListener('click', function() {
  this.select();
});

/**
 * tests for all the ways a variable might be undefined or not have a value
 * @param {*} x the variable to test
 * @return {Boolean} true if variable is defined and has a value
 */
function isDefined(x) {
    if ( x === '' || x === null || x === undefined) {
        return false;
    }
    return true;
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

/**
 * send API request to the proxy
 * @param  {Object} options options for the request
 * @param  {String} requestID the type of request = id of the button
 * @param  {Function} [callback] callback function
 */
function makeRequest(options, callback) {
  var httpRequest = new XMLHttpRequest(),
    responseRaw,
    requestParams,
    // response handler
    getResponse = function() {
      try {
        if (httpRequest.readyState === 4) {
          if (httpRequest.status >= 200 && httpRequest.status < 300) {
            // check for completion
            responseRaw = httpRequest.responseText;
            callback(responseRaw);
          }
        }
      } catch (e) {
        alert('Caught Exception: ' + e);
      }
    };
  // set up request data
  requestParams = 'client_id=' + options.client_id + '&client_secret=' + options.client_secret;

  // set response handler
  httpRequest.onreadystatechange = getResponse;
  // open the request
  httpRequest.open('POST', proxyURL);
  // set headers
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  // open and send request
  httpRequest.send(requestParams);
}

})(window, document);
