var BCLS = ( function (window, document) {
  var live_key = document.getElementById('live_key'),
    apiResponse = document.getElementById('apiResponse'),
    apiKey = '6aaXAZSSzRatgbVo7P12v7g13ovsuemr3y0CLGkR',
    body = {"live_stream":true,"region":"us-west-2","reconnect_time":20,"live_sliding_window_duration":30,"outputs":[{"label":"hls1080p","live_stream":true,"width":1920,"height":1080,"video_codec":"h264","h264_profile":"main","video_bitrate":2400,"segment_seconds":6,"keyframe_interval":60},{"label":"hls720p","live_stream":true,"width":1280,"height":720,"video_codec":"h264","h264_profile":"main","video_bitrate":1843,"segment_seconds":6,"keyframe_interval":60},{"label":"hls480p","live_stream":true,"width":640,"height":360,"video_codec":"h264","h264_profile":"main","video_bitrate":819,"segment_seconds":6,"keyframe_interval":60}]},
    requestURL = 'https://api.bcovlive.io/v1/jobs';


  function createRequest() {
    var options = {},
      responseDecoded;
    options.url = requestURL;
    options.requestBody = body;
    makeRequest(options, function(response) {
      responseDecoded = JSON.parse(response);
      apiResponse.textContent = JSON.stringify(responseDecoded, null, '  ');
    });
  }

  /**
   * send API request to the proxy
   * @param  {Object} requestData options for the request
   * @param  {String} requestID the type of request = id of the button
   * @param  {Function} [callback] callback function
   */
  function makeRequest(options, callback) {
      var httpRequest = new XMLHttpRequest(),
          parsedData,
          requestParams,
          dataString,
          sources,
          // response handler
          getResponse = function() {
              try {
                  if (httpRequest.readyState === 4) {
                      if (httpRequest.status >= 200 && httpRequest.status < 300) {
                          // check for completion
                          if (requestID === 'getVideos') {
                                  callback(httpRequest.responseText);
                          } else {
                            alert('There was a problem with the request. Request returned ' + httpRequest.status);
                          }
                      }
                  }
              } catch (e) {
                alert('Caught Exception: ' + e);
              }
          };
      // set response handler
      httpRequest.onreadystatechange = getResponse;
      // open the request
      httpRequest.open('GET', options.url);
      // set headers
      httpRequest.setRequestHeader("X-API-KEY", apiKey);
      httpRequest.setRequestHeader("Content-Type", 'application/json');
      // open and send request
      httpRequest.send(options.requestBody);
  }

})(window, document);
