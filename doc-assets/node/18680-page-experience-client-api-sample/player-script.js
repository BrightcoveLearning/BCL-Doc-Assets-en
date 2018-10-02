  var BCLS = ( function (window, document) {
    var experience = window.top.bcov.gal.getEmbed('experience_5bb2134180b4990011750f06'),
    current_state = document.getElementById('current_state'),
    current_video = document.getElementById('current_video'),
    current_position = document.getElementById('current_position');
    console.log('experience', experience);

    // var videos = experience.getAllVideos();
    // console.log('videos', videos);
    // event listeners

    experience.on('videoChanged', function(video) {
      // current_video.textContent = experience.getCurrentVideo();
      console.log('current video', video);
    });

    experience.on('playerLoad', function(player) {
      // current_video.textContent = experience.getCurrentVideo();
      console.log('player', player);
    });

    experience.on('videoStarted', function(video) {
      console.log('video started', video);
    });

    experience.on('videoPaused', function(video) {
      console.log('video paused', video);
    });

  })(window, document);
