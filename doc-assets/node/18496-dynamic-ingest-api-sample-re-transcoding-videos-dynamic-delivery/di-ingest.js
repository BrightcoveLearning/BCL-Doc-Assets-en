var BCLS = (function(window, document) {
  var // Ingest Profiles API stuff
    account_id_display = document.getElementById("account_id"),
    account_id,
    client_id_display = document.getElementById("client_id"),
    client_id,
    client_secret_display = document.getElementById("client_secret"),
    client_secret,
    ingest_profile_display = document.getElementById("ingest_profile_display"),
    ingest_profile,
    videoDataDisplay = document.getElementById("videoData"),
    current_profiles = [],
    live_profiles = ['Live - Standard', 'Live - HD', 'Live - Premium HD'],
    // Dynamic Ingest API stuff
    profilesArray = [
      "multi-platform-extended-static",
      "multi-platform-standard-static"
    ],
    di_url = "https://ingest.api.brightcove.com/v1/accounts/",
    di_url_display = document.getElementById("di_url"),
    di_submit_display = document.getElementById("di_Submit"),
    api_response_display = document.getElementById('api_response'),
    proxyURL =
      "https://solutions.brightcove.com/bcls/bcls-proxy/brightcove-learning-proxy-v2.php",
    response = document.getElementById("response"),
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
    callbacks = [
      "http://solutions.brightcove.com/bcls/dynamic-delivery/di-callbacks.php"
    ];

  // is defined
  function isDefined(x) {
    if (x === "" || x === null || x === undefined) {
      return false;
    }
    return true;
  }

  /**
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
   * determines whether specified item is in an array
   *
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
   * find index of an object in array of objects
   * based on some property value
   *
   * @param {array} targetArray array to search
   * @param {string} objProperty object property to search
   * @param {string} value of the property to search for
   * @return {integer} index of first instance if found, otherwise returns -1
  */
  function findObjectInArray(targetArray, objProperty, value) {
      var i, totalItems = targetArray.length, objFound = false;
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

  // set options for the Dynamic Ingest API request
  function createRequest(type) {
    var options = {},
      reqBody = {};

      if (isDefined(client_id) && isDefined(client_secret)) {
        options.client_id = client_id;
        options.client_secret = client_secret;
      }
      options.account_id = account_id;
      options.proxyURL = proxyURL;

    switch (type) {
      case 'getProfiles':
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
          api_response.textContent = response;
          logMessage(logger, 'The get all profiles operation failed; see the API Response for the error', true);
          return;
        }
      });
        break;
      case 'transcodeVideos':
      // get the ingest profile
        ingest_profile =
        ingest_profile_display.options[ingest_profile_display.selectedIndex]
        .value;
      reqBody.master = {};
      reqBody.master.use_archived_master = true;
      reqBody.profile = ingest_profile;
      reqBody.callbacks = callbacks;
      options.requestBody = JSON.stringify(reqBody);
      options.requestType = "POST";
      options.url = 'https://ingest.api.brightcove.com/v1/accounts/' + account_id + '/videos/' + videoData[videoNumber] + '/ingest-requests';
      di_url_display = options.url;
      // now submit the request
      makeRequest(options, function(response) {
        response = JSON.parse(response);
        api_response_display.textContent = JSON.stringify(response, null, '  ');
        totalIngested++;
        logResponse("total transcoded", totalIngested);
        if (videoNumber < totalVideos - 1) {
          videoNumber++;
          currentJobs++;
          logResponse("Processing video number", videoNumber);
          logResponse("Current jobs: ", currentJobs);
          // if currentJobs is > 99, need to pause
          if (currentJobs > 99) {
            // reset currentJobs
            currentJobs = 0;
            // wait 5 min before resuming
            t2 = setTimeout(createRequest('transcodeVideos'), 30000);
          } else {
            // pause slightly to reduce change of hitting jobs overload
            t2 = setTimeout(createRequest('transcodeVideos'), 1000);
          }
        }
      });

    }
  }
  // function to set the request
  function logResponse(type, data) {
    response.textContent += type + ": " + data + ",\n";
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
              if (response === "{null}") {
                response = null;
              }
              // return the response
              console.log(response);
              callback(response);
            } else {
              alert(
                "There was a problem with the request. Request returned " +
                  httpRequest.status
              );
            }
          }
        } catch (e) {
          alert("Caught Exception: " + e);
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
    httpRequest.open("POST", proxyURL);
    // set headers if there is a set header line, remove it
    // open and send request
    httpRequest.send(JSON.stringify(options));
  }

  // event listeners
  videoDataDisplay.addEventListener('click', function() {
    this.select();
  });

  account_id_display.addEventListener('blur', function() {
    account_id = account_id_display.value;
    client_id = client_id_display.value;
    client_secret = client_secret_display.value;
    if (isDefined(account_id) && isDefined(client_id) && isDefined(client_secret)) {
      // refresh Profiles
      createRequest('getProfiles');
      logResponse('New account info...', 'updating profiles list');
    }
  })

  client_id_display.addEventListener('blur', function() {
    account_id = account_id_display.value;
    client_id = client_id_display.value;
    client_secret = client_secret_display.value;
    if (isDefined(account_id) && isDefined(client_id) && isDefined(client_secret)) {
      // refresh Profiles
      createRequest('getProfiles');
      logResponse('New account info...', 'updating profiles list');
    }
  })

  client_secret_display.addEventListener('blur', function() {
    account_id = account_id_display.value;
    client_id = client_id_display.value;
    client_secret = client_secret_display.value;
    if (isDefined(account_id) && isDefined(client_id) && isDefined(client_secret)) {
      // refresh Profiles
      createRequest('getProfiles');
      logResponse('New account info...', 'updating profiles list');
    }
  })

  di_submit_display.addEventListener("click", function() {
    var i,
      now = new Date().valueOf();
    videoData = JSON.parse(videoDataDisplay.value);
    totalVideos = videoData.length;
    // in case of stop/start, reset videoNumber to 0
    videoNumber = 0;
    // get account inputs
    account_id = isDefined(account_id_display.value)
      ? account_id_display.value
      : defaults.account_id;
    client_id = isDefined(client_id_display.value)
      ? client_id_display.value
      : null;
    client_secret = isDefined(client_secret_display.value)
      ? client_secret_display.value
      : null;
    di_url_display.value =
      di_url +
      account_id +
      "/videos/" +
      videoData[videoNumber] +
      "/ingest-requests";

    // set DI API options for first video
    createRequest('transcodeVideos');
  });
  // initialize
  function init() {
    // default account id
    account_id = defaults.account_id;
    // get account profiles
    createRequest('getProfiles');
  }
  // call init to set things up
  init();
})(window, document);
