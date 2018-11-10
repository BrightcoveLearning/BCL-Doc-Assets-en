var BCLS = ( function (window, document) {
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

  rome(fromDate);
  rome(toDate);


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
  // date pickers

})(window, document);
