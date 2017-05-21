var BCLSfinder = ( function (window, document) {
    var homeDomain = '//' + window.location.hostname,
        pathArray = window.location.pathname.split('/'),
        path = pathArray[pathArray.length - 1],
        body = document.getElementById('messageHeader'),
        searchURL,
        searchTag,
        searchLink,
        homeLink,
        message = '<p style="font-weight">To serve you better going forward, the Brightcove documentation site has been completely revamped. The downside is that some of the links you have been using are changed, and we apologize in advance for any inconvenience this causes.</p> <p style="font-weight">To get you as close as possible to the document you are seeking, an intelligent search has been implemented and will be executed when you click the Continue button located below. The search will very likely yield the desired document at or near the top of the returned list of documents.</p> <p style="font-weight">Please take the time to re-bookmark the page once you find it on the new site.</p> <p>For a video introduction to the new site, visit the <a id="homeLink" href="">home page</a> and watch the “Learn about the new Support site” video.</p><p style="text-align:center"><a id="searchLink" href=""><button class="bcls-button">Continue</button></a></p>';

    function injectMessage(el) {
        body.insertAdjacentHTML('afterend', message);
        homeLink = document.getElementById('homeLink');
        searchLink = document.getElementById('searchLink');
        homeLink.setAttribute('href', homeDomain);
        searchLink.setAttribute('href', searchURL);
    }

        path = path.replace(/-/g, ' ');
        searchURL = homeDomain + '/search?search=' + encodeURI(path);
        injectMessage();

})(window, document);
