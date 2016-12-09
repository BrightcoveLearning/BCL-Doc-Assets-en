videojs.plugin('downloadVideoPlugin', function() {
  var myPlayer = this,
    videoID,
    totalRenditions,
    mp4Ara=[],
    highestQuality,
    downloadString,
    overlay;
  videoID = myPlayer.options()['data-video-id'];
  myPlayer.catalog.getVideo(videoID, function(error, video) {
    myPlayer.catalog.load(video);
    rendtionsAra = myPlayer.mediainfo.sources;
    totalRenditions = rendtionsAra.length;
    for (var i = 0; i < totalRenditions; i++) {
      if (rendtionsAra[i].container === "MP4" && rendtionsAra[i].hasOwnProperty('src')) {
        mp4Ara.push(rendtionsAra[i]);
      };
    };
    mp4Ara.sort( function (a,b){
      return b.size - a.size;
    });
    highestQuality= mp4Ara[0].src;
    downloadString = "<a target='_blank' href='" + highestQuality + "'>Download the Video</a>";
    overlay = document.createElement('p');
    overlay.className = 'download-overlay';
    overlay.innerHTML = downloadString;
    myPlayer.el().appendChild(overlay); 
    overlay.addEventListener('click', function(){
      overlay.style.visibility='hidden';
    });    
  });
});