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
    cms_url_display = document.getElementById('cms_url'),
    videoDataDisplay = document.getElementById('videoData'),
    // Dynamic Ingest API stuff
    profilesArray = ['multi-platform-extended-static', 'multi-platform-standard-static'],
    di_url_display = document.getElementById('di_url'),
    di_submit_display = document.getElementById('di_Submit'),
    proxyURL = 'https://solutions.brightcove.com/bcls/bcls-proxy/brightcove-learning-proxy-v2.php',
    apiResponse = document.getElementById('apiResponse'),
    logger = document.getElementById('logger'),
    current_profiles = [],
    current_video_id,
    rawVideoData = [],
    videoData = [],
    totalVideos,
    videoNumber = 0,
    currentJobs = 0,
    totalIngested = 0,
    defaults = {
      account_id: 57838016001
    },
    callbacks = ["http://solutions.brightcove.com/bcls/dynamic-delivery/di-callbacks.php"];


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
   * tests whether a variable is an array
   * @param {*} a the variable to test
   * @return {Boolean} true if variable is an array
   */
  function isArray(a) {
    if (Array.isArray(a)) {
      return true;
    }
    return false;
  }

  /*
   * tests to see if a string is json
   * @param {String} str string to test
   * @return {Boolean}
   */
  function isJson(str) {
      try {
          JSON.parse(str);
      } catch (e) {
          return false;
      }
      return true;
  }

  /**
   * get selected value for single select element
   * @param {htmlElement} e the select element
   * @return {String} selected value
   */
  function getSelectedValue(e) {
    var selected = e.options[e.selectedIndex],
      val = selected.value,
      txt = selected.textContent,
      idx = e.selectedIndex;
    return val;
  }

  /**
   * Just a simple logger to inject messages into the page
   * it requires an element with id="logger" referenced as logger
   * @param  {string} m the message to display
   */
  function logMessage(m) {
    var hr = document.createElement('hr');
    logger.appendChild(hr);
    logger.appendChild(document.createTextNode(m));
  }

  /**
   * determines whether specified item is in an array
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
   * remove all spaces and line breaks from a string
   * @param {string} a the string to operate on
   * @return {string} the string with spaces and line breaks removed
   */
  function removeSpaceAndBreaks(str) {
    var regex = new RegExp('/\r?\n|\r/g');
    return str.replace(regex, '');
  }



  /**
   * find index of an object in array of objects
   * based on some property value
   *
   * @param {array} targetArray array to search
   * @param {string} objProperty object property to search
   * @param {string} value of the property to search for
   * @return {integer} index of first instance if found, otherwise returns -1
   */
  function findObjectInArray(targetArray, objProperty, value) {
    var i, totalItems = targetArray.length,
      objFound = false;
    for (i = 0; i < totalItems; i++) {
      if (targetArray[i][objProperty] === value) {
        objFound = true;
        return i;
      }
    }
    if (objFound === false) {
      return -1;
    }
  }

  /**
   * remove or add obsolete profiles from the current profiles list
   */
  function toggleObsoleteProfiles() {
    // below are the obsolete profiles - you just have to know their names
    var deprecated_profiles = ['balanced-nextgen-player', 'Express Standard', 'mp4-only', 'balanced-high-definition', 'low-bandwidth-devices', 'balanced-standard-definition', 'single-rendition', 'Live - Standard', 'high-bandwidth-devices', 'Live - Premium HD', 'Live - HD', 'videocloud-default-trial', 'screencast'];
    i = current_profiles.length;
    while (i > 0) {
      i--;
      if (arrayContains(deprecated_profiles, current_profiles[i].name)) {
        current_profiles.splice(i, 1);
      }
    }
    return;
  }

  /**
   * displays the filtered list of profiles
   */
  function displayFilteredProfiles() {
    var option,
      fragment = document.createDocumentFragment(),
      i,
      iMax;
    // add first option
    option = document.createElement('option');
    option.textContent = 'Use account default profile';
    option.value = '';
    fragment.appendChild(option);
    // now add the rest
    iMax = current_profiles.length;
    for (i = 0; i < iMax; i++) {
      option = document.createElement('option');
      option.textContent = current_profiles[i].name;
      option.value = current_profiles[i].name;
      fragment.appendChild(option);
    }
    ingest_profile_display.innerHTML = '';
    ingest_profile_display.appendChild(fragment);
    return;
  }

  function processVideoData(rawVideoData) {
    var i, iMax, field;
    iMax = rawVideoData.length;
    for (i = 0; i < iMax; i++) {
      videoData[i] = {};
      videoData[i].createVideoBody = {};
      videoData[i].ingestVideoBody = {};
      // create video request body
      for (field in rawVideoData[i]) {
        if (field !== 'url') {
          videoData[i].createVideoBody[field] = rawVideoData[i][field];
        }
      }
      // now ingest request body
      if (isDefined(ingest_profile)) {
        videoData[i].ingestVideoBody.profile = ingest_profile;
      }
      videoData[i].ingestVideoBody.priority = 'low';
      videoData[i].ingestVideoBody.master = {};
      videoData[i].ingestVideoBody.master.url = rawVideoData[i].url;
      videoData[i].ingestVideoBody['capture-images'] = true;
      videoData[i].ingestVideoBody.callbacks = callbacks;
    }
    console.log('videoData', videoData);
  }

  function createRequest(type) {
    var options = {},
      reqBody = {};
    if (isDefined(client_id) && isDefined(client_secret)) {
      options.client_id = client_id;
      options.client_secret = client_secret;
    }
    options.proxyURL = proxyURL;
    switch (type) {
      case 'getProfiles':
        console.log('getting profiles');
        var i;
        endpoint = '/profiles';
        options.url = 'https://ingestion.api.brightcove.com/v1/accounts/' + account_id + endpoint;
        options.requestType = 'GET';
        makeRequest(options, function(response) {
          if (isJson(response)) {
            current_profiles = JSON.parse(response);
            toggleObsoleteProfiles();
            // hide legacy profiles
            i = current_profiles.length;
            while (i > 0) {
              i--;
              if (!current_profiles[i].hasOwnProperty('dynamic_origin')) {
                current_profiles.splice(i, 1);
              }
            }

            displayFilteredProfiles();
          } else {
            apiResponse.textContent = response;
            logMessage('The get all profiles operation failed; see the API Response for the error');
            return;
          }
        });
        break;
      case 'createVideo':
        options.requestBody = JSON.stringify(videoData[videoNumber].createVideoBody);
        options.url = 'https://cms.api.brightcove.com/v1/accounts/' + account_id + '/videos';
        options.requestType = 'POST';
        cms_url_display.value = options.url;
        console.log('cms options', options);
        makeRequest(options, function(response) {
          // parse response
          response = JSON.parse(response);
          apiResponse.textContent = JSON.stringify(response, null, '  ');
          // errors will come back as array
          if (isArray(response)) {
            logMessage('An error occurred. Look the current API response below, correct the issue with the video data, and try again');
          } else {
            current_video_id = response.id;
            createRequest('ingestVideo');
          }
        });
        break;
      case 'ingestVideo':
        options.url = 'https://ingest.api.brightcove.com/v1/accounts/' + account_id + '/videos/' + current_video_id + '/ingest-requests';
        di_url_display.textContent = options.url;
        options.requestType = 'POST';
        options.requestBody = JSON.stringify(videoData[videoNumber].ingestVideoBody);
        di_url_display.value = options.url;
        console.log('cms options', options);
        makeRequest(options, function(response) {
          // parse response
          response = JSON.parse(response);
          apiResponse.textContent = JSON.stringify(response, null, '  ');
          if (isArray(response)) {
            // an error occurred
            logMessage('An error occurred. Look the current API response below, correct the issue with the video data, and try again');
          } else {
            videoNumber++;
            currentJobs++;
            LogMessage('Processing video number', videoNumber);
            createRequest('createVideo');
          }
        });
        break;
      default:
        console.log('bad type - shouldn\'t be here: ', type);
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

  // event listeners
  videoDataDisplay.addEventListener('click', function() {
    this.select();
  });

  account_id_display.addEventListener('blur', function() {
    if (isDefined(account_id_display.value) && isDefined(client_id_display.value) && isDefined(client_secret_display.value)) {
      // refresh Profiles
      account_id = account_id_display.value;
      client_id = client_id_display.value;
      client_secret = client_secret_display.value;
      // get account profiles
      createRequest('getProfiles');
    }
  });

  client_id_display.addEventListener('blur', function() {
    if (isDefined(account_id_display.value) && isDefined(client_id_display.value) && isDefined(client_secret_display.value)) {
      // refresh Profiles
      account_id = account_id_display.value;
      client_id = client_id_display.value;
      client_secret = client_secret_display.value;
      // get account profiles
      createRequest('getProfiles');
    }
  });

  client_secret_display.addEventListener('blur', function() {
    if (isDefined(account_id_display.value) && isDefined(client_id_display.value) && isDefined(client_secret_display.value)) {
      // refresh Profiles
      account_id = account_id_display.value;
      client_id = client_id_display.value;
      client_secret = client_secret_display.value;
      // get account profiles
      createRequest('getProfiles');
    }
  });



  di_submit_display.addEventListener('click', function() {
    var data = removeSpaceAndBreaks(videoDataDisplay.value);
    console.log('data', data);
    // in case of stop/start, reset videoNumber to 0
    videoNumber = 0;
    // get account inputs
    account_id = isDefined(account_id_display.value) ? account_id_display.value : defaults.account_id;
    client_id = client_id_display.value;
    client_secret = client_secret_display.value;
    ingest_profile = getSelectedValue(ingest_profile_display);
    processVideoData(JSON.parse(data));
    cms_url_display.value = 'https://cms.api.brightcove.com/v1/accounts/' + account_id + '/videos';
    // set CMS API options for first video
    createRequest('createVideo');
  });
  // initialize
  function init() {
    console.log('in init');
    // default account id
    account_id = defaults.account_id;
    // get account profiles
    createRequest('getProfiles');
  }
  // call init to set things up
  init();

  return {
    'logMessage': logMessage
  }
})(window, document);
