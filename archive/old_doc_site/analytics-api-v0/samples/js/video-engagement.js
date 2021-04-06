var BCLS = (function ($, window, AnyTime) {
    "use strict";
    var // media api stuff
        $pageSize = $("#pageSize"),
        $searchType = $("#searchType"),
        $searchTerms = $("#searchTerms"),
        $sortBy = $("#sortBy"),
        pageNumber = 0,
        totalPages = 0,
        $getVideosButton = $("#getVideosButton"),
        $videoSelector = $("#videoSelector"),
        $sortOrder = $("#sortOrder"),
        $mapitoken = $("#mapitoken"),
        $readApiLocation = $("#readApiLocation"),
        videoData,
        totalVideos = 0,
        params = {},
        videoOptionTemplate = "{{#items}}<option value=\"{{id}}\">{{name}}</option>{{/items}}",
        // aapi stuff
        $serviceURL = $("#serviceURL"),
        $accountID = $("#accountID"),
        $token = $("#token"),
        $startDate = $("#startDate"),
        $startTime = $("#startTime"),
        $endDate = $("#endDate"),
        $endTime = $("#endTime"),
        $whereInputs = $(".where-input"),
        $player = $("#player"),
        $video = $("#video"),
        $referrer_domain = $("#referrer_domain"),
        $source_type = $("#source_type"),
        $search_terms = $("#search_terms"),
        $requestButton = $("#requestButton"),
        $request = $("#request"),
        $authorization = $("#authorization"),
        $authorizationDisplay = $("#authorizationDisplay"),
        $requestForm = $("#requestForm"),
        $submitButton = $("#submitButton"),
        $required = $(".required"),
        $format = $("#format"),
        $requestInputs = $(".aapi-request"),
        $directVideoInput = $("#directVideoInput"),
        $responseFrame = $("#responseFrame"),
        $this,
        separator = "",
        requestTrimmed = false,
        lastChar = "",
        where = false,
        requestURL = "",
        authorization = "",
        endDate = "",
        startDate = "",
        rollupDimensionOptions = "<option value=\"account\">account</option>",
        reportDimensionOptions = "<option value=\"player\">player</option><option value=\"video\">video</option><option value=\"referrer_domain\">referrer_domain</option><option value=\"source_type\">source_type</option><option value=\"search_terms\">search_terms</option><option value=\"device_type\">device_type</option><option value=\"device_os\">device_os</option>",
        getVideos,
        onGetVideos,
        trimRequest,
        removeSpaces,
        buildRequest,
        isDefined,
        secondsToTime,
        makeEngagementGraph,
        getData,
        chartEngagement = "#chartEngagement",
        responseData;

    // allow array forEach method in older browsers
    if ( !Array.prototype.forEach ) {
        Array.prototype.forEach = function(fn, scope) {
            for(var i = 0, len = this.length; i < len; ++i) {
                fn.call(scope || this, this[i], i, this);
            }
        }
    }
    // utility to extract h/m/s from seconds
    secondsToTime = function (secs) {
        var hours, divisor_for_minutes, divisor_for_seconds, seconds, minutes, obj = {};
        hours = Math.floor(secs / (60 * 60));
        if (hours < 10 ) {
            hours = "0" + hours.toString();
        } else {
            hours = hours.toString();
        };
        divisor_for_minutes = secs % (60 * 60);
        minutes = Math.floor(divisor_for_minutes / 60);
        if (minutes < 10 ) {
            minutes = "0" + minutes.toString();
        } else {
            minutes = minutes.toString();
        };
        divisor_for_seconds = divisor_for_minutes % 60;
        seconds = Math.ceil(divisor_for_seconds);
        if (seconds < 10) {
            seconds = "0" + seconds.toString();
        } else {
            seconds = seconds.toString();
        };
        obj = {
            "h": hours,
            "m": minutes,
            "s": seconds
        };
        return obj;
    }
    // more robust test for strings "not defined"
    isDefined =  function (v) {
        if(v !== "" && v !== null && v !== "undefined") { return true; }
        else { return false; }
    }
    // remove spaces from string
    removeSpaces = function (str) {
        if (isDefined(str)) {
            str = str.replace(/\s+/g, '');
        return str;
        }
    }
    // create graph
    makeEngagementGraph = function(jsonObject) {
        var options = {pointDot : false}, chartData = {}, labels = [], data = [], video_engagement = jsonObject.metrics.video_engagement.series.values, video_duration = jsonObject.video_duration, series = {}, video_name = jsonObject.video_name, options = {pointDot : false}, ctx, myNewChart;
        // process response data
        video_engagement.forEach( function (element, index, array) {
            var timeformatted = secondsToTime((index * video_duration) / 100);
            if ((index + 1) % 10 === 0) {
                labels[index] = timeformatted.m + ":" + timeformatted.s;
            } else {
                labels[index] = "";
            }

            data[index] = element;
        });
        // chartData
        chartData = {
            labels : labels,
            datasets : [
                {
                    fillColor : "rgba(151,187,205,0.5)",
                    strokeColor : "rgba(151,187,205,1)",
                    pointColor : "rgba(151,187,205,1)",
                    pointStrokeColor : "#fff",
                    data : data
                }
            ]
        }
        //Get the context of the canvas element we want to select
        ctx = document.getElementById("chartEngagement").getContext("2d");
        myNewChart = new Chart(ctx).Line(chartData, options);
    }
    getVideos = function () {
        var searchTerms = $searchTerms.val(),
            searchTermsArray = searchTerms.split(","),
            searchType = $searchType.val();
        // hide the direct video input
        $directVideoInput.hide();
        BCMAPI.url = $readApiLocation.val();
        BCMAPI.callback = "BCLS.onGetVideos";
        BCMAPI.token = $mapitoken.val();
        params.page_number = pageNumber;
        params.page_size = $pageSize.val();
        params.sort_by = $sortBy.val() + ":" + $sortOrder.val();
        params.video_fields = "id,name";
        params.get_item_count = true;
        if (searchTerms !== "") {
            if (searchType !== "") {
                searchTermsArray.forEach(function (element, index, array) {
                    element = searchType + ":" + element;
                });
            }
            params.any = searchTerms;
        }
        BCMAPI.search(params);
        pageNumber++;
    }
    onGetVideos = function(JSONdata) {
        var template, data, result;
        videoData = JSONdata;
        totalVideos += JSONdata.total_count;
        totalPages = Math.ceil(JSONdata.total_count / $pageSize.val());
        if (totalPages === pageNumber) {
            $getVideosButton.html("No more videos");
            $getVideosButton.off("click", this.getVideos);
        } else {
            $getVideosButton.html("Get the next " + $pageSize.val() + " videos");
        }
        template = Handlebars.compile(videoOptionTemplate);
        data = JSONdata;
        result = template(data);
        $videoSelector.html(result);
        buildRequest();
    }
    trimRequest = function () {
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

    buildRequest = function () {
        // reset where to false in case this is a new request
        where = false;
        // check for required fields
        $required.each(function () {
            $this = $(this);
            if ($this.val === "") {
                window.alert("You must provide a service URL, account ID, and a token");
                // stop right here
                return;
            }
        });
        // reset requestTrimmed to false in case of regenerate request
        requestTrimmed = false;
        // build the request
        authorization = "Bearer " + removeSpaces($token.val());
        requestURL = $serviceURL.val();
        requestURL += "/accounts/" + removeSpaces($accountID.val()) + "/?";
        // check for time filters
        startDate = $startDate.val() + " " + $startTime.val();
        if (startDate !== " ") {
            startDate = new Date(startDate).getTime();
            requestURL += "from=" + startDate + "&";
        }
        endDate = $endDate.val() + " " + $endTime.val();
        if (endDate !== " ") {
            endDate = new Date(endDate).getTime();
            requestURL += "to=" + endDate + "&";
        }
        // check for where filters
        $whereInputs.each(function () {
            var dimension;
            $this = $(this);
            dimension = $this.attr("id");
            if (dimension === "videoSelector") {
                dimension = "video";
            }
            if (isDefined($this.val())) {
                if (!where) {
                    requestURL += "where=";
                    where = true;
                }
                requestURL += dimension + "==" + removeSpaces($this.val()) + ";";
            }
        });
        // end the where filters
        requestURL += "&";
        trimRequest();
        $request.html(requestURL);
        $authorizationDisplay.html(authorization);
        $request.attr("value", requestURL);
        $authorization.attr("value", authorization);
    }
    // submit request
    getData = function () {
        var format = $format.val();
        $.ajax({
            url: $request.attr("value"),
            headers: {
                Authorization : $authorization.attr("value")
            },
            success : function(data) {
                makeEngagementGraph(data);
                $responseFrame.html(BCLSformatJSON.formatJSON(data));
            }
        })
    }
    // set up the anytime date/time pickers
    AnyTime.picker("startDate", {
        format: "%a %M %d %Y"
    });
    AnyTime.picker("startTime", {
        format: "%H:%i:%s %@",
        labelTitle: "Time",
        labelHour: "Hour",
        labelMinute: "Minute"
    });
    AnyTime.picker("endDate", {
        format: "%a %M %d %Y"
    });
    AnyTime.picker("endTime", {
        format: "%H:%i:%s %@",
        labelTitle: "Time",
        labelHour: "Hour",
        labelMinute: "Minute"
    });

    // set event listeners
    // if we get a mapi token , hide direct input of video id
    $mapitoken.on("change", function () {
        $directVideoInput.hide();
    });
    // listener for videos request
    $getVideosButton.on("click", getVideos);
    // set listener for form fields
    $requestInputs.on("change", buildRequest);
    // rebuild request when video selector changes
    $videoSelector.on("change", buildRequest);
    // in case search terms added after initial video retrieval
    $searchTerms.on("change", function () {
        // re-initialize
        pageNumber = 0;
        totalPages = 0;
    });
    // send request
    $submitButton.on("click", getData);

    // generate initial request
    // buildRequest();
    return {
        buildRequest: buildRequest,
        onGetVideos: onGetVideos
    }
})($, window, AnyTime);