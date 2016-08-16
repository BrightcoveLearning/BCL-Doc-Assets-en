var BCLS = (function (window, document, datepickr) {
    'use strict';
    var proxyURL = 'http://solutions.brightcove.com/bcls/bcls-proxy/geo-report-proxy.php',
        useMyAccount = document.getElementById('useMyAccount'),
        basicInfo = document.getElementById('basicInfo'),
        $accountID = document.getElementById('accountID'),
        account_id = '1752604059001',
        $client_id = $('#client_id'),
        $client_secret = $('#client_secret'),
        client_id = '',
        client_secret = '',
        $videoSelector = document.getElementById('videoSelector'),
        $geoSelector = document.getElementById('geoSelector'),
        $reportTableBody = document.getElementById('reportTableBody'),
        fromDatePickr = document.getElementById('fromDatePicker'),
        toDatePickr = document.getElementById('toDatePicker'),
        $getData = document.getElementById('getData'),
        $gettingDataDisplay = document.getElementById('gettingDataDisplay'),
        $video_player_info = document.getElementById('video_player_info'),
        $requestURL = document.getElementById('requestURL'),
        currentVideo,
        analyticsData = {},
        chartData = [],
        callType;
        /**
         * Logging function - safe for IE
         * @param  {string} context description of the data
         * @param  {*} message the data to be logged by the console
         * @return {}
         */
        function bclslog(context, message) {
            if (window['console'] && console['log']) {
              console.log(context, message);
            }
            return;
        }
        // more robust test for strings 'not defined'
        /**
         * tests for all the ways a variable might be undefined or not have a value
         * @param {*} x the variable to test
         * @return {Boolean} true if variable is defined and has a value
         */
        function isDefined(x) {
            if ( x === '' || x === null || x === undefined || x === NaN) {
                return false;
            }
            return true;
        }

        /**
         * get selected value for single select element
         * @param {htmlElement} e the select element
         * @return {Object} object containing the `value` and selected `index`
         */
        function getSelectedValue(e) {
            var val = e.options[e.selectedIndex].value,
                idx = e.selectedIndex;
            return {
                value: val,
                index: idx
            };
        }

        /**
         * builds the data display
         */
        function displayData() {
            var displayStr, template, results;
            currentVideo = $videoSelector.filter(':selected').text();
            displayStr = '';
            if (currentVideo !== '') {
                displayStr += 'Video: ' + currentVideo;
            }
            $video_player_info.textContent = displayStr;
            // table
            $reportTableBody.innerHTML = results;
            // chart
            $.plot('#chartView', [ chartData] , {
                series: {
                    bars: {
                        show: true,
                        barWidth: 0.6,
                        align: 'center'
                    }
                },
                xaxis: {
                    mode: 'categories',
                    tickLength: 0
                }
            });
        }

        /**
         * Builds the API requests and handles responses
         * @param {String} type the request type (getCount | getVideos | getAnalytics)
         */
        function buildRequest(type) {
            var requestOptions = {},
                tmpArray,
                newVideoItem = {},
                currentIndex,
                videoItem,
                newEl,
                i,
                frag = new DocumentFragment();
            // add credentials if submitted
            if (isDefined(client_id) && isDefined(client_secret)) {
                requestOptions.client_id = client_id;
                requestOptions.client_secret = client_secret;
            }
            switch (type) {
                case 'getVideos':
                requestOptions.url = 'https://analytics.api.brightcove.com/v1/data?accounts=' + account_id + '&dimensions=video&limit=all&fields=video,video_name&sort=video_view';
                $requestURL.textContent = requestOptions.url;
                getData(requestOptions, type, function(response) {
                    response.items.forEach(function(item, index, response.items) {
                        newEl = document.createElement('option');
                    });
                });
                    break;
                case 'getVideos':
                    requestOptions.url = 'https://analytics.api.brightcove.com/v1/data?accounts=' + accountID + '&dimensions=video&limit=all&fields=video,video_name&sort=video_view&from=' + $fromDatePickr.value + '&to=' + $toDatePickr.value;
                    getData(requestOptions, type, function(response) {
                        // add the current item array to overall one
                        response.forEach(function(video, index, response){
                            newVideoItem = {};
                            newVideoItem.id = video.id;
                            newVideoItem.name = video.name;
                            newVideoItem.published_at = video.published_at;
                            newVideoItem.video_view = 0;
                            newVideoItem.engagement_score = 0;
                            newVideoItem.video_percent_viewed = 0;
                            videoData.push(newVideoItem);
                            // add the video id to the video ids array
                            videoIdsArray.push(video.id);
                        });
                        callNumber++;
                        if (callNumber < totalVideoCalls) {
                            // still have more videos to get
                            buildRequest('getVideos');
                        } else {
                            // reset callNumber
                            callNumber = 0;
                            buildRequest('getAnalytics');
                        }
                    });
                    break;
                case 'getAnalytics':
                    break;
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


        // get the analytics data for the videos
        function getAnalyticsData() {
            var callURL;
            accountID = (isDefined($accountID.value)) ? $accountID.value : accountID;
            $gettingDataDisplay.text('Getting analytics data...');
            callType = 'analytics';
            currentVideo = $videoSelector.value;
            callURL = 'https://analytics.api.brightcove.com/v1/data?accounts=' + accountID + '&dimensions=' + $geoSelector.value + '&limit=all&fields=country,country_name,video_view,video_seconds_viewed';
            if (isDefined($fromDate.value)) {
                callURL += '&from=' + $fromDate.value;
            }
            if (isDefined($toDate.value)) {
                callURL += '&to=' + $toDate.value;
            }
            if (isDefined(currentVideo)) {
                callURL += '&where=video==' + currentVideo;
            }
            $requestURL.text(callURL);
            makeAnalyticsCall(callURL, callType);

        }
        /** get the videos for the time period
        * note the limit of 200 videos - to get more simply
        * change that value, or you could provide an additional field
        * to let the user decide how many to retrieve
        */
        function getVideoData() {
            var callURL = '';
            account_id = (isDefined($accountID.value)) ? $accountID.value : account_id;
            $gettingDataDisplay.text('Getting video data...');
            callType = 'videos';

            $requestURL.text(callURL);
            makeAnalyticsCall(callURL, callType);
        }
    // add date pickers to the date input fields
    datepickr (fromDatePickr, {
        'dateFormat': 'Y-m-d'
    });
    datepickr (toDatePickr, {
        'dateFormat': 'Y-m-d'
    });

    // set event listeners
    useMyAccount.addEventListener('click', function () {
        if (basicInfo.getAttribute('style') === 'display:none') {
            basicInfo.setAttribute('style', 'display:block');
            useMyAccount.textContent = 'Use Sample Account';
        } else {
            basicInfo.setAttribute('style', 'display:none');
            useMyAccount.textContent = 'Use My Account Instead';
        }

    });
    $videoSelector.addEventListener('change', function () {
        buildRequest('getAnalytics');
    });
    $getData.addEventListener('click', function() {
        account_id = (isDefined($accountID.value)) ? $accountID.value : account_id;
        $gettingDataDisplay.text('Getting video data...');
        buildRequest('getVideos');
    });

    return {};
})(window, document, datepickr);
