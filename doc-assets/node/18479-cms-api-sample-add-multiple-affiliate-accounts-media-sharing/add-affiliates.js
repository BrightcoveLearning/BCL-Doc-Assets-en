var BCLS = (function(window, document) {
  var accountId    = document.getElementById('accountId'),
    clientId       = document.getElementById('clientId'),
    clientSecret   = document.getElementById('clientSecret'),
    getChannels    = document.getElementById('getChannels'),
    addChannel     = document.getElementById('addChannel'),
    affiliateId    = document.getElementById('affiliateId'),
    addAffiliateId = document.getElementById('addAffiliateId'),
    affiliateIds   = document.getElementById('affiliateIds'),
    addAffiliates  = document.getElementById('addAffiliates'),
    logger         = document.getElementById('logger'),
    apiRequest     = document.getElementById('apiRequest'),
    apiResponse    = document.getElementById('apiResponse'),
    affiliate_ids  = [];

  // add event listeners
  getChannels.addEventListener('click', function() {
    if (isDefined(accountId.value) && isDefined(clientId.value) && isDefined(clientSecret.value)) {
      createRequest(getChannels);
    } else {
      alert('You must submit an account id and client credentials');
    }
  });
  addChannel.addEventListener('click', function() {
    createRequest(addChannel);
  });
  addAffiliateId.addEventListener('click', addAffiate);
  addAffiliates.addEventListener('click', function() {
    if (isDefined(accountId.value) && isDefined(clientId.value) && isDefined(clientSecret.value)) {
      createRequest(addAffiate);
    } else {
      alert('You must submit an account id and client credentials');
    }
  });

  /**
   * tests for all the ways a variable might be undefined or not have a value
   * @param {*} x the variable to test
   * @return {Boolean} true if variable is defined and has a value
   */
  function isDefined(x) {
    if (x === '' || x === null || x === undefined) {
      return false;
    }
    return true;
  }

  /**
   * dedupe a simple array of strings or numbers
   * @param {array} arr the array to be deduped
   * @return {array} out the deduped array
   */
  function dedupe(arr) {
    var i,
      len = arr.length,
      out = [],
      obj = {};
    for (i = 0; i < len; i++) {
      obj[arr[i]] = 0;
    }
    for (i in obj) {
      out.push(i);
    }
    return out;
  }

  /**
   * remove spaces from a string
   * @param {String} str string to process
   * @return {String} trimmed string
   */
  function removeSpaces(str) {
    str = str.replace(/\s/g, '');
    return str;
  }

  /**
   * determines whether specified item is in an array
   *
   * @param {array} array to check
   * @param {string} item to check for
   * @return {boolean} true if item is in the array, else false
   */
  function arrayContains(arr, item) {
    var i,
      iMax = arr.length;
    for (i = 0; i < iMax; i++) {
      if (arr[i] === item) {
        return true;
      }
    }
    return false;
  }

  /**
   * adds new affiliate id to affiliate_ids array
   */
  function addAffiate() {
    var str;
    if (isDefined(affiliateId.value)) {
      // remove any spaces
      str = removeSpaces(affiliateId.value);
      affiliate_ids.push(str);
      // dedupe in case same affiliate added twice
      affiliate_ids = dedupe(affiliate_ids);
    } else {
      alert('no affiliate id was entered');
    }
  }

  /**
   * createRequest sets up requests, send them to makeRequest(), and handles responses
   * @param  {string} type the request type
   */
  function createRequest(type) {
    var options  = {},
      cmsBaseURL = 'https://cms.api.brightcove.com/v1/accounts/' + accountId.value,
      endpoint,
      body       = {},
      responseDecoded,
      i,
      iMax,
      el,
      txt;

    // set credentials
    options.client_id = clientId.value;
    options.client_secret = clientSecret.value;

    // set proxyURL
    options.proxyURL = 'https://solutions.brightcove.com/bcls/bcls-proxy/bcls-proxy.php';

    switch (type) {
      case 'getChannels':
        endpoint            = 'channels';
        options.url         = cmsBaseURL + endpoint;
        options.requestType = 'GET';
        makeRequest(options, function(response) {
          responseDecoded = JSON.parse(response);
          if (responseDecoded.length === 0) {
            logger.textContent = 'There are no channels; click the Add Default Channel button to create one';
            addChannel.removeAttribute('disabled');
          } else if (!arrayContains(responseDecoded, 'default')) {
            logger.textContent = 'The default channel does not exist; click the Add Default Channel button to create one';
            addChannel.removeAttribute('disabled');
          } else {
            logger.textContent = 'Default channel found - ok to proceed';
          }
        });
        break;
      case 'addChannel':
        endpoint            = 'channels/default';
        options.url         = cmsBaseURL + endpoint;
        body.account_id     = accountId.value;
        body.name           = 'default';
        options.requestBody = JSON.stringify(body);
        options.requestType = 'GET';
        makeRequest(options, function(response) {
          responseDecoded = JSON.parse(response);
          if (responseDecoded.length === 0) {
            logger.textContent = 'There are no channels; click the Add Default Channel button to create one';
            addChannel.removeAttribute('disabled');
          } else if (!arrayContains(responseDecoded, 'default')) {
            logger.textContent = 'The default channel does not exist; click the Add Default Channel button to create one';
            addChannel.removeAttribute('disabled');
          }
        });
        break;
      case 'addAffiliates':
        endpoint            = '/channels/default';
        options.url         = cmsBaseURL + endpoint;
        options.requestType = 'PUT';
        makeRequest(options, function(response) {
          responseDecoded = JSON.parse(response);
          if (responseDecoded.length === 0) {
            logger.textContent = 'There are no channels; click the Add Default Channel button to create one';
            addChannel.removeAttribute('disabled');
          }
        });
        break;
        // additional cases
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
      proxyURL      = options.proxyURL,
      // response handler
      getResponse   = function() {
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
    requestParams = 'url=' + encodeURIComponent(options.url) + '&requestType=' + options.requestType;
    // only add client id and secret if both were submitted
    if (options.client_id && options.client_secret) {
      requestParams += '&client_id=' + options.client_id + '&client_secret=' + options.client_secret;
    }
    // add request data if any
    if (options.requestBody) {
      requestParams += '&requestBody=' + options.requestBody;
    }
    console.log('requestParams', requestParams);
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
