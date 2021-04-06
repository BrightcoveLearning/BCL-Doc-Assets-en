videojs.plugin('logoOverlay', function(options) {
    var player = this,
        overlayOptions,
        overlayContent,
        defaultOptions = {
            align: 'bottom-right',
            imageURL : '//docs.brightcove.com/en/video-cloud/brightcove-player/samples/assets/logo-overlay-plugin/bc-logo.png',
            clickThruURL: '',
            start: 'loadstart',
            end: 'ended'
        };
    function endOverlay() {
        if (isDefined(parseInt(overlayOptions.end)) && player.currentTime() >= overlayOptions.end) {
            player.off('timeupdate', endOverlay);
            document.getElementsByClassName('vjs-overlay')[0].className += ' bcls-hide-overlay';
        }
    }

    function showOverlay() {
        // add the overlay
        player.overlay(
            {
                content: overlayContent,
                overlays: [
                    {
                        start: overlayOptions.start,
                        align: overlayOptions.align
                    }
                ]
            }
        );
        // handler for timeupdate events
        player.on('timeupdate', endOverlay);
    }

    /**
     * tests for all the ways a variable might be undefined or not have a value
     * @param {*} x the variable to test
     * @return {Boolean} true if variable is defined and has a value
     */
    function isDefined(x) {
        if ( x === '' || x === null || x === undefined || x === NaN) {
            return false;
        }
        return true;
    }

    /**
     * merges inputs or default values into a new settings object
     * @param {Object} inputOptions the input values
     * @param {Object} defaultOptions the default values
     * @return {Object} the settings object
     */
    function setOptions (inputOptions, defaultOptions) {
        var prop, settings = {}, aTag, imgTag;
        for (prop in defaultOptions) {
            if (defaultOptions.hasOwnProperty(prop)) {
                settings[prop] = (inputOptions.hasOwnProperty(prop)) ? inputOptions[prop] : defaultOptions[prop];
            }
        }
        return settings;
    }
    // merge default settings with options
    overlayOptions = setOptions(options, defaultOptions);
    // set the content
    imgTag = new Image();
    imgTag.onLoad = function () {
        imgTag.setAttribute('width', this.width);
        imgTag.setAttribute('height'. this.height);
    };
    imgTag.src = overlayOptions.imageURL;
    if (isDefined(overlayOptions.clickThruURL)) {
        aTag = document.createElement('a');
        aTag.setAttribute('href', overlayOptions.clickThruURL);
        aTag.setAttribute('target', '_blank');
        aTag.appendChild(imgTag);
        overlayContent = aTag.outerHTML;
    } else {
        overlayContent = imgTag.outerHTML;
    }
    // show the overlay
    showOverlay();

});
