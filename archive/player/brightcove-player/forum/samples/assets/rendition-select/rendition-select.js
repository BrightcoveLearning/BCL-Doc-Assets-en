videojs.plugin('renditionSelectPlugin', function() {
    var myPlayer = this,
        videoID,
        videoName,
        totalRenditions,
        mp4Ara = [];

    videoID = myPlayer.options()['data-video-id'];
    myPlayer.catalog.getVideo(videoID, function(error, video) {
        myPlayer.catalog.load(video);
        videoName = myPlayer.mediainfo['name'];
        rendtionsAra = myPlayer.mediainfo.sources;
        totalRenditions = rendtionsAra.length;
        for (var i = 0; i < totalRenditions; i++) {
            if (rendtionsAra[i].container === "MP4" && rendtionsAra[i].hasOwnProperty('src')) {
                mp4Ara.push(rendtionsAra[i]);
            };
        };
        mp4Ara.sort(function(a, b) {
            return b.size - a.size;
        });
        highestQuality = mp4Ara[0].src;
        myPlayer.src(highestQuality);
    });
});
