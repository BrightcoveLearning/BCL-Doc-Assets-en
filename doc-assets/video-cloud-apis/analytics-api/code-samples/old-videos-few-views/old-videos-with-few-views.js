var BCLS = (function (window, document) {
    "use strict";
    var videoData = {},
        itemsArray = [],
        totalVideos = null,
        firstRun = true,
        videoCount = 0,
        pageNumber = 0,
        params = {},
        // aapi stuff
        proxyURL = "https://solutions.brightcove.com/bcls/bcls-proxy/non-performing-videos-proxy.php",
        useMyAccount = document.getElementById("useMyAccount"),
        basicInfo = document.getElementById("basicInfo"),
        accountID = document.getElementById('accountID'),
        account_id = "20318290001",
        $client_id = document.getElementById('client_id'),
        $client_secret = document.getElementById('client_secret'),
        client_id,
        client_secret,
        $totalVideos = document.getElementById('totalVideos'),
        // $limitText = $("#limitText"),
        // $offset = $("#offset"),
        // $offsetText = $("#offsetText"),
        limit = 25,
        $fromMonths = document.getElementById('fromMonths'),
        $excludeMonths = document.getElementById('excludeMonths'),
        $includeVideos = document.getElementById('includeVideos'),
        $request = document.getElementById('request'),
        $submitButton = document.getElementById('submitButton'),
        $csvButton = document.getElementById('csvButton'),
        $selectData = document.getElementById('selectData'),
        $required = document.getElementsByClassName('required'),
        $requestInputs = document.getElementsByClassName('aapi-request'),
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
    // more robust test for strings "not defined"
    function isDefined(v) {
        if (v === "" || v === null || v === undefined) {
            return false;
        }
        return true;
    }
    // get videos via MAPI
    function getVideos() {
        bclslog('$totalVideos', $totalVideos.value);
        BCMAPI.url = isDefined($readApiLocation.value) ? $readApiLocation.value : 'http://api.brightcove.com/services/library';
        BCMAPI.callback = "BCLS.addEventListenerGetVideos";
        BCMAPI.token = isDefined($mapitoken.value) ? $mapitoken.value : 'v87kWelIdjUwVm7_Rzv09k-KqtLz-ty8ONbMxVYAI7-Q0eOilegqqg..';
        params.page_number = pageNumber;
        params.page_size = 25;
        params.sort_by = "PUBLISH_DATE:ASC";
        params.video_fields = "id,referenceId,name,publishedDate";
        if (firstRun) {
            params.get_item_count = true;
        }

        bclslog('params', params);
        BCMAPI.search(params);

    }
    // handler for MAPI call
    function onGetVideos(JSONdata) {
        var itemsMax, item;
        bclslog("jsonData", JSONdata);
        if (isDefined(JSONdata.items)) {
            itemsMax = JSONdata.items.length;
        } else {
            itemsMax = 0;
        }
        videoCount += itemsMax;
        bclslog('videoCount', videoCount);
        for (i = 0; i < itemsMax; i++) {
            item = JSONdata.items[i];
            item.publishedDate = parseInt(item.publishedDate);
            videoData[item.id] = item;
        }
        bclslog('total_count', JSONdata.total_count);
        // for first run
        if (firstRun) {
            firstRun = false;
            if ($totalVideos.value === 'all') {
                totalVideos = JSONdata.total_count;
            } else {
                totalVideos = parseInt($totalVideos.value);
            }
            bclslog('totalVideos', totalVideos);
        }
        if (videoCount < totalVideos) {
            pageNumber++;
            bclslog('pageNumber', pageNumber);
            getVideos();
        } else {
            // $limitText.val(videoCount);
            // $submitButton.html("Generate Report");
            // $submitButton.addEventListener("click", getData);
            buildRequest();
        }
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
    function buildRequest() {
        // build the request
        totalAnalyticsCalls = Math.ceil(totalVideos / limit);
        account_id = (isDefined(accountID.value)) ? accountID.value : account_id;
        minViews = $includeVideos.value;
        requestURL = "https://analytics.api.brightcove.com/v1";
        requestURL += "/data?accounts=" + account_id + "&dimensions=video";
        requestURL += "&from=" + from;
        // check for limit and offset
        if ($totalVideos.value !== "") {
            requestURL += "&limit=" + limit + '&offset=' + limit * analyticsCallNumber;
        }
        // if ($offsetText.value !== "") {
        //     requestURL += "&offset=" + removeSpaces($offsetText.value);
        // } else if ($offset.value !== "") {
        //     requestURL += "offset=" + $offset.value;
        // }
        // add fields
        requestURL += "&fields=video,engagement_score,video_view,video_percent_viewed";
        // strip trailing ? or & and replace &&s
        $request.html(requestURL);
        $request.attr("value", requestURL);
        getData();
    }
    // submit request
    function getData() {
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
    function getMediaData(options, requestID, callback) {
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
                      if (requestID === 'cms' || requestID === 'removeVideoFromFolder') {
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
    $mapitoken.addEventListener("change", function () {
        videoData = {};
        // getVideos();
        // $submitButton.html("Getting video data...please wait...");
        // $submitButton.off("click", getData);
    });
    // listener for videos request
    $requestInputs.addEventListener("change", buildRequest);
    // listener for change in from months
    $fromMonths.addEventListener("change", function () {
        from = now.valueOf() - ($fromMonths.value * mMonth);
        buildRequest();
    });
    // listener for change in exclude months
    $excludeMonths.addEventListener("change", function () {
        oldestPubDate = now.valueOf() - ($excludeMonths.value * mMonth);
    });
    // listener for change in minimum views threshhold
    $includeVideos.addEventListener("change", function () {
        minViews = $includeVideos.value;
    });
    // send request
    $submitButton.addEventListener("click", function () {
        // make the Media API calls
        getVideos();
        // generate initial request
        buildRequest();
        getData();
    });
    // handler for totalVideos change
    $totalVideos.addEventListener('click', getVideos);
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
