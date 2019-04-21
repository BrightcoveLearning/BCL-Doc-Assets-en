var BCLS = (function(window, document) {
  "use strict";
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
    proxyURL =
      "https://solutions.brightcove.com/bcls/bcls-proxy/bcls-proxy-v2.php",
    useMyAccount = document.getElementById("useMyAccount"),
    basicInfo = document.getElementById("basicInfo"),
    accountID = document.getElementById("accountID"),
    account_id = "1752604059001",
    $client_id = document.getElementById("client_id"),
    $client_secret = document.getElementById("client_secret"),
    client_id = null,
    client_secret = null,
    $totalVideos = document.getElementById("totalVideos"),
    limit = 25,
    $fromMonths = document.getElementById("fromMonths"),
    $excludeMonths = document.getElementById("excludeMonths"),
    $includeVideos = document.getElementById("includeVideos"),
    $request = document.getElementById("request"),
    $submitButton = document.getElementById("submitButton"),
    $csvButton = document.getElementById("csvButton"),
    $selectData = document.getElementById("selectData"),
    $responseFrame = document.getElementById("responseFrame"),
    mMonth = 2592000000,
    now = new Date(),
    from,
    oldestPubDate = now.valueOf() - $excludeMonths.value * mMonth,
    requestTrimmed = false,
    lastChar = "",
    requestURL = "",
    totalAnalyticsCalls = 0,
    analyticsCallNumber = 0,
    i,
    len,
    minViews = $includeVideos.value;

  // more robust test for strings 'not defined'
  function isDefined(v) {
    if (v === "" || v === null || v === undefined) {
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
      lastChar = requestURL.charAt(requestURL.length - 1);
      if (lastChar === "?" || lastChar === "&" || lastChar === ";") {
        requestURL = requestURL.substring(0, requestURL.length - 1);
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
    var i,
      totalItems = targetArray.length,
      objFound = false;
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
    var options = {},
      tmpArray,
      newVideoItem = {},
      currentIndex,
      videoItem,
      parsedData,
      i;
    options.account_id = account_id;
    options.proxyURL = proxyURL;
    // add credentials if submitted
    if (isDefined(client_id) && isDefined(client_secret)) {
      options.client_id = client_id;
      options.client_secret = client_secret;
    }
    switch (type) {
      case "getCount":
        options.url =
          "https://cms.api.brightcove.com/v1/accounts/" +
          account_id +
          "/counts/videos?q=published_at:.." +
          lastPublishedDate;
        $request.textContent = options.url;
        makeRequest(options, function(response) {
          parsedData = JSON.parse(response);
          totalVideos = parsedData.count;
          totalVideoCalls = Math.ceil(totalVideos / limit);
          buildRequest("getVideos");
        });
        break;
      case "getVideos":
        options.url =
          "https://cms.api.brightcove.com/v1/accounts/" +
          account_id +
          "/videos?q=published_at:.." +
          lastPublishedDate +
          "&limit=" +
          limit +
          "&offset=" +
          limit * callNumber +
          "&sort=published_at";
        makeRequest(options, function(response) {
          parsedData = JSON.parse(response);
          // add the current item array to overall one
          parsedData.forEach(function(video, index, response) {
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
            buildRequest("getVideos");
          } else {
            // reset callNumber
            callNumber = 0;
            totalAnalyticsCalls = Math.ceil(videoIdsArray.length / 150);
            buildRequest("getAnalytics");
          }
        });
        break;
      case "getAnalytics":
        // because of URL length restrictions, we can get up to 150 videos at a time
        tmpArray = videoIdsArray.slice(
          callNumber * 150,
          callNumber * 150 + 150
        );
        account_id = isDefined(accountID.value) ? accountID.value : account_id;
        minViews = parseInt($includeVideos.value);
        options.url = "https://analytics.api.brightcove.com/v1";
        options.url +=
          "/data?accounts=" + account_id + "&dimensions=video&limit=150";
        // add where filter
        options.url += "&where=video==" + tmpArray.join(",");
        // add from date
        options.url += "&from=" + from;
        // add fields
        options.url +=
          "&fields=video,engagement_score,video_view,video_percent_viewed";
        $request.textContent = options.url;
        $request.setAttribute("value", requestURL);
        makeRequest(options, function(response) {
          parsedData = JSON.parse(response);
          analyticsData = analyticsData.concat(parsedData.items);
          callNumber++;
          if (callNumber < totalAnalyticsCalls) {
            buildRequest("getAnalytics");
          } else {
            // remove items with more than the minimum views
            i = analyticsData.length;
            while (i > 0) {
              i--;
              if (analyticsData[i].video_view > minViews) {
                analyticsData.splice(i, 1);
              }
            }
            // update analytics properties in the video data
            analyticsData.forEach(function(item, index, analyticsData) {
              currentIndex = findObjectInArray(videoData, "id", item.video);
              videoItem = videoData[currentIndex];
              videoItem.video_view = item.video_view;
              // engagement score and percent viewed may be undefined
              videoItem.engagement_score = isDefined(videoItem.engagement_score)
                ? item.engagement_score
                : 0;
              videoItem.video_percent_viewed = isDefined(
                videoItem.video_percent_viewed
              )
                ? item.video_percent_viewed
                : 0;
            });
            // if video items did not show up in analytics results, engagement score and percent viewed may be undefined
            videoData.forEach(function(video, index, videoData) {
              if (!isDefined(video.engagement_score)) {
                video.engagement_score = 0;
              }
              if (!isDefined(video.video_percent_viewed)) {
                video.video_percent_viewed = 0;
              }
            });
            $responseFrame.textContent = JSON.stringify(videoData, null, "  ");
          }
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
              if (response === "{null}") {
                response = null;
              }
              // return the response
              callback(response);
            } else {
              alert(
                "There was a problem with the request. Request returned " +
                  httpRequest.status
              );
            }
          }
        } catch (e) {
          alert("Caught Exception: " + e);
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
    httpRequest.open("POST", proxyURL);
    // set headers if there is a set header line, remove it
    // open and send request
    httpRequest.send(JSON.stringify(options));
  }
  // convert data to CSV
  function jsonToCSV() {
    // templates are built dynamically to allow for additional fields added later
    var headersRow = "",
      textRows = "",
      tmpArray = [],
      prop,
      i,
      iMax,
      video,
      str;
    $responseFrame.textContent = "Loading CSV data...";
    // build header row
    headersRow =
      '"ID","Name","Published Date","Video Views","Engagement Score","Video Percent Viewed" \n';
    // build rows
    tmpArray = [];
    iMax = videoData.length;
    for (i = 0; i < iMax; i++) {
      video = videoData[i];
      tmpArray = [
        video.id,
        video.name,
        video.published_at,
        video.video_view,
        video.engagement_score,
        video.video_percent_viewed
      ];
      textRows += '"' + tmpArray.join('","') + '"\n';
    }
    str = headersRow + textRows;
    $responseFrame.textContent = str;
  }

  // set event listeners
  useMyAccount.addEventListener("click", function() {
    if (basicInfo.getAttribute("style") === "display:none;") {
      basicInfo.setAttribute("style", "display:block;");
      useMyAccount.innerHTML = "Use Sample Account";
    } else {
      basicInfo.setAttribute("style", "display:none;");
      useMyAccount.innerHTML = "Use My Account Instead";
    }
  });
  // send request
  $submitButton.addEventListener("click", function() {
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
    from = now.valueOf() - $fromMonths.value * mMonth;
    oldestPubDate = now.valueOf() - $excludeMonths.value * mMonth;
    lastPublishedDate = new Date(oldestPubDate).toISOString();
    minViews = $includeVideos.value;
    // generate initial request
    // if total videos not defined, get count
    if ($totalVideos.value !== "all") {
      totalVideos = $totalVideos.value;
      buildRequest("getVideos");
    } else {
      buildRequest("getCount");
    }
  });
  // convert to csv
  $csvButton.addEventListener("click", jsonToCSV);
  // select all the data
  $selectData.addEventListener("click", function() {
    document.getElementById("responseFrame").select();
  });
  // set initial value of from
  from = now.valueOf() - mMonth;

  return {
    buildRequest: buildRequest
  };
})(window, document);

