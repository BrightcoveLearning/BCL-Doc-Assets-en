// brightcove.hivewrapper.js v1.0
// This plug-in augments use of Hive Streaming Brightcove plug-in with standard Brightcove 
// javascript or iFrame player embed code.  The plug-in extracts the Hive Streaming ticket
// from a Custom Field named "hivestreaming" and provides it to the Hive Streaming
// Brightcove plug-in.

videojs.plugin('hivewrapper', function () {

    // Find the <video> element and assign it to a var
    var vidElement = document.querySelector('video');
    var myPlayer;

    console.log("** brightcove.hivewrapper.js v1.0");

    // Pass the Player to videojs via an element, rather than an ID
    videojs(vidElement).ready(function () {
        myPlayer = this;

        // Get video ID from URL parameter videoId in iFrame embed such as 
        // players.brightcove.net/PUBID/PLAYERID_default/index.html?videoId=VIDEOID   
        var videoID = getQueryParams().videoId;

        // If videoId not defined then assume javascript embed was used instead 
        // of iFrame and set videoId to value in data-video-id.
        if (videoID == null) {
            // access the <video> element's attributes
            videoID = vidElement.getAttribute('data-video-id');
        }

        console.log("** Brightcove videoID: ", videoID);

        // Get the current video object to pull Hive ticket from a Custom Field
        myPlayer.catalog.getVideo(videoID, function (error, video) {
            var ticket = video.customFields["hivestreaming"];

            if (ticket != null) {

                // If videoId is not defined then assume javascript embed was used and 
                // remove data-video-id from page so player will not attempt play from 
                // the original manifest URL.
                if (videoID == null) {
                    vidElement.removeAttribute("data-video-id");
                }

                // Call the Hive plugin initSession() and pass the ticket URL
                // from the Brightcove Custom Field. The plug-in will then rewrite
                // the src to the localhost Hive client serving the stream.
                myPlayer.initSession(ticket, function (manifest, session) {

                    console.log("** Hive Streaming playing stream manifest: " + manifest + " with Hive Streaming tech: " + session.tech);
                    myPlayer.src([{
                        src: manifest,
                        type: "application/x-mpegURL"
                    }]);

                }, function () {
                    console.log("**************************ERROR************************");
                    console.log("** Hive Streaming could not resolve the ticket.");
                    console.log("** Verify that a Hive Streming ticket has been");
                    console.log("** created for the videoID ", videoID, " and that it has");
                    console.log("** been saved to a CustomField named 'hivestreaming'.");
                });

            } else {
                console.log("**************************ERROR*************************");
                console.log("** Hive Streaming ticket not found in 'hivestreaming'");
                console.log("** Custom Field. Verify that a Hive Streaming ticket");
                console.log("** has been created for the videoID ", videoID, " and");
                console.log("** that it has been saved to a Custom Field named");
                console.log("** 'hivestreaming'.");
            }
        });
    });

    // utility function to get URL parameters - returns them as an object/JSON
    function getQueryParams() {
        var qs = document.location.search;
        qs = qs.split('+').join(' ');
        var params = {},
            tokens,
            re = /[?&]?([^=]+)=([^&]*)/g;
        while (tokens = re.exec(qs)) {
            params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        }
        return params;
    }

});
