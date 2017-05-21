var BCLSfinder = ( function (window, document) {
    var h1 = document.getElementsByTagName('h1')[0],
        // change newSite value to //support.brightcove.com when we go live
        newSite = '//stage.bcdocs.pronovix.net',
        searchURL,
        searchTag,
        searchLink,
        homeLink,
        message = '<p style="font-weight">To serve you better going forward, the Brightcove documentation site has been completely revamped. The downside is that some of the links you have been using are changed, and we apologize in advance for any inconvenience this causes.</p> <p style="font-weight">To get you as close as possible to the document you are seeking, an intelligent search has been implemented and will be executed when you click the Continue button located below. The search will very likely yield the desired document at or near the top of the returned list of documents.</p> <p style="font-weight">Please take the time to re-bookmark the page once you find it on the new site.</p> <p>For a video introduction to the new site, visit the <a id="homeLink" href="">home page</a> and watch the “Learn about the new Support site” video.</p><p style="text-align:center"><a id="searchLink" href=""><button class="bcls-button">Continue</button></a></p>';

    function injectMessage(el) {
        el.insertAdjacentHTML('beforebegin', message);
        homeLink = document.getElementById('homeLink');
        searchLink = document.getElementById('searchLink');
        homeLink.setAttribute('href', newSite);
        searchLink.setAttribute('href', searchURL);
    }

    if (h1) {
        searchURL = newSite + '/search/search=' + encodeURI(h1.textContent);
        injectMessage(h1);
    } else {
        var h2 = document.getElementsByTagName('h2')[0];
        searchURL = newSite + '/search/search=' + encodeURI(h2.textContent);
        injectMessage(h2);
    }

})(window, document);
