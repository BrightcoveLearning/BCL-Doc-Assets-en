var BCLS = ( function (window, document) {
  // account id calue is the default
  var account_id = '1752604059001',
    account_id_input = document.getElementById('account_id_input'),
    client_id_input = document.getElementById('client_id_input'),
    client_secrect_input = document.getElementById('client_secrect_input'),
    api_response = document.getElementById('api_response'),
    html_output = document.getElementById('html_output'),
    player_embedded = document.getElementById('player_embedded'),
    get_players = document.getElementById('get_players'),
    show_more_players = document.getElementById('show_more_players'),
    radioGroup = document.getElementsByName('playerList'),
    player_list = document.getElementById('player_list'),
    player_details = document.getElementById('player_details'),
    playerCount = 0,
    nextPlayerStart = 0,
    players;
    // event handlers
    get_players.addEventListener('click', function() {
      createRequest('getPlayers');
    });

    show_more_players.addEventListener('click', function() {
      // inject the player - clear the div first to allow repeated clicks
      showNextPlayerList();
    });

  /**
   * get value of a selected radio buttom
   * @param {htmlElementCollection} rgroup the collection of radio buttom elements
   */
  function getRadioValue(rgroup) {
    var i = 0,
    iMax = rgroup.length;
    for (i; i < iMax; i++) {
        if (rgroup[i].checked) {
            return rgroup[i].value;
        }
    }
  }

  /**
   * find index of an object in array of objects
   * based on some property value
   *
   * @param {array} targetArray array to search
   * @param {string} objProperty object property to search
   * @param {string} value of the property to search for
   * @return {integer} index of first instance if found, otherwise returns -1
  */
  function findObjectInArray(targetArray, objProperty, value) {
      var i, totalItems = targetArray.length, objFound = false;
      for (i = 0; i < totalItems; i++) {
          if (targetArray[i][objProperty] === value) {
              objFound = true;
              return i;
          }
      }
      if (objFound === false) {
          return -1;
      }
  }

  /**
   * inject a list of 3 players into the page as a radio button group
   */
  function showNextPlayerList() {
    var radio,
      label,
      br,
      frag = document.createDocumentFragment(),
      i,
      iMax;
    // clear player list div
    player_list.innerHTML = '';
    for (i = nextPlayerStart; i < 3; i++) {
      radio = document.createElement('input');
      radio.setAttribute('type', 'radio');
      radio.setAttribute('name', 'playerList');
      radio.setAttribute('value', players[i].id);
      radio.setAttribute('id', players[i].id);
      label = document.createElement('label');
      label.setAttribute('for', players[i].id);
      label.textContent = ' ' + players[i].name;
      br = document.createElement('br');
      frag.appendChild(radio);
      frag.appendChild(label);
      frag.appendChild(br);
    }
    player_list.appendChild(frag);
    nextPlayerStart = nextPlayerStart + 3;
    iMax = radioGroup.length;
    for (i = 0; i < iMax; i++) {
      radioGroup[1].addEventListener('change', function() {
        var playerId = getRadioValue(radioGroup);
        showPlayerDetails(player);
      });
    }
  }

  /**
   * show some details of a player
   * @param {String} playerId the player id
   */
  function showPlayerDetails(playerId) {
    var frag = document.createDocumentFragment(),
      index = findObjectInArray(players, 'id', playerId),
      player = players[index],
      p = document.createElement('p'),
      iFrame = document.createElement('iframe');
    p.textContent = 'Name: ' + player.name;
    iFrame.setAttribute('src', player.url);
    frag.appendChild(p);
    frag.appendChild(iFrame);
    player_details.appendChild(frag);
  }


  /**
   * createRequest sets up requests, send them to makeRequest(), and handles responses
   * @param  {string} type the request type
   */
  function createRequest(type) {
    var options   = {},
      requestBody = {},
      proxyURL = 'https://solutions.brightcove.com/bcls/bcls-proxy/doc-samples-proxy-v2.php',
      baseURL = 'https://players.api.brightcove.com/v1/accounts/',
      endpoint,
      responseDecoded;

    if (client_id_input.value.length > 0 && client_secrect_input.value.length > 0) {
      options.client_id     = client_id_input.value;
      options.client_secret = client_secrect_input.value;
    }

    options.account_id = (account_id_input.value.length > 0) ? account_id_input.value : account_id;
    options.proxyURL = proxyURL;

    switch (type) {
        case 'getPlayers':
          endpoint            = '/' + options.account_id + '/players';
          options.url         = baseURL + endpoint;
          options.requestType = 'GET';
          requestBody.name = player_name_input.value;
          requestBody.configuration = {};
          if (media_url_input.value.indexOf('//') > -1) {
            requestBody.configuration.media = {};
            requestBody.configuration.media.sources = [];
            requestBody.configuration.media.sources[0] = {};
            requestBody.configuration.media.sources[0].src = media_url_input.value;
            requestBody.configuration.media.sources[0].type = getSelectedValue(media_type_input);
          } else {
            // assume video id
            requestBody.configuration.video_cloud = {};
            requestBody.configuration.video_cloud.video = media_url_input.value;
          }
          options.requestBody = JSON.stringify(requestBody);
          makeRequest(options, function(response) {
              responseDecoded = JSON.parse(response);
              players = responseDecoded.items;
              playerCount = responseDecoded.item_count;
              create_response.textContent = JSON.stringify(responseDecoded, null, 2);
              showNextPlayerList();
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
