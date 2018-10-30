var BCLS = (function(window, document) {
  var account_id,
    client_id,
    client_secret,
    // api stuff
    proxyURL              = 'https://solutions.brightcove.com/bcls/bcls-proxy/bcls-proxy-v2.php',
    baseURL               = 'https://cms.api.brightcove.com/v1/accounts/',
    limit                 = 10,
    offset                = 0,
    totalVideos           = 0,
    totalCalls            = 0,
    totalUpdateCalls      = 0,
    getVideoCallNumber    = 0,
    updateVideoCallNumber = 0,
    videosCompleted       = 0,
    // elements
    account_id_input      = document.getElementById('account_id'),
    client_id_input       = document.getElementById('client_id'),
    client_secret_input   = document.getElementById('client_secret'),
    get_videos            = document.querySelector('#get_videos'),
    update_videos         = document.querySelector('#update_videos'),
    custom_field          = document.querySelector('#custom_field'),
    custom_field_value    = document.querySelector('#custom_field_value'),
    custom_field_values   = document.querySelector('#custom_field_values'),
    logger                = document.getElementById('logger'),
    api_request           = document.getElementById('api_request'),
    api_response          = document.getElementById('api_response'),
    videos,
    totalCurrentVideos    = 0,
    custom_fields,
    selected_field,
    selected_field_value;


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
      hideElement(custom_field_values);
      showElement(custom_field_value);
    } else {
      hideElement(custom_field_value);
      showElement(custom_field_values);
      // remove existing options
      removeChildren(custom_field_values);
      iMax = field.enum_values.length;
      for (i = 0; i < iMax; i++) {
        option = document.createElement('option');
        option.setAttribute('value', field.enum_values[i]);
        option.textContent = field.enum_values[i];
        frag.appendChild(option);
      }
      custom_field_values.appendChild(frag);
    }
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

  function createVideoList(videos) {
    var input,
      label,
      space,
      text,
      br,
      fragment = document.createDocumentFragment(),
      i,
      iMax;
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
      removeChildren(video_list);
      video_list.appendChild(fragment);
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
        api_request.textContent = options.url;
        options.requestType = 'GET';
        makeRequest(options, function(response) {
          custom_fields = JSON.parse(response).custom_fields;
          api_response.textContent = JSON.stringify(custom_fields, null, 2);
          logMessage('Custom fields retrieved');
          createCustomFieldOptions();
        });
        break;
      case 'getCount':
        endPoint = '/counts/videos';
        if (isDefined(searchString)) {
          endPoint += '&q=' + searchString;
        }
        options.url = cmsBaseURL + endPoint;
        options.requestType = 'GET';
        api_request.textContent = options.url;
        makeRequest(options, function(response) {
          responseParsed = JSON.parse(response);
          logMessage('Video count retrieved');
          api_response.textContent = JSON.stringify(responseParsed, null, '  ');
          totalVideos = responseParsed.count;
          if (totalVideos === 0) {
            alert('No videos found; try changing or removing the search criteria');
          } else if (getSelectedValue(videoCount) !== 'All') {
            totalVideos = getSelectedValue(videoCount);
          }
          totalCalls = Math.ceil(totalVideos / limit);
          createRequest('custom_field_values');
        });
        break;
        case 'getVideos':
          endpoint = '/videos?limit=' + limit + '&offset=' + (limit * getVideoCallNumber);
          options.url = cmsBaseURL + endpoint;
          apiRequest.textContent = options.url;
          options.requestType = 'GET';
          makeRequest(options, function(response) {
            getVideoCallNumber++;
            if (getVideoCallNumber < totalCalls) {
              get_videos.textContent = 'Get Next Set of Videos';
            } else {
              get_videos.textContent = 'No More Videos';
              get_videos.setAttribute('disabled', disabled);
            }
            videos = JSON.parse(response);
            totalCurrentVideos = videos.length;
            logMessage(videos.length + ' videos retrieved');
            apiResponse.textContent = JSON.stringify(videos, null, '  ');
            createVideoList(videos);
            });
            break;
        case 'updateVideo':
          var video = videos[updateVideoCallNumber],
            requestBody = {};
          endpoint = '/videos/' + video.id';
          options.url = cmsBaseURL + endpoint;
          requestBody.custom_fields = {};
          requestBody.custom_fields[selected_field] = selected_field_value;
          options.requestBody = JSON.stringify(requestBody);
          apiRequest.textContent = options.url;
          options.requestType = 'PATCH';
          makeRequest(options, function(response) {
            updateVideoCallNumber++;
            if (updateVideoCallNumber < totalCalls) {
              get_videos.textContent = 'Get Next Set of Videos';
            } else {
              get_videos.textContent = 'No More Videos';
              get_videos.setAttribute('disabled', disabled);
            }
            responseParsed = JSON.parse(response);
            logMessage(videos.length + ' videos retrieved');
            apiResponse.textContent = JSON.stringify(videos, null, '  ');
            createVideoList();
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
    get_videos.addEventListener('click', function() {
      getAccountInfo();
    });
    searchField.addEventListener('change', function() {
      createCustomFieldValueOptions();
    });
    hideElement(custom_field_values);
    showElement(custom_field_value);
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
    if (custom_field_value.getAttribute('style') === 'display:inline') {
      if (isDefined(custom_field_value.value)) {
        if (isDefined(searchField.value)) {
          fieldsSearchString = '%2B' + searchField.value + ':' + encodeURI(custom_field_value.value);
        } else {
          fieldsSearchString = '%2Bcustom_fields:"' + encodeURI(custom_field_value.value) + '"';
        }
      }
    } else {
      console.log('custom_field_values');
      fieldsSearchString = '%2Bcustom_fields:"' + encodeURI(getSelectedValue(custom_field_values)) + '"';
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
