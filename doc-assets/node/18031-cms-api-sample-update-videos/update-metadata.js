var BCLS = (function(window, document, creds) {
  var account_id_field = document.getElementById("account_id"),
    account_id,
    client_id_field = document.getElementById("client_id"),
    client_id = null,
    client_secret_field = document.getElementById("client_secret"),
    client_secret = null,
    setRequest_btn = document.getElementById("setRequest"),
    apiRequest = null,
    apiRequest_field = document.getElementById("apiRequest"),
    submit_button = document.getElementById("submit"),
    response = document.getElementById("response"),
    totalVideos = 0,
    offset = 0,
    callNumber = 0,
    requestBody,
    videoData_display = document.getElementById("videoData"),
    videoData,
    proxyURL = 'https://solutions.brightcove.com/bcls/bcls-proxy/brightcove-learning-proxy-v2.php'
    t1,
    currentVideo;
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

  // function to remove spaces from string
  function cleanString(str) {
    // remove spaces
    str = str.replace(/\s/g, "");
    return str;
  };
  // clean up data before submitting
  function cleanUpData() {
    var i, iMax, item;
    iMax = videoData.length;
    for (i = 0; i < iMax; i++) {
      item = videoData[i];
      // truncate over-long descriptions
      if (item.description.length > 120) {
        item.description = item.description.substr(0, 250) + "...";
      }
      // use name for missing descriptions
      if (item.description === "") {
        item.description = item.name;
      }
    }
    // console.log("videoData Cleaned", videoData);
  };
  // function to set up request
  function setRequest() {
    var responseParsed,
      options = {},
      requestBody = {};
    options.account_id = account_id;
    options.client_id = client_id;
    options.client_secret = client_secret;
    options.proxyURL = proxyURL;
    currentVideo = videoData[callNumber];
    if (isDefined(currentVideo)) {
      apiRequest = "https://cms.api.brightcove.com/v1/accounts/" + options.account_id + "/videos/" + currentVideo.id;
      requestBody.description = currentVideo.description
      options.requestBody = requestBody;
      options.url = apiRequest;
      // display the request URL
      apiRequest_field.textContent = apiRequest;
      makeRequest(options, function(response) {
        responseParsed = JSON.parse(response);
        callNumber++;
        if (callNumber < totalVideos) {
          setRequest();
        }
      });
    }

  };

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

  // init function to set up event listeners
  function init() {
    // event listeners
    setRequest_btn.addEventListener("click", function() {
      // trim any leading/trailing spaces from the input strings
      account_id = cleanString(account_id_field.value) || creds.account_id;
      client_id = cleanString(client_id_field.value) || creds.client_id;
      client_secret = cleanString(client_secret_field.value) || creds.client_secret;
      // get and clean up video data
      videoData = JSON.parse(videoData_display.value);
      totalVideos = videoData.length;
      cleanUpData();
      // set up the request
      setRequest();
    });
  }
  // initialize - set up data
  init();

})(window, document, creds);
