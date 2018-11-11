var BCLS = (function(window, document, rome) {
  var account_id,
    client_id,
    client_secret,
    // api stuff
    proxyURL = 'https://solutions.brightcove.com/bcls/bcls-proxy/bcls-proxy-v2.php',
    baseURL = 'https://analytics.api.brightcove.com/v1/data?accounts=',
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
    results_table_body = document.getElementById('results_table_body'),
    apiRequest = document.getElementById('apiRequest'),
    apiResponse = document.getElementById('apiResponse'),
    fromDateValue,
    toDateValue,
    dayMS = 86400000,
    defaultFromDate = new Date(new Date() - 30 * dayMS);
console.log('defaultFromDate', defaultFromDate);
  // date pickers
  rome(fromDate, {inputFormat:'YYYY-MM-DD', initialValue:getIsoDate(defaultFromDate), time: false});
  rome(toDate, {inputFormat:'YYYY-MM-DD', initialValue:getIsoDate(new Date()), time: false});

  /**
   * get the date part of an ISO date for a JavaScript date
   * @param  {date}   d A JavaScript date
   * @return {string}     The date part of the ISO string, e.g. 2019-01-01
   */
  function getIsoDate(d) {
    var isoString = d.toISOString();
    return isoString.substring(0, isoString.indexOf('T'));
  }


  /**
   * gets account info from inputs; if none, uses default account
   */
  function getAccountInfo() {
    account_id = account_id_input.value;
    client_id = client_id_input.value;
    client_secret = client_secret_input.value;
    // only use entered account id if client id and secret are entered also
    if (client_id.length > 0 && client_secret.length > 0) {
      if (account_id.length > 0) {
        account_id = account_id_input.value;
      } else {
        window.alert('To use your own account, you must specify an account id, and client id, and a client secret - since at least one of these is missing, a sample account will be used');
        client_id = null;
        client_secret = null;
        account_id = '1752604059001';
      }
    } else {
      account_id = '1752604059001';
    }
  }

  /**
   * creates the HTML table body for the display of results
   * @param {object} response the API response (parsed)
   */
  function createReportTable(response) {
    var iMax = response.items.length,
      i,
      item,
      row,
      td1,
      td2,
      td3;
    for (i = 0; i < iMax; i++) {
      item = response.items[i];
      row = results_table_body.insertRow();
      td1 = row.insertCell();
      td2 = row.insertCell();
      td3 = row.insertCell();
      td1.textContent = item.date;
      td2.textContent = item.daily_unique_users;
      td3.textContent = item.video_view;
    }
  }

  /**
   * createRequest sets up requests, send them to makeRequest(), and handles responses
   * @param  {string} type the request type
   */
  function createRequest(type) {
    var options = {},
      proxyURL = 'https://solutions.brightcove.com/bcls/bcls-proxy/bcls-proxy-v2.php';

    // set credentials
    // assumes input fields with ids: account_id, client_id, and client_secret
    if (document.getElementById('client_id').value.length > 0 && document.getElementById('client_secret').value.length > 0) {
      options.client_id = client_id;
      options.client_secret = client_secret;
    }
    options.requestType = 'GET';
    options.proxyURL = proxyURL;
    options.url = baseURL + account_id + '&dimensions=date&limit=all&fields=video_view,daily_unique_viewers&from=' + fromDateValue + '&to=' + toDateValue;

    switch (type) {
      case 'getJSON':
        apiRequest.textContent = options.url;
        makeRequest(options, function(response) {
          response = JSON.parse(response);
          console.log('response', response);
          apiResponse.textContent = JSON.stringify(response, null, 2);
          createReportTable(response);
          // now get the csv version
          createRequest('getCSV');
        });
        break;
      case 'getCSV':
        options.url += '&format=csv';
        apiRequest.textContent = options.url;
        makeRequest(options, function(response) {
          response = JSON.parse(response);
          apiResponse.textContent = JSON.stringify(response, null, 2);
          csvData_display.textContent = response;
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
      proxyURL = options.proxyURL,
      // response handler
      getResponse = function() {
        try {
          if (httpRequest.readyState === 4) {
            if (httpRequest.status >= 200 && httpRequest.status < 300) {
              response = httpRequest.responseText;
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
    csvData_display.addEventListener('click', function() {
      this.select();
    });
    // get initial account info
    getAccountInfo();
  }

  // button event handlers
  makeReport.addEventListener('click', function() {
    // get the inputs
    getAccountInfo();
    // get date range or default values
    fromDateValue = rome(fromDate).getDate();
    fromDateValue = getIsoDate(fromDateValue);
    toDateValue = rome(toDate).getDate();
    toDateValue = getIsoDate(toDateValue);
    createRequest('getJSON');
  });

  init();

})(window, document, rome);
