var apiRequest = document.getElementById('apiRequest'),
    apiResponse = document.getElementById('apiResponse'),
    runButton = document.getElementById('runButton'),
    api_request = 'https://edge.api.brightcove.com/playback/v1/accounts/1752604059001/videos?q=tags:sample',
    policyKey = 'BCpkADawqM2KZhoCftdQooqAvN7vGBxeWbqhorS9KciUZ92NYSveS_vZpn_OI0rK5dfSXWEvonWB9FkXGE_WdtwRNIeU48ZDVVVo0CiqoZrtJ2th7auazdfAYRvqkmT-huknUydUq8KkKBxe';

    function makeRequest() {
        var httpRequest = new XMLHttpRequest();
        function getResponse() {
            var response;
console.log('httpRequest', httpRequest);
            try {
                if (httpRequest.readyState === 4) {
    console.log('response', httpRequest.responseText);
                    if (httpRequest.status >= 200 && httpRequest.status < 300) {
                        response = JSON.parse(httpRequest.responseText);
                        apiResponse.textContent = JSON.stringify(response, null, '  ');
                    }
                }
            } catch (e) {
                alert('Caught Exception: ' + e);
            }
        }
        httpRequest.onreadystatechange = getResponse;
        // open the request
        httpRequest.open('GET', api_request);
        // set headers
        httpRequest.setRequestHeader("Accept'", "application/json;pk=" + policyKey);
        // open and send request
        httpRequest.send();
    }

    runButton.addEventListener('click', function() {
        apiRequest.textContent = api_request;
        makeRequest();
    });
