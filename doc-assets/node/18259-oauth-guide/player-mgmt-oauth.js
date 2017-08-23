var BCLS = (function () {
    "use strict";
	  var proxyURL = "https://solutions.brightcove.com/bcls/bcls-proxy/bcls-proxy.php",
        serviceURL = "https://players.api.brightcove.com/v2",
        $accountID = document.getElementById("accountID"),
            account_id = "",
        $client_id = document.getElementById("client_id"),
            // for testing purposes
            client_id = "",
        $client_secret = document.getElementById("client_secret"),
            // for testing purposes
            client_secret = "",
        $playerID = document.getElementById("playerID"),
            player_id = "",
        $generateButton = document.getElementById("generateButton"),
        $requestInputs = document.getElementByClassName("papi-request"),
        $responseFrame = document.getElementById("responseFrame"),
        $generatedResults = document.getElementById("generatedResults");

    /**
     * Logging function - safe for IE
     * @param  {string} context - description of the data
     * @param  {*} message - the data to be logged by the console
     * @return {}
     */
    function bclslog(context, message) {
        if (window.console && console.log) {
          console.log(context, message);
        }
        return;
    }

    /**
     * tests for all the ways a variable might be undefined or not have a value
     * @param {*} x the variable to test
     * @return {Boolean} true if variable is defined and has a value
     */
    function isDefined(x) {
        if ( x === '' || x === null || x === undefined) {
            return false;
        }
        return true;
    }

    // submit request to get player configuration data for account
    function getPlayerData() {
        if ($accountID.value.length == 0 ||
            $client_id.value.length == 0 ||
            $client_secret.value.length == 0 ||
            $playerID.value.length == 0) {
                alert("Please enter your data before submitting the request");
                return;
        }
        var options = {};
        options.client_id = (isDefined($client_id.value)) ? $client_id.value : client_id;
        options.client_secret = (isDefined($client_secret.value)) ? $client_secret.value : client_secret;

        var values = {};
        values.account_id = (isDefined($accountID.value)) ? $accountID.value : account_id;
        values.player_id = (isDefined($playerID.value)) ? $playerID.value : player_id;

        options.url = serviceURL + "/accounts/" + values.account_id + "/players/" + values.player_id + "/configuration";
        options.requestType = "GET";

        bclslog("options", options);
        $.ajax({
            url: proxyURL,
            type: "POST",
            data: options,
            success : function (data) {
                console.log("successful call: " );
                console.log(data);
                $generatedResults.html(data);
            },
            error : function (XMLHttpRequest, textStatus, errorThrown) {
                $generatedResults.html("Sorry, the GET request to read player data for your account was not successful. Here's what the server sent back: " + errorThrown);
            }
        });
    }

    // set listeners for buttons
    console.log("Player Management API script");
    console.log("set button listeners");
    $generateButton.on("click", getPlayerData);

})();
