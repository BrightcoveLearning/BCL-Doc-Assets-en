var BCLSfinder = ( function (window, document) {
    var pathArray = window.location.pathname.split('/'),
        path = pathArray[pathArray.length - 1],
        searchURL,
        searchLink = document.getElementById('searchLink'),
        homeLink;

        path = path.replace(/-/g, ' ');
        searchURL = 'https://support.brightcove.com/search?search=' + encodeURI(path);
        searchLink.setAttribute('href', searchURL);
})(window, document);
