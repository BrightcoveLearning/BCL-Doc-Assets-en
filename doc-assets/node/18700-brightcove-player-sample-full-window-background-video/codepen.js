videojs.getPlayer('myPlayerID').ready(function() {
  // Get a reference to the player
  var myPlayer = this;

  // +++ Set the playlist to repeat +++
  myPlayer.playlist.repeat(true);

  // +++ Display the title and description +++
  myPlayer.on("loadstart", function() {
    videoTitle.textContent = myPlayer.mediainfo.name;
    videoDescription.textContent = myPlayer.mediainfo.description;
    window.addEventListener('resize', function(){
      var windowWidth = window.innerWidth,
        windowHeight = window.innerHeight;
        /* If the aspect ratio of the window is
         greater than or equal to 16:9, we will set
         the player width to 100% and then set the
         width to match the 16:9 aspect ratio. If
         the window aspect ratio is less than 16:9
    })
  });
});
