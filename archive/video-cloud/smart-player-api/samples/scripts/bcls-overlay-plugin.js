(function() {
    // logging for debugging purposes
    bclslog = function( message ) {
      if ( window["console"] && console["log"] ) {
        console.log(message);
      };
    }
    
    var player,
        videoPlayer,
        experience,
        overlay,
        videoDTO,
        // note that jquery is included in the HTML player page automatically
        $overlay,
        $mediaControls,
        $videoPosition,
        $videoLength,
        $positionIndicator,
        $overlayContent,
        $overlayImage,
        $playButton,
        overlayContent = "<div id=\"overlayContent\" style=\"cursor:pointer;width:auto;height:50px;position:absolute;top:90px;left:30%;padding:4px;\"><img id=\"overlayImage\" src=\"http://docs.brightcove.com/en/smart-player-api/samples/assets/PlayBlock.png\" /></div><div id=\"mediaControls\" style=\"position:absolute;top:238px;left:0;width:100%;height:30px;background-color:#000000;opacity:.7;z-index:99;\"> <img id=\"bclPlayButton\" class=\"paused\" style=\"cursor:pointer;z-index:101;margin-top:5px\" src=\"http://docs.brightcove.com/en/smart-player-api/samples/assets/bcl-play-button.png\"/> <span id=\"videoPosition\" style=\"position:relative;left:25px;bottom:10px;color:#DFE1E2 !important;font-size:12px;\"></span><div style=\"position:absolute;top:12px;left:110px;height:6px;width:320px;background-color:#777978;\"><div id=\"positionIndicator\" style=\"background-color:#b8bdbf;background-image:-webkit-gradient(linear,leftcenter,rightcenter,from(#b8bdbf),to(#fefefe));background-image:-webkit-linear-gradient(left,#b8bdbf,#fefefe);background-image:-moz-linear-gradient(left,#b8bdbf,#fefefe);background-image:-o-linear-gradient(left,#b8bdbf,#fefefe);background-image:-ms-linear-gradient(left,#b8bdbf,#fefefe);background-image:linear-gradient(left,#b8bdbf,#fefefe);filter:progid:DXImageTransform.Microsoft.gradient(GradientType=1,StartColorStr='#b8bdbf',EndColorStr='#fefefe');width:0;height:6px;\"></div></div><span id=\"videoLength\" style=\"color:#DFE1E2;font-size:12px;float:right;padding-top:8px;padding-right:5px\"></span></div>",
        overlayPaused = "http://docs.brightcove.com/en/smart-player-api/samples/assets/ResumeBlock.png",
        overlayComplete = "http://docs.brightcove.com/en/smart-player-api/samples/assets/ReplayBlock.png",
        overlayError = "http://docs.brightcove.com/en/smart-player-api/samples/assets/errorBlock.png";
    setUpOverlay = function () {
      
      // create the overlay and get a reference to it
      overlay = videoPlayer.overlay();
      // add the message block to the overlay
      $overlay = $('.bc-overlay');
      
      $overlay.html(overlayContent);
      
      $overlayContent = $("#overlayContent");
      $overlayImage = $("#overlayImage");
      
      // set up the media controls
      $mediaControls = $("#mediaControls");
      $videoPosition = $("#videoPosition");
      $videoLength = $("#videoLength");
      $positionIndicator = $("#positionIndicator");
      $playButton = $("#bclPlayButton");
      // mouseover/out events for overlay
      $overlay.on("mouseover", function ( evt ) {
        $mediaControls.css("opacity", .8);
      });
      $overlay.on("mouseout", function ( evt ) {
        $mediaControls.css("opacity", 0);
      })
      // get the video duration to set the length label
      $videoLength.html(videoPlayer.getVideoDuration(true));
      // set the initial value for the position label
      $videoPosition.html("00:00");
      // handle click events on the play button
      $playButton.on("click", function ( evt ) {
        
        if ($playButton.hasClass("playing")) {
          videoPlayer.pause(true);
          setButtonPaused();
        }
        else if ($playButton.hasClass("paused")) {
          videoPlayer.pause(false);
          setButtonPlaying();
        }
      });
      // overlay is initially shown
      showOverlayContent();
      // clicks on the overlay message block will play, resume, or replay the video
      $overlayContent.on("click", function ( evt ) {
        videoPlayer.play();
      });
      videoPlayerplayOverlayCallbacks({
        // return false on overlay shown to hide the native controls
        show : function() {
          showOverlayContent(overlayPaused)
          return false;
        },
        hide : function() {
          hideOverlayContent();
        }
      });
    }
    onPlayerReady = function () {
      // set up the event listeners
      var mediaEvent = brightcove.api.events.MediaEvent;
      videoPlayer.addEventListener( mediaEvent.BEGIN, onMediaBegin );
      videoPlayer.addEventListener( mediaEvent.PLAY, onMediaPlay );
      videoPlayer.addEventListener( mediaEvent.STOP, onMediaStop );
      videoPlayer.addEventListener( mediaEvent.MEDIA_ERROR, onMediaError );
      videoPlayer.addEventListener( mediaEvent.COMPLETE, onMediaComplete );
      videoPlayer.addEventListener( mediaEvent.PROGRESS, onMediaProgress );
      // get the current video DTO -- necessary?
      videoDTO = videoPlayer.getCurrentVideo();
      // initialize the overlay
      setUpOverlay();
    }
    setButtonPlaying = function () {
      $playButton.attr("src", "http://docs.brightcove.com/en/smart-player-api/samples/assets/bcl-pause-button.png");
      $playButton.removeClass("paused");
      $playButton.addClass("playing");
    };
    setButtonPaused = function () {
      $playButton.attr("src", "http://docs.brightcove.com/en/smart-player-api/samples/assets/bcl-play-button.png");
      $playButton.removeClass("playing");
      $playButton.addClass("paused");
    };
    showOverlayContent = function () {
      $overlayContent.css("opacity", 1);
    };
    hideOverlayContent = function () {
      $overlayContent.css("opacity", 0);
      setButtonPlaying();
    };
    showOverlayContentForPaused = function () {
      showOverlayContent();
      $overlayImage.attr("src", overlayPaused);
      setButtonPaused();
    };
    showOverlayContentForReplay = function () {
      showOverlayContent();
      $overlayImage.attr("src", overlayComplete);
      setButtonPaused();
    };
    showOverlayContentForError = function () {
      showOverlayContent();
      $overlayImage.attr("src", overlayError);
    };
    // hide the overlay when the video starts
    onMediaBegin = function ( evt ) {
      
      hideOverlayContent();
    }
    // show the paused overlay when the video is stopped
    onMediaStop = function ( evt ) {
      
      // if time remaining is more than .2 sec, assume a pause
      if ( evt.duration - evt.position > .2 ) {
        showOverlayContentForPaused();
      } else {
        // assume it's complete
        showOverlayContentForReplay();
      }
    };
    // hide the overlay on video resume
    onMediaPlay = function ( evt ) {
      
      hideOverlayContent();
    };
    // show replay overlay on video complete
    onMediaComplete = function ( evt ) {
      
      showOverlayContentForReplay( overlayComplete );
    };
    onMediaError = function ( evt ) {
      
      showOverlayContentForError();
    };
    onMediaProgress = function ( evt ) {
      // 320px is the timeline length set in the CSS
      // update the progress display for the controls
      progressLength = (evt.position / evt.duration) * 320;
      $positionIndicator.css("width", progressLength.toString() + "px");
      $videoPosition.html(videoPlayer.getVideoPosition(true));
    };
    player = brightcove.api.getExperience();
    videoPlayer = player.getModule(brightcove.api.modules.APIModules.VIDEO_PLAYER);
    experience = player.getModule(brightcove.api.modules.APIModules.EXPERIENCE);
    if (experience.getReady()) {
        onPlayerReady();
    } else {
        experience.addEventListener(brightcove.player.events.ExperienceEvent.TEMPLATE_READY, onPlayerReady);
    }
})();