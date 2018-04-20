var BCLS = (function(window, document) {
  var baseURL                 = 'https://cms.api.brightcove.com/v1/accounts/57838016001',
    proxyURL                = 'https://solutions.brightcove.com/bcls/bcls-proxy/brightcove-learning-proxy-v2.php',
    video_id                = '5191499941001',
    newVideo_id             = '5191509290001',
    playlist_id             = '4492151631001',
    newPlaylist_id          = '730486831001',
    folder_id               = '560039e5e4b0e69e4b01cacd',
    playlist_videos         = [],
    allButtons              = document.getElementsByTagName('button'),
    get5videos              = document.getElementById('get5videos'),
    get5more                = document.getElementById('get5more'),
    sort                    = document.getElementById('sort'),
    get1video               = document.getElementById('get1video'),
    sources                 = document.getElementById('sources'),
    search                  = document.getElementById('search'),
    searchCount             = document.getElementById('searchCount'),
    createVideo             = document.getElementById('createVideo'),
    updateVideo             = document.getElementById('updateVideo'),
    addRendition            = document.getElementById('addRendition'),
    addPoster               = document.getElementById('addPoster'),
    addThumbnail            = document.getElementById('addThumbnail'),
    get3playlists           = document.getElementById('get3playlists'),
    get1playlist            = document.getElementById('get1playlist'),
    getPlaylistVideoCount   = document.getElementById('getPlaylistVideoCount'),
    getPlaylistVideos       = document.getElementById('getPlaylistVideos'),
    createPlaylist          = document.getElementById('createPlaylist'),
    updatePlaylist          = document.getElementById('updatePlaylist'),
    addVideos               = document.getElementById('updatePlaylist'),
    getFolders              = document.getElementById('getFolders'),
    getFolderVideos         = document.getElementById('getFolderVideos'),
    addVideoToFolder        = document.getElementById('addVideoToFolder'),
    removeVideoFromFolder   = document.getElementById('removeVideoFromFolder'),
    apiRequest              = document.getElementById('apiRequest'),
    apiData                 = document.getElementById('apiData'),
    apiMethod               = document.getElementById('apiMethod'),
    generatedContent        = document.getElementById('generatedContent'),
    responseData            = document.getElementById('responseData'),
    nowISO                  = new Date().toISOString();

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
     * display the api response
     * @param  {String} response API raw response
     */
    function displayResponse(response) {
      var parsedData = JSON.parse(response);
      responseData.textContent = JSON.stringify(parsedData, null, '  ');
      return;
    }

    /**
     * sets up the data for the API request
     * @param {String} id the id of the button that was clicked
     */
    function setoptions(id) {
        var endPoint = '',
            options = {},
            requestBody = {},
            parsedData,
            i,
            iMax;
        // disable buttons to prevent a new request before current one finishes
        disableButtons();
        options.account_id = '57838016001';
        options.proxyURL = proxyURL;
        switch (id) {
            case 'get5videos':
                endPoint = '/videos?limit=5';
                options.url = baseURL + endPoint;
                options.requestType = 'GET';
                apiRequest.textContent = options.url;
                apiMethod.textContent = options.requestType;
                apiData.textContent = '';
                makeRequest(options, function(response) {
                  displayResponse(response);
                  parsedData = JSON.parse(response);
                  // add ids to array to add to playlist later
                  iMax = parsedData.length;
                  for (i = 0; i < iMax; i++) {
                    playlist_videos.push(parsedData[i].id);
                  }
                  enableButtons();
                });
                break;
            case 'get5more':
                endPoint = '/videos?limit=5&offset=5';
                options.url = baseURL + endPoint;
                options.requestType = 'GET';
                apiRequest.textContent = options.url;
                apiMethod.textContent = options.requestType;
                apiData.textContent = '';
                makeRequest(options, function(response) {
                  displayResponse(response);
                  parsedData = JSON.parse(response);
                  // add ids to array to add to playlist later
                  iMax = parsedData.length;
                  for (i = 0; i < iMax; i++) {
                    playlist_videos.push(parsedData[i].id);
                  }
                  enableButtons();
                });
                break;
            case 'sort':
                endPoint = '/videos?limit=5&sort=name';
                options.url = baseURL + endPoint;
                options.requestType = 'GET';
                apiRequest.textContent = options.url;
                apiMethod.textContent = options.requestType;
                apiData.textContent = '';
                makeRequest(options, function(response) {
                  displayResponse(response);
                  enableButtons();
                });
                break;
            case 'get1video':
                endPoint = '/videos/' + video_id;
                options.url = baseURL + endPoint;
                options.requestType = 'GET';
                apiRequest.textContent = options.url;
                apiMethod.textContent = options.requestType;
                apiData.textContent = '';
                makeRequest(options, function(response) {
                  displayResponse(response);
                  enableButtons();
                });
                break;
            case 'sources':
                endPoint = '/videos/' + video_id + '/sources';
                options.url = baseURL + endPoint;
                options.requestType = 'GET';
                apiRequest.textContent = options.url;
                apiMethod.textContent = options.requestType;
                apiData.textContent = '';
                makeRequest(options, function(response) {
                  displayResponse(response);
                  enableButtons();
                });
                break;
            case 'search':
                endPoint = '/videos?q=' + encodeURI('name:sea');
                options.url = baseURL + endPoint;
                options.requestType = 'GET';
                apiRequest.textContent = options.url;
                apiMethod.textContent = options.requestType;
                apiData.textContent = '';
                makeRequest(options, function(response) {
                  displayResponse(response);
                  enableButtons();
                });
                break;
            case 'searchCount':
                endPoint = '/counts/videos?q=' + encodeURI('name:sea');
                options.url = baseURL + endPoint;
                options.requestType = 'GET';
                apiRequest.textContent = options.url;
                apiMethod.textContent = options.requestType;
                apiData.textContent = '';
                makeRequest(options, function(response) {
                  displayResponse(response);
                  enableButtons();
                });
                break;
            case 'createVideo':
                endPoint = '/videos';
                options.url = baseURL + endPoint;
                options.requestType = 'POST';
                requestBody.name = 'Great Blue Heron - from CMS API Quick Start - ' + nowISO;
                options.requestBody = JSON.stringify(requestBody);
                apiRequest.textContent = options.url;
                apiData.textContent = JSON.stringify(requestBody, null, '  ');
                apiMethod.textContent = options.requestType;
                makeRequest(options, function(response) {
                  displayResponse(response);
                  parsedData = JSON.parse(response);
                  newVideo_id = parsedData.id;
                  enableButtons();
                });
                break;
            case 'updateVideo':
                endPoint = '/videos/' + newVideo_id;
                options.url = baseURL + endPoint;
                options.requestType = 'PATCH';
                requestBody.description = 'This video was updated ' + nowISO;
                requestBody.tags = ['test','quick_start'];
                options.requestBody = JSON.stringify(requestBody);
                apiRequest.textContent = options.url;
                apiData.textContent = JSON.stringify(requestBody, null, '  ');
                apiMethod.textContent = options.requestType;
                makeRequest(options, function(response) {
                  displayResponse(response);
                  enableButtons();
                });
                break;
            case 'addRendition':
                endPoint = '/videos/' + newVideo_id + '/assets/renditions';
                options.url = baseURL + endPoint;
                options.requestType = 'POST';
                requestBody.progressive_download = true;
                requestBody.remote_url = 'https://learning-services-media.brightcove.com/videos/mp4/greatblueheron.mp4';
                requestBody.video_duration = 31000;
                requestBody.size = 90990884;
                requestBody.frame_height = 1080;
                requestBody.frame_width = 1920;
                requestBody.video_codec = 'h264';
                requestBody.video_container = 'MP4';
                options.requestBody = JSON.stringify(requestBody);
                apiRequest.textContent = options.url;
                apiData.textContent = JSON.stringify(requestBody, null, '  ');
                apiMethod.textContent = options.requestType;
                makeRequest(options, function(response) {
                  displayResponse(response);
                  enableButtons();
                });
                break;
            case 'addPoster':
                endPoint = '/videos/' + newVideo_id + '/assets/poster';
                options.url = baseURL + endPoint;
                options.requestType = 'POST';
                requestBody.remote_url = 'https://learning-services-media.brightcove.com/images/great-blue-heron-poster.png';
                options.requestBody = JSON.stringify(requestBody);
                apiRequest.textContent = options.url;
                apiData.textContent = JSON.stringify(requestBody, null, '  ');
                apiMethod.textContent = options.requestType;
                makeRequest(options, function(response) {
                  displayResponse(response);
                  enableButtons();
                });
                break;
            case 'addThumbnail':
                endPoint = '/videos/' + newVideo_id + '/assets/thumbnail';
                options.url = baseURL + endPoint;
                options.requestType = 'POST';
                requestBody.remote_url = 'https://learning-services-media.brightcove.com/images/great-blue-heron-thumbnail.png';
                options.requestBody = JSON.stringify(requestBody);
                apiRequest.textContent = options.url;
                apiData.textContent = JSON.stringify(requestBody, null, '  ');
                apiMethod.textContent = options.requestType;
                makeRequest(options, function(response) {
                  displayResponse(response);
                  enableButtons();
                });
                break;
            case 'get3playlists':
                endPoint = '/playlists?limit=3';
                options.url = baseURL + endPoint;
                options.requestType = 'GET';
                apiRequest.textContent = options.url;
                apiMethod.textContent = options.requestType;
                apiData.textContent = '';
                makeRequest(options, function(response) {
                  displayResponse(response);
                  enableButtons();
                });
                break;
            case 'get1playlist':
                endPoint = '/playlists/' + playlist_id;
                options.url = baseURL + endPoint;
                options.requestType = 'GET';
                apiRequest.textContent = options.url;
                apiMethod.textContent = options.requestType;
                apiData.textContent = '';
                makeRequest(options, function(response) {
                  displayResponse(response);
                  enableButtons();
                });
                break;
            case 'getPlaylistVideoCount':
                endPoint = '/counts/playlists/' + playlist_id + '/videos';
                options.url = baseURL + endPoint;
                options.requestType = 'GET';
                apiRequest.textContent = options.url;
                apiMethod.textContent = options.requestType;
                apiData.textContent = '';
                makeRequest(options, function(response) {
                  displayResponse(response);
                  enableButtons();
                });
                break;
            case 'getPlaylistVideos':
                endPoint = '/playlists/' + playlist_id + '/videos';
                options.url = baseURL + endPoint;
                options.requestType = 'GET';
                apiRequest.textContent = options.url;
                apiMethod.textContent = options.requestType;
                apiData.textContent = '';
                makeRequest(options, function(response) {
                  displayResponse(response);
                  enableButtons();
                });
                break;
            case 'createPlaylist':
                endPoint = '/playlists';
                options.url = baseURL + endPoint;
                options.requestType = 'POST';
                requestBody.name = 'New Manual Playlist from CMS API Quick Start ' + nowISO;
                requestBody.type = 'EXPLICIT';
                requestBody.name = 'New Playlist from CMS API Quick Start' + nowISO;
                options.requestBody = JSON.stringify(requestBody);
                apiRequest.textContent = options.url;
                apiData.textContent = JSON.stringify(requestBody, null, '  ');
                apiMethod.textContent = options.requestType;
                makeRequest(options, function(response) {
                  displayResponse(response);
                  newPlaylist_id = parsedData.id;
                  enableButtons();
                });
                break;
            case 'updatePlaylist':
                endPoint = '/playlists/' + newPlaylist_id;
                options.url = baseURL + endPoint;
                options.requestType = 'PATCH';
                requestBody.name = 'Updated Playlist from CMS API Quick Start' + nowISO;
                requestBody.video_ids = playlist_videos;
                options.requestBody = JSON.stringify(requestBody);
                apiRequest.textContent = options.url;
                apiData.textContent = JSON.stringify(requestBody, null, '  ');
                apiMethod.textContent = options.requestType;
                makeRequest(options, function(response) {
                  displayResponse(response);
                  enableButtons();
                });
                break;
            case 'getFolders':
                endPoint = '/folders';
                options.url = baseURL + endPoint;
                options.requestType = 'GET';
                apiRequest.textContent = options.url;
                apiMethod.textContent = options.requestType;
                apiData.textContent = '';
                makeRequest(options, function(response) {
                  displayResponse(response);
                  enableButtons();
                });
                break;
            case 'getFolderVideos':
                endPoint = '/folders/' + folder_id + '/videos';
                options.url = baseURL + endPoint;
                options.requestType = 'GET';
                apiRequest.textContent = options.url;
                apiMethod.textContent = options.requestType;
                apiData.textContent = '';
                makeRequest(options, function(response) {
                  displayResponse(response);
                  enableButtons();
                });
                break;
            case 'addVideoToFolder':
                endPoint = '/folders/' + folder_id + '/videos/' + video_id;
                options.url = baseURL + endPoint;
                options.requestType = 'PUT';
                apiRequest.textContent = options.url;
                apiMethod.textContent = options.requestType;
                apiData.textContent = '';
                makeRequest(options, function(response) {
                  responseData.textContent = 'This request returns 204 No Content';
                  enableButtons();
                });
                break;
            case 'removeVideoFromFolder':
                endPoint = '/folders/' + folder_id + '/videos/' + video_id;
                options.url = baseURL + endPoint;
                options.requestType = 'DELETE';
                apiRequest.textContent = options.url;
                apiMethod.textContent = options.requestType;
                apiData.textContent = '';
                makeRequest(options, function(response) {
                  responseData.textContent = 'This request returns 204 No Content';
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
    get5videos.addEventListener('click', function() {
        setoptions('get5videos');
    });
    get5more.addEventListener('click', function() {
        setoptions('get5more');
    });
    sort.addEventListener('click', function() {
        setoptions('sort');
    });
    get1video.addEventListener('click', function() {
        setoptions('get1video');
    });
    sources.addEventListener('click', function() {
        setoptions('sources');
    });
    search.addEventListener('click', function() {
        setoptions('search');
    });
    searchCount.addEventListener('click', function() {
        setoptions('searchCount');
    });
    createVideo.addEventListener('click', function() {
        setoptions('createVideo');
    });
    updateVideo.addEventListener('click', function() {
        setoptions('updateVideo');
    });
    get3playlists.addEventListener('click', function() {
        setoptions('get3playlists');
    });
    get1playlist.addEventListener('click', function() {
        setoptions('get1playlist');
    });
    getPlaylistVideoCount.addEventListener('click', function() {
        setoptions('getPlaylistVideoCount');
    });
    getPlaylistVideos.addEventListener('click', function() {
        setoptions('getPlaylistVideos');
    });
    createPlaylist.addEventListener('click', function() {
        setoptions('createPlaylist');
    });
    updatePlaylist.addEventListener('click', function() {
        setoptions('updatePlaylist');
    });
    getFolders.addEventListener('click', function() {
        setoptions('getFolders');
    });
    getFolderVideos.addEventListener('click', function() {
        setoptions('getFolderVideos');
    });
    addVideoToFolder.addEventListener('click', function() {
        setoptions('addVideoToFolder');
    });
    removeVideoFromFolder.addEventListener('click', function() {
        setoptions('removeVideoFromFolder');
    });
})(window, document);
