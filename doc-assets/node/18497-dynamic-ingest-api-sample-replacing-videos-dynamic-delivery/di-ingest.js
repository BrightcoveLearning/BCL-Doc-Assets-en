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
    profilesArray = ['multi-platform-extended-static', 'multi-platform-standard-static'],
    di_url = 'https://ingest.api.brightcove.com/v1/accounts/',
    di_url_display = document.getElementById('di_url'),
    di_submit_display = document.getElementById('di_Submit'),
    proxyURL = 'https://solutions.brightcove.com/bcls/bcls-proxy/brightcove-learning-proxy-v2.php',
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
    reqBody.master = {};
    reqBody.master.url = videoData[videoNumber].url;
    reqBody.profile = ingest_profile;
    reqBody.callbacks = callbacks;
    options.requestBody = JSON.stringify(reqBody);
    options.requestType = 'POST';
    options.url = di_url_display.value;
    // now submit the request
    submitRequest(options, function(response) {
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

  // function to submit Request
  function submitRequest(options, proxyURL, type) {
    var httpRequest = new XMLHttpRequest(),
      requestData,
      responseData,
      parsedData,
      getResponse = function() {
        try {
          if (httpRequest.readyState === 4) {
            if (httpRequest.status >= 200 && httpRequest.status < 300) {
              logResponse(type, httpRequest.responseText);
              responseData = httpRequest.responseText;
              switch (type) {
                case 'di':
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
                  break;
              }
            } else {
              alert('There was a problem with the request. Request returned ' + httpRequest.status);
            }
          }
        } catch (e) {
          alert('Caught Exception: ' + e);
        }
      };
    // set up request data
    requestData = 'client_id=' + options.client_id + '&client_secret=' + options.client_secret + '&url=' + encodeURIComponent(options.url) + '&requestBody=' + encodeURIComponent(options.requestBody) + '&requestType=' + options.requestType;
    // set response handler
    httpRequest.onreadystatechange = getResponse;
    // open the request
    httpRequest.open('POST', proxyURL);
    // set headers
    httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    // open and send request
    httpRequest.send(requestData);
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
    di_url_display.value = di_url + account_id + '/videos/' + videoData[videoNumber].id + '/ingest-requests';
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
