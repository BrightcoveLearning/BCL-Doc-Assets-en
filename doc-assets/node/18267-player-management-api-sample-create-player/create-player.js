var BCLS = ( function (window, document) {
  // account id calue is the default
  var account_id = '57838016001',
    account_password = '',
    account_username = '',
    player_name = '',
    player_id,
    account_id_input = document.getElementById('account_id_input'),
    client_id_input = document.getElementById('client_id_input'),
    client_secrect_input = document.getElementById('client_secrect_input'),
    player_name_input = document.getElementById('player_name_input'),
    media_url_input = document.getElementById('media_url_input'),
    media_type_input = document.getElementById('media_type_input'),
    create_response = document.getElementById('create_response'),
    publish_response = document.getElementById('publish_response'),
    player_embedded = document.getElementById('player_embedded'),
    create_player = document.getElementById('create_player'),
    now = new Date();

    // initial value for player name (make unique)
    player_name_input.value = 'Test Player ' + now.toISOString();

    // event handlers
    create_player.addEventListener('click', function() {
      createRequest('createPlayer');
    })

  /**
   * get selected value for single select element
   * @param {htmlElement} e the select element
   * @return {String} the selected value
   */
  function getSelectedValue(e) {
      var selected = e.options[e.selectedIndex],
          val = selected.value;
      return val;
  }

  /**
   * createRequest sets up requests, send them to makeRequest(), and handles responses
   * @param  {string} type the request type
   */
  function createRequest(type) {
    var options   = {},
      requestBody = {},
      // next line for BrightcoveLearning proxy (use if you are making write requests)
      // for read requests only, use https://solutions.brightcove.com/bcls/bcls-proxy/doc-samples-proxy-v2.php
      proxyURL = 'https://solutions.brightcove.com/bcls/bcls-proxy/brightcove-learning-proxy-v2.php',
      baseURL = 'https://players.api.brightcove.com/v1/accounts/',
      endpoint,
      responseDecoded;

    // set credentials
    // assumes input fields with ids: account_id, client_id, and client_secret
    if (client_id_input.value.length > 0 && client_secrect_input.value.length > 0) {
      options.client_id     = client_id_input.value;
      options.client_secret = client_secrect_input.value;
    }

    options.account_id = (account_id_input.value.length > 0) ? account_id_input.value : account_id;
    options.proxyURL = proxyURL;

    switch (type) {
        case 'createPlayer':
          endpoint            = '/' + options.account_id + '/players';
          options.url         = baseURL + endpoint;
          options.requestType = 'POST';
          requestBody.name = player_name_input.value;
          requestBody.media = {};
          requestBody.media.sources = [];
          requestBody.media.sources[0] = {};
          requestBody.media.sources[0].src = media_url_input.value;
          requestBody.media.sources[0].type = getSelectedValue(media_type_input);
          options.requestBody = JSON.stringify(requestBody);
          makeRequest(options, function(response) {
              responseDecoded = JSON.parse(response);
              player_id = responseDecoded.id;
              create_response.textContent = JSON.stringify(responseDecoded, null, 2);
          });
          break;
        case 'publishPlayer':
          endpoint            = '/' + options.account_id + '/players/' + player_id + '';
          options.url         = baseURL + endpoint;
          options.requestType = 'POST';;
          requestBody.name    = 'My New Video';
          // add more properties
          options.requestBody = JSON.stringify(requestBody);
          makeRequest(options, function(response) {
              responseDecoded = JSON.parse(response);
              publish_response.textContent = JSON.stringify(responseDecoded, null, 2);
              // inject the player
              player_embedded.insertAdjacentHTML('afterbegin', responseDecoded.embed_code)
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
