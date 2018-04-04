var BCLS = (function(window, document) {
  var baseURL = 'https://cms.api.brightcove.com/v1/accounts/57838016001',
    ingestURL = 'https://ingest.api.brightcove.com/v1/accounts/57838016001',
    ingestURLsuffix = '/ingest-requests',
    proxyURL = 'https://solutions.brightcove.com/bcls/bcls-proxy/brightcove-learning-proxy-v2.php',
    dd_profile = 'multi-platform-standard-static',
    dd_retranscode_profile = 'multi-platform-extended-static',
    callback_url = 'https://solutions.brightcove.com/bcls/di-api/di-callback-app.php',
    newVideo_id = '',
    allButtons = document.getElementsByTagName('button'),
    createVideo = document.getElementById('createVideo'),
    ingestVideo = document.getElementById('ingestVideo'),
    retranscode = document.getElementById('retranscode'),
    replace = document.getElementById('replace'),
    addImages = document.getElementById('addImages'),
    addTextTracks = document.getElementById('addTextTracks');
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

          });
          break;
        case 'addTextTracks':
          endPoint = '/videos/' + newVideo_id;
          options.url = ingestURL + endPoint + ingestURLsuffix;
          options.requestType = 'POST';
          options.requestBody = {
            profile: '<>multi-platform-extended-static',
            text_tracks: [{
              url: 'https://learning-services-media.brightcove.com/captions/for_video/Water-in-Motion.vtt',
              srclang: 'en',
              kind: 'captions',
              label: 'EN',
              default: true
            }],
            'callbacks': ['https://solutions.brightcove.com/bcls/di-api/di-callback-app.php']
          };
          apiRequest.textContent = options.url;
          apiMethod.textContent = options.requestType;
          apiData.textContent = JSON.stringify(requestBody, null, '  ');
          makeRequest(options, function(response){
            var parsedData;
            parsedData = JSON.parse(response);

          });
          break;
      }
    }
    /**
     * send API request to the proxy
     * @param  {Object} options options for the request
     * @param  {String} requestID the type of request = id of the button
     */
  function makeRequest(options, requestID) {
      var httpRequest = new XMLHttpRequest(),
        responseRaw,
        parsedData,
        requestParams,
        dataString,
        // response handler
        getResponse = function() {
          try {
            if (httpRequest.readyState === 4) {
              if (httpRequest.status === 200) {
                console.log(httpRequest.responseText);
                responseRaw = httpRequest.responseText;
                responseData.textContent = responseRaw;
                parsedData = JSON.parse(responseRaw);
                // save new ids on create requests
                if (requestID === 'createVideo') {
                  newVideo_id = parsedData.id;
                }
                responseData.textContent = JSON.stringify(parsedData, null, '  ');
                // re-enable the buttons
                enableButtons();
              } else {
                alert('There was a problem with the request. Request returned ' + httpRequest.status);
              }
            }
          } catch (e) {
            alert('Caught Exception: ' + e);
          }
        };
      // set up request data
      requestParams = 'url=' + encodeURIComponent(options.url) + '&requestType=' + options.requestType;
      if (options.requestBody) {
        dataString = JSON.stringify(options.requestBody);
        requestParams += '&requestBody=' + encodeURIComponent(dataString);
      }
      console.log(requestParams);
      // set response handler
      httpRequest.onreadystatechange = getResponse;
      // open the request
      httpRequest.open('POST', proxyURL);
      // set headers
      httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      // open and send request
      httpRequest.send(requestParams);
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
