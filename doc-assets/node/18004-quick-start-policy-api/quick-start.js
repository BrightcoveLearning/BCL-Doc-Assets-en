var BCLS = (function() {
    var account_id = document.getElementById('account_id'),
        client_id = document.getElementById('client_id'),
        client_secret = document.getElementById('client_secret'),
        accountId,
        clientId,
        clientSecret,
        apiRequest = document.getElementById('apiRequest'),
        requestBody = document.getElementById('requestBody'),
        apiResponse = document.getElementById('apiResponse'),
        generateKey = document.getElementById('generateKey'),
        allButtons = document.getElementsByTagName('button'),
        // api urls
        proxyURL = 'https://solutions.brightcove.com/bcls/bcls-proxy/doc-samples-proxy-v2.php',
        baseURL = 'https://policy.api.brightcove.com/v1/accounts/',
        urlSuffix = '/policy_keys';

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

    /**
     * disables all buttons so user can't submit new request until current one finishes
     */
    function disableButtons() {
        var i,
            iMax = allButtons.length;
        for (i = 0; i < iMax; i++) {
            allButtons[i].setAttribute('disabled', 'disabled');
        }
    }

    /**
     * re-enables all buttons
     */
    function enableButtons() {
        var i,
            iMax = allButtons.length;
        for (i = 0; i < iMax; i++) {
            allButtons[i].removeAttribute('disabled');
        }
    }

    /**
     * sets up the data for the API request
     * @param {String} id the id of the button that was clicked
     */
    function setRequestData() {
        var options = {},
          body = {},
            callback = function(response) {
              response = JSON.parse(response);
                apiResponse.textContent = JSON.stringify(response, null, '  ');
                enableButtons();
            };
            // disable buttons to prevent a new request before current one finishes
        disableButtons();
        options.url = baseURL + accountId + urlSuffix;
        options.requestType = 'POST';
        body[key-data] = {};
        body[key-data][account-id] = accountId;
        body[key-data].apis = ["search"];
        options.requestBody = JSON.stringify(body);
        if (isDefined(clientId) && isDefined(clientSecret)) {
          options.client_id = clientId;
          options.client_secret = clientSecret;
        }
        options.proxyURL = proxyURL;
        apiRequest.textContent = options.url;
        requestBody.textContent = JSON.stringify(JSON.parse(options.requestBody), null, '  ');
        makeRequest(options, callback);
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
    // event handlers
    generateKey.addEventListener('click', function() {
        // get the inputs
        clientId = client_id.value;
        clientSecret = client_secret.value;
      console.log(clientId);
      console.log(clientSecret);

        // only use entered account id if client id and secret are entered also
        if (isDefined(clientId) && isDefined(clientSecret)) {
            if (isDefined(account_id.value)) {
                accountId = account_id.value;
            } else {
                window.alert('To use your own account, you must specify an account id, and client id, and a client secret - since at least one of these is missing, a sample account will be used');
                clientId = '';
                clientSecret = '';
                accountId = '1752604059001';
            }
        } else {
            accountId = '1752604059001';
        }
        setRequestData();
    });
    apiResponse.addEventListener('click', function() {
        apiResponse.select();
    });
}

init();
})();
