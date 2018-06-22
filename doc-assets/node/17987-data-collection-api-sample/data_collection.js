
/*
 * Data Collection Plugin for Video JS
 * Version: 0.2
 * Author: Robert Crooks
 * Description: Send analytics events for the Video JS player to Brightcove Analytics
 * Options:
 *   showLog: if true (default) adds a log to page to show events sent
 *   accountID (Video Cloud account ID)
 *   videosCollection: array of video objects with properties:
 *       video_name
 *       id (Video Cloud video id)
 *       src (URL for http rendition to play)
 *       poster (URL for the video still)
 * Note: this is a sample only, not a supported Brightcove plugin
 */
(function(videojs, window, document) {
  "use strict";
  var defaults = {
      "showLog": "true",
      "accountID": 1752604059001,
      "videoCollection": [{
          "video_name": "Sea Turtle",
          "id": "4445295617001",
          "src": "//f1.media.brightcove.com/12/1752604059001/1752604059001_4445372009001_4445295617001.mp4?pubId=1752604059001&videoId=4445295617001",
          "poster": "https://httpsak-a.akamaihd.net/1752604059001/1752604059001_4445372001001_4445295617001-vs.jpg?pubId=1752604059001&videoId=4445295617001"
        },
        {
          "video_name": "Great Horned Owl",
          "id": "5566517295001",
          "src": "//f1.media.brightcove.com/4/57838016001/57838016001_5565773114001_5565770450001.mp4?pubId=1752604059001&videoId=5566517295001",
          "poster": "http://f1.media.brightcove.com/8/57838016001/57838016001_5565771700001_5565770450001-vs.jpg?pubId=1752604059001&videoId=5566517295001"
        }
      ]
    },
    settings,
    // functions
    extend,
    isDefined;
  /**
   * extend used to merge options and defaults into settings
   */
  extend = function() {
    var args, target, i, object, property;
    args = Array.prototype.slice.call(arguments);
    target = args.shift() || {};
    for (i in args) {
      object = args[i];
      for (property in object) {
        if (object.hasOwnProperty(property)) {
          if (typeof object[property] === "object") {
            target[property] = extend(target[property], object[property]);
          } else {
            target[property] = object[property];
          }
        }
      }
    }
    return target;
  };
  // more robust test for strings "not defined"
  isDefined = function(v) {
    if (v === "" || v === null || v === undefined) {
      return false;
    }
    return true;
  };
  /**
   * register the collectData plugin
   */
  videojs.plugin("collectData", function(options) {
    var player,
      eventLog = document.getElementById('eventLog'),
      changeVideoBtn,
      currentVideoIndex = 0,
      lastVideoIndex = 0,
      firstTimeUpdate = true,
      initialPosition = 0,
      lastPosition = 0,
      thisPageProtocol = document.location.protocol,
      // data-collection api
      baseURL = thisPageProtocol + "//metrics.brightcove.com/tracker?",
      // location properties
      destination = encodeURI(window.location.href),
      source = encodeURI(document.referrer);
    // load the next video into the player
    function loadVideo() {
      player.src({
        "type": "video/mp4",
        "src": settings.videoCollection[currentVideoIndex].src
      });
      /* each time we load a video, we want to add an event listener for the play event that will unload after one event */
      player.one("play", function(evt) {
        var dateTime = new Date();
        evt.timeStamp = dateTime.valueOf();
        logEvent("player-event", "play", "", dateTime.toISOString());
        sendAnalyticsEvent("video_view", evt);
      });
      // reset firstTimeUpdate
      firstTimeUpdate = true;
      // increment or reset current video index
      lastVideoIndex = currentVideoIndex;
      if (currentVideoIndex < (settings.videoCollection.length - 1)) {
        currentVideoIndex++;
      } else {
        currentVideoIndex = 0;
      }
    }
    /**
     * Injects API calls into the head of a document
     * as the src for a img tag
     * img is better than script tag for CORS
     * @param {string} requestURL The URL to call to send the data
     * @return true
     */
    function sendData(requestURL) {
      var scriptElement = document.createElement("img");
      scriptElement.setAttribute("src", requestURL);
      document.getElementsByTagName("body")[0].appendChild(scriptElement);
      return true;
    }
    // send analytics event
    function sendAnalyticsEvent(eventType, evt) {
      var urlStr = "",
        time = evt.timeStamp,
        dateTime = new Date(parseInt(evt.timeStamp)),
        currentVideo = settings.videoCollection[lastVideoIndex];
      // add params for all requests
      urlStr = "event=" + eventType + "&domain=videocloud&account=" + settings.accountID + "&time=" + time + "&destination=" + encodeURI(destination);
      // source will be empty for direct traffic
      if (source !== "") {
        urlStr += "&source=" + encodeURI(source);
      }
      // add params specific to video events
      if (eventType === "video_impression" || eventType === "video_view" || eventType === "video_engagement") {
        urlStr += "&video=" + currentVideo.id + "&video_name=" + encodeURI(currentVideo.video_name);
      }
      // add params specific to video_engagement events
      if (eventType === "video_engagement") {
        urlStr += "&video_duration=" + player.duration() + "&range=" + evt.range;
      }
      // add the base URL
      urlStr = baseURL + urlStr;
      // make the request
      sendData(urlStr);
      // log that we did this
      if (settings.showLog) {
        logEvent("analytics-event", eventType, ("Data Collection request: " + urlStr), dateTime.toISOString());
      }
      return;
    }

    function onTimeUpdate(evt) {
      var thisPosition = evt.timeStamp,
        range = "",
        dateTime = new Date(evt.timeStamp);
      if (firstTimeUpdate) {
        initialPosition = evt.timeStamp;
        lastPosition = evt.timeStamp;
        firstTimeUpdate = false;
      }
      if (Math.round(thisPosition / 1000) - Math.round(lastPosition / 1000) === 10) {
        // set the range and add it to the evt object
        range = ((lastPosition - initialPosition) / 1000).toString() + ".." + ((thisPosition - initialPosition) / 1000).toString();
        // reset lastPosition
        lastPosition = thisPosition;
        evt.range = range;
        // log player event
        if (settings.showLog) {
          logEvent("player-event", "position update", (((thisPosition - initialPosition) / 1000) + " sec"), dateTime.toISOString());
        }
        // send video_enagement event
        sendAnalyticsEvent("video_engagement", evt);
      }
    }
    // event logger
    function logEvent(eventType, event, data, dateTime) {
      var str = "";
      str += "<span class=\"" + eventType + "\">" + dateTime + "<br />" + eventType + ": " + event;
      if (data !== "") {
        str += " (" + data + " )";
      }
      str += "</span><br /><hr />";
      eventLog.innerHTML += str;
      return;
    }

    function init() {
      // add player event listeners
      player.on("loadstart", function(evt) {
        var dateTime = new Date(evt.timeStamp);
        if (settings.showLog) {
          logEvent("player-event", "loadstart", "", dateTime.toISOString());
        }
        sendAnalyticsEvent("video_impression", evt);
      });
      // add listener for loadedalldata
      player.on("loadedalldata", function() {
        var dateTime = new Date();
        if (settings.showLog) {
          logEvent("player-event", "loadedalldata", "", dateTime.toISOString());
        }
        player.play();
      });
      // add listener for video ended
      player.on("ended", function() {
        var dateTime = new Date();
        if (settings.showLog) {
          logEvent("player-event", "ended", "", dateTime.toISOString());
        }
        loadVideo();
      });
      // add listener for time updates events
      player.on("timeupdate", onTimeUpdate);
      // load the first video in the collection
      loadVideo();
    }
    // initial actions
    settings = extend(defaults, options);
    player = this;
    init();
    return;
  });
})(videojs, window, document);

// add plugin to player
videojs("dataCollector").ready(function() {
    var myPlayer = this,
        options = {};
    myPlayer.collectData(options);
});
