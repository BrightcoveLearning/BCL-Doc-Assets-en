var BCLS = (function(window, document) {
  var account_id,
    client_id,
    client_secret,
    // api stuff
    proxyURL            = 'https://solutions.brightcove.com/bcls/bcls-proxy/brightcove-learning-proxy-v2.php',
    baseURL             = 'https://cms.api.brightcove.com/v1/accounts/',
    limit               = 25,
    totalVideos         = 0,
    totalCalls          = 0,
    totalSharedVideos   = 0,
    callNumber          = 0,
    videosCompleted     = 0,
    videosArray         = [],
    sharedVideos        = [],
    affiliates          = [],
    summaryData         = {},
    csvStr,
    summaryCsvStr,
    // elements
    account_id_input          = document.getElementById('account_id'),
    client_id_input           = document.getElementById('client_id'),
    client_secret_input       = document.getElementById('client_secret'),
    searchTags          = document.getElementById('searchTags'),
    searchField         = document.getElementById('searchField'),
    searchFieldValue    = document.getElementById('searchFieldValue'),
    dateRangeType       = document.getElementById('dateRangeType'),
    fromDate            = document.getElementById('fromDate'),
    toDate              = document.getElementById('toDate'),
    videoCount          = document.getElementById('videoCount'),
    makeReport          = document.getElementById('makeReport'),
    content,
    logger              = document.getElementById('logger'),
    csvData             = document.getElementById('csvData'),
    apiRequest          = document.getElementById('apiRequest'),
    apiResponse         = document.getElementById('apiResponse'),
    allButtons          = document.getElementsByName('button'),
    pLogGettingVideos   = document.createElement('p'),
    gettingVideoShares  = document.createElement('p'),
    pLogFinish          = document.createElement('p'),
    spanIntro2          = document.createElement('span'),
    spanOf2             = document.createElement('span'),
    spanRenditionsTotal = document.createElement('span'),
    spanRenditionsCount = document.createElement('span'),
    dateTypeValue,
    fromDateValue,
    toDateValue,
    tagsSearchString,
    fieldsSearchString,
    dateSearchString,
    searchString,
    spanRenditionsTotalEl,
    spanRenditionsCountEl;

  // date pickers
  rome(fromDate);
  rome(toDate);

  /**
   * tests for all the ways a variable might be undefined or not have a value
   * @param {String|Number} x the variable to test
   * @return {Boolean} true if variable is defined and has a value
   */
  function isDefined(x) {
    if (x === '' || x === null || x === undefined) {
      return false;
    }
    return true;
  }

  /**
   * get selected value for single select element
   * @param {htmlElement} e the select element
   */
  function getSelectedValue(e) {
    return e.options[e.selectedIndex].value;
  }

  /**
   * remove spaces from a string
   * @param {String} str string to process
   * @return {String} trimmed string
   */
  function removeSpaces(str) {
    str = str.replace(/\s/g, '');
    return str;
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
   * disables all buttons so user can't submit new request until current one finishes
   */
  function disableButtons() {
    var i,
      iMax = allButtons.length;
    for (i = 0; i < iMax; i++) {
      allButtons[i].setAttribute('disabled', 'disabled');
    }
  }

  /**
   * re-enables all buttons
   */
  function enableButtons() {
    var i,
      iMax = allButtons.length;
    for (i = 0; i < iMax; i++) {
      allButtons[i].removeAttribute('disabled');
    }
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
   * adds a new message to the logging element
   * @param  {string} message string to add
   */
  function logMessage(message) {
    lineBreak = document.createElement('br');
    logger.appendChild(lineBreak);
    message = document.createTextNode(message);
    logger.appendChild(message);
  }

  function writeReport() {
    var i,
      iMax,
      j,
      jMax,
      video;
    if (sharedVideos.length > 0) {
      csvStr = '"ID","Name","Sharer ID","Sharer Name","Sharer Video ID",\r\n';
      iMax = videosArray.length;
      for (i = 0; i < iMax; i += 1) {
        video = sharedVideos[i];
        // add csv row
        csvStr += '"' + video.id + '","' + video.name + '","' + video.sharer_id + '","' + video.sharer_name + '","' + video.sharer_video_id + '","';
          csvStr += '\r\n';
      }
      csvData.textContent += csvStr;
      // content = document.createTextNode('Finished! See the results or get the CSV data below.');
      logMessage('Finished! Get the CSV data below.');
      // reportDisplay.innerHTML = summaryReportStr + reportStr;
      enableButtons();
    }
  }

  /**
   * sets up the data for the API request
   * @param {String} id the id of the button that was clicked
   */
  function createRequest(id) {
    var endPoint = '',
      cmsBaseURL = baseURL + account_id,
      options = {},
      responseParsed,
      i,
      iMax;
    // disable buttons to prevent a new request before current one finishes
    disableButtons();

    // set general options
    options.account_id = account_id;
    options.proxyURL = proxyURL;
    if (isDefined(client_id) && isDefined(client_secret)) {
      options.client_id = client_id;
      options.client_secret = client_secret;
    }

    switch (id) {
      case 'getAffiliates':
        endpoint = '/channels/default/members';
        options.url = cmsBaseURL + endpoint;
        apiRequest.textContent = options.url;
        options.requestType = 'GET';
        makeRequest(options, function(response) {
          affiliates = JSON.parse(response);
          apiResponse.textContent = JSON.stringify(affiliates, null, '  ');
          logMessage('Affiliates retrieved');
          // get some videos
          createRequest('getCount');
        });
        break;
      case 'getCount':
        endPoint = '/counts/videos';
        if (isDefined(searchString)) {
          endPoint += '&q=' + searchString;
        }
        options.url = cmsBaseURL + endPoint;
        options.requestType = 'GET';
        apiRequest.textContent = options.url;
        makeRequest(options, function(response) {
          responseParsed = JSON.parse(response);
          logMessage('Video count retrieved');
          apiResponse.textContent = JSON.stringify(responseParsed, null, '  ');
          totalVideos = responseParsed.count;
          if (totalVideos === 0) {
            alert('No videos found; try changing or removing the search criteria');
          } else if (getSelectedValue(videoCount) !== 'All') {
            totalVideos = getSelectedValue(videoCount);
          }
          totalCalls = Math.ceil(totalVideos / limit);
          createRequest('getVideos');
        });
        break;
      case 'getVideos':
        var offset = (limit * callNumber);
        endPoint = '/videos?limit=' + limit + '&offset=' + offset;
        if (isDefined(searchString)) {
          endPoint += '&q=' + searchString;
        }
        options.url = cmsBaseURL + endPoint;
        apiRequest.textContent = options.url;
        options.requestType = 'GET';
        apiRequest.textContent = options.url;
        makeRequest(options, function(response) {
          videosArray = videosArray.concat(JSON.parse(response));
          apiResponse.textContent = JSON.stringify(videosArray, null, '  ');
          callNumber++;
          if (callNumber < totalCalls) {
            createRequest('getVideos');
          } else {
            iMax = videosArray.length;
            for (i = 0; i < iMax; i++) {
              var o = {};
              if (isDefined(videosArray[i].sharing)) {
                if (videosArray[i].sharing.by_external_account) {
                  o.id = videosArray[i].id;
                  o.name = videosArray[i].name;
                  o.sharer_id = videosArray[i].sharing.by_id;
                  o.sharer_video_id = videosArray[i].sharing.source_id;
                  o.sharer_name = affiliates[findObjectInArray(affiliates, 'account_id', o.sharer_id)].account_name;
                  sharedVideos.push(o);
                  console.log('sharedVideos', sharedVideos);
                }
              }
            }
            if (sharedVideos.length === 0) {
              alert('None of the returned videos are shared');
              return;
            }
            totalSharedVideos = sharedVideos.length;
            logMessage('All videos retrieved; creating report');
            createRequest('getShares');
          }
        });
        break;
      default:
        console.log('Something wrong; should never get here');
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

  function init() {
    // event listeners
    csvData.addEventListener('click', function() {
      this.select();
    });
    // set up the log elements
  }

  // button event handlers
  makeReport.addEventListener('click', function() {
    // get the inputs
    client_id     = client_id_input.value;
    client_secret = client_secret_input.value;
    totalVideos  = getSelectedValue(videoCount);
    // check for search terms
    if (isDefined(searchTags.value)) {
      tagsSearchString = '%2Btags:' + removeSpaces(searchTags.value);
    }
    if (isDefined(searchFieldValue.value)) {
      if (isDefined(searchField.value)) {
        fieldsSearchString = '%2B' + searchField.value + ':' + convertSpaces(searchFieldValue.value);
      } else {
        fieldsSearchString = '%2Bcustom_fields:"' + convertSpaces(searchFieldValue.value) + '"';
      }
    }
    dateTypeValue = getSelectedValue(dateRangeType).value;
    fromDateValue = rome(fromDate).getDate();
    if (isDefined(fromDateValue)) {
      fromDateValue = fromDateValue.toISOString();
    }
    toDateValue = rome(toDate).getDate();
    if (isDefined(toDateValue)) {
      toDateValue = toDateValue.toISOString();
    }
    if (isDefined(fromDateValue) || isDefined(toDateValue)) {
      dateSearchString = '%2B' + dateTypeValue + ':' + fromDateValue + '..' + toDateValue;
    }

    // define the whole search string
    if (isDefined(tagsSearchString)) {
      searchString = tagsSearchString;
      if (isDefined(fieldsSearchString)) {
        searchString += '+' + fieldsSearchString;
      }
      if (isDefined(dateSearchString)) {
        searchString += '+' + dateSearchString;
      }
    } else if (isDefined(fieldsSearchString)) {
      searchString = fieldsSearchString;
      if (isDefined(dateSearchString)) {
        searchString += '+' + dateSearchString;
      }
    } else if (isDefined(dateSearchString)) {
      searchString = dateSearchString;
    }
    // only use entered account id if client id and secret are entered also
    if (isDefined(client_id) && isDefined(client_secret)) {
      if (isDefined(account_id_input.value)) {
        account_id = account_id_input.value;
      } else {
        window.alert('To use your own account, you must specify an account id, and client id, and a client secret - since at least one of these is missing, a sample account will be used');
        client_id     = '';
        client_secret = '';
        account_id    = '57838016001';
      }
    } else {
      account_id = '57838016001';
    }
    // get video count
    createRequest('getAffiliates');

  });

  init();
})(window, document);
