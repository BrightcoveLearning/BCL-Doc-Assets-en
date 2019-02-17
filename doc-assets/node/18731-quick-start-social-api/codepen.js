var BCLS = (function(window, document) {
  var baseURL = 'https://social.api.brightcove.com/v1/',
    proxyURL = 'https://solutions.brightcove.com/bcls/bcls-proxy/bcls-proxy-v2.php',
    video_id,
    account_id,
    client_id,
    client_secret,
    account_id_default = '1486906377',
    account_id_input = document.getElementById('account_id_input'),
    client_id_input = document.getElementById('client_id_input'),
    client_secret_input = document.getElementById('client_secret_input'),
    getStatusAll = document.getElementById('getStatusAll'),
    getStatusOne = document.getElementById('getStatusOne'),
    getHistory = document.getElementById('getHistory'),
    videoForStatus = document.getElementById('videoForStatus'),
    videoForHistory = document.getElementById('videoForHistory'),
    apiRequest = document.getElementById('apiRequest'),
    apiMethod = document.getElementById('apiMethod'),
    responseData = document.getElementById('responseData'),
    selectorData = [],
    selectedVideo;



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

  /**
   * get selected value for single select element
   *
   @param {htmlElement} e the select element
   *
   @return {Object} object containing the `value`
   */
   function getSelectedValue(e) {
     var selected = e.options[e.selectedIndex];
      return selected.value;
   }

   /**
    * disables a button so user can't submit new request until current one finishes
   * @param {htmlElement} button
   */
  function disableElement(button) {
      button.setAttribute('disabled', 'disabled');
      button.classList.add('disabled');
  }

  /**
   * re-enables a button
   */
  function enableElement(button) {
      button.removeAttribute('disabled');
      button.classList.remove('disabled');
  }

  /**
   * display the api response
   * @param  {String} response API raw response
   */
  function displayResponse(response) {
    var parsedData = JSON.parse(response);
    responseData.textContent = JSON.stringify(parsedData, null, 2);
    return;
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

  function getInfo() {
    account_id = (isDefined(account_id_input.value)) ? account_id_input.value : account_id_default;
    client_id = (isDefined(client_id_input.value)) ? client_id_input.value : null;
    client_secret = (isDefined(client_secret_input.value)) ? client_secret_input.value : null;
    if (account_id !== account_id_default) {
      if (!isDefined(client_secret) || !isDefined(client_id)) {
        window.alert('If you are using your own account, you must provide a client id and client secret');
      }
    }
  }

  /**
   * sets up the data for the API request
   * @param {String} id the id of the button that was clicked
   */
  function setoptions(id, video_id, callback) {
    var endPoint,
      options = {},
      requestBody = {},
      parsedData,
      i,
      iMax;
    // disable buttons to prevent a new request before current one finishes
    options.proxyURL = proxyURL;
    if (isDefined(client_id)) {
      options.client_id = client_id;
      options.client_secret = client_secret;
    }
    switch (id) {
      case 'getStatusAll':
        endPoint = '/videos/status';
        options.url = baseURL + account_id + endPoint;
        options.requestType = 'GET';
        apiRequest.textContent = options.url;
        apiData.textContent = '';
        makeRequest(options, function(response) {
          displayResponse(response);
          parsedData = JSON.parse(response);
          // add ids to array to add to playlist later
          iMax = parsedData.length;
          for (i = 0; i < iMax; i++) {
            setoptions('getVideoName', parsedData[i].id, function(name) {
              selectorData.push({'id': parsedData[i].id, 'name': name});
            });
          }
          populateSelector(videoForStatus, selectorData, 'id', 'name');
          populateSelector(videoForHistory, selectorData, 'id', 'name');
          enableElement(getStatusOne);
          enableElement(getHistory);
          enableElement(videoForStatus);
          enableElement(videoForHistory);
        });
        break;
      case 'getVideoName':
        endPoint = '/videos/' + video_id;
        options.url = 'https://cms.api.brightcove.com/v1/accounts/' + account_id + endPoint;
        options.requestType = 'GET';
        apiRequest.textContent = options.url;
        apiData.textContent = '';
        makeRequest(options, function(response) {
          displayResponse(response);
          parsedData = JSON.parse(response);
          // add ids to array to add to playlist later
          iMax = parsedData.length;
          for (i = 0; i < iMax; i++) {
            playlist_videos.push(parsedData[i].id);
          }
          enableElements();
        });
        break;
      case 'getStatusOne':
        endPoint = '/videos?limit=5&sort=name';
        options.url = baseURL + account_id + endPoint;
        options.requestType = 'GET';
        apiRequest.textContent = options.url;
        apiData.textContent = '';
        makeRequest(options, function(response) {
          displayResponse(response);
        });
        break;
      case 'getHistory':
        endPoint = '/videos/' +  video_id + '/status'
        options.url = baseURL + account_id + endPoint;
        options.requestType = 'GET';
        apiRequest.textContent = options.url;
        apiData.textContent = '';
        makeRequest(options, function(response) {
          displayResponse(response);
        });
        break;
      default:
        console.log('should not be here - ', id);
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

  // event listeners
  getStatusAll.addEventListener('click', function() {
    getInfo();
    setoptions('getStatusAll');
  });
  getStatusOne.addEventListener('click', function() {
    getSelectedValue(videoForStatus);
    setoptions('getStatusOne');
  });
  getHistory.addEventListener('click', function() {
    getSelectedValue(videoForHistory);
    setoptions('getHistory');
  });
})(window, document);
