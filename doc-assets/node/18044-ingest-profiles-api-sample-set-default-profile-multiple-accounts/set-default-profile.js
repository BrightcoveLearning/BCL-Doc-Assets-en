var BCLS = (function(window, document) {
  var // account stuff
    accountId,
    bcToken,
    clientId,
    clientSecret,
    newProfile,
    // api stuff
    proxyURL = 'https://solutions.brightcove.com/bcls/bcls-proxy/beml-proxy-v2.php',
    ipURL = 'https://ingestion.api.brightcove.com/v1/accounts/',
    ipURLsuffix = '/configuration',
    totalCalls = 0,
    callNumber = 0,
    responseArray = [],
    accountsArray = [],
    defaultAccounts = ['1485884786001'],
    profilesArray = ['smart-player-transition', 'videocloud-default-v1', 'high-resolution', 'screencast-1280', 'single-bitrate-high', 'single-bitrate-standard'],
    // elements
    account_ids = document.getElementById('account_ids'),
    client_id = document.getElementById('client_id'),
    client_secret = document.getElementById('client_secret'),
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
      options.client_id = clientId;
      options.client_secret = clientSecret;
    }
    switch (id) {
      case 'setDefaults':
        var reqBody = {},
          now;
    logger.textContent = 'Processing account: ' + accountsArray[callNumber];
    endPoint = accountsArray[callNumber];
    options.url = ipURL + endPoint + ipURLsuffix;
    options.requestType = type;
    reqBody.account_id = parseInt(accountsArray[callNumber]);
    reqBody.default_profile_id = newProfile;
    options.requestBody = JSON.stringify(reqBody);
    apiRequest.textContent = options.url;
    makeRequest(options, function(response) {
      var now = new Date().toISOString();
      parsedData = JSON.parse(response);
      if (isDefined(parsedData.code)) {
        setoptions('setDefaults', 'PUT');
      } else {
        responseArray.push(parsedData);
        callNumber++;
        if (callNumber < totalCalls) {
          setoptions('setDefaults', 'POST');
        }
      }

      logger.textContent = 'Finished at ' + now;
      apiResponse.textContent = JSON.stringify(parsedData, null, '  ');
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
  setDefaults.addEventListener('click', function() {
    var accountIds;
    // get the inputs
    clientId = client_id.value;
    clientSecret = client_secret.value;
    newProfile = getSelectedValue(profileSelect);
    // only use entered account id if client id and secret are entered also
    if (isDefined(clientId) && isDefined(clientSecret)) {
      if (isDefined(account_ids.value)) {
        accountIds = removeSpaces(account_ids.value);
        accountsArray = accountIds.split(',');
      } else {
        window.alert('To use your own account, you must specify an account id, and client id, and a client secret - since at least one of these is missing, a sample account will be used');
        clientId = '';
        clientSecret = '';
        accountsArray = defaultAccounts;
      }
    } else {
      accountsArray = defaultAccounts;
    }
    totalCalls = accountsArray.length;
    setoptions('setDefaults', 'POST');
  });

  apiResponse.addEventListener('click', function() {
    apiResponse.select();
  });
}
// kick things off
init();
})(window, document);
