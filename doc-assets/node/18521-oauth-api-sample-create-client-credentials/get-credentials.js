var BCLS = ( function (window, document) {
  var bcToken   = document.getElementById('bcToken'),
    credentialsName = document.getElementById('credentialsName'),
    accountIds = document.getElementById('accountIds'),
    operationsList = document.getElementById('operationsList'),
    submitButton = document.getElementById('submitButton'),
    requestBody = getElementById('requestBody'),
    clientId  = document.getElementById('clientId'),
    clientSecret = document.getElementById('clientSecret'),
    apiResponse  = document.getElementById('apiResponse'),
    defaultName = 'Credentials from Learning Services App',
    options      = {},
    request_body = {},
    accountsStr,
    accounts = [],
    operations = ['video-cloud/analytics/read', 'video-cloud/audience/read', 'video-cloud/audience/write', 'video-cloud/player/read', 'video-cloud/player/all', 'video-cloud/ingest-profiles/profile/read', 'video-cloud/ingest-profiles/profile/write', 'video-cloud/ingest-profiles/account/read', 'video-cloud/ingest-profiles/account/write', 'video-cloud/upload-urls/read',  'video-cloud/video/all', 'video-cloud/video/read', 'video-cloud/video/create', 'video-cloud/video/update', 'video-cloud/video/delete', 'video-cloud/asset/delete', 'video-cloud/playlist/all', 'video-cloud/playlist/read', 'video-cloud/playlist/create', 'video-cloud/playlist/update', 'video-cloud/playlist/delete', 'video-cloud/sharing-relationships/read', 'video-cloud/sharing-relationships/create', 'video-cloud/sharing-relationships/update', 'video-cloud/sharing-relationships/delete', 'video-cloud/sharing-relationships/all', 'video-cloud/notifications/all'],
    selectedOperations = [],
    operationsSelectAll,
    operationsCollection,
    proxyURL     = 'https://solutions.brightcove.com/bcls/bcls-proxy/client-credentials-proxy.php',
    bc_token,
    client_id,
    client_secret,
    input,
    space,
    br,
    label,
    fragment = document.createFragment(),
    i,
    iMax;

// set initial requestBody properties
requestBody.type = 'credential';
requestBody.maximum_scope = [];
maximum_scope_template = {};
maximum_scope_template.operations = [];

// generate operations options
input = document.createElement('input');
space = document.createTextNode(' ');
label = document.createElement('label');
input.setAttribute('name', 'operationsChkAll');
input.setAttribute('id', 'operationsChkAll');
input.setAttribute('type', 'checkbox');
input.setAttribute('value', 'all');
label.setAttribute('for', 'operationsChkAll');
label.setAttribute('style', 'color:#F3951D;');
text = document.createTextNode('Select All');
label.appendChild(text);
br = document.createElement('br');
fragment.appendChild(input);
fragment.appendChild(space);
fragment.appendChild(label);
fragment.appendChild(br);
iMax = operations.length;
for (i = 0; i < iMax; i++) {
  input = document.createElement('input');
  space = document.createTextNode(' ');
  label = document.createElement('label');
  input.setAttribute('name', 'operationsChk');
  input.setAttribute('id', operations[i].account_id);
  input.setAttribute('type', 'checkbox');
  input.setAttribute('value', operations[i].account_id);
  label.setAttribute('for', operations[i].account_id);
  text = document.createTextNode(operations[i].account_name);
  label.appendChild(text);
  br = document.createElement('br');
  fragment.appendChild(input);
  fragment.appendChild(space);
  fragment.appendChild(label);
  fragment.appendChild(br);
}
operationsList.appendChild(fragment);
// get references to checkboxes
operationsCollection = document.getElementsByName('operationsChk');
operationsSelectAll = document.getElementById('operationsChkAll');
// add event listener for select allows
operationsSelectAll.addEventListener('change', function() {
  if (this.checked) {
    selectAllCheckboxes(operationsCollection);
  } else {
    deselectAllCheckboxes(operationsCollection);
  }
});


// event handlers
submitButton.addEventListener('click', function() {
  var responseParsed,
    maximum_scope_template = {};
  if (isDefined(bcToken.value) && isDefined(accountIds.value)) {
    requestBody.name = (isDefined(credentialsName.value)) ? credentialsName.value : defaultName;
    maximum_scope_template.operations = [];
    maximum_scope_template.operations = getCheckedBoxValues(operationsCollection);
    options.bc_token     = bcToken.value;
    accountsStr = removeSpaces(accountIds.value);
    accounts = accountsStr.split(',');
    makeRequest(options, function(response) {
      if (isJson(response)) {
        responseParsed          = JSON.parse(response);
        client_id            = responseParsed.client_id;
        client_secret            = responseParsed.client_secret;
        accessToken.textContent = access_token;
        apiResponse.textContent = JSON.stringify(responseParsed, null, '  ');
      } else {
        // didn't get JSON back, just dump responseRaw
        apiResponse.textContent = response;
      }
    });
  } else {
    alert('A BC_TOKEN and at least one account id are required.');
  }
});

accessToken.addEventListener('click', function() {
  this.select();
});

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
 * remove spaces from a string
 * @param {String} str string to process
 * @return {String} trimmed string
 */
function removeSpaces(str) {
    str= str.replace(/\s/g, '');
    return str;
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
 * send API request to the proxy
 * @param  {Object} options options for the request
 * @param  {String} requestID the type of request = id of the button
 * @param  {Function} [callback] callback function
 */
function makeRequest(options, callback) {
  var httpRequest = new XMLHttpRequest(),
    responseRaw,
    requestParams,
    // response handler
    getResponse = function() {
      try {
        if (httpRequest.readyState === 4) {
          if (httpRequest.status >= 200 && httpRequest.status < 300) {
            // check for completion
            responseRaw = httpRequest.responseText;
            callback(responseRaw);
          }
        }
      } catch (e) {
        alert('Caught Exception: ' + e);
      }
    };
  // set up request data
  requestParams = 'client_id=' + options.client_id + '&client_secret=' + options.client_secret;

  // set response handler
  httpRequest.onreadystatechange = getResponse;
  // open the request
  httpRequest.open('POST', proxyURL);
  // set headers
  httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  // open and send request
  httpRequest.send(requestParams);
}

})(window, document);
