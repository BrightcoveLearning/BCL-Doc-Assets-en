var BCLS = (function(window, document) {
  var ipxURL = ' https://experiences.api.brightcove.com/v1/accounts/',
    cmsURL = 'https://cms.api.brightcove.com/v1/accounts/',
    proxyURL = 'https://solutions.brightcove.com/bcls/bcls-proxy/bcls-proxy-v2.php',
    video_id,
    playlist_id,
    default_account_id = '57838016001',
    new_experience_id,
    new_experience_name,
    new_experience_template,
    is_playlist_template = true;
    account_id_input = document.getElementById('account_id_input'),
    client_id_input = document.getElementById('client_id_input'),
    client_secret_input = document.getElementById('client_secret_input'),
    template_selector = document.getElementById('template_selector'),
    videos_selector = document.getElementById('video_selector'),
    apiRequest = document.getElementById('apiRequest'),
    apiData = document.getElementById('apiData'),
    apiMethod = document.getElementById('apiMethod'),
    apiResponse = document.getElementById('apiResponse'),
    // buttons
    all_buttons = document.querySelectorAll('.bcls-button'),
    get_templates = document.getElementById('get_templates'),
    create_ipx = document.getElementById('create_ipx'),
    get_videos = document.getElementById('get_videos'),
    get_videos = document.getElementById('get_videos'),
    get_playlists = document.getElementById('get_playlists'),
    update_experience = document.getElementById('update_experience'),
    publish_experience = document.getElementById('publish_experience'),
    reset_app = document.getElementById('reset_app'),
    all_templates = [],
    single_video_templates = [
      'ee-single-video'
    ],
    playlist_templates = [
      'ee-carousel',
      'ee-grid',
      'ee-horizontal-playlist',
      'ee-thumbnail',
      'ee-vertical-playlist'
    ],
    live_templates = [
      'ee-live-event'
    ];

  /**
   * event listeners
   */
  get_templates.addEventListener('click', function() {
    createRequest('get_templates');
  });

  create_ipx.addEventListener('click', function() {
    createRequest('create_ipx');
  });

  get_videos.addEventListener('click', function() {
    createRequest('get_videos');
  });

  get_playlists.addEventListener('click', function() {
    createRequest('get_playlists');
  });

  update_experience.addEventListener('click', function() {
    createRequest('update_experience');
  });

  publish_experience.addEventListener('click', function() {
    createRequest('publish_experience');
  });

  reset_app.addEventListener('click', function() {
    reset();
  });

  /**
   * disables all buttons so user can't submit new request until current one finishes
   */
  function disableButtons() {
    var i,
      iMax = all_buttons.length;
    for (i = 0; i < iMax; i++) {
      all_buttons[i].setAttribute('disabled', 'disabled');
      all_buttons[i].setAttribute('style', 'color:#999;cursor:not-allowed;border:1px #999 solid;');
    }
  }

  /**
   * enables a button element
   * @param {htmlElement} button the button
   */
  function enableButton(button) {
    button.removeAttribute('disabled');
    button.removeAttribute('style');
  }

  function removeChildren(el) {
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }
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
   * @return {String} the selected value
   */
  function getSelectedValue(e) {
    var selected = e.options[e.selectedIndex],
      val = selected.value;
      return val;
  }

  function reset() {
    disableButtons();
    enableButton(get_templates);
  }

  /**
   * sets up the data for the API request
   * @param {String} id the id of the button that was clicked
   */
  function createRequest(id) {
    var endPoint = '',
      options = {},
      requestBody = {};
    // disable buttons to prevent a new request before current one finishes
    disableButtons();
    options.account_id = (account_id_input.value.length > 0) ? account_id_input.value : '57838016001';
    if (client_id_input.value.length > 0 && client_secret_input.value.length > 0) {
      options.client_id = client_id_input.value;
      options.client_secret = client_secret_input.value;
    }
    options.proxyURL = proxyURL;
    switch (id) {
      case 'get_templates':
        endPoint = options.account_id + '/templates';
        options.url = ipxURL + endPoint;
        options.requestType = 'GET';
        apiRequest.textContent = options.url;
        apiMethod.textContent = options.requestType;
        console.log('options', options);
        makeRequest(options, function(response) {
          console.log('response', response);
          var parsedData,
            i,
            iMax,
            option,
            frag = document.createDocumentFragment();
          parsedData = JSON.parse(response);
          apiResponse.textContent = JSON.stringify(parsedData, null, 2);
          all_templates = parsedData.items
          i = all_templates.length;
          // remove live templates
          while (i < 0) {
            i--;
            if (arrayContains(live_templates, all_templates[i].id)) {
              all_templates.splice(i, 1);
            }
          }
          // populate template selector
          iMax = all_templates.length;
          for (i = 0; i < Imax; i++) {
            option = document.createElement('option');
            option.setAttribute('value', all_templates[i].id);
            if (i === 0) {
              option.setAttribute('selected', 'selected');
            }
            option.textContent = all_templates[i].name;
            frag.appendChild(option);
          }
          template_selector.appendChild(frag);
          responseData.textContent = JSON.stringify(parsedData, null, '  ');
          // enable the create experience button
          disableButtons();
          enableButton(create_ipx);
        });
        break;
      case 'create_ipx':
        var now = new Date().toISOString(),
          is_playlist_template = arrayContains(playlist_templates, new_experience_template);
          new_experience_template = getSelectedValue(template_selector);
          new_experience_name = 'Experience from Quick Start ' + now;
        endPoint = options.account_id + '/experiences';
        options.url = ipxURL + endPoint;
        options.requestType = 'POST';
        requestBody.name = new_experience_name;
        requestBody.template = new_experience_template;
        requestBody.description = 'A simple new experience created from the In-Page Experience API Quick Start';
        options.requestBody = JSON.stringify(requestBody);
        apiRequest.textContent = options.url;
        apiData.textContent = JSON.stringify(requestBody, null, '  ');
        apiMethod.textContent = options.requestType;
        makeRequest(options, function(response) {
          var parsedData;
          parsedData = JSON.parse(response);
          new_experience_id = parsedData.id;
          apiResponse.textContent = JSON.stringify(parsedData, null, '  ');
          // enable
          disableButtons();
          if (is_playlist_template) {
            enableButton(get_playlists);
          } else {
            enableButton(get_videos);
          }
        });
        break;
      case 'get_videos':
        endPoint = options.account_id + '/videos?limit=10';
        options.url = cmsURL + endPoint;
        options.requestType = 'GET';
        apiRequest.textContent = options.url;
        apiData.textContent = '';
        apiMethod.textContent = options.requestType;
        makeRequest(options, function(response) {
          var parsedData,
          option,
          i,
          iMax,
          frag = document.createDocumentFragment();
          parsedData = JSON.parse(response);
          console.log('parsedData', parsedData);
          apiResponse.textContent = JSON.stringify(parsedData, null, 2);
          // add video options to selector
          removeChildren(video_selector);
          iMax = parsedData.length;
          for (i = 0; i < iMax; i++) {
            option = document.createElement('option');
            option.setAttribute('value', parsedData[i].id);
            if (i === 0) {
              option.setAttribute('selected', 'selected');
            }
            option.textContent = parsedData[i].name;
            frag.appendChild(option);
          }
          videos_selector.appendChild(frag);
          // enable the update button
          disableButtons();
          enableButton(update_experience);
        });
        break;
      case 'get_playlists':
        endPoint = options.account_id + '/playlists?limit=10';
        options.url = cmsURL + endPoint;
        options.requestType = 'GET';
        apiRequest.textContent = options.url;
        apiData.textContent = '';
        apiMethod.textContent = options.requestType;
        makeRequest(options, function(response) {
          var parsedData,
          option,
          i,
          iMax,
          frag = document.createDocumentFragment();
          parsedData = JSON.parse(response);
          console.log('parsedData', parsedData);
          apiResponse.textContent = JSON.stringify(parsedData, null, 2);
          // add video options to selector
          removeChildren(video_selector);
          iMax = parsedData.length;
          for (i = 0; i < iMax; i++) {
            option = document.createElement('option');
            option.setAttribute('value', parsedData[i].id);
            if (i === 0) {
              option.setAttribute('selected', 'selected');
            }
            option.textContent = parsedData[i].name;
            frag.appendChild(option);
          }
          videos_selector.appendChild(frag);
          // enable the update button
          disableButtons();
          enableButton(update_experience);
        });
        break;
      case 'update_experience':
        endPoint = options.account_id + '/experiences/' + new_experience_id;
        options.url = ipxURL + endPoint;
        options.requestType = 'PUT';
        requestBody.name = new_experience_name;
        requestBody.template = new_experience_template;
        requestBody.videos = {};
        if (is_playlist_template) {
          requestBody.videos.type = 'playlist';
          requestBody.videos.playlistid = getSelectedValue(playlist_selector);
        } else {
          requestBody.videos.type = 'manual';
          requestBody.videos.videoids = getSelectedValue(video_selector);
        }
        options.requestBody = JSON.stringify(requestBody);
        apiRequest.textContent = options.url;
        apiMethod.textContent = options.requestType;
        apiData.textContent = JSON.stringify(requestBody, null, '  ');
        makeRequest(options, function(response) {
          var parsedData;
          parsedData = JSON.parse(response);
          apiResponse.textContent = JSON.stringify(parsedData, null, 2);
          // re-enable the publish ipx button
          disableButtons();
          enableButton(publish_experience);
        });
        break;
      case 'publish_experience':
        endPoint = '/experiences/' + new_experience_id + '/actions/publish';
        options.url = ipxURL + endPoint;
        options.requestType = 'POST';
        apiRequest.textContent = options.url;
        apiMethod.textContent = options.requestType;
        apiData.textContent = '';
        makeRequest(options, function(response) {
          var parsedData;
          parsedData = JSON.parse(response);
          apiResponse.textContent = JSON.stringify(parsedData, null, 2);
          // re-enable the create IPX button
          disableButtons();
          enableButton(create_ipx);
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
      getResponse = function() {
        try {
          if (httpRequest.readyState === 4) {
            if (httpRequest.status >= 200 && httpRequest.status < 300) {
              response = httpRequest.responseText;
              console.log('raw response', response);
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

  /**
   * initial disable/enable buttons
   */
  function init() {
    var i, iMax = all_buttons.length;
    disableButtons();
    enableButton(get_templates);
    for (i = 0; i < iMax; i++) {
      enableButton(all_buttons[i]);
    }
  }

  init();

})(window, document);
