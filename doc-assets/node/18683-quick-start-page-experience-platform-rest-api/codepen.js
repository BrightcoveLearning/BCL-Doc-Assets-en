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
    get_templates = document.getElementById('get_templates'),
    template_selector = document.getElementById('template_selector'),
    video_selector = document.getElementById('video_selector'),
    playlist_selector = document.getElementById('playlist_selector'),
    allButtons = document.getElementsByTagName('button'),
    createVideo = document.getElementById('createVideo'),
    ingestVideo = document.getElementById('ingestVideo'),
    retranscode = document.getElementById('retranscode'),
    replace = document.getElementById('replace'),
    addImages = document.getElementById('addImages'),
    addTextTracks = document.getElementById('addTextTracks'),
    single_video_templates = [];
  /**
   * disables all buttons so user can't submit new request until current one finishes
   */
  function disableButtons() {
      var i,
        iMax = allButtons.length;
      for (i = 0; i < iMax; i++) {
        allButtons[i].setAttribute('disabled', 'disabled');
      }
    }
    /**
     * re-enables all buttons
     */
  function enableButtons() {
      var i,
        iMax = allButtons.length;
      for (i = 0; i < iMax; i++) {
        allButtons[i].removeAttribute('disabled');
      }
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
      options.account_id = '57838016001';
      options.proxyURL = proxyURL;
      switch (id) {
        case 'createVideo':
          endPoint = '/videos';
          options.url = baseURL + endPoint;
          options.requestType = 'POST';
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
        case 'ingestVideo':
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
        case 'retranscode':
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
        case 'replace':
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
        case 'addImages':
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
        case 'addTextTracks':
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
