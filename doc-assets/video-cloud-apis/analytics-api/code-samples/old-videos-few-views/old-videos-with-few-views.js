var BCLS = (function (window, document) {
    "use strict";
    var videoData = [],
        itemsArray = [],
        lastPublishedDate,
        totalVideos = null,
        videoCount = 0,
        totalVideoCalls = 0,
        callNumber = 0,
        pageNumber = 0,
        params = {},
        // aapi stuff
        proxyURL = "https://solutions.brightcove.com/bcls/bcls-proxy/non-performing-videos-proxy.php",
        useMyAccount = document.getElementById("useMyAccount"),
        basicInfo = document.getElementById("basicInfo"),
        accountID = document.getElementById('accountID'),
        account_id = "1752604059001",
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
        lastChar = "",
        requestURL = "",
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
        if (window["console"] && console["log"]) {
          console.log(context, message);
        }
        return;
    };


    // more robust test for strings "not defined"
    function isDefined(v) {
        if (v === "" || v === null || v === undefined || v === NaN) {
            return false;
        }
        return true;
    }

    function removeSpaces(str) {
        if (isDefined(str)) {
            str = str.replace(/\s+/g, "");
            return str;
        }
    }

    function trimRequest() {
        if (!requestTrimmed) {
            lastChar = requestURL.charAt((requestURL.length - 1));
            if (lastChar === "?" || lastChar === "&" || lastChar === ";") {
                requestURL = requestURL.substring(0, (requestURL.length - 1));
                // recall this function until trim finished
                trimRequest(requestURL);
            } else if (requestURL.indexOf("&&") > -1) {
                requestURL = requestURL.replace("&&", "&");
            } else if (requestURL.indexOf("?&") > -1) {
                requestURL = requestURL.replace("?&", "?");
            } else {
                requestTrimmed = true;
            }
        }
    }
    // construct the request
    function buildRequest(type) {
        var requestOptions = {}, i, iMax;
        // add credentials if submitted
        if (isDefined(client_id) && isDefined(client_secret)) {
            requestOptions.client_id = client_id;
            requestOptions.client_secret = client_secret;
        }
        switch (type) {
            case 'getCount':
                requestOptions.url = 'https://cms.api.brightcove.com/v1/accounts/' + account_id + '/counts/videos?q=created_at:' + encodeURI(lastPublishedDate);
                $request.textContent = requestOptions.url;
                getData(requestOptions, type, function(response) {
                    totalVideos = response.count;
                    buildRequest('getVideos');
                });
                break;
            case 'getVideos':
                totalVideoCalls = Math.ceil(totalVideos / limit);
                requestOptions.url = 'https://cms.api.brightcove.com/v1/accounts/' + account_id + '/videos?limit=' + limit + '&offset=' + (limit * callNumber);
                getData(requestOptions, type, function(response) {
                    videoData = videoData.concat(response);
                    callNumber++;
                    if (callNumber < totalVideoCalls) {
                        buildRequest('getVideos');
                    } else {
                        videoData.forEach(function(video, index, videoData) {
                            video.video_view = 0;
                            video.engagement_score = 0;
                            video.video_percent_viewed = 0;
                        });
                        buildRequest('getAnalytics');
                    }
                });
                break;
            case 'getAnalytics':
                totalAnalyticsCalls = Math.ceil(totalVideos / limit);
                account_id = (isDefined(accountID.value)) ? accountID.value : account_id;
                minViews = $includeVideos.value;
                requestURL = "https://analytics.api.brightcove.com/v1";
                requestURL += "/data?accounts=" + account_id + "&dimensions=video";
                requestURL += "&from=" + from;
                // add fields
                requestURL += "&fields=video,engagement_score,video_view,video_percent_viewed";
                $request.textContent = requestURL;
                $request.setAttribute("value", requestURL);
                getData();
                break;
        }

    }
    // submit request
    function oldgetData() {
        var itemsMax, item, video, options = {}, data;
        // clear the results frame
        $responseFrame.html("Loading...");
        options.client_id = (isDefined($client_id.value)) ? $client_id.value : client_id;
        options.client_secret = (isDefined($client_secret.value)) ? $client_secret.value : client_secret;
        options.url = $request.value;
        options.requestType = "GET";
        options.requestBody = null;
        bclslog("options", options);
        $.ajax({
            url: proxyURL,
            type: "POST",
            data: options,
            success: function (jsondata) {
                bclslog("aapi call complete");
                try {
                  data = JSON.parse(jsondata);
                } catch (e) {
                  alert('invalid json');
                }
                minViews = $includeVideos.value;
                itemsMax = data.items.length;
                // add analytics data to video data
                for (i = 0; i < itemsMax; i++) {
                    item = data.items[i];
                    if (isDefined(videoData[parseInt(item.video)])) {
                        videoData[item.video].engagement_score = item.engagement_score;
                        videoData[item.video].video_view = item.video_view;
                        videoData[item.video].average_percent_viewed = item.video_percent_viewed / item.video_view;
                    }
                }
                // convert it to a simple array to make conversion to CSV easier
                for (video in videoData) {
                    itemsArray.push(videoData[video]);
                }
                analyticsCallNumber++;
                if (analyticsCallNumber < totalAnalyticsCalls) {
                    buildRequest();
                } else {
                    itemsMax = itemsArray.length;
                    // assume videos not returned in analytics data had 0 views
                    for (i = 0; i < itemsMax; i++) {
                        video = itemsArray[i];
                        if (!video.hasOwnProperty("video_view")) {
                            video.engagement_score = 0;
                            video.video_view = 0;
                            video.average_percent_viewed = 0;
                        }
                    }
                    // remove videos above the views minimum
                    i = itemsArray.length;
                    while (i--) {
                        video = itemsArray[i];
                        if (video.video_view > minViews) {
                            itemsArray.splice(i, 1);
                        }
                    }
                    // remove items if the published date is too new
                    i = itemsArray.length;
                    while (i--) {
                        video = itemsArray[i];
                        if (video.publishedDate > oldestPubDate) {
                            itemsArray.splice(i, 1);
                        }
                    }
                    $responseFrame.html(JSON.stringify(itemsArray, null, '  '));
                }

            },
            error : function (XMLHttpRequest, textStatus, errorThrown) {
                $responseFrame.html("Sorry, your request was not successful. Here's what the server sent back: " + errorThrown);
            }
        });
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
                      switch (type) {
                          case 'getCount':
                              parsedData = JSON.parse(httpRequest.responseText);
                              callback(parsedData);
                              break;
                          case 'getVideos':

                              break;
                          case 'getAnalytics':

                      }
                    } else {
                      alert('There was a problem with the request. Request returned ' + httpRequest.status);
                    }
                  }
                } catch (e) {
                  alert('Caught Exception: ' + e);
                }
            };
            // set up request data
        requestParams = "url=" + encodeURIComponent(options.url) + "&requestType=GET";
        if (options.client_id && options.client_secret) {
            requestParams += "&client_id=" + options.client_id + '&client_secret=' + options.client_secret;
        }
        bclslog('requestParams', requestParams);

        // set response handler
        httpRequest.onreadystatechange = getResponse;
        // open the request
        httpRequest.open('POST', proxyURL);
        // set headers
        httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        // open and send request
        httpRequest.send(requestParams);
    }

    // convert data to CSV
    function jsonToCSV() {
        // templates are built dynamically to allow for additional fields added later
        var headersRow = "", rowTemplate = "{{#items}}", property, template, results, str = "", obj = {};
        obj.items = itemsArray;
        $responseFrame.html("Loading CSV data...");
        for (property in obj.items[0]) {
            headersRow += "\"" + property + "\",";
            rowTemplate += "\"{{" + property + "}}\",";
        }
        headersRow += " \r";
        rowTemplate += "\r{{/items}}";
        str = headersRow;
        template = Handlebars.compile(rowTemplate);
        results = template(obj);
        str += results;
        $responseFrame.html(str);
    }

    // set event listeners
    useMyAccount.addEventListener("click", function () {
        if (basicInfo.getAttribute('style') === "display:none;") {
            basicInfo.setAttribute('style', 'display:block;');
            useMyAccount.innerHTML = "Use Sample Account";
        } else {
            basicInfo.setAttribute('style', 'display:none;');
            useMyAccount.innerHTML = "Use My Account Instead";
        }
    });
    // send request
    $submitButton.addEventListener("click", function () {
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
    $csvButton.addEventListener("click", jsonToCSV);
    // select all the data
    $selectData.addEventListener("click", function () {
        document.getElementById("responseFrame").select();
    });
    // set initial value of from
    from = now.valueOf() - mMonth;

    return {
        buildRequest: buildRequest
    };
})(window, document);
