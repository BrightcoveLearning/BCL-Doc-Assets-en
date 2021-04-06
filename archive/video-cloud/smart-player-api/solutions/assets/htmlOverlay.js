(function() {
    console.log("marquee.js loaded");

    function onPlayerReady() {
        overlay = videoPlayer.overlay();

        $fb.appendTo(overlay);

        videoPlayer.addEventListener(brightcove.api.events.MediaEvent.STOP, mediaStopHandler);
        videoPlayer.addEventListener(brightcove.api.events.MediaEvent.PLAY, mediaBeginHandler);
    }

    function onScrollClicked(e) {
        window.open('http://www.mtv.com/', '_newtab');
    }

    function mediaBeginHandler(e) {
        $fb.hide();
        setTimeout(function drawCanvas(){
           scrollBug = document.createElement('canvas');
           scrollBug.height = 30;
           scrollBug.width = 480;
           $(scrollBug).css({
              position: 'absolute',
              top: '10px',
           });
           context = scrollBug.getContext('2d');
           context.fillStyle = "White"
           context.shadowColor = "Black";
           context.shadowOffsetX = 2;
           context.shadowOffsetY = 2;
           context.shadowBlur = 3;
           context.font = "18pt Segoe UI";

           var text = 'All New Episodes Start June 5th! Tap Here for a Sneak Preview.'
           var metrics = context.measureText(text);

           currentX = scrollBug.width;
           currentY = scrollBug.height - 10;
           clearInterval(marquee);
           marquee = setInterval(function() {
              context.clearRect( 0, 0, 480, 30 );
              context.fillText( text, currentX, currentY );
              currentX -= 2;
              if( currentX + metrics.width < 0 ) {
                 currentX = 600;
              }
           }, 20 );
           $(scrollBug).click(onScrollClicked);
           overlay.appendChild(scrollBug);
        },1);
    }

    function mediaStopHandler(e) {
        overlay.removeChild(scrollBug);
        $(".fb-like").css({'background-color':'white','left':'127px','top':'117px','border':'thin solid black','padding':'10px 0 0 15px'});
        setTimeout($fb.show(),300);
    }

    player = brightcove.api.getExperience();
    videoPlayer = player.getModule(brightcove.api.modules.APIModules.VIDEO_PLAYER);
    experience = player.getModule(brightcove.api.modules.APIModules.EXPERIENCE);
    content = brightcove.api.getExperience('myExperience').getModule('content');
    var overlay,scrollBug,marquee,$fb;

    $fb =
       $('<div class="fb-like" data-send="false" data-width="225" data-show-faces="false" data-font="arial"></div>')
          .hide()
          .appendTo(document.body);

    if (experience.getReady()) {
        onPlayerReady();
    } else {
        experience.addEventListener(brightcove.player.events.ExperienceEvent.TEMPLATE_READY, onPlayerReady);
    }

    fbroot = document.createElement('div')
    fbroot.id = 'fb-root';
    document.body.appendChild(fbroot);

    (function(d, s, id) {
           var js, fjs = d.getElementsByTagName(s)[0];
           if (d.getElementById(id)) return;
           js = d.createElement(s); js.id = id;
           js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";
           fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));


}());

