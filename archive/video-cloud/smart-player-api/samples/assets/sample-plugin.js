(function() {
    console.log("************ mediaEventPlugin.js has loaded ******************");

    function onPlayerReady() {
        videoPlayer.addEventListener(brightcove.api.events.MediaEvent.BEGIN, mediaBeginEventHandler);
        videoPlayer.addEventListener(brightcove.api.events.MediaEvent.PLAY, mediaEventHandler);
        videoPlayer.addEventListener(brightcove.api.events.MediaEvent.CHANGE, mediaEventHandler);
        videoPlayer.addEventListener(brightcove.api.events.MediaEvent.STOP, mediaEventHandler);
        videoPlayer.addEventListener(brightcove.api.events.MediaEvent.SEEK_NOTIFY, mediaEventHandler);
        videoPlayer.addEventListener(brightcove.api.events.MediaEvent.MEDIA_ERROR, mediaEventHandler);
        videoPlayer.addEventListener(brightcove.api.events.MediaEvent.COMPLETE, mediaEventHandler);
        videoPlayer.addEventListener(brightcove.api.events.CuePointEvent.CUE, cuePointHandler);
    }

    // Show video and rendition info here since BEGIN fires once and only once per video.
    function mediaBeginEventHandler(pEvent) {
        mediaEventHandler(pEvent);
        showCurrentVideo();
        showCurrentRendition();
    }

    function mediaEventHandler(pEvent) {
        console.log("EVENT: " + pEvent.type + " fired.  Video position: " + pEvent.position);
    }

    function cuePointHandler(pEvent) {
        console.log("EVENT: " + pEvent.type + " fired (" + pEvent.cuePoint.time + ", " + pEvent.cuePoint.metadata + ")");
    }

    function showCurrentVideo() {
        var video = videoPlayer.getCurrentVideo();
        console.log("--------------");
        console.log("Current Video:");
        console.log("--------------");
        showObject(video);
    }

    function showCurrentRendition() {
        var rendition = videoPlayer.getCurrentRendition();
        console.log("------------------");
        console.log("Current Rendition:");
        console.log("------------------");
        showObject(rendition);
    }

    function showObject(pObject) {
        for (var item in pObject) {
            console.log("  " + item + " = " + pObject[item]);
        }
    }

    player = brightcove.api.getExperience();
    videoPlayer = player.getModule(brightcove.api.modules.APIModules.VIDEO_PLAYER);
    experience = player.getModule(brightcove.api.modules.APIModules.EXPERIENCE);

    if (experience.getReady()) {
        onPlayerReady();
    } else {
        experience.addEventListener(brightcove.player.events.ExperienceEvent.TEMPLATE_READY, onPlayerReady);
    }
}());