var BCLS = (function(window, document) {
  var account_id,
    client_id,
    client_secret,
    // api stuff
    proxyURL            = 'https://solutions.brightcove.com/bcls/bcls-proxy/bcls-proxy-v2.php',
    baseURL             = 'https://cms.api.brightcove.com/v1/accounts/',
    limit               = 10,
    offset              = 0,
    totalVideos         = 0,
    totalCalls          = 0,
    callNumber          = 0,
    videosCompleted     = 0,
    videosArray         = [],
    // elements
    account_id_input    = document.getElementById('account_id'),
    client_id_input     = document.getElementById('client_id'),
    client_secret_input = document.getElementById('client_secret'),
    custom_field        = document.querySelector('#searchField'),
    custom_field_value  = document.querySelector('#searchFieldValue'),
    custom_field_values = document.querySelector('#searchFieldValues'),
    videoCount          = document.getElementById('videoCount'),
    content,
    logger              = document.getElementById('logger'),
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
    custom_fields,
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
   * hide an element
   * @param {htmlElement} el the element to hide
   */
  function hideElement(el) {
    el.setAttribute('style', 'display:none');
  }

  /**
   * show a hidden element
   * @param {htmlElement} el the element to hide
   */
  function showElement(el) {
    el.setAttribute('style', 'display:inline');
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
   * removes all children from an element
   * @param {htmlElement} el the element to empty
   */
  function removeChildren(el) {
    while (el.firstChild) {
    el.removeChild(el.firstChild);
  }


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

  /**
   * populate field selector with account custom fields
   */
  function createCustomFieldOptions() {
    var i,
      iMax,
      field,
      option,
      frag = document.createDocumentFragment();
    // remove any existing options
    removeChildren(searchField);
    // set the 'any' option
    option = document.createElement('option');
    option.setAttribute('value', 'custom_fields');
    option.textContent = 'any';
    frag.appendChild(option);
    iMax = custom_fields.length;
    for (i = 0; i < iMax; i++) {
      field = custom_fields[i];
      option = document.createElement('option');
      option.setAttribute('value', field.id);
      option.textContent = field.display_name;
      frag.appendChild(option);
    }
    searchField.appendChild(frag);
  }

  /**
   * set the field for custom field value, depending on whether it's a string or enum type
   */
  function createCustomFieldValueOptions() {
    var i,
      iMax,
      field,
      option,
      idx,
      frag = document.createDocumentFragment();
    idx = findObjectInArray(custom_fields, 'id', getSelectedValue(searchField));
    field = custom_fields[idx];
    if (field.type === 'string') {
      hideElement(searchFieldValues);
      showElement(searchFieldValue);
    } else {
      hideElement(searchFieldValue);
      showElement(searchFieldValues);
      // remove existing options
      removeChildren(searchFieldValues);
      option = document.createElement('option');
      option.setAttribute('value', 'null');
      option.textContent = 'Do not search on custom fields';
      iMax = field.enum_values.length;
      for (i = 0; i < iMax; i++) {
        option = document.createElement('option');
        option.setAttribute('value', field.enum_values[i]);
        option.textContent = field.enum_values[i];
        frag.appendChild(option);
      }
      searchFieldValues.appendChild(frag);
    }
  }

  function writeReport() {
    var i,
      iMax,
      j,
      jMax,
      video;
    if (sharedVideoData.length > 0) {
      csvStr = '"ID","Name","Affiliate ID","Affiliate Name","Affiliate Video ID","Share Status",\r\n';
      iMax = sharedVideoData.length;
      for (i = 0; i < iMax; i += 1) {
        video = sharedVideoData[i];
        console.log('video', video);
        // add csv row
        csvStr += '"' + video.id + '","' + video.name + '","' + video.affiliate_id + '","' + video.affiliate_name + '","' + video.affiliate_video_id + '","' + video.share_status + '","' ;
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
      case 'getCustomFields':
        endpoint = '/video_fields';
        options.url = cmsBaseURL + endpoint;
        apiRequest.textContent = options.url;
        options.requestType = 'GET';
        makeRequest(options, function(response) {
          custom_fields = JSON.parse(response).custom_fields;
          apiResponse.textContent = JSON.stringify(custom_fields, null, 2);
          logMessage('Custom fields retrieved');
          createCustomFieldOptions();
        });
        break;
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
                o.id = videosArray[i].id;
                o.name = videosArray[i].name;
                sharedVideos.push(o);
console.log('sharedVideos', sharedVideos);
              }
            }
            if (sharedVideos.length === 0) {
              alert('None of the returned videos are shared');
              return;
            }
            totalSharedVideos = sharedVideos.length;
            logMessage('All videos retrieved; checking for shares...');
            callNumber = 0;
            createRequest('getShares');
          }
        });
        break;
      case 'getShares':
        endPoint = '/videos/' + sharedVideos[callNumber].id + '/shares';
        options.url = cmsBaseURL + endPoint;
        apiRequest.textContent = options.url;
        options.requestType = 'GET';
        apiRequest.textContent = options.url;
        makeRequest(options, function(response) {
          responseParsed = JSON.parse(response);
          apiResponse.textContent = JSON.stringify(responseParsed, null, '  ');
          iMax = responseParsed.length;
          for (i = 0; i < iMax; i++) {
            var o = {};
            o.id = sharedVideos[callNumber].id;
            o.name = sharedVideos[callNumber].name;
            o.affiliate_id = responseParsed[i].affiliate_id;
            // look up affiliate name from get affiliates response
            o.affiliate_name = affiliates[findObjectInArray(affiliates, 'account_id', responseParsed[i].affiliate_id)].account_name;
            o.affiliate_video_id = responseParsed[i].affiliate_video_id;
            o.share_status = responseParsed[i].status;
            sharedVideoData.push(o);
          }
          callNumber++;
          if (callNumber < totalSharedVideos) {
            createRequest('getShares');
          } else {
            logMessage('Video sharing info retrieved; writing report...');
            writeReport();
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

  function getAccountInfo() {
    account_id = account_id_input.value;
    client_id = client_id_input.value;
    client_secret = client_secret_input.value;
    // only use entered account id if client id and secret are entered also
    if (isDefined(client_id) && isDefined(client_secret)) {
      if (isDefined(account_id_input.value)) {
        account_id = account_id_input.value;
        console.log('account_id', account_id);
      } else {
        window.alert('To use your own account, you must specify an account id, and client id, and a client secret - since at least one of these is missing, a sample account will be used');
        client_id = null;
        client_secret = null;
        account_id = '57838016001';
      }
    } else {
      account_id = '57838016001';
    }
    createRequest('getCustomFields');
  }

  function init() {
    // event listeners
    csvData.addEventListener('click', function() {
      this.select();
    });
    useMyAccount.addEventListener('click', function() {
      getAccountInfo();
    });
    searchField.addEventListener('change', function() {
      createCustomFieldValueOptions();
    });
    hideElement(searchFieldValues);
    showElement(searchFieldValue);
    getAccountInfo();
  }

  // button event handlers
  makeReport.addEventListener('click', function() {
    // get the inputs
    totalVideos = getSelectedValue(videoCount);
    // check for search terms
    if (isDefined(searchTags.value)) {
      tagsSearchString = '%2Btags:' + removeSpaces(searchTags.value);
    }
    if (searchFieldValue.getAttribute('style') === 'display:inline') {
      if (isDefined(searchFieldValue.value)) {
        if (isDefined(searchField.value)) {
          fieldsSearchString = '%2B' + searchField.value + ':' + encodeURI(searchFieldValue.value);
        } else {
          fieldsSearchString = '%2Bcustom_fields:"' + encodeURI(searchFieldValue.value) + '"';
        }
      }
    } else {
      console.log('searchFieldValues');
      fieldsSearchString = '%2Bcustom_fields:"' + encodeURI(getSelectedValue(searchFieldValues)) + '"';
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
