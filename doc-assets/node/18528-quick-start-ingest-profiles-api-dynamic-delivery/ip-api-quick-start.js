var BCLS = (function(window, document) {
  var account_id_input = document.getElementById('account_id_input'),
    client_id_input = document.getElementById('client_id_input'),
    client_secret_input = document.getElementById('client_secret_input'),
    get_profiles = document.getElementById('get_profiles'),
    create_profile = document.getElementById('create_profile'),
    set_default_profile = document.getElementById('set_default_profile'),
    update_default_profile = document.getElementById('update_default_profile'),
    rendition_selector = document.getElementById('rendition_selector'),
    rendition_select = document.getElementById('rendition_select'),
    profile_selector = document.getElementById('profile_selector'),
    profile_select = document.getElementById('profile_select'),
    logger = document.getElementById('logger'),
    api_request_display = document.getElementById('api_request_display'),
    api_request_body_display = document.getElementById('api_request_body_display'),
    api_response = document.getElementById('api_response'),
    renditions = ['default/audio64', 'default/audio96', 'default/audio128', 'default/audio192', 'default/video450', 'default/video700', 'default/video900', 'default/video1200', 'default/video1700', 'default/video2000', 'default/video3500', 'default/video3800'],
    profiles = [],
    account_id,
    client_id,
    client_secret,
    selectAll,
    selectedRenditions = [],
    selectedProfile,
    checkBoxCollection;

  // event listeners
  get_profiles.addEventListener('click', function() {
    getAccountInfo();
    createRequest('get_profiles');
  });

  create_profile.addEventListener('click', function() {
    selectedRenditions = getCheckedBoxValues(checkboxCollection);
    if (renditions.length === 0) {
      alert('Please select the renditions you want to include and click this button again');
    } else {
      getAccountInfo();
      createRequest('create_profile');
    }
  });

  set_default_profile.addEventListener('click', function() {
    selectedProfile = getSelectedValue(profile_select).value;
    if (isDefined(selectedProfile)) {
      getAccountInfo();
      createRequest('set_default_profile');
    } else {
      alert('Please select a profile and click this button again');
    }
  });

  update_default_profile.addEventListener('click', function() {
    selectedProfile = getSelectedValue(profile_select).value;
    if (isDefined(selectedProfile)) {
      getAccountInfo();
      createRequest('update_default_profile');
    } else {
      alert('Please select a profile and click this button again');
    }
  });

  /**
   * get account info from input fields
   */
  function getAccountInfo() {
    account_id    = account_id_input.value;
    client_id     = client_id_input.value;
    client_secret = client_secret_input.value;
  }

  function logMessage(message) {
    var br = document.createElement('br');
    logger.textContent += message;
    logger.appendChild(br);
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
   * adds options to a select element from an array of valuesArray
   * @param {HTMLelement} selectElement the select element reference
   * @param {Array} valuesArray the array of option values e.g. [{value:'a',label:'alpha'},{value:'b',label:'beta'}]
   */
  function addOptions(selectElement, valuesArray) {
    var i,
      iMax,
      option,
      fragment = document.createDocumentFragment;
    if (selectElement && valuesArray) {
      iMax = valuesArray.length;
      for (i = 0; i < iMax; i++) {
        option = document.createElement('option');
        option.setAttribute('value', valuesArray[i].value);
        option.textContent = valuesArray[i].label;
        fragment.appendChild(option);
      }
      selectElement.appendChild(fragment);
    } else {
      console.log('function addOptions: no parameters provided');
    }
  }

  /**
   * adds options to a select element from an array of valuesArray
   * @param {HTMLelement} parentElement the parent element for the checkboxes
   * @param {Array} valuesArray the array of value/labels  e.g. [{value:'a',label:'alpha'},{value:'b',label:'beta'}]
   */
  function addCheckboxes (parentElement, valuesArray) {
    var i,
      iMax,
      input,
      label,
      br,
      txt,
      fragment = document.createDocumentFragment;
    if (selectElement && valuesArray) {
      iMax = valuesArray.length;
      // add select all option
      input             = document.createElement('input');
      input.setAttribute('type', 'checkbox');
      input.setAttribute('id', 'checkAll');
      txt               = document.createTextNode('&nbsp;');
      label             = document.createElement('label');
      label.setAttribute('for', 'checkAll');
      label.textContent = 'Select All';
      br                = document.createElement('br');
      fragment.appendChild(input);
      fragment.appendChild(txt);
      fragment.appendChild(label);
      fragment.appendChild(br);
      for (i = 0; i < iMax; i++) {
        input             = document.createElement('input');
        input.setAttribute('type', 'checkbox');
        input.setAttribute('value', valuesArray[i].value);
        input.setAttribute('name', 'checkBoxCollection');
        txt               = document.createTextNode('&nbsp;');
        label             = document.createElement('label');
        label.setAttribute('for', valuesArray[i].value);
        label.textContent = valuesArray[i].label;
        br                = document.createElement('br');
        fragment.appendChild(input);
        fragment.appendChild(txt);
        fragment.appendChild(label);
        fragment.appendChild(br);
      }
      parentElement.appendChild(fragment);

      // set up select all option
      checkBoxCollection = document.getElementsByName('checkBoxCollection');
      selectAll = document.getElementById('selectAll');
      selectAll.addEventListener('change', function() {
        if (this.checked) {
          selectAllCheckboxes(checkBoxCollection);
        } else {
          unselectAllCheckboxes(checkBoxCollection);
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
      proxyURL = 'https:/solutions.brightcove.com/bcls/bcls-proxy/ip2-proxy.php',
      baseURL = 'https://ingestion.api.brightcove.com/v1/accounts/' + account_id,
      endpoint,
      responseDecoded,
      today = new Date().toISOString(),
      tmpArray = [],
      i,
      iMax;

    // set credentials
    options.client_id = client_id;
    options.client_secret = client_secret;
    options.proxyURL = proxyURL;

    switch (type) {
      case 'get_profiles':
        logMessage('Getting profiles');
        endpoint = '/profiles';
        options.url = baseURL + endpoint;
        api_request_display.textContent = options.url;
        api_request_body_display.textContent = 'no request body for this operation';
        options.requestType = 'GET';
        makeRequest(options, function(response) {
          if (isJson(response)) {
            responseDecoded = JSON.parse(response);
            api_request_display.textContent = JSON.stringify(responseDecoded, null, '  ');
          } else {
            api_response.textContent = response;
            logMessage('The get profiles operation failed; see the API Response for the error');
            return;
          }
          if (Array.isArray(responseDecoded)) {
            iMax = responseDecoded.length;
            for (i = 0; i < iMax; i++) {
              var o = {value:responseDecoded[i].id, label:responseDecoded[i].name};
              tmpArray.push(o);
            }
            addOptions(profile_selector, tmpArray);
          }
        });
        break;
      case 'create_profile':
        logMessage('Creating profile');
        endpoint = '/profiles';
        options.url = baseURL + endpoint;
        api_request_display.textContent = options.url;
        options.requestType = 'POST';
        requestBody.name = 'test_dynamic_delivery_profile' + today;
        requestBody.description = 'Test profile created from Ingest Profiles API Quick Start - delete if you do not need it';
        requestBody.account_id = account_id;
        requestBody.digital_master = {};
        requestBody.digital_master.rendition = 'passthrough';
        requestBody.digital_master.distribute = true;
        requestBody.dynamic_origin = {};
        requestBody.dynamic_origin.renditions = selectedRenditions;
        requestBody.images = [];
        requestBody.images.push({label:'poster', height: 720, width: 1280});
        requestBody.images.push({label:'thumbnail', height: 90, width: 160});
        api_request_body_display.textContent = JSON.stringify(requestBody, null, '  ');
        // add more properties
        options.requestBody = JSON.stringify(requestBody);
        makeRequest(options, function(response) {
          if (isJson(response)) {
            responseDecoded = JSON.parse(response);
            api_request_display.textContent = JSON.stringify(responseDecoded, null, '  ');
          } else {
            api_response.textContent = response;
            logMessage('The create profile operation failed; see the API Response for the error');
            return;
          }
        });
        break;
      case 'set_default_profile':
        logMessage('Setting the default profile');
        endpoint = '/configuration';
        options.url = baseURL + endpoint;
        api_request_display.textContent = options.url;
        options.requestType = 'POST';
        break;
      case 'update_default_profile':
        logMessage('Setting the default profile');
        endpoint = '/configuration';
        options.url = baseURL + endpoint;
        api_request_display.textContent = options.url;
        options.requestType = 'POST';
        break;
      default:
        console.log('Should not be getting to the default case - bad request type sent');
        break;
    }
  }

function init() {
  addCheckboxes(rendition_selector, renditions);
}

init();

})(window, document);
