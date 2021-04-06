  var BCLS = (function() {
    var playlistShowing = true,
      player,
      APImodules,
      mediaEvent,
      videoPlayer,
      contentModule,
      sitePath = window.location.pathname,
      siteLanguage = "en",
      totalTime = 0,
      $nextItem,
      $videoPlayer = $('#videoPlayer'),
      $videoPlayerChildren = $videoPlayer.children(),
      $playlist = $('#playlist'),
      $playlistChildren = $playlist.children(),
      $relatedLink = $('#relatedLink'),
      $flipButton = $('#flipButton'),
      relatedLink = {},
      playlistID = $playlist.attr("data-playlistID"),
      playlistTemplate = "{{#videos}}<div class=\"bcl-playlist-item\" id=\"{{id}}\"><img src=\"{{thumbnailURL}}\"/><div><h4>{{displayName}}</h4><p>{{shortDescription}} [ {{length.m}}:{{length.s}} ]</p></div></div>{{/videos}}",
      relatedLinkTemplate = "Related document: <a href=\"{{linkURL}}\">{{linkText}}</a>";
    /*************
     * get/set language
     *************/
    if (sitePath.indexOf("/en/") > -1) {
      siteLanguage = "en";
    } else if (sitePath.indexOf("/de/") > -1) {
      siteLanguage = "de";
    } else if (sitePath.indexOf("/es/") > -1) {
      siteLanguage = "es";
    } else if (sitePath.indexOf("/fr/") > -1) {
        siteLanguage = "fr";
    } else if (sitePath.indexOf("/ja/") > -1) {
        siteLanguage = "ja";
    };
    switch (siteLanguage) {
        case "en":
            playerButtonLabelText = BCLSbuttons.en.showPlayer;
            topicsButtonLabelText = BCLSbuttons.en.showTopics;
            break;
        case "de":
            playerButtonLabelText = BCLSbuttons.de.showPlayer;
            topicsButtonLabelText = BCLSbuttons.de.showTopics;
            break;
        case "es":
            playerButtonLabelText = BCLSbuttons.es.showPlayer;
            topicsButtonLabelText = BCLSbuttons.es.showTopics;
            break;
        case "fr":
            playerButtonLabelText = BCLSbuttons.fr.showPlayer;
            topicsButtonLabelText = BCLSbuttons.fr.showTopics;
            break;
        case "ja":
            playerButtonLabelText = BCLSbuttons.ja.showPlayer;
            topicsButtonLabelText = BCLSbuttons.ja.showTopics;
            break;
        default:
            playerButtonLabelText = BCLSbuttons.en.showPlayer;
            topicsButtonLabelText = BCLSbuttons.en.showTopics;
            break;
    }
    return {
      /** template loaded event handler **/
      onTemplateLoad: function(experienceID) {
        // get a reference to the player and API Modules and Events
        player = brightcove.api.getExperience(experienceID);
        APImodules = brightcove.api.modules.APIModules;
        mediaEvent = brightcove.api.events.MediaEvent;
      },
      /** template ready event handler **/
      onTemplateReady: function(evt) {
        // get references to modules
        contentModule = player.getModule(APImodules.CONTENT);
        videoPlayer = player.getModule(APImodules.VIDEO_PLAYER);
        contentModule.getPlaylistByID(playlistID, BCLS.onPlaylistLoad);
        videoPlayer.addEventListener(mediaEvent.BEGIN, BCLS.onMediaBegin);
        videoPlayer.addEventListener(mediaEvent.COMPLETE, BCLS.onMediaComplete);
        $flipButton.click(BCLS.switchViews);
      },
      /***** handler for playlist return ****/
      onPlaylistLoad: function(playlistDTO) {
        var video = {},
        localizedData = {};
        for (var i = 0, max = playlistDTO.videos.length; i < max; i++) {
          video = playlistDTO.videos[i];
          totalTime += video.length;
          video.length = BCLSsecondsToTime(video.length / 1000);
          // if siteLanguage is EN,DE, or ES, need to modify the Handlebars template
          if (video.longDescription !== null && siteLanguage !== "ja") {
            localizedData = JSON.parse(video.longDescription);
            var languageObj = localizedData[siteLanguage];
            video.displayName = languageObj.name;
            video.shortDescription = languageObj.shortDescription;
          }
        }
        totalTime = BCLSsecondsToTime(totalTime / 1000);
        $('.BCL-objective').append(' ' + totalTime.h + ':' + totalTime.m);
        var template = Handlebars.compile(playlistTemplate);
        var data = playlistDTO;
        var results = template(data);
        $playlist.html(results);
        $playlist.fadeIn();
        $playlistItems = $('div.bcl-playlist-item');
        $playlistItems.click(BCLS.playVideo);
      },
      playVideo: function() {
        var $this = $(this);
        var videoID = $(this).attr("id");
        $nextItem = $this.next(".bcl-playlist-item");
        $playlistItems.attr('class', 'bcl-playlist-item');
        $this.attr('class', 'bcl-highlight');
        if (playlistShowing) {
          BCLS.switchViews();
        }
        $flipButton.attr('class', 'BCLbutton');
        // cue the video, localize the title, then play
        videoPlayer.cueVideoByID(videoID);
        if (siteLanguage == "en" || "de" || "es" || "fr") {
          videoPlayer.getCurrentVideo(function(videoDTO) {
            var languageObj, currentLanguage;
            // check to see if longDescription exists and looks like JSON
            if (videoDTO.longDescription[0] == "{") {
              languageObj = JSON.parse(videoDTO.longDescription);
              currentLanguage = languageObj[siteLanguage];
              videoDTO.displayName = currentLanguage.name;
              videoDTO.shortDescription = currentLanguage.shortDescription;
              contentModule.updateMedia(videoDTO, function(newVideoDTO) {
                videoPlayer.play();
              });
            } else {
                videoPlayer.play();
            }
          });
        } else {
          videoPlayer.loadVideoByID(videoID);
        }
      },
      onMediaBegin: function(evt) {
        videoPlayer.getCurrentVideo(function(videoDTO) {
          if (videoDTO.linkText !== null) {
            var template = Handlebars.compile(relatedLinkTemplate);
            var data = videoDTO;
            var results = template(data);
            $relatedLink.html(results);
          } else {
            $relatedLink.html('');
          }
        });
      },
      onMediaComplete: function(evt) {
        if ($nextItem.length > 0) {
          // trigger a click on the next item
          $nextItem.trigger("click");
        } else {
          BCLS.switchViews();
        }
      },
      switchViews: function() {
        if (playlistShowing) {
          $playlist.fadeOut();
          $playlistChildren.fadeOut();
          $videoPlayer.attr('class', 'bcl-show');
          $videoPlayerChildren.attr('class', 'bcl-show');
          playlistShowing = false;
          $flipButton.html(topicsButtonLabelText);
        } else {
          $playlist.fadeIn();
          $playlistChildren.fadeIn();
          $videoPlayer.attr('class', 'bcl-hide');
          $videoPlayerChildren.attr('class', 'bcl-hide');
          $flipButton.html(playerButtonLabelText);
          playlistShowing = true;
        }
      }
    };
  })();