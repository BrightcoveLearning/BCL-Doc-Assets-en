var BCLS = (function(window, document) {
  // var proxyURL = 'https://solutions.brightcove.com/bcls/bcls-proxy/bcls-proxy-v2.php',
  var proxyURL = 'https://cs1.brightcodes.net/hturkel/bc_proxy.php',
    reportURL = 'https://analytics.api.brightcove.com/v1/timeseries/accounts/',
    default_account_id = '3737230870001',
    default_video_id = '6057232440001',
    useMyAccount = document.getElementById('useMyAccount'),
    basicInfo = document.getElementById('basicInfo'),
    accountId = document.querySelector('#account_id'),
    account_id = '1752604059001',
    clientId = document.querySelector('#client_id'),
    clientSecret = document.querySelector('#client_secret'),
    videoId = document.querySelector('#video_id'),
    client_id = null,
    client_secret = null,
    video_id = null,
    allButtons = document.querySelectorAll('button[data-type="getData"]'),
    ccu1m = document.getElementById('ccu1m'),
    ccu5m = document.getElementById('ccu5m'),
    ccu15m = document.getElementById('ccu15m'),
    ccu30m = document.getElementById('ccu30m'),
    gettingDataDisplay = document.getElementById('gettingDataDisplay'),
    requestURL = document.getElementById('requestURL'),
    analyticsData = {},
    callType;

  // more robust test for strings 'not defined'
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

  function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
  }

  function disableButtons() {
    var i,
      iMax = allButtons.length;
    for (i = 0; i < iMax; i++) {
      allButtons[i].setAttribute('disabled', 'disabled');
    }
  }

  function enableButtons() {
    var i,
      iMax = allButtons.length;
    for (i = 0; i < iMax; i++) {
      allButtons[i].removeAttribute('disabled');
    }
  }

  function apiCallback(response) {
    var parsedData,
      i,
      iMax,
      item;
    if (isJson(response)) {
      parsedData = JSON.parse(response);
console.log('response', parsedData.ccu.data[0]);
      iMax = parsedData.ccu.data[0].points.length;
      for (i = 0; i < iMax; i++) {
        item = parsedData.ccu.data[0].points[i];
        item.timestamp = new Date(item.timestamp).toISOString();
      }
      responseData.textContent = JSON.stringify(parsedData, null, 2);
    } else {
      responseData.textContent = response;
    }
    enableButtons();
  }

  /**
   * Builds the API requests and handles responses
   * @param {String} interval the interval for the time series
   */
  function createRequest(interval) {
    var endPoint = '',
      options = {};

    disableButtons();
    options.proxyURL = proxyURL;
    options.video_id = video_id;
    switch (interval) {
      case 'ccu1m':
        endPoint = account_id + '?dimensions=video&where=video==' + options.video_id +  '&metrics=ccu';
        options.url = reportURL + endPoint;
        options.requestType = 'GET';
        apiRequest.textContent = options.url;
        
        makeRequest(options, apiCallback);
        break;
     case 'ccu5m':
        endPoint = account_id + '?dimensions=video&where=video==' + options.video_id +  '&metrics=ccu&bucket_duration=5m';
        options.url = reportURL + endPoint;
        options.requestType = 'GET';
        apiRequest.textContent = options.url;
        
        makeRequest(options, apiCallback);
        break;
        
     case 'ccu15m':
        endPoint = account_id + '?dimensions=video&where=video==' + options.video_id +  '&metrics=ccu&bucket_duration=15m';
        options.url = reportURL + endPoint;
        options.requestType = 'GET';
        apiRequest.textContent = options.url;
        
        makeRequest(options, apiCallback);
        break;
     case 'ccu30m':
        endPoint = account_id + '?dimensions=video&where=video==' + options.video_id +  '&metrics=ccu&bucket_duration=30m';
        options.url = reportURL + endPoint;
        options.requestType = 'GET';
        apiRequest.textContent = options.url;
        
        makeRequest(options, apiCallback);
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
console.log('response', response);

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

  function getAccountInfo() {
    account_id = (isDefined(accountId.value)) ? accountId.value : default_account_id;
    client_id = (isDefined(clientId.value)) ? clientId.value : null;
    client_secret = (isDefined(clientSecret.value)) ? clientSecret.value : null;
    video_id = (isDefined(videoId.value)) ? videoId.value : default_video_id;
  }

  // set event listeners
  useMyAccount.addEventListener('click', function() {
    if (basicInfo.getAttribute('style') === 'display:none') {
      basicInfo.setAttribute('style', 'display:block');
      useMyAccount.textContent = 'Use Sample Account';
    } else {
      basicInfo.setAttribute('style', 'display:none');
      useMyAccount.textContent = 'Use My Account Instead';
    }
  });
  ccu1m.addEventListener('click', function() {
    getAccountInfo();
    createRequest('ccu1m');
  });
  ccu5m.addEventListener('click', function() {
    getAccountInfo();
    createRequest('ccu5m');
  });
  ccu15m.addEventListener('click', function() {
    getAccountInfo();
    createRequest('ccu15m');
  });
  ccu30m.addEventListener('click', function() {
    getAccountInfo();
    createRequest('ccu30m');
  });

  return {};
})(window, document);
