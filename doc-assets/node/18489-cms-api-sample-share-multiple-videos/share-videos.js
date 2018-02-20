var BCLS = (function(window, document) {
  var accountId           = document.getElementById('accountId'),
    clientId              = document.getElementById('clientId'),
    clientSecret          = document.getElementById('clientSecret'),
    searchTags            = document.getElementById('searchTags'),
    searchField           = document.getElementById('searchField'),
    searchFieldValue      = document.getElementById('searchFieldValue'),
    dateRangeType         = document.getElementById('dateRangeType'),
    fromDate              = document.getElementById('fromDate'),
    toDate                = document.getElementById('toDate'),
    videoCountDisplay     = document.getElementById('videoCountDisplay'),
    videosBlock           = document.getElementById('videosBlock'),
    affiliatesBlock       = document.getElementById('affiliatesBlock'),
    getVideos             = document.getElementById('getVideos'),
    shareVideos           = document.getElementById('shareVideos'),
    logger                = document.getElementById('logger'),
    apiRequest            = document.getElementById('apiRequest'),
    apiResponse           = document.getElementById('apiResponse'),
    affiliates            = [],
    affiliatesToShareWith = [],
    videos                = [],
    videosToShare         = [],
    limit                 = 20,
    videoCount            = 0,
    videoCallNumber       = 0,
    shareCallNumber       = 0,
    totalVideoCalls       = 0,
    totalShareCalls       = 0,
    lineBreak,
    message,
    dateTypeValue,
    fromDateValue,
    toDateValue,
    tagsSearchString,
    fieldsSearchString,
    dateSearchString,
    searchString,
    account_id,
    client_id,
    client_secret,
    videosCollection,
    affiliatesCollection,
    videosSelectAll,
    affiliatesSelectAll;

  // date pickers
  rome(fromDate);
  rome(toDate);

  // *****event listeners*****
  getVideos.addEventListener('click', function() {
    if (videoCount === 0) {
      if (isDefined(accountId.value) && isDefined(clientId.value) && isDefined(clientSecret.value)) {
        // get inputs
        account_id    = accountId.value;
        client_id     = clientId.value;
        client_secret = clientSecret.value;
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
        createRequest('getVideoCount');
      } else {
        alert('You must submit an account id and client credentials');
      }
    } else {
      videoCallNumber++;
      if (videoCallNumber < totalVideoCalls) {
        createRequest('getVideos');
      } else {
        logMessage('No more videos - finished.');
      }
    }
  });

  shareVideos.addEventListener('click', function() {
    apiResponse.textContent = '';
    videosToShare = getCheckedBoxValues(videosCollection);
    affiliatesToShareWith = getCheckedBoxValues(affiliatesCollection);
console.log('affiliatesToShareWith', affiliatesToShareWith);
    if (videosToShare.length === 0) {
      alert('Please select some videos to share and try again');
    } else if (affiliatesToShareWith.length === 0) {
      alert('Please select some affiliates to share with and try again');
    } else {
      totalShareCalls = videosToShare.length;
      shareCallNumber = 0;
      createRequest('shareVideos');
    }
  });

  // ***** end event listeners *****

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
   * get selected value for single select element
   * @param {htmlElement} e the select element
   * @return {Object} object containing the `value`, text, and selected `index`
   */
  function getSelectedValue(e) {
    var selected = e.options[e.selectedIndex],
      val = selected.value,
      txt = selected.textContent,
      idx = e.selectedIndex;
    return {
      value: val,
      text: txt,
      index: idx
    };
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
   * convert spaces in a string to %20 for URI encoding
   * @param {String} str string to process
   * @return {String} trimmed string
   */
  function convertSpaces(str) {
    str = str.replace(/\s/g, '%20');
    return str;
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
   * createRequest sets up requests, send them to makeRequest(), and handles responses
   * @param  {string} type the request type
   */
  function createRequest(type) {
    var options = {},
      cmsBaseURL = 'https://cms.api.brightcove.com/v1/accounts/' + account_id,
      endpoint,
      body = [],
      responseDecoded,
      fragment = document.createDocumentFragment(),
      input,
      space,
      label,
      br,
      i,
      iMax;

    // set credentials
    options.client_id = client_id;
    options.client_secret = client_secret;

    // set proxyURL
    options.proxyURL = 'https://solutions.brightcove.com/bcls/bcls-proxy/bcls-proxy.php';

    switch (type) {
      case 'getVideoCount':
        endpoint = '/counts/videos';
        if (isDefined(searchString)) {
          endpoint += '?q=' + searchString;
        }
        options.url = cmsBaseURL + endpoint;
        apiRequest.textContent = options.url;
        options.requestType = 'GET';
        makeRequest(options, function(response) {
          videoCount = JSON.parse(response).count;
          apiResponse.textContent = JSON.stringify(JSON.parse(response), null, '  ');
          videoCountDisplay.textContent = videoCount;
          if (videoCount === 0) {
            logMessage('The search returned no videos - try using different search criteria (or none at all)');
          } else {
            totalVideoCalls = Math.ceil(videoCount / limit);
            createRequest('getAffiliates');
          }
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
          if (affiliates.length === 0) {
            logMessage('There are no affiliate accounts set up for sharing; please add one or more affiliates and try again');
          } else {
            logMessage('Affiliates retrieved');
            input = document.createElement('input');
            space = document.createTextNode(' ');
            label = document.createElement('label');
            input.setAttribute('name', 'affiliatesChkAll');
            input.setAttribute('id', 'affiliatesChkAll');
            input.setAttribute('type', 'checkbox');
            input.setAttribute('value', 'all');
            label.setAttribute('for', 'affiliatesChkAll');
            label.setAttribute('style', 'color:#F3951D;');
            text = document.createTextNode('Select All');
            label.appendChild(text);
            br = document.createElement('br');
            fragment.appendChild(input);
            fragment.appendChild(space);
            fragment.appendChild(label);
            fragment.appendChild(br);
            iMax = affiliates.length;
            for (i = 0; i < iMax; i++) {
              input = document.createElement('input');
              space = document.createTextNode(' ');
              label = document.createElement('label');
              input.setAttribute('name', 'affiliatesChk');
              input.setAttribute('id', affiliates[i].account_id);
              input.setAttribute('type', 'checkbox');
              input.setAttribute('value', affiliates[i].account_id);
              label.setAttribute('for', affiliates[i].account_id);
              text = document.createTextNode(affiliates[i].account_name);
              label.appendChild(text);
              br = document.createElement('br');
              fragment.appendChild(input);
              fragment.appendChild(space);
              fragment.appendChild(label);
              fragment.appendChild(br);
            }
            affiliatesBlock.appendChild(fragment);
            // get references to checkboxes
            affiliatesCollection = document.getElementsByName('affiliatesChk');
            affiliatesSelectAll = document.getElementById('affiliatesChkAll');
            // add event listener for select allows
            affiliatesSelectAll.addEventListener('change', function() {
              if (this.checked) {
                selectAllCheckboxes(affiliatesCollection);
              } else {
                deselectAllCheckboxes(affiliatesCollection);
              }
            });
          }
          // get some videos
          createRequest('getVideos');
        });
        break;
      case 'getVideos':
        endpoint = '/videos?limit=' + limit + '&offset=' + (limit * videoCallNumber);
        if (isDefined(searchString)) {
          endpoint += '&q=' + searchString;
        }
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
        case 'shareVideos':
          endpoint = '/videos/' + videosToShare[shareCallNumber] + '/shares';
          options.url = cmsBaseURL + endpoint;
          apiRequest.textContent = options.url;
          options.requestType = 'POST';
          iMax = affiliatesToShareWith.length;
          for (i = 0; i < iMax; i++) {
            var o = {};
            o.id = affiliatesToShareWith[i];
            body.push(o);
          }
console.log('body', body);
          options.requestBody = JSON.stringify(body);
          makeRequest(options, function(response) {
            responseDecoded = JSON.parse(response);
            lineBreak = document.createElement(br);
            apiResponse.appendChild(lineBreak);
            apiResponse.textContent += JSON.stringify(responseDecoded, null, '  ');
            logMessage('Video was shared with selected affiliates (see response to check for errors)');
            shareCallNumber++;
            if (shareCallNumber < totalShareCalls) {
              createRequest('shareVideos');
            } else {
                logMessage('Share complete - click Get Next Set of Videos to share more videos');
            }
          });
          break;
      default:
        console.log('Should not be getting to the default case - bad request type sent');
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
})(window, document);
