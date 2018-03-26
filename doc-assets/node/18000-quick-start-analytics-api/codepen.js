var BCLS = (function(window, document) {
  var reportURL = 'https://analytics.api.brightcove.com/v1/data',
    engagementURL = 'https://analytics.api.brightcove.com/v1/engagement/accounts/20318290001',
    proxyURL = 'https://solutions.brightcove.com/bcls/bcls-proxy/training-videos-proxy.php',
    video_id = '4562259880001',
    player_id = '901fa759-2353-412c-83ff-e8be6011e9f2',
    allButtons = document.getElementsByTagName('button'),
    account = document.getElementById('account'),
    video = document.getElementById('video'),
    player = document.getElementById('player'),
    date = document.getElementById('date'),
    country = document.getElementById('country'),
    destination_path = document.getElementById('destination_path'),
    source_type = document.getElementById('source_type');
  device_os = document.getElementById('device_os');
  videoCountry = document.getElementById('videoCountry');
  multipleAccounts = document.getElementById('multipleAccounts');
  limitOffset = document.getElementById('limitOffset');
  sort = document.getElementById('sort');
  dateRange = document.getElementById('dateRange');
  oneDay = document.getElementById('oneDay');
  fields = document.getElementById('fields');
  whereDevice = document.getElementById('whereDevice');
  whereTags = document.getElementById('whereTags');
  formatCSV = document.getElementById('formatCSV');
  accountEngagement = document.getElementById('accountEngagement');
  videoEngagement = document.getElementById('videoEngagement');
  playerEngagement = document.getElementById('playerEngagement');
  /**
   * disables all buttons so user can't submit new request until current one finishes
   */
  function disableButtons() {
      var i,
        iMax = allButtons.length;
      for (i = 0; i < iMax; i++) {
        allButtons[i].setAttribute('disabled', 'disabled');
      }
    }
    /**
     * re-enables all buttons
     */
  function enableButtons() {
      var i,
        iMax = allButtons.length;
      for (i = 0; i < iMax; i++) {
        allButtons[i].removeAttribute('disabled');
      }
    }
    /**
     * sets up the data for the API request
     * @param {String} id the id of the button that was clicked
     */
  function setRequestData(id) {
      var endPoint = '',
        requestData = {};
      // disable buttons to prevent a new request before current one finishes
      disableButtons();
      switch (id) {
        case 'account':
          endPoint = '?accounts=20318290001&dimensions=account';
          requestData.url = reportURL + endPoint;
          requestData.requestType = 'GET';
          apiRequest.textContent = requestData.url;
          apiMethod.textContent = requestData.requestType;
          getMediaData(requestData, id);
          break;
        case 'video':
          endPoint = '?accounts=20318290001&dimensions=video';
          requestData.url = reportURL + endPoint;
          requestData.requestType = 'GET';
          apiRequest.textContent = requestData.url;
          apiMethod.textContent = requestData.requestType;
          getMediaData(requestData, id);
          break;
        case 'player':
          endPoint = '?accounts=20318290001&dimensions=player';
          requestData.url = reportURL + endPoint;
          requestData.requestType = 'GET';
          apiRequest.textContent = requestData.url;
          apiMethod.textContent = requestData.requestType;
          getMediaData(requestData, id);
          break;
        case 'date':
          endPoint = '?accounts=20318290001&dimensions=date';
          requestData.url = reportURL + endPoint;
          requestData.requestType = 'GET';
          apiRequest.textContent = requestData.url;
          apiMethod.textContent = requestData.requestType;
          getMediaData(requestData, id);
          break;
        case 'destination_path':
          endPoint = '?accounts=20318290001&dimensions=destination_path';
          requestData.url = reportURL + endPoint;
          requestData.requestType = 'GET';
          apiRequest.textContent = requestData.url;
          apiMethod.textContent = requestData.requestType;
          getMediaData(requestData, id);
          break;
        case 'country':
          endPoint = '?accounts=20318290001&dimensions=country';
          requestData.url = reportURL + endPoint;
          requestData.requestType = 'GET';
          apiRequest.textContent = requestData.url;
          apiMethod.textContent = requestData.requestType;
          getMediaData(requestData, id);
          break;
        case 'source_type':
          endPoint = '?accounts=20318290001&dimensions=source_type';
          requestData.url = reportURL + endPoint;
          requestData.requestType = 'GET';
          apiRequest.textContent = requestData.url;
          apiMethod.textContent = requestData.requestType;
          getMediaData(requestData, id);
          break;
        case 'device_os':
          endPoint = '?accounts=20318290001&dimensions=device_os';
          requestData.url = reportURL + endPoint;
          requestData.requestType = 'GET';
          apiRequest.textContent = requestData.url;
          apiMethod.textContent = requestData.requestType;
          getMediaData(requestData, id);
          break;
        case 'videoCountry':
          endPoint = '?accounts=20318290001&dimensions=video,country';
          requestData.url = reportURL + endPoint;
          requestData.requestType = 'GET';
          apiRequest.textContent = requestData.url;
          apiMethod.textContent = requestData.requestType;
          getMediaData(requestData, id);
          break;
        case 'multipleAccounts':
          endPoint = '?accounts=20318290001,57838016001&dimensions=video';
          requestData.url = reportURL + endPoint;
          requestData.requestType = 'GET';
          apiRequest.textContent = requestData.url;
          apiMethod.textContent = requestData.requestType;
          getMediaData(requestData, id);
          break;
        case 'limitOffset':
          endPoint = '?accounts=20318290001&dimensions=video&limit=5&offset=5';
          requestData.url = reportURL + endPoint;
          requestData.requestType = 'GET';
          apiRequest.textContent = requestData.url;
          apiMethod.textContent = requestData.requestType;
          getMediaData(requestData, id);
          break;
        case 'sort':
          endPoint = '?accounts=20318290001&dimensions=video,country&sort=country_name';
          requestData.url = reportURL + endPoint;
          requestData.requestType = 'GET';
          apiRequest.textContent = requestData.url;
          apiMethod.textContent = requestData.requestType;
          getMediaData(requestData, id);
          break;
        case 'dateRange':
          endPoint = '?accounts=20318290001&dimensions=video&from=alltime&to=now';
          requestData.url = reportURL + endPoint;
          requestData.requestType = 'GET';
          apiRequest.textContent = requestData.url;
          apiMethod.textContent = requestData.requestType;
          getMediaData(requestData, id);
          break;
        case 'oneDay':
          endPoint = '?accounts=20318290001&dimensions=video&from=2015-03-25&to=2015-03-25';
          requestData.url = reportURL + endPoint;
          requestData.requestType = 'GET';
          apiRequest.textContent = requestData.url;
          apiMethod.textContent = requestData.requestType;
          getMediaData(requestData, id);
          break;
        case 'fields':
          endPoint = '?accounts=20318290001&dimensions=video&fields=video,video_duration,video_engagement_1,video_engagement_100,video_engagement_25,video_engagement_50,video_engagement_75,video_impression,video.name,video_percent_viewed,video_seconds_viewed';
          requestData.url = reportURL + endPoint;
          requestData.requestType = 'GET';
          apiRequest.textContent = requestData.url;
          apiMethod.textContent = requestData.requestType;
          getMediaData(requestData, id);
          break;
        case 'whereDevice':
          endPoint = '?accounts=20318290001&dimensions=video&where=device_type==tablet';
          requestData.url = reportURL + endPoint;
          requestData.requestType = 'GET';
          apiRequest.textContent = requestData.url;
          apiMethod.textContent = requestData.requestType;
          getMediaData(requestData, id);
          break;
        case 'whereTags':
          endPoint = '?accounts=20318290001&dimensions=video&where=video.q==tags:drupal';
          requestData.url = reportURL + endPoint;
          requestData.requestType = 'GET';
          apiRequest.textContent = requestData.url;
          apiMethod.textContent = requestData.requestType;
          getMediaData(requestData, id);
          break;
        case 'formatCSV':
          endPoint = '?accounts=20318290001&dimensions=video,country&sort=country_name&format=csv';
          requestData.url = reportURL + endPoint;
          requestData.requestType = 'GET';
          apiRequest.textContent = requestData.url;
          apiMethod.textContent = requestData.requestType;
          getMediaData(requestData, id);
          break;
        case 'accountEngagement':
          endPoint = '';
          requestData.url = engagementURL + endPoint;
          requestData.requestType = 'GET';
          apiRequest.textContent = requestData.url;
          apiMethod.textContent = requestData.requestType;
          getMediaData(requestData, id);
          break;
        case 'videoEngagement':
          endPoint = '/videos/video_id';
          requestData.url = engagementURL + endPoint;
          requestData.requestType = 'GET';
          apiRequest.textContent = requestData.url;
          apiMethod.textContent = requestData.requestType;
          getMediaData(requestData, id);
          break;
        case 'playerEngagement':
          endPoint = '/players/player_id';
          requestData.url = engagementURL + endPoint;
          requestData.requestType = 'GET';
          apiRequest.textContent = requestData.url;
          apiMethod.textContent = requestData.requestType;
          getMediaData(requestData, id);
          break;
      }
    }
    /**
     * send API request to the proxy
     * @param  {Object} requestData options for the request
     * @param  {String} requestID the type of request = id of the button
     */
  function getMediaData(options, requestID) {
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
                if (requestID === 'formatCSV') {
                  responseData.textContent = httpRequest.responseText;
                } else {
                  console.log(httpRequest.responseText);
                  responseRaw = httpRequest.responseText;
                  responseData.textContent = responseRaw;
                  parsedData = JSON.parse(responseRaw);
                  responseData.textContent = JSON.stringify(parsedData, null, '  ');
                }

                // re-enable the buttons
                enableButtons();
              } else {
                console.log('There was a problem with the request. Request returned ' + httpRequest.status);
              }
            }
          } catch (e) {
            console.log('Caught Exception: ' + e);
          }
        };
      // set up request data
      requestParams = 'url=' + encodeURIComponent(options.url) + '&requestType=' + options.requestType;
      if (options.requestBody) {
        dataString = JSON.stringify(options.requestBody);
        requestParams += '&requestBody=' + encodeURIComponent(dataString);
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
    // event listeners
  video.addEventListener('click', function() {
    setRequestData('video');
  });
  player.addEventListener('click', function() {
    setRequestData('player');
  });
  country.addEventListener('click', function() {
    setRequestData('country');
  });
  date.addEventListener('click', function() {
    setRequestData('date');
  });
  destination_path.addEventListener('click', function() {
    setRequestData('destination_path');
  });
  device_os.addEventListener('click', function() {
    setRequestData('device_os');
  });
  source_type.addEventListener('click', function() {
    setRequestData('source_type');
  });
  account.addEventListener('click', function() {
    setRequestData('account');
  });
  videoCountry.addEventListener('click', function() {
    setRequestData('videoCountry');
  });
  multipleAccounts.addEventListener('click', function() {
    setRequestData('multipleAccounts');
  });
  limitOffset.addEventListener('click', function() {
    setRequestData('limitOffset');
  });
  sort.addEventListener('click', function() {
    setRequestData('sort');
  });
  fields.addEventListener('click', function() {
    setRequestData('fields');
  });
  dateRange.addEventListener('click', function() {
    setRequestData('dateRange');
  });
  oneDay.addEventListener('click', function() {
    setRequestData('oneDay');
  });
  whereDevice.addEventListener('click', function() {
    setRequestData('whereDevice');
  });
  whereTags.addEventListener('click', function() {
    setRequestData('whereTags');
  });
  formatCSV.addEventListener('click', function() {
    setRequestData('formatCSV');
  });
  accountEngagement.addEventListener('click', function() {
    setRequestData('accountEngagement');
  });
  videoEngagement.addEventListener('click', function() {
    setRequestData('videoEngagement');
  });
  playerEngagement.addEventListener('click', function() {
    setRequestData('playerEngagement');
  });
})(window, document);
