var myPlayer,
    videoData = [],
    // Build options needed for CMS API request
    options = {},
    requestBody = {},
    baseURL = "https://cms.api.brightcove.com/v1/accounts/";

options.proxyURL = "https://solutions.brightcove.com/bcls/bcls-proxy/bcls-proxy-v2.php";
options.requestType = "GET";

// +++ Wait for loadedmetadata +++
videojs("myPlayerID").one('loadedmetadata', function(){
  myPlayer = this;
  // set up data for CMS API request
  setRequestData();
  // Make the CMS API request to get related videos
  makeRequest(options, function(relatedVideos) {
    if (relatedVideos) {
      // Convert response string into JSON
      JSONrelatedVideos = JSON.parse(relatedVideos);
      // extract the needed video data into an array
      videoData = extractVideoData(JSONrelatedVideos);
      // generate the HTML for the overlay
      videoList = createVideoList(videoData);
      // add the overlay
      addOverlayText(videoList);
    }
  });
});

// +++ Setup the API request +++
/**
  * sets up the data for the API request
  */
function setRequestData() {
  var endPoint = '',
      accountId,
      tagValue,
      videoName,
      endPoint,
      requestData = {};

  accountId = myPlayer.mediainfo.account_id;
  tagValue = myPlayer.mediainfo.tags[0];
  videoName = myPlayer.mediainfo.name;

  // return up to 9 videos which have a tag value equal to the current video tag value, excluding the current video by name
  endPoint = encodeURI('?q=tags:"' + tagValue + '"+-name:"' + videoName + '"&limit=9');
  options.url = baseURL + accountId + "/videos" + endPoint;
}

// +++ Make the CMS API request +++
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
              if (response === "{null}") {
                response = null;
              }
              // return the response
              callback(response);
            } else {
              alert(
                "There was a problem with the request. Request returned " +
                httpRequest.status
              );
            }
          }
        } catch (e) {
          alert("Caught Exception: " + e);
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
  httpRequest.open("POST", proxyURL);
  // set headers if there is a set header line, remove it
  // open and send request
  httpRequest.send(JSON.stringify(options));
}

// +++ Format the overlay content +++
/**
  * extract video data from CMS API response
  * @param {array} cmsData the data from the CMS API
  * @return {array} videoData array of video info
  */
function extractVideoData(cmsData) {
  var i,
      iMax = cmsData.length,
      videoItem;
  for (i = 0; i < iMax; i++) {
    if (cmsData[i].id !== null || cmsData[i].images.thumbnail.src !== null) {
      videoItem = {};
      videoItem.id = cmsData[i].id;
      videoItem.name = cmsData[i].name;
      videoItem.thumbnail = cmsData[i].images.thumbnail.src;
      videoData.push(videoItem);
    }
  }
  return videoData;
}

/**
  * create the html for the overlay
  * @param {array} videoData array of video objects
  * @return {HTMLElement} videoList the div element containing the overlay
  */
function createVideoList(videoData) {
  var i,
      iMax = videoData.length,
      videoList = createEl('div', {
        id: 'videoList'
      }),
      videoWrapper = createEl('div'),
      thumbnailLink,
      thumbnailImage;

  videoList.appendChild(videoWrapper);
  for (i = 0; i < iMax; i++) {
    thumbnailLink = createEl('a', {
      href: 'javascript:loadAndPlay(' + i + ')'
    })
    thumbnailImage = createEl('img', {
      class: 'video-thumbnail',
      src: videoData[i].thumbnail
    });
    videoWrapper.appendChild(thumbnailLink);
    thumbnailLink.appendChild(thumbnailImage);
  }
  return videoList;
}

/**
  * create an element
  *
  * @param  {string} type - the element type
  * @param  {object} attributes - attributes to add to the element
  * @return {HTMLElement} the HTML element
  */
function createEl(type, attributes) {
  var el,
      attr;

  el = document.createElement(type);
  if (attributes !== null) {
    for (attr in attributes) {
      el.setAttribute(attr, attributes[attr]);
    }
    return el;
  }
}

/**
  * adds text content to an element
  * @param {HTMLElement} el the element
  * @param {string} str the text content
  */
function addText(el, str) {
  el.appendChild(document.createTextNode(str));
}

/**
  * intializes the overlay plugin with the related video thumbnails
  * @param {HTML} overlayContent the HTML for the overlay
  */
function addOverlayText(overlayContent) {
  myPlayer.overlay({
    overlays: [{
      content: overlayContent,
      start: 'pause',
      end: 'play'
    },
    {
      start: 'end',
      end: 'play'
     }]
  });
}

// +++ Load and play related video +++
/**
  * loads and plays a video
  * this function called when thumbnails in the overlay are clicked
  * @param {integer} idx the index of the video object in the videoData array
  */
loadAndPlay = function(idx) {
  var currentId = videoData[idx].id;
  myPlayer.catalog.getVideo(currentId, function(error, video) {
    try {
      myPlayer.catalog.load(video);
    } catch (e) {
      myPlayer.catalog.load(video);
    }
    myPlayer.play();
  });
}
