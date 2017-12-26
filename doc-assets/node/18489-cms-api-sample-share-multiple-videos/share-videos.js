var BCLS = (function(window, document) {
  var accountId      = document.getElementById('accountId'),
    clientId         = document.getElementById('clientId'),
    clientSecret     = document.getElementById('clientSecret'),
    searchTags       = document.getElementById('searchTags'),
    searchField      = document.getElementById('searchField'),
    searchFieldValue = document.getElementById('searchFieldValue'),
    dateRangeType    = document.getElementById('dateRangeType'),
    fromDate         = document.getElementById('fromDate'),
    toDate           = document.getElementById('toDate'),
    videosBlock      = document.getElementById('videosBlock'),
    affiliatesBlock  = document.getElementById('affiliatesBlock'),
    getVideos        = document.getElementById('getVideos'),
    shareVideos      = document.getElementById('addChannel'),ß
    logger           = document.getElementById('logger'),
    logger2          = document.getElementById('logger2'),
    apiRequest       = document.getElementById('apiRequest'),
    apiResponse      = document.getElementById('apiResponse'),
    dateTypeValue,
    fromDateValue,
    toDateValue,
    tagsSearchString,
    fieldsSearchString,
    dateSearchString,ß
    searchString,
    account_id,
    client_id,
    client_secret,
    affiliates       = [],
    videos           = [],
    videosToShare    = [],
    limit            = 20,
    videoCount       = 0,
    callNumber       = 0,
    totalCalls       = 0;

  // date pickers
  rome(fromDate);
  rome(toDate);

  // *****event listeners*****
  getVideos.addEventListener('click', function() {
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
          fieldsSearchString = '%2B' + searchField.value + ':' + converSpaces(searchFieldValue.value);
        } else {
          fieldsSearchString = '%2Bcustom_fields:"' + converSpaces(searchFieldValue.value) + '"';
        }
      }

      fromDateValue = rome(fromDate).getDate();
      if (isDefined(fromDateValue)) {
        fromDateValue = fromDateValue.toISOString();
      }
      toDateValue = rome(toDate).getDate();
      if (isDefined(toDateValue)) {
        toDateValue = toDateValue.toISOString();
      }
      dateSearchString += dateTypeValue + ':' + fromDateValue + '..' + toDateValue;

      // define the whole search string
      if (isDefined(tagsSearchString)) {
        searchString = tagsSearchString;
        if (isDefined(fieldsSearchString)) {
          searchString += '%20+' + fieldsSearchString;
        }
        if (isDefined(dateSearchString)) {
          searchString += '%20+' + dateSearchString;
        }
      } else if (isDefined(fieldsSearchString)) {
        searchString = fieldsSearchString;
        if (isDefined(dateSearchString)) {
          searchString += '%20+' + dateSearchString;
        }
      } else if (isDefined(dateSearchString)) {
        searchString = dateSearchString;
      }
      console.log('searchString', searchString);
      createRequest('getVideoCount');
    } else {
      alert('You must submit an account id and client credentials');
    }
  });

  shareVideos.addEventListener('click', function() {
    createRequest('shareVideos');
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
        if (checkBoxCollection[i].check === true) {
          checkedValues.push(checkBoxCollection[i].value);
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
    return targetArray;
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
  function converSpaces(str) {
    str = str.replace(/\s/g, '%20');
    return str;
  }

  /**
   * determines whether specified item is in an array of objects
   *
   * @param {array} array to check
   * @param {string} prop the object property to check
   * @param {string} item to check for
   * @return {boolean} true if item is in the array, else false
   */
  function arrayContains(arr, prop, item) {
    var i,
      iMax = arr.length;
    for (i = 0; i < iMax; i++) {
      if (arr[i].hasOwnProperty(prop)) {
        if (arr[i][prop] === item) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * createRequest sets up requests, send them to makeRequest(), and handles responses
   * @param  {string} type the request type
   */
  function createRequest(type) {
    var options = {},
      cmsBaseURL = 'https://cms.api.brightcove.com/v1/accounts/' + account_id,
      endpoint,
      body = {},
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
        endpoint = '/counts/videos?q=' + searchString;
        break;
      case 'getAffiliates':
        endpoint = '/channels/default/members';
        options.url = cmsBaseURL + endpoint;
        options.requestType = 'GET';
        makeRequest(options, function(response) {
        affiliates = JSON.parse(response);
          iMax = affiliates.length;
          for (i = 0; i < iMax; i++) {
            input = document.createElement('input');
            space = document.createTextNode(' ');
            label = document.createElement('label');
            input.setAttribute('name', 'affiliatesChk');
            input.setAttribute('id', 'field' + affiliates[i].id);
            input.setAttribute('type', 'checkbox');
            input.setAttribute('value', affiliates[i].id);
            label.setAttribute('for', 'field' + affiliates[i].id);
            text = document.createTextNode(affiliates[i].account_name);
            label.appendChild(text);
            br = document.createElement('br');
            fragment.appendChild(input);
            fragment.appendChild(space);
            fragment.appendChild(label);
            fragment.appendChild(br);
          }
          affiliatesBlock.appendChild(fragment);
        });
        break;
      case 'getVideos':
        endpoint = '/videos?q=' + searchString + '&limit=' + limit + '&offset=' + (limit * callnumber);
        options.url = cmsBaseURL + endpoint;
        options.requestType = 'GET';
        makeRequest(options, function(response) {
        videos = JSON.parse(response);
          iMax = affiliates.length;
          for (i = 0; i < iMax; i++) {
            input = document.createElement('input');
            space = document.createTextNode(' ');
            label = document.createElement('label');
            input.setAttribute('name', 'affiliatesChk');
            input.setAttribute('id', 'field' + affiliates[i].id);
            input.setAttribute('type', 'checkbox');
            input.setAttribute('value', affiliates[i].id);
            label.setAttribute('for', 'field' + affiliates[i].id);
            text = document.createTextNode(affiliates[i].account_name);
            label.appendChild(text);
            br = document.createElement('br');
            fragment.appendChild(input);
            fragment.appendChild(space);
            fragment.appendChild(label);
            fragment.appendChild(br);
          }
          affiliatesBlock.appendChild(fragment);
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
    apiRequest.textContent = options.url;
    requestParams = 'url=' + encodeURIComponent(options.url) + '&requestType=' + options.requestType;
    // only add client id and secret if both were submitted
    if (options.client_id && options.client_secret) {
      requestParams += '&client_id=' + options.client_id + '&client_secret=' + options.client_secret;
    }
    // add request data if any
    if (options.requestBody) {
      requestParams += '&requestBody=' + options.requestBody;
    }
    // set response handler
    httpRequest.onreadystatechange = getResponse;
    // open the request
    httpRequest.open('POST', proxyURL);
    // set headers
    httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    // send request
    httpRequest.send(requestParams);
  }
})(window, document);
