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
          baseURL = 'https://cms.api.brightcove.com/v1/accounts',
          endpoint,
          responseDecoded;

      // set credentials
      // assumes input fields with ids: account_id, client_id, and client_secret
      if (document.getElementById('client_id').value.length > 0 && document.getElementById('client_secret').value.length > 0)
      options.client_id     = document.getElementById('client_id').value;
      options.client_secret = document.getElementById('client_secret').value;
      options.proxyURL      = proxyURL;

      switch (type) {
          case 'getVideoCount':
              endpoint            = '/' + options.account_id + '/counts/videos';
              options.url         = baseURL + endpoint;
              options.requestType = 'GET';
              makeRequest(options, function(response) {
                  responseDecoded = JSON.parse(response);
                  // do what you want here
              });
              break;
          case 'createVideo':
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


})(window, document);
