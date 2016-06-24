var BCLS = (function ($, window, datepickr) {
"use strict";
var proxyURL = "https://solutions.brightcove.com/bcls/bcls-proxy/bcls-proxy.php",
    useMyAccount = document.getElementById("useMyAccount"),
    basicInfo = document.getElementById("basicInfo"),
    $accountID = $("#accountID"),
    accountID = "1752604059001",
    $client_id = $("#client_id"),
    client_id = "f3959ced-7046-4e83-866c-aac17ec91303",
    $client_secret = $("#client_secret"),
    client_secret = "DFy3xvhS6xyPQSwAM7ahoEmvZFPhGgpQYraaEEc3DCYzNuXytSnQxIXRd-0GuKRDTYpxUwqI3iorMv5geEqCZA",
    $requestType = $("#requestType"),
    to = document.getElementById("to"),
    from = document.getElementById("from"),
    now = new Date(),
    nowMS = now.valueOf(),
    fromMS = nowMS - (30 * 24 * 60 * 60 * 1000),
    fromDate = new Date(fromMS),
    nowISO = now.toISOString(),
    fromISO = fromDate.toISOString(),
    $reference_id = $("#reference_id"),
    reference_id = "bison4825296720001,budapest1,budapest2",
    $request = $("#request"),
    $submitButton = $("#submitButton"),
    $selectData = $("#selectData"),
    $required = $(".required"),
    $requestInputs = $(".aapi-request"),
    $responseFrame = $("#responseFrame"),
    $this,
    requestURL = "",
    endDate = "",
    startDate = "",
    // functions
    removeSpaces,
    buildRequest,
    isDefined,
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

// more robust test for strings "not defined"
isDefined =  function (v) {
    if (v !== "" && v !== null && v !== "undefined" && v !== undefined) {
        return true;
    } else { return false; }
};

// remove space after comma and URI encode
removeSpaces = function (str) {
    if (isDefined(str)) {
        str = str.replace(", ", ",");
        str = encodeURI(str);
        return str;
    }
};

// construct the request
buildRequest = function () {
    var account_id = (isDefined($accountID.val())) ? $accountID.val() : accountID,
    reference_ids = (isDefined($reference_id.val())) ? $reference_id.val().split(',') : reference_id.split(','),
    searchStr = '',
    i,
    iMax;
    iMax = reference_ids.length;
    for (i = 0; i < iMax; i++) {
        reference_ids[i] = 'reference_id:' + encodeURI(reference_ids[i]);
    }
    searchStr = reference_ids.join('+')
    // build the request
    requestURL = "https://analytics.api.brightcove.com/v1";
    requestURL += "/data?accounts=" + account_id + "&dimensions=video";
    // check for time filters
    startDate = from.value;
    if (startDate !== " ") {
        requestURL += "&from=" + startDate;
    }
    endDate = to.value;
    if (endDate !== " ") {
        requestURL += "&to=" + endDate;
    }
    // add limit and fields
    requestURL += "&limit=all&fields=engagement_score,play_rate,video,video_duration,video_engagement_1,video_engagement_100,video_engagement_25,video_engagement_50,video_engagement_75,video_impression,video_name,video_percent_viewed,video_seconds_viewed,video_view,video.reference_id";
    // add ref id filter
    requestURL += "&where=video.q==" + searchStr;
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
    // wait message
    $responseFrame.html("Loading...");
    $.ajax({
        url: proxyURL,
        type: "POST",
        data: options,
        success : function (data) {
            try {
               var data = JSON.parse(data);
            } catch (e) {
               alert('invalid json');
            }
            $responseFrame.html(JSON.stringify(data, null, '  '));
        },
        error : function (XMLHttpRequest, textStatus, errorThrown) {
            $responseFrame.html("Sorry, your request was not successful. Here's what the server sent back: " + errorThrown);
        }
    });
};
// add date pickers to the date input fields
datepickr(to, {
    'dateFormat': 'Y-m-d'
});
datepickr(from, {
    'dateFormat': 'Y-m-d'
});

to.addEventListener('change', buildRequest);
from.addEventListener('change', buildRequest);
// populate to/from fields with default values
nowISO = nowISO.substring(0, nowISO.indexOf("T"));
fromISO = fromISO.substring(0, fromISO.indexOf("T"));
to.value = nowISO;
from.value = fromISO;

// set event listeners
useMyAccount.addEventListener("click", function () {
    if (basicInfo.getAttribute('style') === 'display:none;') {
        basicInfo.setAttribute('style', 'display:block;');
        useMyAccount.innerHTML = "Use Sample Account";
    } else {
        basicInfo.setAttribute('style', 'display:none;');
        useMyAccount.innerHTML = "Use My Account Instead";
    }
});
// set listener for form fields
$requestInputs.on("change", buildRequest);
// send request
$submitButton.on("click", getData);
// select all the data
$selectData.on("click", function() {
    document.getElementById("responseFrame").select();
});
// generate initial request
buildRequest();
return {
    buildRequest: buildRequest
};
})($, window, datepickr);
