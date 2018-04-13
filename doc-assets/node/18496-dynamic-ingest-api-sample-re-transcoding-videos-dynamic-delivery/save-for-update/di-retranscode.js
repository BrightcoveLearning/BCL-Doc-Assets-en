var BCLS = (function(window, document) {
  var // CMS API stuff
    account_id_display = document.getElementById("account_id"),
    account_id,
    client_id_display = document.getElementById("client_id"),
    client_id,
    client_secret_display = document.getElementById("client_secret"),
    client_secret,
    ingest_profile_display = document.getElementById("ingest_profile_display"),
    ingest_profile,
    custom_profile_display = document.getElementById("custom_profile_display"),
    capture_images_display = document.getElementById('capture_images_display'),
    videoDataDisplay = document.getElementById("videoData"),
    // Dynamic Ingest API stuff
    profilesArray = [],
    videosBlock = document.getElementById('videosBlock'),
    apiRequest = document.getElementById("apiRequest"),
    di_submit_display = document.getElementById("di_Submit"),
    proxyURL = "https://solutions.brightcove.com/bcls/bcls-proxy/beml-proxy-v2.php",
    response = document.getElementById("response"),
    videoData = [],
    videos = [],
    videosCollection,
    videosSelectAll,
    totalVideos = 0,
    videoNumber = 0,
    currentJobs = 0,
    totalIngested = 0,
    defaults = {
      account_id: 57838016001,
      client_id: "37cd3c5d-6f18-4702-bfb6-4fbc1cd095f1",
      client_secret: "gLSQANqe6A2PzJce_6xA4bTNu844up5-CSrC-jxNfur4EaOgWKRcqq_GTxKjhMpPSflMdNEhFdBmNe0qsTIZSQ"
    };


  // is defined
  function isDefined(x) {
    if (x === "" || x === null || x === undefined) {
      return false;
    }
    return true;
  }

  /**
   * determines if checkbox is checked * @param  {htmlElement}  e the checkbox to check
   * @return {Boolean}  true if box is checked
   */
  function isChecked(e) {
    if (e.checked) {
      return true;
    }
    return false;
  }

  /**
     * get array of values for checked boxes in a collection
     * @param {htmlElementCollection} checkBoxCollection collection of checkbox elements
     * @return {Array} array of the values of the checked boxes
     */
    function getCheckedBoxValues(checkBoxCollection) {
      var checkedValues = [],
        i,
        iMax;
      if (checkBoxCollection) {
        iMax = checkBoxCollection.length;
        for (i = 0; i < iMax; i++) {
          if (checkBoxCollection[i].checked === true) {
            checkedValues.push(checkBoxCollection[i].value);
          }
        }
        return checkedValues;
      } else {
        console.log('Error: no input received');
        return null;
      }
    }

    /**
       * selects all checkboxes in a collection
       * @param {htmlElementCollection} checkboxCollection a collection of the checkbox elements, usually gotten by document.getElementsByName()
       */
      function selectAllCheckboxes(checkboxCollection) {
        var i,
          iMax = checkboxCollection.length;
        for (i = 0; i < iMax; i += 1) {
          checkboxCollection[i].setAttribute('checked', 'checked');
        }
      }

      /**
         * deselects all checkboxes in a collection
         * @param {htmlElementCollection} checkboxCollection a collection of the checkbox elements, usually gotten by document.getElementsByName()
         */
        function deselectAllCheckboxes(checkboxCollection) {
          var i,
            iMax = checkboxCollection.length;
          for (i = 0; i < iMax; i += 1) {
            checkboxCollection[i].removeAttribute('checked');
          }
        }

  // set options for the Dynamic Ingest API request
  function makeRequest(type) {
    var options = {},
      body = {},
      i,
      iMax,
      cmsBaseURL = 'https://cms.api.brightcove.com/v1/accounts/' + account_id,
      custom_profile_display_value = custom_profile_display.value;
    // get the ingest profile
    if (isDefined(custom_profile_display_value)) {
      ingest_profile = custom_profile_display_value;
    } else {
      ingest_profile = ingest_profile_display.options[ingest_profile_display.selectedIndex].value;
    }
    options.client_id = client_id;
    options.client_secret = client_secret;
    options.proxyURL = proxyURL;

    switch (type) {
      case 'getVideos':
      var input,
        space,
        label,
        text,
        br,
        fragment = document.createDocumentFragment();
      endpoint = '/videos';
      options.url = cmsBaseURL + endpoint;
      apiRequest.textContent = options.url;
      options.requestType = 'GET';
      makeRequest(options, function(response) {
        getVideos.textContent = 'Get Next Set of Videos';
        videos = JSON.parse(response);
        logMessage(videos.length + ' videos retrieved');
        apiResponse.textContent = JSON.stringify(videos, null, '  ');
        input = document.createElement('input');
        space = document.createTextNode(' ');
        label = document.createElement('label');
        input.setAttribute('name', 'videosChkAll');
        input.setAttribute('id', 'videosChkAll');
        input.setAttribute('type', 'checkbox');
        input.setAttribute('value', 'all');
        label.setAttribute('for', 'videosChkAll');
        label.setAttribute('style', 'color:#F3951D;');
        text = document.createTextNode('Select All');
        label.appendChild(text);
        br = document.createElement('br');
        fragment.appendChild(input);
        fragment.appendChild(space);
        fragment.appendChild(label);
        fragment.appendChild(br);
          iMax = videos.length;
          for (i = 0; i < iMax; i++) {
            input = document.createElement('input');
            space = document.createTextNode(' ');
            label = document.createElement('label');
            input.setAttribute('name', 'videosChk');
            input.setAttribute('id', 'field' + videos[i].id);
            input.setAttribute('type', 'checkbox');
            input.setAttribute('value', videos[i].id);
            label.setAttribute('for', 'field' + videos[i].id);
            text = document.createTextNode(videos[i].name);
            label.appendChild(text);
            br = document.createElement('br');
            fragment.appendChild(input);
            fragment.appendChild(space);
            fragment.appendChild(label);
            fragment.appendChild(br);
          }
          // clear videos videos
          videosBlock.innerHTML = '';
          videosBlock.appendChild(fragment);
          // get references to checkboxes
          videosCollection = document.getElementsByName('videosChk');
          videosSelectAll = document.getElementById('videosChkAll');
          // add event listener for select allows
          videosSelectAll.addEventListener('change', function() {
            if (this.checked) {
              selectAllCheckboxes(videosCollection);
            } else {
              deselectAllCheckboxes(videosCollection);
            }
          });
        });
        break;
      case 'getProfiles':

        break;
      case 'startRetranscode':
        break;
      default:
        console.log('Unknown request type');
    }
    apiRequest.value = "https://ingest.api.brightcove.com/v1/accounts/" + account_id + "/videos/" + videoData[videoNumber].id + "/ingest-requests";
    body.master = {};
    body.master.use_archived_master = true;
    body.profile = ingest_profile;
    body["capture-images"] = isChecked(capture_images_display);
    options.requestBody = JSON.stringify(body);
    options.requestType = "POST";
    options.url = apiRequest.value;
    // now submit the request
    submitRequest(options, diURL, "di");
  }
  // function to set the request
  function logResponse(type, data) {
    response.textContent += type + ": " + data + ",\n";
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
              if (responseData.indexOf("error_code") < 0) {
                // handle the response
                totalIngested++;
                logResponse("totalIngested", totalIngested);
                videoNumber++;
                currentJobs++;
                if (videoNumber < totalVideos - 1) {
                  logResponse('Processing video number', videoNumber);
                  logResponse('Current jobs: ', currentJobs);
                  // if currentJobs is > 99, need to pause
                  if (currentJobs > 99) {
                    // reset currentJobs
                    currentJobs = 0;
                    // wait 30 min before resuming
                    t2 = setTimeout(makeRequest, 1800000);
                  } else {
                    makeRequest();
                  }
                }
              } else {
                logResponse("DI", "Request failed; retrying video number: " + videoData[videoNumber].id);
                videoNumber++;
                // give proxy a second to rest
                t2 = setTimeout(makeRequest, 1000);
              }

            } else {
              alert("There was a problem with the request. Request returned " + httpRequest.status);
            }
          }
        } catch (e) {
          alert('Caught Exception: ' + e);
        }
      };
    // set up request data
    requestData = "client_id=" + options.client_id + "&client_secret=" + options.client_secret + "&url=" + encodeURIComponent(options.url) + "&requestBody=" + encodeURIComponent(options.requestBody) + "&requestType=" + options.requestType;
    // set response handler
    httpRequest.onreadystatechange = getResponse;
    // open the request
    httpRequest.open("POST", proxyURL);
    // set headers
    httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    // open and send request
    httpRequest.send(requestData);
  }
  di_submit_display.addEventListener("click", function() {
    videoData = JSON.parse(videoDataDisplay.value);
    totalVideos = videoData.length;
    // to insure uniqueness,
    // in case of stop/start, reset videoNumber to 0
    videoNumber = 0;
    // get account inputs
    account_id = isDefined(account_id_display.value) ? account_id_display.value : defaults.account_id;
    client_id = isDefined(client_id_display.value) ? client_id_display.value : defaults.client_id;
    client_secret = isDefined(client_secret_display.value) ? client_secret_display.value : defaults.client_secret;
    // set CMS API options for first video
    makeRequest();
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
  };
  // call init to set things up
  init();
})(window, document);
