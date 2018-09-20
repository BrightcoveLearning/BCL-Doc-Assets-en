var BCLS = ( function (window, document) {
  // account id value is the default Brightcove Learning account
  var account_id = '1752604059001',
    account_id_input = document.getElementById('account_id_input'),
    client_id_input = document.getElementById('client_id_input'),
    client_secrect_input = document.getElementById('client_secrect_input'),
    api_response = document.getElementById('api_response'),
    player_embedded = document.getElementById('player_embedded'),
    get_players = document.getElementById('get_players'),
    show_more_players = document.getElementById('show_more_players'),
    radioGroup = document.getElementsByName('playerList'),
    player_list = document.getElementById('player_list'),
    delete_player = document.getElementById('delete_player'),
    playerCount = 0,
    nextPlayerStart = 0,
    players,
    playerToDelete;
    // event handlers
    get_players.addEventListener('click', function() {
      createRequest('getPlayers');
    });

    show_more_players.addEventListener('click', function() {
      // show players in groups of 3 (the number can be whatever you like)
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
    // make sure count doesn't exceed number of players
    if (playerCount > 0) {
      if ((playerCount - nextPlayerStart) < 5) {
        iMax = playerCount - nextPlayerStart;
      } else {
        iMax = nextPlayerStart + 5;
      }
    } else {
      iMax = nextPlayerStart + 5;
    }
    for (i = nextPlayerStart; i < iMax; i++) {
      // create the elements, add to doc fragment
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
    // inject fragment
    player_list.appendChild(frag);
    // set the next starting count
    nextPlayerStart = nextPlayerStart + 5;
    // note that because getElementsByName gets a dynamic collection,
    // the new elements are automatically added to it
    iMax = radioGroup.length;
    // set event listeners on the new set of radio buttons
    for (i = 0; i < iMax; i++) {
      radioGroup[i].addEventListener('change', function() {
        playerToDelete = getRadioValue(radioGroup);
        createRequest('deletePlayer');
      });
    }
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
    // the proxy alreay has credentials for the default Brightcove Learning account
    // so no need to send them
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
          makeRequest(options, function(response) {
              responseDecoded = JSON.parse(response);
              // save the players array
              players = responseDecoded.items;
              // save the total player count
              playerCount = responseDecoded.item_count;
              api_response.textContent = JSON.stringify(responseDecoded, null, 2);
              // show the first 3 players - note that the API request
              // returns them in ascending order by date created,
              // so if you wanted to show the newest players first
              // you would start with the last item instead of the first
              showNextPlayerList();
          });
          break;

        case 'deletePlayer':
          endpoint            = '/' + options.account_id + '/players/' + playerToDelete;
          options.url         = baseURL + endpoint;
          options.requestType = 'DELETE';
          api_response.textContent = 'We are not actually going to delete player ' + playerToDelete + ' here, as that is an irreversible action. If you need to create an app that really deletes players, you will find the code in the JavaScript source code here, commented out.'

          /**
           * If you really wanted to delete the player
           * the lines commented out below would do it
           */
          // makeRequest(options, function(response) {
          //     responseDecoded = JSON.parse(response);
          //     api_response.textContent = JSON.stringify(responseDecoded, null, 2);
          //     showNextPlayerList();
          // });
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
             // any response status code in the 200 range indicates success
             if (httpRequest.status >= 200 && httpRequest.status < 300) {
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
