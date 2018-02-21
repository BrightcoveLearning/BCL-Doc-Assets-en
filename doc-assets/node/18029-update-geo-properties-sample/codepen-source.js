var BCLS = (function(window, document) {
  var baseURL                 = 'https://cms.api.brightcove.com/v1/accounts/1485884786001',
      proxyURL                = 'https://solutions.brightcove.com/bcls/bcls-proxy/beml-proxy-v2.php',
      video_id                = '',
      video_name              = '',
      account_id              = '1485884786001',
      offset                  = 0,
      excludedValue           = 'true',
      excluded                = true,
      countriesArray          = [],
      videoCount              = 0,
      count                   = document.getElementById('count'),
      allButtons              = document.getElementsByTagName('button'),
      excludedEl              = document.getElementsByName('excluded'),
      countries               = document.getElementById('countries'),
      selectedCountries       = document.getElementById('selectedCountries'),
      addCountry              = document.getElementById('addCountry'),
      removeCountry           = document.getElementById('removeCountry'),
      updateVideos            = document.getElementById('updateVideos'),
      apiRequest              = document.getElementById('apiRequest'),
      apiData                 = document.getElementById('apiData'),
      apiMethod               = document.getElementById('apiMethod'),
      generatedContent        = document.getElementById('generatedContent'),
      responseData            = document.getElementById('responseData'),
      logger                  = document.getElementById('logger'),
      i,
      iMax;

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
     * gets the selected value for the excluded radio group and sets the var
     */
    function getExcludedValue() {
        iMax = excludedEl.length;
        for (i = 0; i < iMax; i++) {
            if (excludedEl[i].checked === true) {
                if (excludedEl[i].value === 'true') {
                    excluded = true;
                } else {
                    excluded = false;
                }
            }
        }
    }

    /**
     * sort the elements of an array - use as is to sort by text
     * to sort by value, make that the 0 element of the tmpAry
     * @param  {HTMLElement} selElem the select element
     */
    function sortSelect(selElem) {
    var tmpAry = new Array();
    for (var i=0;i<selElem.options.length;i++) {
        tmpAry[i] = new Array();
        tmpAry[i][0] = selElem.options[i].text;
        tmpAry[i][1] = selElem.options[i].value;
    }
    tmpAry.sort();
    while (selElem.options.length > 0) {
        selElem.options[0] = null;
    }
    for (var i=0;i<tmpAry.length;i++) {
        var op = new Option(tmpAry[i][0], tmpAry[i][1]);
        selElem.options[i] = op;
    }
    return;
}

    /**
     * gets a collection of selected options for multi-select control
     * @param  {Element}   sel      the selector element
     * @param  {Function} [callback] callback to handle individual selected options
     * @return {Array}  array of selected options
     */
    function getSelectedOptions(sel, callback) {
        var opts = [], opt, i, len;
        i = sel.options.length;
        // loop through options in select list
        while (i > 0) {
            i--;
            opt = sel.options[i];
            console.log(opt);
            // check if selected
            if ( opt.selected ) {
                // add to array of option elements to return from this function
                opts.push(opt);

                // invoke optional callback function if provided
                // and pass the selector and the selected option
                if (callback) {
                    callback(sel, opt);
                }
            }
        }

        // return array containing references to selected option elements
        return opts;
    }

    /**
     * injects messages into the UI
     * @param  {HTMLElement} el The element to inject text into
     * @param  {String} message The message to inject
     * @param  {Boolean} append Append the message to existing content
     */
    function logMessage(el, message, append) {
      if (append === true) {
        var br = document.createElement('br');
        el.appendChild(br);
        el.appendChild(document.createTextNode(message));
      } else {
        el.textContent = message;
      }
    }

    /**
     * or removes country codes to country array
     * this is a callback for getSelectedOptions
     * @param  {HTMLElement} sel the selector that is processing
     * @param  {HTMLElement} opt the option to be processed
     */
    function addtoCountriesArray(sel, opt) {
        var i, iMax;
        if (sel.id === 'countries') {
            countriesArray.push(opt.value);
            sel.removeChild(opt);
            selectedCountries.appendChild(opt);
        } else {
            sel.removeChild(opt);
            countries.appendChild(opt);
            sortSelect(countries);
            iMax = countriesArray.length;
            for (i = 0; i < iMax; i++) {
                if (countriesArray[i] === opt.value) {
                    countriesArray.splice(i, 1);
                    break;
                }
            }
        }

    }

    /**
     * sets up the data for the API request
     * @param {String} id the id of the button that was clicked
     */
    function createRequest(id) {
        var endPoint = '',
            options = {};
        // disable buttons to prevent a new request before current one finishes
        disableButtons();
        options.proxyURL = proxyURL;
        options.account_id = account_id;
        switch (id) {
            case 'getCount':
                endPoint = '/counts/videos';
                options.url = baseURL + endPoint;
                options.requestType = 'GET';
                logMessage(apiRequest, options.url, false);
                logMessage(apiMethod, options.requestType, false);
                makeRequest(options, function(response) {
                  parsedData = JSON.parse(response);
                  logMessage(responseData, JSON.stringify(parsedData, null, '  '), false);
                  // set total videos
                  videoCount = parsedData.count;
                  count.textContent = 'Total videos: ' + videoCount;
                  createRequest('get1video');                });
                break;
            case 'get1video':
                endPoint = '/videos?limit=1&sort=created_at&offset=' + offset;
                options.url = baseURL + endPoint;
                options.requestType = 'GET';
                logMessage(apiRequest, options.url, false);
                logMessage(apiMethod, options.requestType, false);
                makeRequest(options, function(response) {
                  parsedData = JSON.parse(response);
                  logMessage(responseData, JSON.stringify(parsedData, null, '  '), false);
                  // set the video id for the update
                  video_id = parsedData[0].id;
                  video_name = parsedData[0].name;
                  logMessage(logger, ('Processing ' + video_name), true);
                  createRequest('updateVideos');
                });
                break;
            case 'updateVideos':
                endPoint = '/videos/' + video_id;
                options.url = baseURL + endPoint;
                options.requestType = 'PATCH';
                options.requestBody = {geo: {countries: countriesArray, exclude_countries: excluded, restricted: true}};
                logMessage(apiRequest, options.url, false);
                logMessage(apiData, JSON.stringify(options.requestBody), false);
                logMessage(apiMethod, options.requestType, false);
                makeRequest(options, function(response) {
                  parsedData = JSON.parse(response);
                  logMessage(responseData, JSON.stringify(parsedData, null, '  '), false);
                  // increment offset
                  offset++;
                  if (offset < videoCount) {
                      // move on to next video
                      createRequest('get1video');
                  } else {
                      // we are done
                      logMessage(logger, ('Finished... ' + offset + ' videos processed'), true)
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
        requestParams,
        dataString,
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
    updateVideos.addEventListener('click', function() {
        createRequest('getCount');
    });
    iMax = excludedEl.length;
    for (i = 0; i < iMax; i++) {
        excludedEl[i].addEventListener('change', getExcludedValue);
    }
    addCountry.addEventListener('click', function() {
        updateVideos.removeAttribute('disabled');
        getSelectedOptions(countries, addtoCountriesArray);
    });
    removeCountry.addEventListener('click', function(evt) {
        getSelectedOptions(selectedCountries, addtoCountriesArray);
    });
})(window, document);
