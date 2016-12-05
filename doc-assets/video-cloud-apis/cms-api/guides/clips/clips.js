var BCLS = (function (window, document) {
    var account_id      = document.getElementById('account_id'),
        client_id       = document.getElementById('client_id'),
        client_secret   = document.getElementById('client_secret'),
        videoCount      = 0,
        totalCalls      = 0,
        callNumber      = 0,
        rendiitonNumber = 0,
        posterNumber    = 0,
        thumbnailNumber = 0,
        videoData       = [],
        renditionData   = [],
        posterData      = [],
        thumbnailData   = [];

    function setUpRequest(type) {
        var baseURL = 'https://cms.api.brightcove.com/v1/accounts',
            endpoint,
            limit   = 25,
            options = {};
        options.client_id = client_id.value;
        options.client_secret = client_secret.value;

        switch (type) {
            case 'getCount':
                endpoint = '/' + account_id.value + '/counts/videos/q=%2Bis_clip:true';
                options.url = baseURL + endpoint;
                options.requestType = 'GET';
                break;
            case 'getVideoClips':
                endpoint = '/' + account_id.value + '/videos/q=%2Bis_clip:true&limit=' + limit + '&offset=' + (limit * callNumber);
                options.url = baseURL + endpoint;
                options.requestType = 'GET';
                break;
            case 'getRenditions':
                endpoint = '/' + account_id.value + '/videos/' + videoData[callNumber] + '/assets/renditions';
                options.url = baseURL + endpoint;
                options.requestType = 'GET';
                break;
            case 'deleteRendition':
                endpoint = '/' + account_id.value + '/videos/' + videoData[callNumber] + '/assets/renditions/' + renditionData[rendiitonNumber];
                options.url = baseURL + endpoint;
                options.requestType = 'DELETE';
                break;
            case 'getPosters':
                endpoint = '/' + account_id.value + '/videos/' + videoData[callNumber] + '/assets/poster';
                options.url = baseURL + endpoint;
                options.requestType = 'GET';
                break;
            case 'deletePoster':
                endpoint = '/' + account_id.value + '/videos/' + videoData[callNumber] + '/assets/poster/' + posterData[posterNumber];
                options.url = baseURL + endpoint;
                options.requestType = 'DELETE';
                break;
            case 'getThumbnails':
                endpoint = '/' + account_id.value + '/videos/' + videoData[callNumber] + '/assets/thumbnail';
                options.url = baseURL + endpoint;
                options.requestType = 'GET';
                break;
            case 'deletePoster':
                endpoint = '/' + account_id.value + '/videos/' + videoData[callNumber] + '/assets/thumbnail/' + thumbnailData[thumbnailNumber];
                options.url = baseURL + endpoint;
                options.requestType = 'DELETE';
                break;
            default:
                if (window && window.console) {
                    console.log('default case: we should not be here');
                }
        }
    }

    /**
     * send API request to the proxy
     * @param  {Object} requestData options for the request
     * @param  {Function} [callback] callback function
     */
    function getMediaData(options, callback) {
        var httpRequest = new XMLHttpRequest(),
            response,
            requestParams,
            dataString,
            // response handler
            getResponse = function() {
                try {
                    if (httpRequest.readyState === 4) {
                        if (httpRequest.status === 200 || httpRequest.status === 204) {
                            response = httpRequest.responseText;
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
        // set up request data
        requestParams = "url=" + encodeURIComponent(options.url) + "&requestType=" + options.requestType;
        // only add client id and secret if both were submitted
        if (isDefined(clientId) && isDefined(clientSecret)) {
            requestParams += '&client_id=' + clientId + '&client_secret=' + clientSecret;
        }

        // set response handler
        httpRequest.onreadystatechange = getResponse;
        // open the request
        httpRequest.open('POST', proxyURL);
        // set headers
        httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        // open and send request
        httpRequest.send(requestParams);
    }

})(window, document);
