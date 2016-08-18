function var BCLS = (function (window, document, Pikaday) {
    'use strict';
    var // media api stuff
        getPlaylists,
        limit = 25,
        offset = 0,
        total_pages = 0,
        playlistData = [],
        analyticsData = {},
        useMyAccount = document.getElementById('useMyAccount'),
        basicInfo = document.getElementById('basicInfo'),
        $accountInputs = document.getElementById('accountInputs'),
        $playlistInfo = document.getElementById('playlistInfo'),
        $mapitoken = document.getElementById('mapitoken'),
        $readApiLocation = document.getElementById('readApiLocation'),
        params = {},
        videoOptionTemplate = '{{#items}}<option value=\'{{id}}\'>{{name}}</option>{{/items}}',
        // aapi stuff
        proxyURL = 'https://solutions.brightcove.com/bcls/bcls-proxy/analytics-by-playlist.php',
        account_id = '20318290001',
        $client_id = document.getElementById('client_id'),
        $client_secret = document.getElementById('client_secret'),
        client_id,
        client_secret,
        $APIrequestType = document.getElementById('aapiRequestType'),
        requestType,
        $accountID = document.getElementById('accountID'),
        $dimension = document.getElementById('dimension'),
        fromPicker,
        toPicker,
        to = document.getElementById('to'),
        from = document.getElementById('from'),
        $whereInputs = $('.where-input'),
        $player = document.getElementById('player'),
        $requestButton = document.getElementById('requestButton'),
        $request = document.getElementById('request'),
        $requestForm = document.getElementById('requestForm'),
        $aapiParams = document.getElementById('aapiParams'),
        $requestSubmitter = document.getElementById('requestSubmitter'),
        $submitButton = document.getElementById('submitButton'),
        $required = $('.required'),
        $format = document.getElementById('format'),
        $requestInputs = $('.aapi-request'),
        $directVideoInput = document.getElementById('directVideoInput'),
        $responseFrame = document.getElementById('responseFrame'),
        separator = '',
        requestTrimmed = false,
        lastChar = '',
        requestURL = '',
        endDate = '',
        startDate = '',
        $getPlaylists = document.getElementById('getPlaylists'),
        $playlistSelectWrapper = document.getElementById('playlistSelectWrapper'),
        $playlistSelector = document.getElementById('playlistSelector'),
        playlistSelector = document.getElementById('playlistSelector'),
        videoIds = [],
        searchString,
        playlistLimit,
        currentVideoIndex = 0,
        failNumber = 0,
        aapiFailNumber = 0,
        firstRun = true,
        addArrayItems,
        analyticsRequestNumber = 0,
        totalPlaylists = 0,
        gettingData = false,
        now = new Date(),
        nowMS = now.valueOf(),
        fromMS = nowMS - (30 * 24 * 60 * 60 * 1000),
        fromDate = new Date(fromMS),
        nowISO = now.toISOString().substr(0, 10),
        fromISO = fromDate.toISOString().substr(0, 10);
    // utilities
    function bclslog(context, message) {
        if (console) {
            console.log(context, message);
        }
    }
    // more robust test for strings 'not defined'
    function isDefined(v) {
        if (v === '' || v === null || v === 'undefined' || v === undefined) {
            return false;
        }
        return true;
    }

    // reset everything
    function reset() {
        firstRun = true;
        $playlistSelectWrapper.setAttribute('class', 'bcls-hidden');
        $playlistSelector.textContent = '';
        $getPlaylists.textContent = 'Get playlists';
        $getPlaylists.setAttribute('class', 'run-button');
        $getPlaylists.addEventListener('click', getPlaylists);
        to.value = nowISO;
        from.value = fromISO;
        offset = 0;
    }
    function onPlaylistSelect() {
        var selectedPlaylist = playlistData[(playlistSelector.selectedIndex - 1)];
        videoIds = selectedPlaylist.videoIds;
        bclslog('videoIds', videoIds);
        totalPlaylists = videoIds.length - 1;
        bclslog('totalPlaylists', totalPlaylists);
        // undim param input fields
        $aapiParams.setAttribute('style', 'opacity:1;cursor:pointer;');
        $requestSubmitter.setAttribute('style', 'opacity:1;cursor:pointer;');
        buildRequest();
    }

    function removeSpaces(str) {
        if (isDefined(str)) {
            str = str.replace(/\s+/g, '');
        return str;
        }
    }

    function trimRequest() {
        if (!requestTrimmed) {
            lastChar = requestURL.charAt((requestURL.length - 1));
            if (lastChar === '?' || lastChar === '&' || lastChar === ';') {
                requestURL = requestURL.substring(0, (requestURL.length - 1));
                // recall this function until trim finished
                trimRequest(requestURL);
            } else if (requestURL.indexOf('&&') > -1) {
                requestURL = requestURL.replace('&&', '&');
            } else if (requestURL.indexOf('?&') > -1) {
                requestURL = requestURL.replace('?&', '?');
            } else {
                requestTrimmed = true;
            }
        }
    }

    function buildRequest(type) {
        var requestOptions = {},
        tmpArray,
        newOption,
        txt,
        frag = new DocumentFragment(),
        currentIndex,
        i;

        // add credentials if submitted
        if (isDefined(client_id) && isDefined(client_secret)) {
            requestOptions.client_id = client_id;
            requestOptions.client_secret = client_secret;
        }
        switch (type) {
            case 'getPlaylistsCount':
            requestOptions.url = 'https://cms.api.brightcove.com/v1/accounts/' + account_id + '/counts/playlists';
            $request.textContent = requestOptions.url;
            getData(requestOptions, type, function(response) {
                totalPlaylists = response.count;
                buildRequest('getPlaylists');
            });
                break;
            case 'getPlaylists':
            totalPlaylistCalls = Math.ceil(totalPlaylists / limit);
            requestOptions.url = 'https://cms.api.brightcove.com/v1/accounts/' + account_id + '/playlists?limit=' + limit + '&offset=' + (limit * callNumber);
            getData(requestOptions, type, function(response) {
                // add the current items array to overall one
                playlistData = playlistData.concat(response);
                callNumber++;
                if (callNumber < totalPlaylistCalls) {
                    // still have more videos to get
                    buildRequest('getVideos');
                } else {
                    // build the playlist selector
                    newOption = document.createElement('option');
                    txt = document.createTextNode('Select a Playlist');
                    newOption.appendChild(txt);
                    frag.appendChild(newOption);
                    playlistData.forEach(function(playlist, index, playlistData) {
                        newOption = document.createElement('option');
                        newOption.setAttribute('value', playlist.id);
                        newOption.setAttribute('data-playlist-index', index);
                        txt = document.createTextNode(playlist.name);
                        newOption.appendChild(txt);
                        frag.appendChild(newOption);
                    });
                    // add the options to the playlist selector
                    $playlistSelector.appendChild(frag);
                    // reset callNumber
                    callNumber = 0;
                }
            });
                break;
            case 'getVideos':
                requestOptions.url = 'https://cms.api.brightcove.com/v1/accounts/' + account_id + 'videos?q=' + search + '&limit=' + playlistLimit;
                getData(requestOptions, type, function(response) {
                    response.forEach(function(video, index, response) {
                        videoIds.push(video.id)
                    });
                });
                break;
            case 'getAnalytics':
                totalAnalyticsCalls =
                break;

        }
        // reset requestTrimmed to false in case of regenerate request
        account_id = isDefined($accountID.val()) ? removeSpaces($accountID.val()) : account_id;
        requestTrimmed = false;
        requestURL = 'https://analytics.api.brightcove.com/v1/data';
        requestURL += '?accounts=' + account_id;
        // report dimensions
        requestURL += '&dimensions=video';
        // add video filter
        requestURL += '&where=video==' + videoIds.join();
        // check for player filter
        if ($player.val() !== '') {
            requestURL += ';player==' + $player.val();
        }
        requestURL += '&format=' + $format.val();
        // check for time filters
        startDate = from.value;
        if (startDate !== ' ') {
            requestURL += '&from=' + startDate;
        }
        endDate = to.value;
        if (endDate !== ' ') {
            requestURL += '&to=' + endDate;
        }
        // add limit and fields
        requestURL += '&limit=all&fields=engagement_score,play_rate,video,video_duration,video_engagement_1,video_engagement_100,video_engagement_25,video_engagement_50,video_engagement_75,video_impression,video_name,video_percent_viewed,video_seconds_viewed,video_view';

        // strip trailing ? or & and replace &&s
        trimRequest();
        $request.textContent = requestURL;
        $request.setAttribute('value', requestURL);
        // if getting data initiated, get data
        if (gettingData) {
            getData();
        }
    }

    /**
     * send API request to the proxy
     * @param  {Object} requestData options for the request
     * @param  {String} requestID the type of request = id of the button
     * @param  {Function} callback the callback function to invoke
     */
    function getData(options, type, callback) {
        var httpRequest = new XMLHttpRequest(),
            parsedData,
            requestParams,
            dataString,
            // response handler
            getResponse = function() {
                try {
                  if (httpRequest.readyState === 4) {
                    if (httpRequest.status === 200) {
                      parsedData = JSON.parse(httpRequest.responseText);
                      callback(parsedData);
                    } else {
                      alert('There was a problem with the request. Request returned ' + httpRequest.status);
                    }
                  }
                } catch (e) {
                  alert('Caught Exception: ' + e);
                }
            };
            // set up request data
        requestParams = 'url=' + encodeURIComponent(options.url) + '&requestType=GET';
        if (options.client_id && options.client_secret) {
            requestParams += '&client_id=' + options.client_id + '&client_secret=' + options.client_secret;
        }

        // set response handler
        httpRequest.onreadystatechange = getResponse;
        // open the request
        httpRequest.open('POST', proxyURL);
        // set headers
        httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        // open and send request
        httpRequest.send(requestParams);
    }


    // add date pickers to the date input fields
    fromPicker = new Pikaday({
        field: document.getElementById('from'),
        format: 'YYYY-MM-DD',
        onSelect: buildRequest
    });
    toPicker = new Pikaday({
        field: document.getElementById('to'),
        format: 'YYYY-MM-DD',
        onSelect: buildRequest
    });
    // populate to/from fields with default values
    to.value = nowISO;
    from.value = fromISO;

    // set event listeners
    useMyAccount.addEventListener('click', function () {
        if (basicInfo.getAttribute('style') === 'display:none;') {
            basicInfo.setAttribute('style', 'display:block;');
            useMyAccount.textContent = 'Use Sample Account';
        } else {
            basicInfo.setAttribute('style', 'display:none;');
            useMyAccount.textContent = 'Use My Account Instead';
        }
    });

    $getPlaylists.addEventListener('click', getPlaylists);
    // set listener for form fields
    $requestInputs.addEventListener('change', function () {
        // reset();
        buildRequest();
    });
    // send request
    $submitButton.addEventListener('click', function () {
        // reset current video index
        currentVideoIndex = 0;
        // make sure request data is current
        buildRequest();
        getData();
    });

    // generate initial request
    buildRequest();
    return {
        onPlaylistSelect : onPlaylistSelect
    };
})(window, document, Pikaday);
