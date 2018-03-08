var BCLS = (function(window, document) {
  var account_id_field = document.getElementById("account_id"),
    account_id = '57838016001',
    setRequest_btn = document.getElementById("setRequest"),
    apiRequest = null,
    apiRequest_field = document.getElementById("apiRequest"),
    getVideos_button = document.getElementById('getVideos'),
    submit_button = document.getElementById("submit"),
    response_display = document.getElementById("response"),
    totalVideos = 0,
    limit = 5,
    offset = 0,
    callNumber = 0,
    requestBody,
    videoData_display = document.getElementById("videoData"),
    videoData = [],
    proxyURL = 'https://solutions.brightcove.com/bcls/bcls-proxy/brightcove-learning-proxy-v2.php',
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

  // function to set up request
  function setRequest(type) {
    var responseParsed,
      options = {},
      requestBody = {},
      i,
      iMax;
    options.account_id = account_id;
    options.proxyURL = proxyURL;
    switch (type) {
      case 'getVideos':
        options.url = 'https://cms.api.brightcove.com/v1/accounts/' + options.account_id + '/videos?limit=5&offset=' + offset;
        // display the request URL
        apiRequest_field.textContent = options.url;
        makeRequest(options, function(response) {
          responseParsed = JSON.parse(response);
          response_display.textContent = JSON.stringify(responseParsed, null, '  ');
          iMax = responseParsed.length;
          for (i = 0; i < iMax; i++) {
            var o = {},
              video = responseParsed[i],
              date = new Date().toISOString();
            o.id = video.id;
            o.name = video.name;
            o.description = 'Updated at: ' + date;
            videoData.push(o);
          }
          videoData_display.textContent = JSON.stringify(videoData, null, '  ');
        });
        break;
      case 'updateVideo':
      var currentVideo = videoData[callNumber];
      if (isDefined(currentVideo)) {
        options.url = "https://cms.api.brightcove.com/v1/accounts/" + options.account_id + "/videos/" + currentVideo.id;
        requestBody.description = currentVideo.description
        options.requestBody = requestBody;
        // display the request URL
        apiRequest_field.textContent = options.url;
        makeRequest(options, function(response) {
          responseParsed = JSON.parse(response);
          response_display.textContent = JSON.stringify(responseParsed, null, '  ');
          callNumber++;
          if (callNumber < totalVideos) {
            setRequest('updateVideo');
          }
        });
      }
        break;
      default:

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
    getVideos_button.addEventListener('click', function() {
      setRequest('getVideos');
    });
    setRequest_btn.addEventListener("click", function() {
      // get and clean up video data
      videoData = JSON.parse(videoData_display.value);
      totalVideos = videoData.length;
      // set up the request
      setRequest('updateVideo');
    });
  }
  // initialize - set up data
  init();

})(window, document);
