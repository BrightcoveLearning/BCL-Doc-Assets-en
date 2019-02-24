var BCLS = (function (window, document) {
  var // account stuff
    account_id,
    account_ids,
    bcToken,
    client_id,
    client_secret,
    selectedProfile,
    // api stuff
    proxyURL = 'https://solutions.brightcove.com/bcls/bcls-proxy/bcls-proxy-v2.php',
    ipURL = 'https://ingestion.api.brightcove.com/v1/accounts/',
    ipAccountSuffix = '/configuration',
    ipProfileSuffix = '/profiles'
    totalCalls = 0,
    callNumber = 0,
    responseArray = [],
    accountsArray = [],
    defaultAccounts = ['1485884786001', '1937897674001'],
    profilesArray = [],
    // element references
    account_id_input = document.getElementById('account_id_input'),
    account_ids_input = document.getElementById('account_ids_input'),
    client_id_input = document.getElementById('client_id_input'),
    client_secret_input = document.getElementById('client_secret_input'),
    getProfiles = document.getElementById('getProfiles'),
    profileSelect = document.getElementById('profileSelect'),
    setDefaults = document.getElementById('setDefaults'),
    logger = document.getElementById('logger'),
    apiRequest = document.getElementById('apiRequest'),
    apiResponse = document.getElementById('apiResponse');


  /**
   * remove spaces from a string
   * @param {String} str string to process
   */
  function removeSpaces(str) {
    str = str.replace(/\s/g, '');
    return str;
  }

  /**
   * tests for all the ways a variable might be undefined or not have a value
   * @param {String|Number} x the variable to test
   * @return {Boolean} true if variable is defined and has a value
   */
  function isDefined(x) {
    if (x === "" || x === null || x === undefined) {
      return false;
    }
    return true;
  }

  /**
   * get selected value for single select element
   * @param {htmlElement} e the select element
   */
  function getSelectedValue(e) {
    return e.options[e.selectedIndex].value;
  }

  /**
   * determines if checkbox is checked
   * @param  {htmlElement}  e the checkbox to check
   * @return {Boolean}  true if box is checked
   */
  function isChecked(e) {
    if (e.checked) {
      return true;
    }
    return false;
  }

  /**
   * disables a button so user can't submit new request until current one finishes
   */
  function disableButton(button) {
    button.setAttribute('disabled', 'disabled');
    button.setAttribute('style', 'opacity:.5,cursor:not-allowed;');
  }

  /**
   * enables a button
   * @param {htmlElement} button - the button to enable
   */
  function enableButton(button) {
    button.removeAttribute('disabled');
    button.setAttribute('style', 'opacity:1;cursor:pointer;');
  }

  /**
   * sets up the data for the API request
   * @param {String} id the id of the button that was clicked
   */
  function setoptions(id, type) {
    var i,
      iMax,
      options = {};
    options.account_id = accountsArray[callNumber];
    options.proxyURL = proxyURL;
    if (isDefined(client_id) && isDefined(client_secret)) {
      options.client_id = client_id;
      options.client_secret = client_secret;
      options.url = ipURL + endPoint + ipProfileSuffix;
      options.requestType = type;
    }
    switch (id) {
      case 'getProfiles':
       endpoint = accountsArray[callNumber];
      case 'setDefaults':
        var reqBody = {},
          now;
        logger.textContent = 'Processing account: ' + accountsArray[callNumber];
        endPoint = accountsArray[callNumber];
        options.url = ipURL + endPoint + ipAccountSuffix;
        options.requestType = type;
        reqBody.default_profile_id = newProfile;
        options.requestBody = JSON.stringify(reqBody);
        apiRequest.textContent = options.url;
        makeRequest(options, function (response) {
          var now = new Date().toISOString();
          parsedData = JSON.parse(response);
          responseArray.push(parsedData);
          if (Array.isArray(parsedData)) {
            // we have an error, most likely a conflict because default has already been set - try update instead
            setoptions('setDefaults', 'PUT');
          } else {
            callNumber++;
            if (callNumber < totalCalls) {
              setoptions('setDefaults', 'POST');
            } else {
              logger.textContent = 'Finished at ' + now;
              apiResponse.textContent = JSON.stringify(responseArray, null, '  ');
            }
          }

        });
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
      proxyURL = options.proxyURL,
      // response handler
      getResponse = function () {
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
     * the proxy used here takes the following request body:
     * JSON.stringify(options)
     */
    // set response handler
    httpRequest.onreadystatechange = getResponse;
    // open the request
    httpRequest.open('POST', proxyURL);
    // set headers if there is a set header line, remove it
    // open and send request
    httpRequest.send(JSON.stringify(options));
  }

  function init() {
    var i,
      iMax,
      opt;
    // set up profiles selector
    iMax = profilesArray.length;
    for (i = 0; i < iMax; i++) {
      opt = document.createElement('option');
      opt.value = profilesArray[i];
      opt.text = profilesArray[i];
      profileSelect.add(opt, null);
    }
    // event handlers
    getProfiles.addEventListener('click', function () {
      var accountIds;
      // get the inputs
      client_id = client_id_input.value;
      client_secret = client_secret_input.value;
      newProfile = getSelectedValue(profileSelect);
      // only use entered account id if client id and secret are entered also
      if (isDefined(client_id) && isDefined(client_secret)) {
        if (isDefined(account_id_input.value) && isDefined(account_ids_input.value)) {
          account_id = account_id_input.value;
          accountIds = removeSpaces(account_ids_input.value);
          accountsArray = accountIds.split(',');
        } else {
          window.alert('To use your own account, you must specify an account id, and client id, and a client secret - since at least one of these is missing, a sample account will be used');
          client_id = '';
          client_secret = '';
          accountsArray = defaultAccounts;
        }
      } else {
        accountsArray = defaultAccounts;
      }
      totalCalls = accountsArray.length;
      setoptions('setDefaults', 'POST');
    });

    apiResponse.addEventListener('click', function () {
      apiResponse.select();
    });
  }
  // kick things off
  init();
})(window, document);
