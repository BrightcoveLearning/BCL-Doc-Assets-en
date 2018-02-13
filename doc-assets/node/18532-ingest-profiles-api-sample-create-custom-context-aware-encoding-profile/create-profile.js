var BCLS = (function(window, document) {
  var account_id_input = document.getElementById('account_id_input'),
    client_id_input = document.getElementById('client_id_input'),
    client_secret_input = document.getElementById('client_secret_input'),
    rendition_selector = document.getElementById('rendition_selector'),
    profile_name_input = document.getElementById('profile_name_input'),
    profile_description_input = document.getElementById('profile_description_input'),
    archive_master_input = document.getElementById('archive_master_input'),
    capture_images_input = document.getElementById('capture_images_input'),
    poster_height_input = document.getElementById('poster_height_input'),
    poster_width_input = document.getElementById('poster_height_input'),
    thumbnail_height_input = document.getElementById('thumbnail_height_input'),
    thumbnail_width_input = document.getElementById('thumbnail_width_input'),
    min_renditions_input = document.getElementById('min_renditions_input'),
    max_renditions_input = document.getElementById('max_renditions_input'),
    min_resolution_width_input = document.getElementById('min_resolution_width_input'),
    min_resolution_height_input = document.getElementById('min_resolution_height_input'),
    max_resolution_width_input = document.getElementById('max_resolution_width_input'),
    max_resolution_height_input = document.getElementById('max_resolution_height_input'),
    max_bitrate_input = document.getElementById('max_bitrate_input'),
    max_first_rendition_bitrate_input = document.getElementById('max_first_rendition_bitrate_input'),
    max_frame_rate_input = document.getElementById('max_frame_rate_input'),
    keyframe_rate_input = document.getElementById('keyframe_rate_input'),
    select_baseline_profile_configuration_input = document.getElementById('select_baseline_profile_configuration_input'),
    create_profile = document.getElementById('create_profile'),
    logger = document.getElementById('logger'),
    api_request_display = document.getElementById('api_request_display'),
    api_request_body_display = document.getElementById('api_request_body_display'),
    api_response = document.getElementById('api_response'),
    renditions = [{
      value: 'default/audio64',
      label: 'default/audio64'
    }, {
      value: 'default/audio96',
      label: 'default/audio96'
    }, {
      value: 'default/audio128',
      label: 'default/audio128'
    }, {
      value: 'default/audio192',
      label: 'default/audio192'
    }],
    account_id,
    client_id,
    client_secret,
    profile_name,
    profile_description,
    archive_master = true,
    capture_images = true,
    poster_width,
    poster_height,
    thumbnail_width,
    thumbnail_height,
    min_renditions,
    max_renditions,
    min_resolution_width,
    min_resolution_height,
    max_resolution_width,
    max_resolution_height,
    max_bitrate,
    max_first_rendition_bitrate,
    max_frame_rate,
    keyframe_rate,
    select_baseline_profile_configuration = true,
    selectAll,
    selectedRenditions = [],
    existingProfileNames = [],
    checkboxCollection;

  // event listeners
  create_profile.addEventListener('click', function() {
    selectedRenditions = getCheckedBoxValues(checkboxCollection);
    if (getAccountInfo()) {
      createRequest('get_profiles');
    } else {
      alert('Account id, client id, client secret, and a name for the new profile are required');
    }
  });


  /**
   * get account info from input fields
   */
  function getAccountInfo() {
    if (isDefined(account_id_input.value) && isDefined(client_id_input.value) && isDefined(client_secret_input.value) && isDefined(profile_name_input.value)) {
      account_id = removeSpaces(account_id_input.value);
      client_id = removeSpaces(client_id_input.value);
      client_secret = removeSpaces(client_secret_input.value);
      profile_name = (profile_name_input.value);
      archive_master = isChecked(archive_master_input);
      capture_images = isChecked(capture_images_input);
      poster_width = parseInt(removeSpaces(poster_width_input.value), 10);
      poster_height = parseInt(removeSpaces(poster_height_input.value), 10);
      thumbnail_width = parseInt(removeSpaces(thumbnail_width_input.value), 10);
      thumbnail_height = parseInt(removeSpaces(thumbnail_height_input.value), 10);
      if (capture_images) {
        if (!isDefined(poster_width) || !isDefined(poster_height) || !isDefined(thumbnail_width) || !isDefined(thumbnail_height)) {
          alert('If you want to capture images using this profile, you must provide dimensions for the poster and thumbnail');
          return false;
        }
      }
      min_renditions = parseInt(removeSpaces(min_renditions_input.value), 10);
      max_renditions = parseInt(removeSpaces(max_renditions_input.value), 10);
      min_resolution_width = parseInt(removeSpaces(min_resolution_width_input.value), 10);
      min_resolution_height = parseInt(removeSpaces(min_resolution_height_input.value), 10);
      max_resolution_width = parseInt(removeSpaces(max_resolution_width_input.value), 10);
      max_resolution_height = parseInt(removeSpaces(max_resolution_height_input.value), 10);
      max_bitrate = parseInt(removeSpaces(max_bitrate_input.value), 10);
      max_first_rendition_bitrate = parseInt(removeSpaces(max_first_rendition_bitrate_input.value), 10);
      max_frame_rate = parseInt(removeSpaces(max_frame_rate_input.value), 10);
      keyframe_rate = parseFloat(removeSpaces(keyframe_rate_input.value));
      select_baseline_profile_configuration = isChecked(select_baseline_profile_configuration_input);
      if (!isDefined(min_renditions) || !isDefined(max_renditions)) {
        alert('The minimum and maximum number of renditions are required');
        return false;
      }
      return true;
    } else {
      return false;
    }
  }

  /**
   * add a log message to the page
   * (inside an element with id="logger")
   * @param  {string} message the message to insert
   */
  function logMessage(message) {
    var p = document.createElement('p'),
      txt = document.createTextNode(message);
    p.appendChild(txt);
    logger.appendChild(p);
  }

  /**
   * tests for all the ways a variable might be undefined or not have a value
   * @param {*} x the variable to test
   * @return {Boolean} true if variable is defined and has a value
   */
  function isDefined(x) {
    if (x === '' || x === null || x === undefined || x === NaN) {
      return false;
    }
    return true;
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
   * replace spaces in a string with underscores
   * @param {String} str string to process
   * @return {String} processed string
   */
  function replaceSpaces(str) {
    str = str.replace(/\s/g, '_');
    return str;
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
   * determines if checkbox is checked
   * @param  {htmlElement}  e the checkbox to check
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
   * @param {htmlElementCollection} elementCollection collection of checkbox elements
   * @return {Array} array of the values of the checked boxes
   */
  function getCheckedBoxValues(elementCollection) {
    var checkedValues = [],
      i,
      iMax;
    if (elementCollection) {
      iMax = elementCollection.length;
      for (i = 0; i < iMax; i++) {
        if (elementCollection[i].checked === true) {
          checkedValues.push(elementCollection[i].value);
        }
      }
      return checkedValues;
    } else {
      console.log('Error: no input recieved');
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
   * de-selects all checkboxes in a collection
   * @param {htmlElementCollection} checkboxCollection a collection of the checkbox elements, usually gotten by document.getElementsByName()
   */
  function unselectAllCheckboxes(checkboxCollection) {
    var i,
      iMax = checkboxCollection.length;
    for (i = 0; i < iMax; i += 1) {
      checkboxCollection[i].removeAttribute('checked');
    }
  }

  /**
   * creates a set of checkboxes with labels from an array of valuesArray
   * @param {HTMLelement} parentElement the parent element for the checkboxes
   * @param {Array} valuesArray the array of value/labels  e.g. [{value:'a',label:'alpha'},{value:'b',label:'beta'}]
   */
  function addCheckboxes(parentElement, valuesArray) {
    var i,
      iMax,
      input,
      label,
      br,
      txt,
      fragment = document.createDocumentFragment();
    if (parentElement && valuesArray) {
      iMax = valuesArray.length;
      // add select all option
      input = document.createElement('input');
      input.setAttribute('type', 'checkbox');
      input.setAttribute('id', 'selectAll');
      txt = document.createTextNode(' ');
      label = document.createElement('label');
      label.setAttribute('for', 'selectAll');
      label.textContent = ' Select All';
      br = document.createElement('br');
      fragment.appendChild(input);
      fragment.appendChild(txt);
      fragment.appendChild(label);
      fragment.appendChild(br);
      for (i = 0; i < iMax; i++) {
        input = document.createElement('input');
        input.setAttribute('type', 'checkbox');
        input.setAttribute('value', valuesArray[i].value);
        input.setAttribute('name', 'checkboxCollection');
        txt = document.createTextNode(' ');
        label = document.createElement('label');
        label.setAttribute('for', valuesArray[i].value);
        label.textContent = ' ' + valuesArray[i].label;
        br = document.createElement('br');
        fragment.appendChild(input);
        fragment.appendChild(txt);
        fragment.appendChild(label);
        fragment.appendChild(br);
      }
      parentElement.appendChild(fragment);

      // set up select all option
      checkboxCollection = document.getElementsByName('checkboxCollection');
      selectAll = document.getElementById('selectAll');
      selectAll.addEventListener('change', function() {
        if (this.checked) {
          selectAllCheckboxes(checkboxCollection);
        } else {
          unselectAllCheckboxes(checkboxCollection);
        }
      });
    } else {
      console.log('function addCheckboxes: no parameters provided');
    }
  }


  /**
   * createRequest sets up requests, send them to makeRequest(), and handles responses
   * @param  {string} type the request type
   */
  function createRequest(type) {
    var options = {},
      requestBody = {},
      proxyURL = 'https://solutions.brightcove.com/bcls/bcls-proxy/brightcove-learning-proxy-v2.php',
      baseURL = 'https://ingestion.api.brightcove.com/v1/accounts/' + account_id,
      endpoint,
      responseDecoded,
      i,
      iMax;

    // set credentials
    options.client_id = client_id;
    options.client_secret = client_secret;
    options.proxyURL = proxyURL;

    switch (type) {
      case 'get_profiles':
        logMessage('Checking existing profiles to see if name is already used');
        endpoint = '/profiles';
        options.url = baseURL + endpoint;
        api_request_display.textContent = options.url;
        api_request_body_display.textContent = 'no request body for this operation';
        options.requestType = 'GET';
        makeRequest(options, function(response) {
          if (isJson(response)) {
            responseDecoded = JSON.parse(response);
            api_response.textContent = JSON.stringify(responseDecoded, null, '  ');
          } else {
            api_response.textContent = response;
            logMessage('The get profiles operation failed; see the API Response for the error');
            return;
          }
          if (Array.isArray(responseDecoded)) {
            iMax = responseDecoded.length;
            for (i = 0; i < iMax; i++) {
              existingProfileNames.push(responseDecoded[i].name);
            }
            // check to see if input name already exists
            if (arrayContains(existingProfileNames, profile_name)) {
              alert('The profile name you entered is already in use in this account; please enter a different name and try again');
            } else {
              createRequest('create_profile');
            }
          }
        });
        break;
      case 'create_profile':
        logMessage('Creating profile');
        endpoint = '/profiles';
        options.url = baseURL + endpoint;
        api_request_display.textContent = options.url;
        options.requestType = 'POST';
        requestBody.name = profile_name;
        if (isDefined(profile_description)) {
          requestBody.description = profile_description;
        }
        requestBody.account_id = account_id;
        if (archive_master) {
          requestBody.digital_master = {};
          requestBody.digital_master.rendition = 'passthrough';
        }
        requestBody.dynamic_origin = {};
        requestBody.dynamic_origin.renditions = selectedRenditions;
        if (capture_images) {
          requestBody.dynamic_origin.images = [];
          requestBody.dynamic_origin.images.push({
            label: 'poster',
            height: poster_height,
            width: poster_width
          });
          requestBody.dynamic_origin.images.push({
            label: 'thumbnail',
            height: thumbnail_height,
            width: thumbnail_width
          });
        }
        requestBody.dynamic_origin.dynamic_profile_options = {};
        requestBody.dynamic_origin.dynamic_profile_options.min_renditions = min_renditions;
        requestBody.dynamic_origin.dynamic_profile_options.max_renditions = max_renditions;
        if (isDefined(min_resolution_width) || isDefined(min_resolution_height)) {
          requestBody.dynamic_origin.dynamic_profile_options.min_resolution = {};
          if (isDefined(min_resolution_width)) {
            requestBody.dynamic_origin.dynamic_profile_options.min_resolution.width = min_resolution_width;
          }
          if (isDefined(min_resolution_height)) {
            requestBody.dynamic_origin.dynamic_profile_options.min_resolution.height = min_resolution_height;
          }
        }
        if (isDefined(max_resolution_width) || isDefined(max_resolution_height)) {
          requestBody.dynamic_origin.dynamic_profile_options.max_resolution = {};
          if (isDefined(max_resolution_width)) {
            requestBody.dynamic_origin.dynamic_profile_options.max_resolution.width = max_resolution_width;
          }
          if (isDefined(min_resolution_height)) {
            requestBody.dynamic_origin.dynamic_profile_options.min_resolution.height = min_resolution_height;
          }
        }
        if (isDefined(max_bitrate)) {
          requestBody.dynamic_origin.dynamic_profile_options.max_bitrate = max_bitrate;
        }
        if (isDefined(max_first_rendition_bitrate)) {
          requestBody.dynamic_origin.dynamic_profile_options.max_first_rendition_bitrate = max_first_rendition_bitrate;
        }
        if (isDefined(max_frame_rate)) {
          requestBody.dynamic_origin.dynamic_profile_options.max_frame_rate = max_frame_rate;
        }
        if (isDefined(keyframe_rate)) {
          requestBody.dynamic_origin.dynamic_profile_options.keyframe_rate = keyframe_rate;
        }
        requestBody.dynamic_origin.dynamic_profile_options.select_baseline_profile_configuration = select_baseline_profile_configuration;
        api_request_body_display.textContent = JSON.stringify(requestBody, null, '  ');
        options.requestBody = JSON.stringify(requestBody);
        makeRequest(options, function(response) {
          if (isJson(response)) {
            responseDecoded = JSON.parse(response);
            api_response.textContent = JSON.stringify(responseDecoded, null, '  ');
            logMessage('Profile create operation complete - check the response below to sure there were no errors');
          } else {
            api_response.textContent = response;
            logMessage('The create profile operation failed; see the response below for the error');
            return;
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
     * the proxy used here takes the following params:
     * url - the full API request (required)
     * requestType - the HTTP request type (default: GET)
     * clientId - the client id (defaults here to a Brightcove sample account value - this should always be stored on the server side if possible)
     * clientSecret - the client secret (defaults here to a Brightcove sample account value - this should always be stored on the server side if possible)
     * requestBody - request body for write requests (optional JSON string)
     */
    // set response handler
    httpRequest.onreadystatechange = getResponse;
    // open the request
    httpRequest.open('POST', proxyURL);
    // open and send request
    httpRequest.send(JSON.stringify(options));
  }

  function init() {
    addCheckboxes(rendition_selector, renditions);
  }

  init();

})(window, document);
