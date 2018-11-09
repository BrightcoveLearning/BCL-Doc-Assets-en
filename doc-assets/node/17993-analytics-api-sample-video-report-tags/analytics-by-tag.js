var BCLS = (function(window, document, Pikaday) {
  'use strict';
  var proxyURL = 'https://solutions.brightcove.com/bcls/bcls-proxy/doc-samples-proxy-v2.php',
    basicInfo = document.getElementById('basicInfo'),
    useMyAccount = document.getElementById('useMyAccount'),
    $accountID = document.getElementById('accountID'),
    accountID = '1752604059001',
    $client_id = document.getElementById('client_id'),
    client_id = null,
    $client_secret = document.getElementById('client_secret'),
    client_secret = null,
    $requestType = document.getElementById('requestType'),
    fromPicker,
    toPicker,
    to = document.getElementById('to'),
    from = document.getElementById('from'),
    now = new Date(),
    nowMS = now.valueOf(),
    fromMS = nowMS - (30 * 24 * 60 * 60 * 1000),
    fromDate = new Date(fromMS),
    nowISO = now.toISOString(),
    fromISO = fromDate.toISOString(),
    $tags = document.getElementById('tags'),
    tags = 'bird,budapest',
    $request = document.getElementById('request'),
    $submitButton = document.getElementById('submitButton'),
    csv_format = document.getElementById('csv_format'),
    csvFormat = false,
    $selectData = document.getElementById('selectData'),
    $requestInputs = document.getElementsByClassName('aapi-request'),
    $responseFrame = document.getElementById('responseFrame'),
    requestURL = '',
    endDate = '',
    startDate = '',
    options = {},
    i,
    iMax;


  // more robust test for strings 'not defined'
  function isDefined(v) {
    if (v === '' || v === null || v === undefined) {
      return false;
    }
    return true;
  }

  // remove space after comma and URI encode
  function encodeString(str) {
    if (isDefined(str)) {
      str = '"' + str + '"';
      str = encodeURI(str);
      return str;
    }
  }

  /**
   * determines if checkbox is checked
   * @param  {htmlElement}  e the checkbox to check
   * @return {Boolean}  true if box is checked
   */
  function isChecked(e) {
    if (e.checked) {
      return true;
    }
    return false;
  }

  // construct the request
  function buildRequest() {
    var account_id = (isDefined($accountID.value)) ? $accountID.value : accountID;
    tags = (isDefined($tags.value)) ? $tags.value : tags;
    // add client credentials if any
    if (isDefined($client_id.value)) {
      options.client_id = $client_id.value;
    }
    if (isDefined($client_secret.value)) {
      options.client_secret = $client_secret.value;
    }
    options.account_id = account_id;
    options.proxyURL = proxyURL;
    // build the request
    options.url = 'https://analytics.api.brightcove.com/v1';
    options.url += '/data?accounts=' + account_id + '&dimensions=video';
    // check for time filters
    startDate = from.value || fromISO;
    // startDate = fromPicker.toString('YYYY-MM-DD');
    options.url += '&from=' + startDate;
    endDate = to.value || nowISO;
    // endDate = toPicker.toString('YYYY-MM-DD');
    options.url += '&to=' + endDate;

    // add limit and fields
    options.url += '&limit=all&fields=engagement_score,play_rate,video,video_duration,video_engagement_1,video_engagement_100,video_engagement_25,video_engagement_50,video_engagement_75,video_impression,video_name,video_percent_viewed,video_seconds_viewed,video_view,video.tags';
    // add ref id filter
    tags = encodeString(tags);
    options.url += '&where=video.q==tags:' + tags;
    // check format
    if (isChecked(csv_format)) {
      options.url += '&format=csv';
      csvFormat = true;
    }


    $request.textContent = options.url;
    $request.setAttribute('value', options.url);
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
              console.log('response', response);
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
    console.log('options', options);
    httpRequest.send(JSON.stringify(options));
  }

  // add date pickers to the date input fields
  fromPicker = new Pikaday({
    field: from,
    format: 'YYYY-MM-DD',
    onSelect: buildRequest
  });
  toPicker = new Pikaday({
    field: to,
    format: 'YYYY-MM-DD',
    onSelect: buildRequest
  });
  // populate to/from fields with default values
  nowISO = nowISO.substring(0, nowISO.indexOf('T'));
  fromISO = fromISO.substring(0, fromISO.indexOf('T'));
  to.value = nowISO;
  from.value = fromISO;

  // set event listeners
  useMyAccount.addEventListener('click', function() {
    if (basicInfo.getAttribute('style') === 'display:none;') {
      basicInfo.setAttribute('style', 'display:block;');
      useMyAccount.innerHTML = 'Use Sample Account';
    } else {
      basicInfo.setAttribute('style', 'display:none;');
      useMyAccount.textContent = 'Use My Account Instead';
    }
  });


  // set listener for form fields
  iMax = $requestInputs.length;
  for (i = 0; i < iMax; i++) {
    $requestInputs[i].addEventListener('change', buildRequest);
  }
  // send request
  $submitButton.addEventListener('click', function() {
    makeRequest(options, function(response) {
      if (!csvFormat) {
       response = JSON.parse(response);
      responseFrame.textContent = JSON.stringify(response, null, '  ');
      } else {
        responseFrame.textContent = response;
      }

    });
  });
  // select all the data
  $selectData.addEventListener('click', function() {
    document.getElementById('responseFrame').select();
  });
  // generate initial request
  buildRequest();
})(window, document, Pikaday);
