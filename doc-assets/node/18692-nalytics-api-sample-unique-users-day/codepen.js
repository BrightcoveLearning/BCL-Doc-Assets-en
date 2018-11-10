var BCLS = ( function (window, document, rome) {
  var account_id,
    client_id,
    client_secret,
    // api stuff
    proxyURL = 'https://solutions.brightcove.com/bcls/bcls-proxy/bcls-proxy-v2.php',
    baseURL = 'https://analytics.api.brightcove.com/v1?accounts=',
    itemsArray = [],
    csvData,
    // elements
    account_id_input = document.getElementById('account_id'),
    client_id_input = document.getElementById('client_id'),
    client_secret_input = document.getElementById('client_secret'),
    fromDate = document.getElementById('fromDate'),
    toDate = document.getElementById('toDate'),
    makeReport = document.getElementById('makeReport'),
    csvData_display = document.getElementById('csvData_display'),
    apiRequest = document.getElementById('apiRequest'),
    apiResponse = document.getElementById('apiResponse'),
    fromDateValue,
    toDateValue;

  // date pickers
  rome(fromDate);
  rome(toDate);

  function getIsoDate(d) {
    var isoString = d.toISOString();
  }


  function getAccountInfo() {
    account_id = account_id_input.value;
    client_id = client_id_input.value;
    client_secret = client_secret_input.value;
    // only use entered account id if client id and secret are entered also
    if (isDefined(client_id) && isDefined(client_secret)) {
      if (isDefined(account_id_input.value)) {
        account_id = account_id_input.value;
        console.log('account_id', account_id);
      } else {
        window.alert('To use your own account, you must specify an account id, and client id, and a client secret - since at least one of these is missing, a sample account will be used');
        client_id = null;
        client_secret = null;
        account_id = '1752604059001';
      }
    } else {
      account_id = '1752604059001';
    }
    createRequest('getCustomFields');
  }

  /**
   * createRequest sets up requests, send them to makeRequest(), and handles responses
   * @param  {string} type the request type
   */
  function createRequest(type) {
      var options   = {},
          requestBody = {},
          // next line for BrightcoveLearning proxy (use if you are making write requests)
          // for read requests only, use https://solutions.brightcove.com/bcls/bcls-proxy/doc-samples-proxy-v2.php
          proxyURL = 'https://solutions.brightcove.com/bcls/bcls-proxy/brightcove-learning-proxy-v2.php'
          baseURL = 'https://cms.api.brightcove.com/v1/accounts',
          endpoint,
          responseDecoded;

      // set credentials
      // assumes input fields with ids: account_id, client_id, and client_secret
      if (document.getElementById('client_id').value.length > 0 && document.getElementById('client_secret').value.length > 0)
      options.client_id     = document.getElementById('client_id').value;
      options.client_secret = document.getElementById('client_secret').value;
      options.proxyURL      = proxyURL;

      switch (type) {
          case 'getVideoCount':
              endpoint            = '/' + options.account_id + '/counts/videos';
              options.url         = baseURL + endpoint;
              options.requestType = 'GET';
              makeRequest(options, function(response) {
                  responseDecoded = JSON.parse(response);
                  // do what you want here
              });
              break;
          case 'createVideo':
              endpoint            = '/' + options.account_id + '/counts/videos';
              options.url         = baseURL + endpoint;
              options.requestType = 'POST';;
              requestBody.name    = 'My New Video';
              // add more properties
              options.requestBody = JSON.stringify(requestBody);
              makeRequest(options, function(response) {
                  responseDecoded = JSON.parse(response);
                  // do more stuff
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
       * the proxy used here takes the following request body:
       * JSON.strinify(options)
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
    // event listeners
    csvData.addEventListener('click', function() {
      this.select();
    });
    useMyAccount.addEventListener('click', function() {
      getAccountInfo();
    });
    searchField.addEventListener('change', function() {
      createCustomFieldValueOptions();
    });
    hideElement(searchFieldValues);
    showElement(searchFieldValue);
    getAccountInfo();
  }

  // button event handlers
  makeReport.addEventListener('click', function() {
    // get the inputs
    getAccountInfo();

    fromDateValue = rome(fromDate).getDate();
    if (isDefined(fromDateValue)) {
      fromDateValue = fromDateValue.toISOString();
    }
    toDateValue = rome(toDate).getDate();
    if (isDefined(toDateValue)) {
      toDateValue = toDateValue.toISOString();
    }
    if (isDefined(fromDateValue) || isDefined(toDateValue)) {
      dateSearchString = '%2B' + dateTypeValue + ':' + fromDateValue + '..' + toDateValue;
    }

    // get video count
    createRequest('getAffiliates');

  });

  init();

})(window, document, rome);
