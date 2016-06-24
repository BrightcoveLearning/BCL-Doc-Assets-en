var BCLS = (function ($, window) {
    "use strict";
    var // aapi stuff
        useMyAccount = document.getElementById("useMyAccount"),
        basicInfo = document.getElementById("basicInfo"),
        proxyURL = "https://solutions.brightcove.com/bcls/bcls-proxy/bcls-proxy.php",
        $accountID = $("#accountID"),
        account_id = "20318290001",
        $client_id = $("#client_id"),
        client_id = "742d6440-58d1-49ed-b2fb-f60d33bf02ae",
        $client_secret = $("#client_secret"),
        client_secret = "xs3vuzzKPz5fWHInsON26SXOL54X1GObFW70KylVqdVuIHdkqwqlCs9yVSCRF3i5u_0NcNb7MrzntCLaveZmeQ",
        $scopeSelect = $("#scopeSelect"),
        scope = "account",
        $playerID = $("#playerID"),
        player_id = "baf68072-fb1a-4461-a00c-72b8a7f4cb10",
        $videoID = $("#videoID"),
        video_id = "821141023001",
        $pid = $("#pid"),
        $vid = $("#vid"),
        $requestButton = $("#requestButton"),
        $request = $("#request"),
        $submitButton = $("#submitButton"),
        $required = $(".required"),
        $requestInputs = $(".aapi-request"),
        $responseFrame = $("#responseFrame"),
        $this,
        requestURL = "",
        chartEngagement = "#chartEngagement",
        responseData,
        // functions
        isDefined,
        makeEngagementGraph,
        buildRequest,
        getData,
        bclslog;

    /**
     * Logging function - safe for IE
     * @param  {string} context description of the data
     * @param  {*} message the data to be logged by the console
     * @return {}
     */
    bclslog = function (context, message) {
        if (window["console"] && console["log"]) {
          console.log(context, message);
        }
        return;
    };

    // allow array forEach method in older browsers
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function (fn, scope) {
            for (var i = 0, len = this.length; i < len; ++i) {
                fn.call(scope || this, this[i], i, this);
            }
        };
    }
    // more robust test for strings "not defined"
    isDefined =  function (v) {
        if(v !== "" && v !== null && v !== "undefined") { return true; }
        else { return false; }
    };

    // create graph
    makeEngagementGraph = function(jsonObject) {
        var options = {pointDot : false},
            chartData = {},
            labels = [],
            data = [],
            video_engagement = jsonObject.timeline.values,
            video_duration = 100,
            series = {},
            video_name = jsonObject.video_name,
            ctx,
            myNewChart;
        // process response data
        video_engagement.forEach( function (element, index, array) {
            if ((index) % 10 === 0) {
                labels[index] = index + "%";
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
        };
        //Get the context of the canvas element we want to select
        ctx = document.getElementById("chartEngagement").getContext("2d");
        myNewChart = new Chart(ctx).Line(chartData, options);
    };

    buildRequest = function () {
        var account = (isDefined($accountID.val())) ? $accountID.val() : account_id,
            player = (isDefined($playerID.val())) ? $playerID.val() : player_id,
            video = (isDefined($videoID.val())) ? $videoID.val() : video_id;

        // build the request
        requestURL = "https://analytics.api.brightcove.com/v1";
        requestURL += "/engagement/accounts/" + account;
        if (scope === "players") {
            requestURL += "/players/" + player;
        } else if (scope === "videos") {
            requestURL+= "/videos/" + video;
        }
        $request.html(requestURL);
        $request.attr("value", requestURL);
    };
    // submit request
    getData = function () {
        var options = {};
        options.client_id = (isDefined($client_id.val())) ? $client_id.val() : client_id;
        options.client_secret = (isDefined($client_secret.val())) ? $client_secret.val() : client_secret;
        options.url = $request.val();
        options.requestType = "GET";
        options.requestBody = null;
        bclslog("options", options);
        $.ajax({
            url: proxyURL,
            method: "POST",
            data: options,
            success : function (data) {
                try {
                   data = JSON.parse(data);
                } catch (e) {
                   alert('invalid json');
                }

                $responseFrame.html(JSON.stringify(data, null, '  '));
                makeEngagementGraph(data);
            }
        });
    };
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
    // listener for videos request
    $requestInputs.on("change", buildRequest);
    // rebuild request when scope selector changes
    $scopeSelect.on("change", function (evt) {
        scope = $scopeSelect.val();
        if (scope === "account") {
            $vid.hide();
            $pid.hide();
        } else if (scope === "players") {
            $vid.hide();
        } else if (scope === "videos") {
            $pid.hide();
        }
        buildRequest();
    });
    // send request
    $submitButton.on("click", getData);

    // generate initial request
    buildRequest();
    return {
        buildRequest: buildRequest
    };
})($, window);
