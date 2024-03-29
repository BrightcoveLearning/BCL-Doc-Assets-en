var BCLS = (function(window, document) {
  var account_id_display = document.getElementById('account_id'),
    account_id,
    client_id_display = document.getElementById('client_id'),
    client_id,
    client_secret_display = document.getElementById('client_secret'),
    client_secret,
    ingest_profile_display = document.getElementById('ingest_profile_display'),
    ingest_profile,
    custom_profile_display = document.getElementById('custom_profile_display'),
    videoDataDisplay = document.getElementById('videoData'),
    // Dynamic Ingest API stuff
    profilesArray = ['multi-platform-standard-static', 'multi-platform-standard-static-with-mp4', 'multi-platform-extended-static', 'multi-platform-extended-static-with-mp4', 'multi-platform-standard-dynamic-with-mp4', 'multi-platform-standard-dynamic', 'low-bandwidth-dynamic-with-mp4', 'low-bandwidth-dynamic', 'multi-platform-extended-dynamic-with-mp4', 'multi-platform-extended-dynamic'],
    di_url = 'https://ingest.api.brightcove.com/v1/accounts/',
    di_url_display = document.getElementById('di_url'),
    di_submit_display = document.getElementById('di_Submit'),
    proxyURL = 'https://solutions.brightcove.com/bcls/bcls-proxy/bcls-proxy-v2.php',
    response = document.getElementById('response'),
    videoData = [],
    totalVideos,
    videoNumber = 0,
    currentJobs = 0,
    t1,
    t2,
    totalIngested = 0,
    defaults = {
      account_id: 57838016001
    },
    callbacks = ["http://solutions.brightcove.com/bcls/dynamic-delivery/di-callbacks.php"];


  // is defined
  function isDefined(x) {
    if (x === '' || x === null || x === undefined) {
      return false;
    }
    return true;
  }
  // set options for the Dynamic Ingest API request
  function setDIOptions() {
    var options = {},
      reqBody = {};
      custom_profile_display_value = custom_profile_display.value;
      di_url_display.value = di_url + account_id + '/videos/' + videoData[videoNumber].id + '/ingest-requests';
    // get the ingest profile
    if (isDefined(custom_profile_display_value)) {
      ingest_profile = custom_profile_display_value;
    } else {
      ingest_profile = ingest_profile_display.options[ingest_profile_display.selectedIndex].value;
    }
    if (isDefined(client_id) && isDefined(client_secret)) {
      options.client_id = client_id;
      options.client_secret = client_secret;
    }
    options.account_id = account_id;
    options.proxyURL = proxyURL;
    reqBody.master = {};
    reqBody.master.url = videoData[videoNumber].url;
    reqBody.profile = ingest_profile;
    reqBody.callbacks = callbacks;
    options.requestBody = JSON.stringify(reqBody);
    options.requestType = 'POST';
    options.url = di_url_display.value;
    // now submit the request
    makeRequest(options, function(response) {
      response = JSON.parse(response);
      totalIngested++;
      logResponse('totalIngested', totalIngested);
      if (videoNumber < totalVideos - 1) {
        videoNumber++;
        currentJobs++;
        logResponse('Processing video number', videoNumber);
        logResponse('Current jobs: ', currentJobs);
        // if currentJobs is > 99, need to pause
        if (currentJobs > 99) {
          // reset currentJobs
          currentJobs = 0;
          // wait 30 sec before resuming
          t2 = setTimeout(setDIOptions, 180000);
        } else {
          // pause to avoid DI API timeouts
          t2 = setTimeout(setDIOptions, 1000);
        }
      }
    });
  }
  // function to set the request
  function logResponse(type, data) {
    response.textContent += type + ': ' + data + ',\n';
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

  di_submit_display.addEventListener('click', function() {
    var i, now = new Date().valueOf();
    videoData = JSON.parse(videoDataDisplay.value);
    totalVideos = videoData.length;
    // to insure uniqueness,
    for (i = 0; i < totalVideos; i++) {
      videoData[i].reference_id += '_' + now.toString();
    }
    // in case of stop/start, reset videoNumber to 0
    videoNumber = 0;
    // get account inputs
    account_id = isDefined(account_id_display.value) ? account_id_display.value : defaults.account_id;
    client_id = isDefined(client_id_display.value) ? client_id_display.value : null;
    client_secret = isDefined(client_secret_display.value) ? client_secret_display.value : null;

    // set DI API options for first video
    setDIOptions();
  });
  // initialize
  function init() {
    var i,
      iMax = profilesArray.length,
      newOpt;
    // add options for standard ingest profiles
    for (i = 0; i < iMax; i++) {
      newOpt = new Option(profilesArray[i]);
      ingest_profile_display.add(newOpt);
    }
  }
  // call init to set things up
  init();
})(window, document);
