var BCLS = (function (window, document) {
    // account info
    var useMyAccount = document.getElementById('useMyAccount'),
        basicInfo = document.getElementById('basicInfo'),
        account = document.getElementById('account'),
        cid = document.getElementById('cid'),
        secret = document.getElementById('secret'),
        // value below is for BrightcoveLearning
        // default client id and secret should be stored in the proxy
        default_account_id = '57838016001',
        // cuepoint fields
        name = document.getElementById('name').
        type = document.getElementById('type'),
        // update info
        video = document.getElementById('video'),
        name = document.getElementById('name'),
        type = document.getElementById('type'),
        time = document.getElementById('time'),
        metadata = document.getElementById('metadata'),
        force_stop = document.getElementById('force_stop'),
        addCue = document.getElementById('addCue'),
        setRequest = document.getElementById('setRequest'),
        // data objects
        cuePointData = [],
        client_id,
        client_secret,
        account_id;

    // set event listeners
    useMyAccount.addEventListener('click', function () {
        if (basicInfo.getAttribute('style') === 'display:non;') {
            basicInfo.setAttribute('style', 'display:block;');
            useMyAccount.textContent = 'Use Sample Account';
        } else {
            basicInfo.setAttribute('style', 'display:none;');
            useMyAccount.textContent = 'Use My Account Instead';
        }
    });

    addCue.addEventListener('click', function() {
        var cue = {};
        cue.name = name.value;
        cue.type = getSelectedValue(type).value;
        cue.time = parseFloat(time.value);
        cue.metadata = metadata.value;
        cue.force_stop = isChecked(force_stop);
        cuePointData.push(cue);
        name.value = '';
        time.value = '';
        metadata.value - '';
    });

    /**
     * get selected value for single select element
     * @param {htmlElement} e the select element
     * @return {Object} object containing the `value`, text, and selected `index`
     */
    function getSelectedValue(e) {
        var selected = e.options[e.selectedIndex],
            val = selected.value,
            txt = selected.textContent,
            idx = e.selectedIndex;
        return {
            value: val,
            text: txt,
            index: idx
        };
    }

    /**
     * determines if checkbox is checked
     * @param  {htmlElement}  e the checkbox to check
     * @return {Boolean}  true if box is checked
     */
    function isChecked(e) {
        if (e.value) {
            return true;
        }
        return false;
    }

    /**
     * createRequest sets up requests, send them to makeRequest(), and handles responses
     * @param  {string} type the request type
     */
    function createRequest(type) {
        var options   = {},
            ipBaseURL = 'https://ingestion.api.brightcove.com/v1/accounts/' + account.value,
            diBaseURL = 'https://ingest.api.brightcove.com/v1/accounts/' + account.value,
            endpoint,
            responseDecoded,
            i,
            iMax,
            el,
            txt;

        // set credentials
        options.client_id     = cid.value;
        options.client_secret = secret.value;

        switch (type) {
            case 'getProfiles':
                options.proxyURL = './profiles-proxy.php';
                endpoint         = '/profiles';
                options.url      = ipBaseURL + endpoint;
                makeRequest(options, function(response) {
                    responseDecoded = JSON.parse(response);
                    if (Array.isArray(responseDecoded)) {
                        // remove existing options
                        iMax = profiles.length;
                        for (i = 0; i < iMax; i++) {
                            profiles.remove(i);
                        }
                        // add new options
                        iMax = responseDecoded.length;
                        for (i = 0; i < iMax; i++) {
                            el = document.createElement('option');
                            el.setAttribute('value', responseDecoded[i].name);
                            txt = document.createTextNode(responseDecoded[i].name);
                            el.appendChild(txt);
                            profiles.appendChild(el);
                        }
                    }
                });
                break;
            // additional cases
            default:
                console.log('Should not be getting to the default case - bad request type sent);
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
            requestParams,
            dataString,
            proxyURL    = options.proxyURL,
            // response handler
            getResponse = function() {
                try {
                    if (httpRequest.readyState === 4) {
                        if (httpRequest.status === 200 || httpRequest.status === 204) {
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
         * the proxy used here takes the following params:
         * url - the full API request (required)
         * requestType - the HTTP request type (default: GET)
         * clientId - the client id (defaults here to a Brightcove sample account value - this should always be stored on the server side if possible)
         * clientSecret - the client secret (defaults here to a Brightcove sample account value - this should always be stored on the server side if possible)
         * requestData - request body for write requests (optional JSON string)
         */
        requestParams = "url=" + encodeURIComponent(options.url) + "&requestType=" + options.requestType;
        // only add client id and secret if both were submitted
        if (options.client_id && options.client_secret) {
            requestParams += '&client_id=' + options.client_id + '&client_secret=' + options.client_secret;
        }
        // add request data if any
        if (options.requestData) {
            requestParams += '&requestBody=' + options.requestBody;
        }
        console.log('requestParams', requestParams);
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
