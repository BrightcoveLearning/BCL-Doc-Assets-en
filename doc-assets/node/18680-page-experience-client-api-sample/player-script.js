  var BCLS = ( function (window, document) {
    var experience = window.top.bcov.gal.getEmbed('experience_5bb2134180b4990011750f06'),
    current_state = document.getElementById('current_state'),
    current_video = document.getElementById('current_video'),
    current_position = document.getElementById('current_position');
    console.log('experience', experience);

    // var videos = experience.getAllVideos();
    // console.log('videos', videos);
    // event listeners

    experience.on('videoChanged', function() {
      current_video.textContent = experience.getCurrentVideo();
      console.log('current video', experience.getCurrentVideo());
      current_position.textContent = '0';
    });

    experience.on('playerLoad', function() {
      current_video.textContent = experience.getCurrentVideo();
      console.log('current video', experience.getCurrentVideo());
    });

    experience.on('videoStarted', function() {
      var interval;
      video_paused.textContent = 'false';
      current_position.textContent = '0';
    });

    experience.on('videoPaused', function() {
      var interval;
      video_paused.textContent = 'true';
    });

  })(window, document);
