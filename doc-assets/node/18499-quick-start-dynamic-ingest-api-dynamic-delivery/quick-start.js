var BCLS = (function(window, document) {
  var baseURL = 'https://cms.api.brightcove.com/v1/accounts/57838016001',
    ingestURL = 'https://ingest.api.brightcove.com/v1/accounts/57838016001',
    ingestURLsuffix = '/ingest-requests',
    proxyURL = 'https://solutions.brightcove.com/bcls/bcls-proxy/brightcove-learning-proxy.php',
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
  function setRequestData(id) {
      var endPoint = '',
        requestData = {};
      // disable buttons to prevent a new request before current one finishes
      disableButtons();
      switch (id) {
        case 'createVideo':
          endPoint = '/videos';
          requestData.url = baseURL + endPoint;
          requestData.requestType = 'POST';
          requestData.requestBody = {
            name: 'New Video from Dynamic Ingest API Quick Start'
          };
          apiRequest.textContent = requestData.url;
          apiData.textContent = JSON.stringify(requestData.requestBody, null, '  ');
          apiMethod.textContent = requestData.requestType;
          getMediaData(requestData, id);
          break;
        case 'ingestVideo':
          endPoint = '/videos/' + newVideo_id;
          requestData.url = ingestURL + endPoint + ingestURLsuffix;
          requestData.requestType = 'POST';
          requestData.requestBody = {
            master: {
              url: 'https://learning-services-media.brightcove.com/videos/mp4/greatblueheron.mp4'
            },
            profile: 'multi-platform-extended-static',
            'capture-images': true,
            'callbacks': ['https://solutions.brightcove.com/bcls/dynamic-delivery/di-callback-app.php']
          };
          apiRequest.textContent = requestData.url;
          apiData.textContent = JSON.stringify(requestData.requestBody, null, '  ');
          apiMethod.textContent = requestData.requestType;
          getMediaData(requestData, id);
          break;
        case 'retranscode':
          endPoint = '/videos/' + newVideo_id;
          requestData.url = ingestURL + endPoint + ingestURLsuffix;
          requestData.requestType = 'POST';
          requestData.requestBody = {
            master: {
              use_archived_master: true
            },
            profile: 'multi-platform-extended-static',
            'capture-images': true,
            'callbacks': ['https://solutions.brightcove.com/bcls/di-api/di-callback-app.php']
          };
          apiRequest.textContent = requestData.url;
          apiData.textContent = JSON.stringify(requestData.requestBody, null, '  ');
          apiMethod.textContent = requestData.requestType;
          getMediaData(requestData, id);
          break;
        case 'replace':
          endPoint = '/videos/' + newVideo_id;
          requestData.url = ingestURL + endPoint + ingestURLsuffix;
          requestData.requestType = 'POST';
          requestData.requestBody = {
            master: {
              url: 'https://learning-services-media.brightcove.com/videos/mp4/greathornedowl.mp4'
            },
            profile: 'multi-platform-extended-static',
            'capture-images': true,
            'callbacks': ['https://solutions.brightcove.com/bcls/di-api/di-callback-app.php']
          };
          apiRequest.textContent = requestData.url;
          apiData.textContent = JSON.stringify(requestData.requestBody, null, '  ');
          apiMethod.textContent = requestData.requestType;
          getMediaData(requestData, id);
          break;
        case 'addImages':
          endPoint = '/videos/' + newVideo_id;
          requestData.url = ingestURL + endPoint + ingestURLsuffix;
          requestData.requestType = 'POST';
          requestData.requestBody = {
            poster: {
              url: 'https://learning-services-media.brightcove.com/images/for_video/Water-In-Motion-poster.png',
              width: 640,
              height: 360
            },
            'thumbnail': {
              url: 'https://learning-services-media.brightcove.com/images/for_video/Water-In-Motion-thumbnail.png',
              width: 160,
              height: 90
            },
            profile: 'multi-platform-extended-static',
            'callbacks': ['https://solutions.brightcove.com/bcls/di-api/di-callback-app.php']
          };
          apiRequest.textContent = requestData.url;
          apiMethod.textContent = requestData.requestType;
          apiData.textContent = JSON.stringify(requestData.requestBody, null, '  ');
          getMediaData(requestData, id);
          break;
        case 'addTextTracks':
          endPoint = '/videos/' + newVideo_id;
          requestData.url = ingestURL + endPoint + ingestURLsuffix;
          requestData.requestType = 'POST';
          requestData.requestBody = {
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
          apiRequest.textContent = requestData.url;
          apiMethod.textContent = requestData.requestType;
          apiData.textContent = JSON.stringify(requestData.requestBody, null, '  ');
          getMediaData(requestData, id);
          break;
      }
    }
    /**
     * send API request to the proxy
     * @param  {Object} requestData options for the request
     * @param  {String} requestID the type of request = id of the button
     */
  function getMediaData(options, requestID) {
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
    setRequestData('createVideo');
  });
  ingestVideo.addEventListener('click', function() {
    setRequestData('ingestVideo');
  });
  retranscode.addEventListener('click', function() {
    setRequestData('retranscode');
  });
  replace.addEventListener('click', function() {
    setRequestData('replace');
  });
  addImages.addEventListener('click', function() {
    setRequestData('addImages');
  });
  addTextTracks.addEventListener('click', function() {
    setRequestData('addTextTracks');
  });
})(window, document);
