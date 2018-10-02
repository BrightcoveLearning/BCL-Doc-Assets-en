  var BCLS = ( function (window, document) {
    var experience = window.top.bcov.gal.getEmbed(experience_5bb2134180b4990011750f06),
    current_video = document.getElementById('current_video'),
    video_paused = document.getElementById('video_paused');
    console.log('experience', experience);

    // var videos = experience.getAllVideos();
    // console.log('videos', videos);
    // event listeners

    experience.on('videoChanged', function() {
      current_video.textContent = experience.clientApi.getCurrentVideo();
      console.log('current video', experience.getCurrentVideo());
    });

    experience.on('playerLoad', function(player) {
      current_video.textContent = experience.clientApi.getCurrentVideo();
      console.log('current video', experience.clientApi.getCurrentVideo());
    });

    experience.on('videoStarted', function(video) {
      video_paused.textContent = 'false';
    });

    experience.on('videoPaused', function(video) {
      video_paused.textContent = 'true';
    });

  })(window, document);
