var BCLS = ( function (window, document) {
  var account_id = "",
    account_password = "",
    account_username = "",
    player_name = "",
    media_url = "",
    media_type = "",
    callPurpose = "",
    account_id_input = document.getElementById('account_id_input'),
    client_id_input = document.getElementById('client_id_input'),
    client_secrect_input - document.getElementById('client_secrect_input'),
    player_name_input = document.getElementById('player_name_input'),
    create_response = document.getElementById('create_response'),
    publish_response = document.getElementById('publish_response'), player_embedded = document.getElementById('player_embedded');

  /**
   * createRequest sets up requests, send them to makeRequest(), and handles responses
   * @param  {string} type the request type
   */
  function createRequest(type) {
    var options   = {},
      requestBody = {},
      // next line for BrightcoveLearning proxy (use if you are making write requests)
      // for read requests only, use https://solutions.brightcove.com/bcls/bcls-proxy/doc-samples-proxy-v2.php
      proxyURL = 'https://solutions.brightcove.com/bcls/bcls-proxy/brightcove-learning-proxy-v2.php'
      baseURL = 'https://players.api.brightcove.com/v1/accounts/',
      endpoint,
      responseDecoded;

    // set credentials
    // assumes input fields with ids: account_id, client_id, and client_secret
    if (client_id_input.value.length > 0 && client_secrect_input.value.length > 0) {
      options.client_id     = client_id_input.value;
      options.client_secret = client_secrect_input.value;
    }
    options.proxyURL = proxyURL;

    switch (type) {
        case 'createPlayer':
          endpoint            = '/' + options.account_id + '/counts/videos';
          options.url         = baseURL + endpoint;
          options.requestType = 'POST';
          makeRequest(options, function(response) {
              responseDecoded = JSON.parse(response);
              // do what you want here
          });
          break;
        case 'publishPlayer':
          endpoint            = '/' + options.account_id + '/counts/videos';
          options.url         = baseURL + endpoint;
          options.requestType = 'POST';;
          requestBody.name    = 'My New Video';
          // add more properties
          options.requestBody = JSON.stringify(requestBody);
          makeRequest(options, function(response) {
              responseDecoded = JSON.parse(response);
              // do more stuff
          });
          break;

        // additional cases
        default:
          console.log('Should not be getting to the default case - bad request type sent');
          break;
    }
  }

  /**
   * send API request to the proxy
   * @param {Object} options for the request
   * @param {String} options.url the full API request URL
   * @param {String = "GET", "POST", "PATCH", "PUT", "DELETE"} requestData[options.requestType = "GET"] HTTP type for the request
   * @param {String} options.proxyURL proxyURL to send the request to
   * @param {String} options.client_id client id for the account( default is in the proxy)
   * @param {String} options.client_secret client secret for the account(default is in the proxy)
   * @param {JSON} [options.requestBody] Data to be sent in the request body in the form of a JSON string
   *
     @param {Function} [callback] callback function that will process the response
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
      * JSON.strinify(options)
      */
     // set response handler
     httpRequest.onreadystatechange = getResponse;
     // open the request
     httpRequest.open('POST', proxyURL);
     // set headers if there is a set header line, remove it
     // open and send request
     httpRequest.send(JSON.stringify(options));
   }

})(window, document);
