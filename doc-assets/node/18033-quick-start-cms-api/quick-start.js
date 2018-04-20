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
                });
                break;
            case 'addRendition':
                endPoint = '/videos/' + newVideo_id;
                options.url = baseURL + endPoint;
                options.requestType = 'PATCH';
                options.requestBody = {name:'Updated Video from CMS API Quick Start',description:'This is only a test',tags:['test','quick_start']};
                apiRequest.textContent = options.url;
                apiData.textContent = JSON.stringify(options.requestBody, null, '  ');
                apiMethod.textContent = options.requestType;
                makeRequest(options, function(response) {

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

                });
                break;
            case 'createPlaylist':
                endPoint = '/playlists';
                options.url = baseURL + endPoint;
                options.requestType = 'POST';
                options.requestBody = {name:'New Playlist from CMS API Quick Start',type:'ALPHABETICAL',search:'tags:sealife'};
                apiRequest.textContent = options.url;
                apiData.textContent = JSON.stringify(options.requestBody, null, '  ');
                apiMethod.textContent = options.requestType;
                makeRequest(options, function(response) {

                });
                break;
            case 'updatePlaylist':
                endPoint = '/playlists/' + newPlaylist_id;
                options.url = baseURL + endPoint;
                options.requestType = 'PATCH';
                options.requestBody = {name:'Updated Playlist from CMS API Quick Start',type:'ACTIVATED_NEWEST_TO_OLDEST',search:'tags:sealife'};
                apiRequest.textContent = options.url;
                apiData.textContent = JSON.stringify(options.requestBody, null, '  ');
                apiMethod.textContent = options.requestType;
                makeRequest(options, function(response) {

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
                      // add/remove folder video return no data
                      if (requestID === 'addVideoToFolder' || requestID === 'removeVideoFromFolder') {
                        responseData.textContent = 'This request returns 204 No Content';
                      } else {
                        responseRaw = httpRequest.responseText;
                        responseData.textContent = responseRaw;
                        parsedData = JSON.parse(responseRaw);
                        // save new ids on create requests
                        if (requestID === 'createVideo') {
                            newVideo_id = parsedData.id;
                        } else if (requestID === 'createPlaylist') {
                            newPlaylist_id = parsedData.id;
                        }
                        responseData.textContent = JSON.stringify(parsedData, null, '  ');
                      }
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
        requestParams = "url=" + encodeURIComponent(options.url) + "&requestType=" + options.requestType;
        if (options.requestBody) {
            dataString = JSON.stringify(options.requestBody);
            requestParams += "&requestBody=" + encodeURIComponent(dataString);
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
