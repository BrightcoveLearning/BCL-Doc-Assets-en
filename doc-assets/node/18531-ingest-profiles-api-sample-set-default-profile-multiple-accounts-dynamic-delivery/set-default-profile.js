var BCLS = (function(window, document) {
  var account_id_input = document.getElementById('account_id_input'),
    client_id_input = document.getElementById('client_id_input'),
    client_secret_input = document.getElementById('client_secret_input'),
    get_profiles = document.getElementById('get_profiles'),
    set_default_profile = document.getElementById('set_default_profile'),
    update_default_profile = document.getElementById('update_default_profile'),
    profile_selector = document.getElementById('profile_selector'),
    profile_select = document.getElementById('profile_select'),
    logger = document.getElementById('logger'),
    api_request_display = document.getElementById('api_request_display'),
    api_request_body_display = document.getElementById('api_request_body_display'),
    api_response = document.getElementById('api_response'),
    profiles = [],
    account_ids = [],
    client_id,
    client_secret,
    selectedProfile;

  // event listeners
  get_profiles.addEventListener('click', function() {
    if  (getAccountInfo()) {
      createRequest('get_profiles');
    } else {
      alert('Account ID, Client ID, and Client Secret are required');
    }
  });

  set_default_profile.addEventListener('click', function() {
    selectedProfile = getSelectedValue(profile_select).value;
    if (isDefined(selectedProfile)) {
      createRequest('set_default_profile');
    } else {
      alert('Please select a profile and click this button again');
    }
  });

  update_default_profile.addEventListener('click', function() {
    selectedProfile = getSelectedValue(profile_select).value;
    if (isDefined(selectedProfile)) {
      createRequest('update_default_profile');
    } else {
      alert('Please select a profile and click this button again');
    }
  });

  /**
   * get account info from input fields
   */
  function getAccountInfo() {
    if (isDefined(account_id_input.value) && isDefined(client_id_input.value) && isDefined(client_secret_input.value)) {
      account_id    = removeSpaces(account_id_input.value);
      client_id     = removeSpaces(client_id_input.value);
      client_secret = removeSpaces(client_secret_input.value);
      return true;
    } else {
      return false;
    }
  }

  function logMessage(message) {
    var p = document.createElement('p'),
        txt = document.createTextNode(message);
    p.appendChild(txt);
    logger.appendChild(p);
  }

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
   * remove spaces from a string
   * @param {String} str string to process
   * @return {String} trimmed string
   */
  function removeSpaces(str) {
      str= str.replace(/\s/g, '');
      return str;
  }

  /**
   * enable a button element
   * @param  {HTMLelement} button a reference to a button element
   */
  function enableButton(button) {
    button.removeAttribute('disabled');
    button.setAttribute('style', 'opacity:1;');
  }

  /**
   * disable a button element
   * @param  {HTMLelement} button a reference to a button element
   */
  function disableButton(button) {
    button.setAttribute('disabled', 'disabled');
    button.setAttribute('style', 'opacity:.6;');
  }

  /**
   * get selected value for single select element
   * @param {htmlElement} e the select element
   * @return {Object} object containing the `value`, text, and selected `index`
   */
  function getSelectedValue(e) {
      var selected = e.options[e.selectedIndex],
          val = selected.value,
          txt = selected.textContent,
          idx = e.selectedIndex;
      return {
          value: val,
          text: txt,
          index: idx
      };
  }

  /**
   * adds options to a select element from an array of valuesArray
   * @param {HTMLelement} selectElement the select element reference
   * @param {Array} valuesArray the array of option values e.g. [{value:'a',label:'alpha'},{value:'b',label:'beta'}]
   */
  function addOptions(selectElement, valuesArray) {
    var i,
      iMax;
    if (selectElement && valuesArray) {
      iMax = valuesArray.length;
      for (i = 0; i < iMax; i++) {
        var option = document.createElement('option');
        option.setAttribute('value', valuesArray[i].value);
        option.textContent = valuesArray[i].label;
        selectElement.add(option);
      }
    } else {
      console.log('function addOptions: no parameters provided');
    }
  }

  /**
   * createRequest sets up requests, send them to makeRequest(), and handles responses
   * @param  {string} type the request type
   */
  function createRequest(type) {
    var options = {},
      requestBody = {},
      proxyURL = 'https://solutions.brightcove.com/bcls/bcls-proxy/ip2-proxy.php',
      baseURL = 'https://ingestion.api.brightcove.com/v1/accounts/' + account_id,
      endpoint,
      responseDecoded,
      today = new Date().toISOString(),
      tmpArray = [],
      i,
      iMax;

    // set credentials
    options.client_id = client_id;
    options.client_secret = client_secret;
    options.proxyURL = proxyURL;

    switch (type) {
      case 'get_profiles':
        logMessage('Getting profiles');
        endpoint = '/profiles';
        options.url = baseURL + endpoint;
        api_request_display.textContent = options.url;
        api_request_body_display.textContent = 'no request body for this operation';
        options.requestType = 'GET';
        makeRequest(options, function(response) {
          if (isJson(response)) {
            responseDecoded = JSON.parse(response);
            api_response.textContent = JSON.stringify(responseDecoded, null, '  ');
          } else {
            api_response.textContent = response;
            logMessage('The get profiles operation failed; see the API Response for the error');
            return;
          }
          if (Array.isArray(responseDecoded)) {
            iMax = responseDecoded.length;
            for (i = 0; i < iMax; i++) {
              if (responseDecoded[i].hasOwnProperty('dynamic_origin')) {
                var o = {value:responseDecoded[i].id, label:responseDecoded[i].name};
                tmpArray.push(o);
              }
            }
            addOptions(profile_select, tmpArray);
            enableButton(set_default_profile);
          }
        });
        break;
      case 'set_default_profile':
        logMessage('Setting the default profile');
        endpoint = '/configuration';
        options.url = baseURL + endpoint;
        api_request_display.textContent = options.url;
        options.requestType = 'POST';
        requestBody.account_id = account_id;
        requestBody.default_profile_id = selectedProfile;
        api_request_body_display.textContent = JSON.stringify(requestBody, null, '  ');
        options.requestBody = JSON.stringify(requestBody);
        makeRequest(options, function(response) {
          if (isJson(response)) {
            responseDecoded = JSON.parse(response);
            api_response.textContent = JSON.stringify(responseDecoded, null, '  ');
            // check for conflict - means default has already been set
            if (Array.isArray(responseDecoded) && responseDecoded[0].code === 'CONFLICT') {
              alert('The request failed because the default profile for the account has already been set - use Update Default Profile instead');
              enableButton(update_default_profile);
            }
          } else {
            api_response.textContent = response;
            logMessage('The set default profile operation failed; see the API Response for the error');
            return;
          }
        });
        break;
      case 'update_default_profile':
        logMessage('Updating the default profile');
        endpoint = '/configuration';
        options.url = baseURL + endpoint;
        api_request_display.textContent = options.url;
        options.requestType = 'PUT';
        requestBody.account_id = account_id;
        requestBody.default_profile_id = selectedProfile;
        api_request_body_display.textContent = JSON.stringify(requestBody, null, '  ');
        options.requestBody = JSON.stringify(requestBody);
        makeRequest(options, function(response) {
          if (isJson(response)) {
            responseDecoded = JSON.parse(response);
            api_response.textContent = JSON.stringify(responseDecoded, null, '  ');
          } else {
            api_response.textContent = response;
            logMessage('The set default profile operation failed; see the API Response for the error');
            return;
          }
        });
        break;
      default:
        console.log('Should not be getting to the default case - bad request type sent');
        break;
    }
  }

  /**
   * send API request to the proxy
   * @param  {Object} options for the request
   * @param  {String} options.url the full API request URL
   * @param  {String="GET","POST","PATCH","PUT","DELETE"} requestData [options.requestType="GET"] HTTP type for the request
   * @param  {String} options.proxyURL proxyURL to send the request to
   * @param  {String} options.client_id client id for the account (default is in the proxy)
   * @param  {String} options.client_secret client secret for the account (default is in the proxy)
   * @param  {JSON} [options.requestBody] Data to be sent in the request body in the form of a JSON string
   * @param  {Function} [callback] callback function that will process the response
   */
  function makeRequest(options, callback) {
      var httpRequest = new XMLHttpRequest(),
          response,
          requestParams,
          dataString,
          proxyURL    = options.proxyURL,
          // response handler
          getResponse = function() {
              try {
                  if (httpRequest.readyState === 4) {
                      if (httpRequest.status >= 200 && httpRequest.status < 300) {
                          response = httpRequest.responseText;
                          // some API requests return '{null}' for empty responses - breaks JSON.parse
                          if (response === '{null}') {
                              response = null;
                          }
                          // return the response
                          callback(response);
                      } else {
                          alert('There was a problem with the request. Request returned ' + httpRequest.status);
                      }
                  }
              } catch (e) {
                  alert('Caught Exception: ' + e);
              }
          };
      /**
       * set up request data
       * the proxy used here takes the following params:
       * url - the full API request (required)
       * requestType - the HTTP request type (default: GET)
       * clientId - the client id (defaults here to a Brightcove sample account value - this should always be stored on the server side if possible)
       * clientSecret - the client secret (defaults here to a Brightcove sample account value - this should always be stored on the server side if possible)
       * requestBody - request body for write requests (optional JSON string)
       */
      requestParams = "url=" + encodeURIComponent(options.url) + "&requestType=" + options.requestType;
      // only add client id and secret if both were submitted
      if (options.client_id && options.client_secret) {
          requestParams += '&client_id=' + options.client_id + '&client_secret=' + options.client_secret;
      }
      // add request data if any
      if (options.requestBody) {
          requestParams += '&requestBody=' + options.requestBody;
      }
      // set response handler
      httpRequest.onreadystatechange = getResponse;
      // open the request
      httpRequest.open('POST', proxyURL);
      // set headers
      httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      // open and send request
      httpRequest.send(requestParams);
  }

})(window, document);
