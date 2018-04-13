var BCLS = (function(window, document) {
  var reportURL = 'https://analytics.api.brightcove.com/v1/data',
    engagementURL = 'https://analytics.api.brightcove.com/v1/engagement/accounts/1752604059001',
    proxyURL = 'https://solutions.brightcove.com/bcls/bcls-proxy/doc-samples-proxy-v2.php',
    video_id = '4825296720001',
    player_id = 'HJHx0gc7',
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

  /*
   * tests to see if a string is json
   * @param {String} str string to test
   * @return {Boolean}
   */
  function isJson(str) {
      try {
          JSON.parse(str);
      } catch (e) {
          return false;
      }
      return true;
  }

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

    function apiCallback(response) {
      var parsedData;
      if (isJson(response)) {
        parsedData = JSON.parse(response);
        responseData.textContent = JSON.stringify(parsedData, null, '  ');
      } else {
        responseData.textContent = response;
      }
      enableButtons();
    }
    /**
     * sets up the data for the API request
     * @param {String} id the id of the button that was clicked
     */
  function setoptions(id) {
      var endPoint = '',
        options = {};
      // disable buttons to prevent a new request before current one finishes
      disableButtons();
      options.proxyURL = proxyURL;
      options.account_id = '1752604059001';
      switch (id) {
        case 'account':
          endPoint = '?accounts=1752604059001&dimensions=account';
          options.url = reportURL + endPoint;
          options.requestType = 'GET';
          apiRequest.textContent = options.url;
          apiMethod.textContent = options.requestType;
          makeRequest(options, apiCallback);
          break;
        case 'video':
          endPoint = '?accounts=1752604059001&dimensions=video';
          options.url = reportURL + endPoint;
          options.requestType = 'GET';
          apiRequest.textContent = options.url;
          apiMethod.textContent = options.requestType;
          makeRequest(options, apiCallback);
          break;
        case 'player':
          endPoint = '?accounts=1752604059001&dimensions=player';
          options.url = reportURL + endPoint;
          options.requestType = 'GET';
          apiRequest.textContent = options.url;
          apiMethod.textContent = options.requestType;
          makeRequest(options, apiCallback);
          break;
        case 'date':
          endPoint = '?accounts=1752604059001&dimensions=date';
          options.url = reportURL + endPoint;
          options.requestType = 'GET';
          apiRequest.textContent = options.url;
          apiMethod.textContent = options.requestType;
          makeRequest(options, apiCallback);
          break;
        case 'destination_path':
          endPoint = '?accounts=1752604059001&dimensions=destination_path';
          options.url = reportURL + endPoint;
          options.requestType = 'GET';
          apiRequest.textContent = options.url;
          apiMethod.textContent = options.requestType;
          makeRequest(options, apiCallback);
          break;
        case 'country':
          endPoint = '?accounts=1752604059001&dimensions=country';
          options.url = reportURL + endPoint;
          options.requestType = 'GET';
          apiRequest.textContent = options.url;
          apiMethod.textContent = options.requestType;
          makeRequest(options, apiCallback);
          break;
        case 'source_type':
          endPoint = '?accounts=1752604059001&dimensions=source_type';
          options.url = reportURL + endPoint;
          options.requestType = 'GET';
          apiRequest.textContent = options.url;
          apiMethod.textContent = options.requestType;
          makeRequest(options, apiCallback);
          break;
        case 'device_os':
          endPoint = '?accounts=1752604059001&dimensions=device_os';
          options.url = reportURL + endPoint;
          options.requestType = 'GET';
          apiRequest.textContent = options.url;
          apiMethod.textContent = options.requestType;
          makeRequest(options, apiCallback);
          break;
        case 'videoCountry':
          endPoint = '?accounts=1752604059001&dimensions=video,country';
          options.url = reportURL + endPoint;
          options.requestType = 'GET';
          apiRequest.textContent = options.url;
          apiMethod.textContent = options.requestType;
          makeRequest(options, apiCallback);
          break;
        case 'multipleAccounts':
          endPoint = '?accounts=1752604059001,57838016001&dimensions=video';
          options.url = reportURL + endPoint;
          options.requestType = 'GET';
          apiRequest.textContent = options.url;
          apiMethod.textContent = options.requestType;
          makeRequest(options, apiCallback);
          break;
        case 'limitOffset':
          endPoint = '?accounts=1752604059001&dimensions=video&limit=5&offset=5';
          options.url = reportURL + endPoint;
          options.requestType = 'GET';
          apiRequest.textContent = options.url;
          apiMethod.textContent = options.requestType;
          makeRequest(options, apiCallback);
          break;
        case 'sort':
          endPoint = '?accounts=1752604059001&dimensions=video,country&sort=country_name';
          options.url = reportURL + endPoint;
          options.requestType = 'GET';
          apiRequest.textContent = options.url;
          apiMethod.textContent = options.requestType;
          makeRequest(options, apiCallback);
          break;
        case 'dateRange':
          endPoint = '?accounts=1752604059001&dimensions=video&from=alltime&to=now';
          options.url = reportURL + endPoint;
          options.requestType = 'GET';
          apiRequest.textContent = options.url;
          apiMethod.textContent = options.requestType;
          makeRequest(options, apiCallback);
          break;
        case 'oneDay':
          endPoint = '?accounts=1752604059001&dimensions=video&from=2015-03-25&to=2015-03-25';
          options.url = reportURL + endPoint;
          options.requestType = 'GET';
          apiRequest.textContent = options.url;
          apiMethod.textContent = options.requestType;
          makeRequest(options, apiCallback);
          break;
        case 'fields':
          endPoint = '?accounts=1752604059001&dimensions=video&fields=video,video_duration,video_engagement_1,video_engagement_100,video_engagement_25,video_engagement_50,video_engagement_75,video_impression,video.name,video_percent_viewed,video_seconds_viewed';
          options.url = reportURL + endPoint;
          options.requestType = 'GET';
          apiRequest.textContent = options.url;
          apiMethod.textContent = options.requestType;
          makeRequest(options, apiCallback);
          break;
        case 'whereDevice':
          endPoint = '?accounts=1752604059001&dimensions=video&where=device_type==tablet';
          options.url = reportURL + endPoint;
          options.requestType = 'GET';
          apiRequest.textContent = options.url;
          apiMethod.textContent = options.requestType;
          makeRequest(options, apiCallback);
          break;
        case 'whereTags':
          endPoint = '?accounts=1752604059001&dimensions=video&where=video.q==tags:drupal';
          options.url = reportURL + endPoint;
          options.requestType = 'GET';
          apiRequest.textContent = options.url;
          apiMethod.textContent = options.requestType;
          makeRequest(options, apiCallback);
          break;
        case 'formatCSV':
          endPoint = '?accounts=1752604059001&dimensions=video,country&sort=country_name&format=csv';
          options.url = reportURL + endPoint;
          options.requestType = 'GET';
          apiRequest.textContent = options.url;
          apiMethod.textContent = options.requestType;
          makeRequest(options, apiCallback);
          break;
        case 'accountEngagement':
          endPoint = '';
          options.url = engagementURL + endPoint;
          options.requestType = 'GET';
          apiRequest.textContent = options.url;
          apiMethod.textContent = options.requestType;
          makeRequest(options, apiCallback);
          break;
        case 'videoEngagement':
          endPoint = '/videos/video_id';
          options.url = engagementURL + endPoint;
          options.requestType = 'GET';
          apiRequest.textContent = options.url;
          apiMethod.textContent = options.requestType;
          makeRequest(options, apiCallback);
          break;
        case 'playerEngagement':
          endPoint = '/players/player_id';
          options.url = engagementURL + endPoint;
          options.requestType = 'GET';
          apiRequest.textContent = options.url;
          apiMethod.textContent = options.requestType;
          makeRequest(options, apiCallback);
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

    // event listeners
  video.addEventListener('click', function() {
    setoptions('video');
  });
  player.addEventListener('click', function() {
    setoptions('player');
  });
  country.addEventListener('click', function() {
    setoptions('country');
  });
  date.addEventListener('click', function() {
    setoptions('date');
  });
  destination_path.addEventListener('click', function() {
    setoptions('destination_path');
  });
  device_os.addEventListener('click', function() {
    setoptions('device_os');
  });
  source_type.addEventListener('click', function() {
    setoptions('source_type');
  });
  account.addEventListener('click', function() {
    setoptions('account');
  });
  videoCountry.addEventListener('click', function() {
    setoptions('videoCountry');
  });
  multipleAccounts.addEventListener('click', function() {
    setoptions('multipleAccounts');
  });
  limitOffset.addEventListener('click', function() {
    setoptions('limitOffset');
  });
  sort.addEventListener('click', function() {
    setoptions('sort');
  });
  fields.addEventListener('click', function() {
    setoptions('fields');
  });
  dateRange.addEventListener('click', function() {
    setoptions('dateRange');
  });
  oneDay.addEventListener('click', function() {
    setoptions('oneDay');
  });
  whereDevice.addEventListener('click', function() {
    setoptions('whereDevice');
  });
  whereTags.addEventListener('click', function() {
    setoptions('whereTags');
  });
  formatCSV.addEventListener('click', function() {
    setoptions('formatCSV');
  });
  accountEngagement.addEventListener('click', function() {
    setoptions('accountEngagement');
  });
  videoEngagement.addEventListener('click', function() {
    setoptions('videoEngagement');
  });
  playerEngagement.addEventListener('click', function() {
    setoptions('playerEngagement');
  });
})(window, document);
