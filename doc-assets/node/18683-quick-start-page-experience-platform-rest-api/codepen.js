var BCLS = (function(window, document) {
  var ipxURL = ' https://experiences.api.brightcove.com/v1/accounts/',
    cmsURL = 'https://cms.api.brightcove.com/v1/accounts/',
    proxyURL = 'https://solutions.brightcove.com/bcls/bcls-proxy/brightcove-learning-proxy-v2.php',
    video_id,
    playlist_id,
    default_account_id = '57838016001',
    account_id_input = document.getElementById('account_id_input'),
    client_id_input = document.getElementById('client_id_input'),
    client_secret_input = document.getElementById('client_secret_input'),
    template_selector = document.getElementById('template_selector'),
    video_selector = document.getElementById('video_selector'),
    playlist_selector = document.getElementById('playlist_selector'),
    // buttons
    all_buttons = document.querySelectorAll('button'),
    get_templates = document.getElementById('get_templates'),
    create_ipx = document.getElementById('create_ipx'),
    get_videos = document.getElementById('get_videos'),
    get_videos = document.getElementById('get_videos'),
    get_playlists = document.getElementById('get_playlists'),
    update_experience = document.getElementById('update_experience'),
    publish_experience = document.getElementById('publish_experience'),
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
   * disables all buttons so user can't submit new request until current one finishes
   */
  function disableButtons() {
    var i,
      iMax = allButtons.length;
    for (i = 0; i < iMax; i++) {
      allButtons[i].setAttribute('disabled', 'disabled');
      allButtons[i].setAttribute('style', 'color:#999');
    }
  }

  /**
   * disables a button element
   * @param {htmlElement} button the button
   */
  function disableButton(button) {
    button.setAttribute('disabled', 'disabled');
    button.setAttribute('style', 'color:#999')
  }

  /**
   * enables a button element
   * @param {htmlElement} button the button
   */
  function enableButton(button) {
    button.removeAttribute('disabled');
    button.removeAttribute('style');
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
      options.proxyURL = proxyURL;
      switch (id) {
        case 'get_templates':
          endPoint = '/templates';
          options.url = ipxURL + endPoint;
          options.requestType = 'GET';
          requestBody.name = 'New Video from Dynamic Ingest API Quick Start';
          options.requestBody = JSON.stringify(requestBody);
          apiRequest.textContent = options.url;
          apiData.textContent = JSON.stringify(requestBody, null, '  ');
          apiMethod.textContent = options.requestType;
          makeRequest(options, function(response){
            var parsedData;
            parsedData = JSON.parse(response);
            newVideo_id = parsedData.id;
            responseData.textContent = JSON.stringify(parsedData, null, '  ');
            // re-enable the buttons
            enableButtons();
          });
          break;
        case 'create_ipx':
          endPoint = '/videos/' + newVideo_id;
          options.url = ingestURL + endPoint + ingestURLsuffix;
          options.requestType = 'POST';
          requestBody.master = {};
          requestBody.master.url = 'https://learning-services-media.brightcove.com/videos/mp4/greatblueheron.mp4';
          requestBody.profile = dd_profile;
          requestBody.callbacks = [callback_url];
          options.requestBody = JSON.stringify(requestBody);
          apiRequest.textContent = options.url;
          apiData.textContent = JSON.stringify(requestBody, null, '  ');
          apiMethod.textContent = options.requestType;
          makeRequest(options, function(response){
            var parsedData;
            parsedData = JSON.parse(response);
            responseData.textContent = JSON.stringify(parsedData, null, '  ');
            // re-enable the buttons
            enableButtons();
          });
          break;
        case 'get_videos':
          endPoint = '/videos/' + newVideo_id;
          options.url = ingestURL + endPoint + ingestURLsuffix;
          options.requestType = 'POST';
          requestBody.master = {};
          requestBody.master.use_archived_master = true;
          requestBody.profile = dd_retranscode_profile;
          requestBody['capture-images'] = true;
          requestBody.callbacks = [callback_url];
          options.requestBody = JSON.stringify(requestBody);
          apiRequest.textContent = options.url;
          apiData.textContent = JSON.stringify(requestBody, null, '  ');
          apiMethod.textContent = options.requestType;
          makeRequest(options, function(response){
            var parsedData;
            parsedData = JSON.parse(response);
            responseData.textContent = JSON.stringify(parsedData, null, '  ');
            // re-enable the buttons
            enableButtons();
          });
          break;
        case 'get_playlists':
          endPoint = '/videos/' + newVideo_id;
          options.url = ingestURL + endPoint + ingestURLsuffix;
          options.requestType = 'POST';
          options.master = {};
          options.master.url = 'https://learning-services-media.brightcove.com/videos/mp4/greathornedowl.mp4';
          options.profile = dd_profile;
          requestBody['capture-images'] = true;
          requestBody.callbacks = [callback_url];
          options.requestBody = JSON.stringify(requestBody);
          apiRequest.textContent = options.url;
          apiData.textContent = JSON.stringify(requestBody, null, '  ');
          apiMethod.textContent = options.requestType;
          makeRequest(options, function(response){
            var parsedData;
            parsedData = JSON.parse(response);
            responseData.textContent = JSON.stringify(parsedData, null, '  ');
            // re-enable the buttons
            enableButtons();
          });
          break;
        case 'update_experience':
          endPoint = '/videos/' + newVideo_id;
          options.url = ingestURL + endPoint + ingestURLsuffix;
          options.requestType = 'POST';
          requestBody.poster = {};
          requestBody.poster.url = 'https://learning-services-media.brightcove.com/images/for_video/Water-In-Motion-poster.png';
          requestBody.poster.width = 640;
          requestBody.poster.height = 360;
          requestBody.thumbnail = {};
          requestBody.thumbnail.url = 'https://learning-services-media.brightcove.com/images/for_video/Water-In-Motion-thumbnail.png';
          requestBody.thumbnail.width = 160;
          requestBody.thumbnail.height = 90;
          requestBody.profile = dd_profile;
          requestBody.callbacks = [callback_url];
          options.requestBody = JSON.stringify(requestBody);
          apiRequest.textContent = options.url;
          apiMethod.textContent = options.requestType;
          apiData.textContent = JSON.stringify(requestBody, null, '  ');
          makeRequest(options, function(response){
            var parsedData;
            parsedData = JSON.parse(response);
            responseData.textContent = JSON.stringify(parsedData, null, '  ');
            // re-enable the buttons
            enableButtons();
          });
          break;
        case 'publish_experience':
          endPoint = '/videos/' + newVideo_id;
          options.url = ingestURL + endPoint + ingestURLsuffix;
          options.requestType = 'POST';
          requestBody.profile = dd_profile;
          requestBody.text_tracks = [];
          requestBody.text_tracks[0] = {};
          requestBody.text_tracks[0].url = 'https://learning-services-media.brightcove.com/captions/for_video/Water-in-Motion.vtt';
          requestBody.text_tracks[0].srclang = 'en';
          requestBody.text_tracks[0].kind = 'captions';
          requestBody.text_tracks[0].label = 'EN';
          requestBody.text_tracks[0].default = true;
          requestBody.callbacks = [callback_url];
          options.requestBody = JSON.stringify(requestBody);
          apiRequest.textContent = options.url;
          apiMethod.textContent = options.requestType;
          apiData.textContent = JSON.stringify(requestBody, null, '  ');
          makeRequest(options, function(response){
            var parsedData;
            parsedData = JSON.parse(response);
            responseData.textContent = JSON.stringify(parsedData, null, '  ');
            // re-enable the buttons
            enableButtons();
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
  createVideo.addEventListener('click', function() {
    createRequest('createVideo');
  });
  ingestVideo.addEventListener('click', function() {
    createRequest('ingestVideo');
  });
  retranscode.addEventListener('click', function() {
    createRequest('retranscode');
  });
  replace.addEventListener('click', function() {
    createRequest('replace');
  });
  addImages.addEventListener('click', function() {
    createRequest('addImages');
  });
  addTextTracks.addEventListener('click', function() {
    createRequest('addTextTracks');
  });
})(window, document);
