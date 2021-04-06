# Delivery System API v1

The Delivery System APIs allow for the management and deployment of a group of files, called a repository. These files are managed through REST APIs and through git. These files are delivered, on every "git push", to players.brightcove.net.

These APIs are used internally by our own player management APIs, but we've also decided to expose them to everyone to allow fine-grained managing of what gets deployed for your players. You can also use them for completely custom players.

## Using the APIs: overview

The delivery system APIs are centered around repositories, otherwise known as repos. You can manage repos through a group of REST APIs that allow you to add, get, and list your repos.

Note: if you haven&#39;t gone through the <a href="/en/video-cloud/player-management/playertour.html">player tour</a>, it&#39;s highly suggested you start there.  You&#39;ll get security set up, learn some of the basics of the system.

We use the command-line tool curl to help show usage of the REST APIs. You can't use the examples directly as written, however, as a number of placeholders are used. Substitute in the envrionment variable or value for the following: [ACCOUNT_ID], [REPO_NAME], [ACCESS_TOKEN], [USERNAME]

The REST APIs return responses in JSON format containing the following information on success:

* name: The repo name. This is the same as the name found in the REST API URLs.
* public_url: The base URL where the repo files can be seen.

## <a id="baseURL"></a>Base URL

The base URL for the Delivery System API is:

    http://repos.api.brightcove.com/v1

## <a id="authorization"></a>Using the REST APIs: two ways to authorize

You can authorize yourself using either <a href="http://localhost/en/video-cloud/player-management/oauth/OAuth.html">OAuth access tokens</a> or through Basic Authentication using your Video Cloud username and password. The standard OAuth access tokens should be used for any programmatic usage of the APIs, but the Basic Authentication route is a lot easier for command-line usage and getting started.

We'll use Basic Authentication in the examples below. If you wanted to use access tokens instead, change:

    --user [USERNAME]
    
to:

    --header "Authorization: Bearer [ACCESS_TOKEN]"
    
    
    
## <a id="errorMessages"></a>Error messages

Error messages are returned using the response status codes of a request to the API. Status Codes correspond to those defined by W3. Some of the most commonly seen codes are:

* 200 Request success
* 201 Created (a player, a configuration)
* 400 Bad request - the syntax of the API call is likely incorrect
* 401 Unauthorized - check that you have followed the oauth instructions correctly.
* 404 Not found - check the resource exists and the URL used in the API call is correct
* 500 Internal Server Error - there was an error trying to fulfil the request


## <a name="limitations"></a>Limitations

* There is currently no way to delete a player.
* The Delivery System APIs are not yet available via HTTPS.
* Currently only Player IDs and URLs are returned as a result of a list call. In the future, it will include player metadata e.g. name, description.
* Updating the configuration of a player with the same configuration(and therefore changing nothing) will result in an error. In the future this will return a 304(Not Modified) but currently returns: { "killed": false, "code": 1, "signal": null }
