var BCLS = (function(window, document) {
  var reportURL = 'https://analytics.api.brightcove.com/v1/timeseries/accounts/3737230870001',
    proxyURL = '../bc_proxy.php',
    allButtons = document.getElementsByTagName('button'),
    ccu1m = document.getElementById('ccu1m');
    ccu5m = document.getElementById('ccu5m');
    ccu15m = document.getElementById('ccu15m');
    ccu30m = document.getElementById('ccu30m');

  function isJson(str) {
      try {
          JSON.parse(str);
      } catch (e) {
          return false;
      }
      return true;
  }

  function disableButtons() {
      var i,
        iMax = allButtons.length;
      for (i = 0; i < iMax; i++) {
        allButtons[i].setAttribute('disabled', 'disabled');
      }
    }

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

  function setoptions(id) {
      var endPoint = '',
        options = {};

      disableButtons();
      options.proxyURL = proxyURL;
      options.video_id = '6057232440001';
      switch (id) {
        case 'ccu1m':
          endPoint = '?dimensions=video&where=video==' + options.video_id +  '&metrics=ccu';
          options.url = reportURL + endPoint;
          options.requestType = 'GET';
          apiRequest.textContent = options.url;
          apiMethod.textContent = options.requestType;
          makeRequest(options, apiCallback);
          break;
       case 'ccu5m':
          endPoint = '?dimensions=video&where=video==' + options.video_id +  '&metrics=ccu&bucket_duration=5m';
          options.url = reportURL + endPoint;
          options.requestType = 'GET';
          apiRequest.textContent = options.url;
          apiMethod.textContent = options.requestType;
          makeRequest(options, apiCallback);
          break;
          
       case 'ccu15m':
          endPoint = '?dimensions=video&where=video==' + options.video_id +  '&metrics=ccu&bucket_duration=15m';
          options.url = reportURL + endPoint;
          options.requestType = 'GET';
          apiRequest.textContent = options.url;
          apiMethod.textContent = options.requestType;
          makeRequest(options, apiCallback);
          break;
       case 'ccu30m':
          endPoint = '?dimensions=video&where=video==' + options.video_id +  '&metrics=ccu&bucket_duration=30m';
          options.url = reportURL + endPoint;
          options.requestType = 'GET';
          apiRequest.textContent = options.url;
          apiMethod.textContent = options.requestType;
          makeRequest(options, apiCallback);
          break;         
      }
    }

    function makeRequest(options, callback) {
      var httpRequest = new XMLHttpRequest(),
        response,
        proxyURL = options.proxyURL,

        getResponse = function() {
          try {
            if (httpRequest.readyState === 4) {
              if (httpRequest.status >= 200 && httpRequest.status < 300) {
                response = httpRequest.responseText;

                if (response === '{null}') {
                  response = null;
                }

                callback(response);
              } else {
                alert('There was a problem with the request. Request returned ' + httpRequest.status);
              }
            }
          } catch (e) {
            alert('Caught Exception: ' + e);
          }
        };
      httpRequest.onreadystatechange = getResponse;

      httpRequest.open('POST', proxyURL);

      httpRequest.send(JSON.stringify(options));
    }

    // event listeners
  ccu1m.addEventListener('click', function() {
    setoptions('ccu1m');
  });
  ccu5m.addEventListener('click', function() {
    setoptions('ccu5m');
  });
  ccu15m.addEventListener('click', function() {
    setoptions('ccu15m');
  });
  ccu30m.addEventListener('click', function() {
    setoptions('ccu30m');
  });
})(window, document);
