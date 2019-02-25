var BCLS = (function (window, document) {
  var // account stuff
    account_id,
    account_ids,
    bcToken,
    client_id,
    client_secret,
    selectedProfile,
    // api stuff
    proxyURL = 'https://solutions.brightcove.com/bcls/bcls-proxy/bcls-proxy-v2.php',
    ipURL = 'https://ingestion.api.brightcove.com/v1/accounts/',
    ipAccountSuffix = '/configuration',
    ipProfileSuffix = '/profiles'
    totalCalls = 0,
    callNumber = 0,
    accountsArray = [],
    defaultAccounts = ['1485884786001', '1937897674001'],
    defaultAccount = '1752604059001',
    profilesArray = [],
    // element references
    account_id_input = document.getElementById('account_id_input'),
    account_ids_input = document.getElementById('account_ids_input'),
    client_id_input = document.getElementById('client_id_input'),
    client_secret_input = document.getElementById('client_secret_input'),
    getProfiles = document.getElementById('getProfiles'),
    profileSelect = document.getElementById('profileSelect'),
    addProfile = document.getElementById('addProfile'),
    setDefaults = document.getElementById('setDefaults'),
    logger = document.getElementById('logger'),
    apiRequest = document.getElementById('apiRequest'),
    apiResponse = document.getElementById('apiResponse'),
    // for filtering ingest profiles list
    live_profiles = ['Live - Standard', 'Live - HD', 'Live - Premium HD'];


  /**
   * remove spaces from a string
   * @param {String} str string to process
   */
  function removeSpaces(str) {
    str = str.replace(/\s/g, '');
    return str;
  }

  /**
   * determines whether an object has a certain property
   * @param {object} obj the object
   * @param {string} prop the property name
   * @returns {boolean}
   */
  function hasProperty(obj, prop) {
    if (prop in obj) {
      return true;
    }
    return false;
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
   * tests for all the ways a variable might be undefined or not have a value
   * @param {String|Number} x the variable to test
   * @return {Boolean} true if variable is defined and has a value
   */
  function isDefined(x) {
    if (x === "" || x === null || x === undefined) {
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
   * get a copy of (rather than reference to) an object
   * @param  {object} obj - the object you want a copy
   * @return {object}     the copy
   */
  function copyObj(obj) {
      return JSON.parse(JSON.stringify(obj));
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
   * disables an element so user can't click on it
  * @param {htmlElement} el the element
  */
 function disableElement(el) {
     el.setAttribute('disabled', 'disabled');
     el.classList.add('disabled');
 }

 /**
  * re-enables an element to make it clickable
  * @param {htmlElement} el the element
  */
 function enableElement(el) {
     el.removeAttribute('disabled');
     el.classList.remove('disabled');
 }

  /**
   * populate a selector element from an array of objects
   * @param {htmlElement} selector reference to the selector element
   * @param {array} dataArray an array of objects
   * @param {string} valueField name of the object field to use for option values
   * @param {string} textField name of the object field to be use for the option text (can be the same as the valueField)
   */
  function populateSelector(selector, dataArray, valueField, textField) {
    var i,
      iMax,
      option,
      item,
      frag = document.createDocumentFragment();
    iMax = dataArray.length;
    for (i = 0; i < iMax; i++) {
      item = dataArray[i];
      option = document.createElement('option');
      option.setAttribute('value', item[valueField]);
      option.textContent = item[textField];
      frag.appendChild(option);
    }
    selector.appendChild(frag);
    return;
  }

  /**
   * remove or add obsolete, standard and live profiles from the profiles list
   */
    function filterProfiles() {
      // below are the obsolete profiles - you just have to know their names
      var deprecated_profiles = ['balanced-nextgen-player', 'Express Standard', 'mp4-only', 'balanced-high-definition', 'low-bandwidth-devices', 'balanced-standard-definition', 'single-rendition', 'Live - Standard', 'high-bandwidth-devices', 'Live - Premium HD', 'Live - HD', 'videocloud-default-trial', 'screencast'],
        live_profiles = ['Live - Standard', 'Live - HD', 'Live - Premium HD'],
        i = profilesArray.length;
      while (i > 0) {
        i--;
        if (arrayContains(deprecated_profiles, profilesArray[i].name)) {
          profilesArray.splice(i, 1);
        } else if (profilesArray[i].brightcove_standard === true) {
          profilesArray.splice(i, 1);
        } else if (arrayContains(live_profiles, profilesArray[i].name)) {
          profilesArray.splice(i, 1);
        }
      }
      return;
    }


  /**
   * sets up the data for the API request
   * @param {String} id the id of the button that was clicked
   */
  function setOptions(id, type) {
    var i,
      iMax,
      endPoint,
      options = {};
    logger.textContent = 'Getting profiles for source account'
    options.proxyURL = proxyURL;
    if (isDefined(client_id) && isDefined(client_secret)) {
      options.client_id = client_id;
      options.client_secret = client_secret;
    }
    switch (id) {
      case 'getProfiles':
        var profile;
        console.log('account', account_id);
        endPoint = account_id;
        options.url = ipURL + endPoint + ipProfileSuffix;
        options.requestType = type;
        apiRequest.textContent = options.url;
        makeRequest(options, function(response) {
          if (isJson(response)) {
            profilesArray = JSON.parse(response);
            // filter out non-custom profiles
            filterProfiles();
            // check for display_name and if none, use name
            // amd remove fields that can't be used when adding the profile to another account
            iMax = profilesArray.length;
            for (i = 0; i < iMax; i++) {
              profile = profilesArray[i];
              if (!hasProperty(profile, 'display_name')) {
                profile.display_name = profile.name;
              }
              delete profile.date_created;
              delete profile.date_last_modified;
              delete profile.version;
            }
            // populate the profile selector
            populateSelector(profileSelect, profilesArray, 'id', 'display_name');
          }
          apiResponse.textContent = JSON.stringify(profilesArray, null, 2);
          enableElement(profileSelect);
        });
        break;
      case 'addProfile':
        var requestBody = copyObj(selectedProfile),
          responseObj;
        logger.textContent = 'Adding profile to target account ' + accountsArray[callnumber];
        delete requestBody.id;
        endPoint = accountsArray[callNumber];
        options.url = ipURL + endPoint + ipProfileSuffix;
        options.requestType = type;
        options.requestBody = JSON.stringify(requestBody);
        apiRequest.textContent = options.url;
        makeRequest(options, function(response) {
          if (isJson(response)) {
            responseObj = JSON.parse(response);
            apiResponse = JSON.stringify(responseObj, null, 2);
            if (isChecked(setDefaults)) {
              setOptions('setDefault', 'POST');
            } else {
              callNumber++;
              if (callNumber < totalCalls) {
                setOptions('addProfile', 'POST');
              } else {
                logger.textContent = 'All finished!'
              }
            }
          }
        });
        break;
      case 'setDefault':
        var reqBody = {},
          now;
        logger.textContent = 'Processing account: ' + accountsArray[callNumber];
        endPoint = accountsArray[callNumber];
        options.url = ipURL + endPoint + ipAccountSuffix;
        options.requestType = type;
        reqBody.default_profile_id = selectedProfile.id;
        options.requestBody = JSON.stringify(reqBody);
        apiRequest.textContent = options.url;
        makeRequest(options, function (response) {
          parsedData = JSON.parse(response);
          responseArray.push(parsedData);
          if (Array.isArray(parsedData)) {
            // we have an error, most likely a conflict because default has already been set - try update instead
            setOptions('setDefaults', 'PUT');
          } else {
            callNumber++;
            if (callNumber < totalCalls) {
              setOptions('setDefaults', 'POST');
            } else {
              logger.textContent = 'All finished!'
              apiResponse.textContent = JSON.stringify(responseArray, null, '  ');
            }
          }

        });
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
      getResponse = function () {
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
    // event handlers
    getProfiles.addEventListener('click', function () {
      var accountIds;
      // get the inputs
      client_id = client_id_input.value;
      client_secret = client_secret_input.value;
      newProfile = getSelectedValue(profileSelect);
      // only use entered account id if client id and secret are entered also
      if (isDefined(client_id) && isDefined(client_secret)) {
        if (isDefined(account_id_input.value) && isDefined(account_ids_input.value)) {
          account_id = account_id_input.value;
          accountIds = removeSpaces(account_ids_input.value);
          accountsArray = accountIds.split(',');
        } else {
          window.alert('To use your own account, you must specify an account id, and client id, and a client secret - since at least one of these is missing, a sample account will be used');
          account_id = defaultAccount;
          client_id = '';
          client_secret = '';
          accountsArray = defaultAccounts;
        }
      } else {
        account_id = defaultAccount;
        accountsArray = defaultAccounts;
      }
      totalCalls = accountsArray.length;
      setOptions('getProfiles', 'GET');
    });
    profileSelect.addEventListener('change', function() {
      var selected = getSelectedValue(profileSelect),
        idx = findObjectInArray(profilesArray, 'id', selected);
      selectedProfile = profilesArray[idx];
      enableElement(addProfile);
    });
    addProfile.addEventListener('click', function() {
      setOptions('addProfile', 'POST');
    })

  }
  // kick things off
  init();
})(window, document);
