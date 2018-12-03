videojs.getPlayer('myPlayerID').ready(function() {
  // Get a reference to the player
  var myPlayer = this;

  // +++ Set the playlist to repeat +++
  myPlayer.playlist.repeat(true);

  // +++ Display the title and description +++
  myPlayer.on("loadstart", function() {
    sizePlayer();
    videoTitle.textContent = myPlayer.mediainfo.name;
    videoDescription.textContent = myPlayer.mediainfo.description;
    function sizePlayer() {
      var windowWidth = window.innerWidth,
        windowHeight = window.innerHeight,
        playerWidth,
        playerHeight,
        windowAspectRatio = windowWidth / windowHeight;
        /* If the aspect ratio of the window is
         greater than or equal to 16:9, we will set
         the player width to 100% and then set the
         width to match the 16:9 aspect ratio. If
         the window aspect ratio is less than 16:9,
         we will set the height to 100% and the width
         accordingly */
      if (windowAspectRatio >= (16 / 9)) {
        playerWidth = windowWidth;
        playerHeight = (9 / 16) * playerWidth;
      } else {
        playerHeight = windowHeight;
        playerWidth = (16 / 9) * playerHeight;
      }
      // now use the Player API to set the actual width and height
      myPlayer.width(playerWidth);
      myPlayer.height(playerHeight);
    }
    window.addEventListener('resize', function(){
      sizePlayer();
    })
  });
});
