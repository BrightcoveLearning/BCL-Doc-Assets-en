var BCLS = (function(window, document, Pikaday) {
  'use strict';
  var proxyURL = 'https://solutions.brightcove.com/bcls/bcls-proxy/doc-samples-proxy-v2.php',
    useMyAccount = document.getElementById('useMyAccount'),
    basicInfo = document.getElementById('basicInfo'),
    $accountID = document.getElementById('accountID'),
    account_id = '1752604059001',
    $client_id = document.getElementById('client_id'),
    $client_secret = document.getElementById('client_secret'),
    client_id = '',
    client_secret = '',
    $videoSelector = document.getElementById('videoSelector'),
    $reportTableBody = document.getElementById('reportTableBody'),
    fromDatePicker = document.getElementById('fromDatePicker'),
    toDatePicker = document.getElementById('toDatePicker'),
    getData = document.getElementById('getData'),
    $gettingDataDisplay = document.getElementById('gettingDataDisplay'),
    video_info = document.getElementById('video_info'),
    $requestURL = document.getElementById('requestURL'),
    currentVideo,
    currentVideoObj,
    analyticsData = {},
    chartData = [],
    callType,
    fromPicker,
    toPicker,
    now = new Date(),
    nowMS = now.valueOf(),
    then = new Date(nowMS - (1000 * 60 * 60 * 24 * 30)), // 30 days ago in milliseconds
    nowISO = now.toISOString().substr(0, 10), // get the date part of the date-time string
    thenISO = then.toISOString().substr(0, 10); // get the date part of the date-time string

  // more robust test for strings 'not defined'
  /**
   * tests for all the ways a variable might be undefined or not have a value
   * @param {*} x the variable to test
   * @return {Boolean} true if variable is defined and has a value
   */
  function isDefined(x) {
    if (x === '' || x === null || x === undefined) {
      return false;
    }
    return true;
  }

  /**
   * get selected value for single select element
   * @param {htmlElement} e the select element
   * @return {Object} object containing the `value` and selected `index`, and the option text
   */
  function getSelectedValue(e) {
    var val = e.options[e.selectedIndex].value,
      txt = e.options[e.selectedIndex].textContent,
      idx = e.selectedIndex;
    return {
      value: val,
      text: txt,
      index: idx
    };
  }

  /**
   * builds the data display
   * @param {Object[]} array of analytics items
   */
  function displayData(items) {
    var newTr,
      newTd,
      txt,
      results = new DocumentFragment();
    // display the video info
    video_info.textContent = 'Video: ' + currentVideoObj.text + ' (' + currentVideoObj.value + ')';
    items.forEach(function(item, index, items) {
      newTr = document.createElement('tr');
      newTd = document.createElement('td');
      txt = document.createTextNode(item.country_name);
      newTd.appendChild(txt);
      newTr.appendChild(newTd);
      newTd = document.createElement('td');
      txt = document.createTextNode(item.video_view);
      newTd.appendChild(txt);
      newTr.appendChild(newTd);
      newTd = document.createElement('td');
      txt = document.createTextNode(item.video_seconds_viewed);
      newTd.appendChild(txt);
      newTr.appendChild(newTd);
      results.appendChild(newTr);
    });
    $reportTableBody.appendChild(results);
  }

  /**
   * Builds the API requests and handles responses
   * @param {String} type the request type (getCount | getVideos | getAnalytics)
   */
  function buildRequest(type) {
    var options = {},
      parsedData,
      tmpArray,
      newVideoItem = {},
      videoItem,
      newEl,
      txt,
      i,
      iMax,
      item,
      fields,
      frag = new DocumentFragment();
    // add credentials if submitted
    if (isDefined(client_id) && isDefined(client_secret)) {
      options.client_id = client_id;
      options.client_secret = client_secret;
    }
    options.account_id = account_id;
    options.proxyURL = proxyURL;
    switch (type) {
      case 'getVideos':
        options.url = 'https://analytics.api.brightcove.com/v1/data?accounts=' + account_id + '&dimensions=video&limit=all&fields=video,video.name&sort=-video_view&from=' + fromDatePicker.value + '&to=' + toDatePicker.value;
        $requestURL.textContent = options.url;
        makeRequest(options, function(response) {
          parsedData = JSON.parse(response);
          // create the video selector items from the response items
          newEl = document.createElement('option');
          newEl.setAttribute('value', '');
          txt = document.createTextNode('Select a video');
          newEl.appendChild(txt);
          frag.appendChild(newEl);
          iMax = parsedData.items.length;
          for (i = 0; i < iMax; i++) {
            item = parsedData.items[i];
            newEl = document.createElement('option');
            newEl.setAttribute('value', item.video);
            txt = document.createTextNode(item['video.name']);
            newEl.appendChild(txt);
            frag.appendChild(newEl);
          }
          // append the options to the video selector
          $videoSelector.appendChild(frag);
        });
        break;
      case 'getAnalytics':
        currentVideo = currentVideoObj.value;
        // fields to return
        fields = 'country,country_name,video_view,video_seconds_viewed';
        options.url = 'https://analytics.api.brightcove.com/v1/data?accounts=' + account_id + '&dimensions=country&limit=all&fields=' + fields + '&from=' + fromDatePicker.value + '&to=' + toDatePicker.value + '&where=video==' + currentVideo;
        $requestURL.textContent = options.url;
        makeRequest(options, function(response) {
          parsedData = JSON.parse(response);
          // display the data
          displayData(parsedData.items);
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
              if (response === '{null}') {
                response = null;
              }
              // return the response
              callback(response);
            } else {
              alert('There was a problem with the request. Request returned ' + httpRequest.status);
            }
          }
        } catch (e) {
          alert('Caught Exception: ' + e);
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
    httpRequest.open('POST', proxyURL);
    // set headers if there is a set header line, remove it
    // open and send request
    httpRequest.send(JSON.stringify(options));
  }

  // add date pickers to the date input fields
  fromPicker = new Pikaday({
    field: fromDatePicker,
    format: 'YYYY-MM-DD'
  });
  toPicker = new Pikaday({
    field: toDatePicker,
    format: 'YYYY-MM-DD'
  });
  // set initial from/to values
  fromDatePicker.value = thenISO;
  toDatePicker.value = nowISO;

  // set event listeners
  useMyAccount.addEventListener('click', function() {
    if (basicInfo.getAttribute('style') === 'display:none') {
      basicInfo.setAttribute('style', 'display:block');
      useMyAccount.textContent = 'Use Sample Account';
    } else {
      basicInfo.setAttribute('style', 'display:none');
      useMyAccount.textContent = 'Use My Account Instead';
    }

  });
  $videoSelector.addEventListener('change', function() {
    // get video and geo selections
    currentVideoObj = getSelectedValue($videoSelector);
    buildRequest('getAnalytics');
  });
  getData.addEventListener('click', function() {
    account_id = (isDefined($accountID.value)) ? $accountID.value : account_id;
    $gettingDataDisplay.textContent = 'Getting video data...';
    buildRequest('getVideos');
  });

  return {};
})(window, document, Pikaday);
