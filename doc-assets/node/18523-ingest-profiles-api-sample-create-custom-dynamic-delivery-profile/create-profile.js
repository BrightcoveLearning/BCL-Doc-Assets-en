var BCLS = (function(window, document) {
  var // account stuff
    account_id,
    client_id,
    client_secret,
    newProfile = {},
    availableRenditions = ["video450", "video700", "video900", "video1200", "video1700", "video2000", "video3500"],
    selectedRenditions = [],
    renditionsSelectAll,
    renditionsCollection,
    // api stuff
    ipProxyURL = 'https://solutions.brightcove.com/bcls/bcls-proxy/bcls-proxy.php',
    ipURL = 'https://ingestion.api.brightcove.com/v1/accounts/',
    ipURLsuffix = '/profiles',
    // elements
    accountId = document.getElementById('accountId'),
    clientId = document.getElementById('clientId'),
    clientSecret = document.getElementById('client_secret'),
    archiveMaster = document.getElementById('archiveMaster'),
    distributeMaster = document.getElementById('distributeMaster'),
    captureImages = document.getElementById('captureImages'),
    posterHeight = document.getElementById('posterHeight'),
    posterWidth = document.getElementById('posterWidth'),
    thumbnailHeight = document.getElementById('thumbnailHeight'),
    thumbnailWidth = document.getElementById('thumbnailWidth'),
    renditionsList = document.getElementById('renditionsList'),
    submitButton = document.getElementById('submitButton'),
    logger = document.getElementById('logger'),
    apiRequest = document.getElementById('apiRequest'),
    apiResponse = document.getElementById('apiResponse'),
    input,
    space,
    br,
    label,
    fragment = document.createDocumentFragment(),
    i,
    iMax;

    // generate renditions options
    input = document.createElement('input');
    space = document.createTextNode(' ');
    label = document.createElement('label');
    input.setAttribute('name', 'renditionsChkAll');
    input.setAttribute('id', 'renditionsChkAll');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('value', 'all');
    label.setAttribute('for', 'renditionsChkAll');
    label.setAttribute('style', 'color:#F3951D;');
    text = document.createTextNode('Select All');
    label.appendChild(text);
    br = document.createElement('br');
    fragment.appendChild(input);
    fragment.appendChild(space);
    fragment.appendChild(label);
    fragment.appendChild(br);
    iMax = availableRenditions.length;
    for (i = 0; i < iMax; i++) {
      input = document.createElement('input');
      space = document.createTextNode(' ');
      label = document.createElement('label');
      input.setAttribute('name', 'renditionsChk');
      input.setAttribute('id', availableRenditions[i]);
      input.setAttribute('type', 'checkbox');
      input.setAttribute('value', availableRenditions[i]);
      label.setAttribute('for', availableRenditions[i]);
      text = document.createTextNode(availableRenditions[i]);
      label.appendChild(text);
      br = document.createElement('br');
      fragment.appendChild(input);
      fragment.appendChild(space);
      fragment.appendChild(label);
      fragment.appendChild(br);
    }
    renditionsList.appendChild(fragment);
    // get references to checkboxes
    renditionsCollection = document.getElementsByName('renditionsChk');
    renditionsSelectAll = document.getElementById('renditionsChkAll');
    // add event listener for select allows
    renditionsSelectAll.addEventListener('change', function() {
      if (this.checked) {
        selectAllCheckboxes(renditionsCollection);
      } else {
        deselectAllCheckboxes(renditionsCollection);
      }
    });



  /**
   * remove spaces from a string
   * @param {String} str string to process
   */
  function removeSpaces(str) {
    str = str.replace(/\s/g, '');
    return str;
  }

  /**
   * tests for all the ways a variable might be undefined or not have a value
   * @param {*} x the variable to test
   * @return {Boolean} true if variable is defined and has a value
   */
  function isDefined(x) {
      if ( x === '' || x === null || x === undefined) {
          return false;
      }
      return true;
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
   * get selected value for single select element
   * @param {htmlElement} e the select element
   */
  function getSelectedValue(e) {
    return e.options[e.selectedIndex].value;
  }


  /**
   * disables a button so user can't submit new request until current one finishes
   */
  function hideElement(element) {
    element.setAttribute('style', 'opacity:.5;');
  }

  /**
   * enables a button
   * @param {htmlElement} button - the button to enable
   */
  function showElement(element) {
    element.removeAttribute('style');
  }

  /**
   * sets up the data for the API request
   * @param {String} id the id of the button that was clicked
   */
  function setRequestData(type) {
    var i,
      iMax,
      requestData = {};
    switch (id) {
      case 'setDefaults':
        var reqBody = {},
          now;
    logger.textContent = 'Processing account: ' + accountsArray[callNumber];
    endPoint = accountsArray[callNumber];
    proxyURL = ipProxyURL;
    requestData.url = ipURL + endPoint + ipURLsuffix;
    requestData.requestType = type;
    reqBody.account_id = parseInt(accountsArray[callNumber]);
    reqBody.default_profile_id = newProfile;
    if (isDefined(configId)) {
      bclslog('configId', configId);
      reqBody.id = configId;
    }
    requestData.requestBody = JSON.stringify(reqBody);
    bclslog('requestBody', requestData.requestBody);
    apiRequest.textContent = requestData.url;
    sendRequest(requestData, proxyURL, id, function(response) {
      now = new Date().toISOString();
      logger.textContent = 'Finished at ' + now;
      apiResponse.textContent = JSON.stringify(response, null, '  ');
    });
    break;
  }
}

/**
 * send API request to the proxy
 * @param  {Object} requestData options for the request
 * @param  {String} requestID the type of request = id of the button
 * @param  {Function} [callback] callback function
 */
function sendRequest(options, proxyURL, requestID, callback) {
  var httpRequest = new XMLHttpRequest(),
    responseRaw,
    parsedData,
    requestParams,
    dataString,
    configId,
    // response handler
    getResponse = function() {
      try {
        if (httpRequest.readyState === 4) {
          if (httpRequest.status >= 200 && httpRequest.status < 300) {
            // check for completion
            if (requestID === 'getCredentials') {
              responseRaw = httpRequest.responseText;
              parsedData = JSON.parse(responseRaw);
              callback(parsedData);
            } else if (requestID === 'setDefaults') {
              responseRaw = httpRequest.responseText;
              bclslog('responseRaw', responseRaw);
              parsedData = JSON.parse(responseRaw);
              bclslog('parsedData', parsedData);
              if (options.requestType === 'POST') {
                configId = parsedData.id;
                setRequestData('setDefaults', 'PUT', configId);
              } else if (options.requestType === 'PUT') {
                responseArray.push(parsedData);
                callNumber++;
                if (callNumber < totalCalls) {
                  setRequestData('setDefaults', 'POST');
                } else {
                  callback(responseArray);
                }
              }
            } else {
              alert('There was a problem with the request. Request returned ' + httpRequest.status);
            }
          }
        }
      } catch (e) {
        alert('Caught Exception: ' + e);
      }
    };
  // set up request data
  requestParams = "url=" + encodeURIComponent(options.url) + "&requestType=" + options.requestType;
  // for the IP API call
  // add request body if any
  if (isDefined(options.requestBody)) {
    requestParams += '&requestBody=' + options.requestBody;
  }
  // only add client id and secret if both were submitted
  if (isDefined(clientId) && isDefined(clientSecret)) {
    requestParams += '&client_id=' + clientId + '&client_secret=' + clientSecret;
  }
  // for the OAuth API call
  if (isDefined(options.name) && isDefined(options.maximum_scope) && isDefined(options.bc_token)) {
    requestParams += '&name=' + options.name + '&maximum_scope=' + options.maximum_scope.replace(reSlash, '') + '&bc_token=' + options.bc_token;
  }

  // set response handler
  httpRequest.onreadystatechange = getResponse;
  // open the request
  httpRequest.open('POST', proxyURL);
  // set headers
  httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  // open and send request
  bclslog('requestParams', requestParams);
  httpRequest.send(requestParams);
}

})(window, document);
