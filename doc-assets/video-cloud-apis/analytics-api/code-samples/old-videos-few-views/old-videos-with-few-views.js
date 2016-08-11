var BCLS = (function (window, document) {
    'use strict';
    var videoData = [],
        analyticsData = [],
        videoIdsArray = [],
        lastPublishedDate,
        totalVideos = null,
        videoCount = 0,
        totalVideoCalls = 0,
        callNumber = 0,
        pageNumber = 0,
        params = {},
        // aapi stuff
        proxyURL = 'https://solutions.brightcove.com/bcls/bcls-proxy/non-performing-videos-proxy.php',
        useMyAccount = document.getElementById('useMyAccount'),
        basicInfo = document.getElementById('basicInfo'),
        accountID = document.getElementById('accountID'),
        account_id = '1752604059001',
        $client_id = document.getElementById('client_id'),
        $client_secret = document.getElementById('client_secret'),
        client_id = null,
        client_secret = null,
        $totalVideos = document.getElementById('totalVideos'),
        limit = 25,
        $fromMonths = document.getElementById('fromMonths'),
        $excludeMonths = document.getElementById('excludeMonths'),
        $includeVideos = document.getElementById('includeVideos'),
        $request = document.getElementById('request'),
        $submitButton = document.getElementById('submitButton'),
        $csvButton = document.getElementById('csvButton'),
        $selectData = document.getElementById('selectData'),
        $responseFrame = document.getElementById('responseFrame'),
        mMonth = 2592000000,
        now = new Date(),
        from,
        oldestPubDate = now.valueOf() - ($excludeMonths.value * mMonth),
        requestTrimmed = false,
        lastChar = '',
        requestURL = '',
        totalAnalyticsCalls = 0,
        analyticsCallNumber = 0,
        i,
        len,
        minViews = $includeVideos.value;

    /**
     * Logging function - safe for IE
     * @param  {string} context - description of the data
     * @param  {*} message - the data to be logged by the console
     * @return {}
     */
    function bclslog(context, message) {
        if (window['console'] && console['log']) {
          console.log(context, message);
        }
        return;
    };


    // more robust test for strings 'not defined'
    function isDefined(v) {
        if (v === '' || v === null || v === undefined || v === NaN) {
            return false;
        }
        return true;
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

    /**
     * find index of an object in array of objects
     * based on some property value
     *
     * @param {array} targetArray array to search
     * @param {string} objProperty object property to search
     * @param {string} value of the property to search for
     * @return {integer} index of first instance if found, otherwise returns -1
    */
    function findObjectInArray(targetArray, objProperty, value) {
        var i, totalItems = targetArray.length, objFound = false;
        for (i = 0; i < totalItems; i++) {
            if (targetArray[i][objProperty] === value) {
                objFound = true;
                return i;
            }
        }
        if (objFound === false) {
            return -1;
        }
    }

    /**
     * Builds the API requests and handles responses
     * @param {String} type the request type (getCount | getVideos | getAnalytics)
     */
    function buildRequest(type) {
        var requestOptions = {}, tmpArray;
        // add credentials if submitted
        if (isDefined(client_id) && isDefined(client_secret)) {
            requestOptions.client_id = client_id;
            requestOptions.client_secret = client_secret;
        }
        switch (type) {
            case 'getCount':
                requestOptions.url = 'https://cms.api.brightcove.com/v1/accounts/' + account_id + '/counts/videos?q=published_at:..' + lastPublishedDate;
                $request.textContent = requestOptions.url;
                getData(requestOptions, type, function(response) {
                    totalVideos = response.count;
                    buildRequest('getVideos');
                });
                break;
            case 'getVideos':
                totalVideoCalls = Math.ceil(totalVideos / limit);
                requestOptions.url = 'https://cms.api.brightcove.com/v1/accounts/' + account_id + '/videos?q=published_at:..' + lastPublishedDate + '&limit=' + limit + '&offset=' + (limit * callNumber) + '&sort=published_at';
                getData(requestOptions, type, function(response) {
                    // add the current item array to overall one
                    videoData = videoData.concat(response);
                    callNumber++;
                    if (callNumber < totalVideoCalls) {
                        // still have more videos to get
                        buildRequest('getVideos');
                    } else {
                        videoData.forEach(function(video, index, videoData) {
                            // initialize the analytics data for each video
                            video.video_view = 0;
                            video.engagement_score = 0;
                            video.video_percent_viewed = 0;
                            // add the video id to the video ids array
                            videoIdsArray.push(video.id);
                        });
                        // reset callNumber
                        callNumber = 0;
                        buildRequest('getAnalytics');
                    }
                });
                break;
            case 'getAnalytics':
                // because of URL length restrictions, we can get up to 150 videos at a time
                totalAnalyticsCalls = Math.ceil(videoIdsArray.length / 150);
                tmpArray = videoIdsArray.slice((callNumber * 150), ((callNumber * 150) + 150));
                account_id = (isDefined(accountID.value)) ? accountID.value : account_id;
                minViews = $includeVideos.value;
                requestOptions.url = 'https://analytics.api.brightcove.com/v1';
                requestOptions.url += '/data?accounts=' + account_id + '&dimensions=video';
                // add where filter
                requestOptions.url += '&where=video==' + tmpArray.join(',');
                // add from date
                requestURL += '&from=' + from;
                // add fields
                requestURL += '&fields=video,engagement_score,video_view,video_percent_viewed';
                $request.textContent = requestOptions.url;
                $request.setAttribute('value', requestURL);
                getData(requestOptions, type, function(response) {
                    analyticsData = analyticsData.concat(response.items);
                    callNumber++;
                    if (callNumber < totalAnalyticsCalls) {
                        buildRequest('getAnalytics');
                    } else {
                        bclslog('analyticsData', analyticsData);
                    }
                });
                break;
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
                      bclslog('httpRequest.responseText', httpRequest.responseText);
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
        bclslog('requestParams', requestParams);

        // set response handler
        httpRequest.onreadystatechange = getResponse;
        // open the request
        httpRequest.open('POST', proxyURL);
        // set headers
        httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        // open and send request
        httpRequest.send(requestParams);
    }

    // convert data to CSV
    function jsonToCSV() {
        // templates are built dynamically to allow for additional fields added later
        var headersRow = '';
        $responseFrame.textContent = 'Loading CSV data...';
        $responseFrame.textContent = str;
    }

    // set event listeners
    useMyAccount.addEventListener('click', function () {
        if (basicInfo.getAttribute('style') === 'display:none;') {
            basicInfo.setAttribute('style', 'display:block;');
            useMyAccount.innerHTML = 'Use Sample Account';
        } else {
            basicInfo.setAttribute('style', 'display:none;');
            useMyAccount.innerHTML = 'Use My Account Instead';
        }
    });
    // send request
    $submitButton.addEventListener('click', function () {
        // get input values
        if (isDefined($client_id.value)) {
            client_id = $client_id.value;
        }
        if (isDefined($client_secret.value)) {
            client_secret = $client_secret.value;
        }
        if (isDefined(accountID.value)) {
            account_id = accountID.value;
        }
        from = now.valueOf() - ($fromMonths.value * mMonth);
        oldestPubDate = now.valueOf() - ($excludeMonths.value * mMonth);
        lastPublishedDate = new Date(oldestPubDate).toISOString();
        bclslog('lastPublishedDate', lastPublishedDate);
        minViews = $includeVideos.value;
        // generate initial request
        // if total videos not defined, get count
        if ($totalVideos.value !== 'all') {
            totalVideos = $totalVideos.value;
            buildRequest('getVideos');
        } else {
            buildRequest('getCount');
        }
    });
    // convert to csv
    $csvButton.addEventListener('click', jsonToCSV);
    // select all the data
    $selectData.addEventListener('click', function () {
        document.getElementById('responseFrame').select();
    });
    // set initial value of from
    from = now.valueOf() - mMonth;

    return {
        buildRequest: buildRequest
    };
})(window, document);
