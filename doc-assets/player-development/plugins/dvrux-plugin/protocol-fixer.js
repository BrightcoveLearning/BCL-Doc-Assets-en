videojs.plugin('pluginDev', function() {
    var player = this,
        protocol = window.location.protocol;
    overlay.className = 'vjs-overlay';
    overlay.innerHTML = "Becoming a plugin developer";
    player.el().appendChild(overlay);
});
