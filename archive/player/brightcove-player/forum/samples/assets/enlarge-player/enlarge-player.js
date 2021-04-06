videojs.plugin('enlargePlayer', function() {
    var player = this,
        // set the large and small sizes
        // you could also all options to be passed in to set these sizes
        largeWidth = 640,
        largeHeight = 360,
        smallWidth = 272,
        smallHeight = 153,
        // get a reference to the player wrapper
        // if that element doesn't exist in the HTML, this plugin will fail
        playerWrapper = document.getElementById('playerWrapper');

    /**
     * make the player large
     */
    function makePlayerLarge() {
        playerWrapper.setAttribute('style', 'width:' + largeWidth + 'px;height:' + largeHeight + 'px;transition: width .4s ease-in-out, height .4s ease-in-out;');
    }

    /**
     * make the player small
     */
    function makePlayerSmall() {
        playerWrapper.setAttribute('style', 'width:' + smallWidth + 'px;height:' + smallHeight + 'px;transition: width .4s ease-in-out, height .4s ease-in-out;');
    }

    /**
     * add the mouseout event listener
     */
    function mouseoutOn() {
        // add the event listener to make the player small on mouseout
        playerWrapper.addEventListener('mouseout', makePlayerSmall);
        // make the player small now
        makePlayerSmall();
    }

    /**
     * remove the mouseout event listener
     */
    function mouseoutOff() {
        // remove the mouseout event listener
        playerWrapper.removeEventListener('mouseout', makePlayerSmall);
    }

    // make sure the player wrapper exists - otherwise, do nothing
    if (playerWrapper !== null) {
        // initially, make sure the player is small
        makePlayerSmall();
        // on mouseover make the player large
        playerWrapper.addEventListener('mouseover', makePlayerLarge);
        // on mouseout, make the player small
        mouseoutOn();
        // on play, keep the player large
        player.on('play', mouseoutOff);
        // on pause or video end, make the player small
        player.on('pause', mouseoutOn);
        player.on('ended', mouseoutOn);
    }

});
