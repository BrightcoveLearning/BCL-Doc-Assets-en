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

  // date pickers
  rome(fromDate);
  rome(toDate);
})(window, document);
