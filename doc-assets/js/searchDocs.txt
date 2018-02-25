var BCLSfinder = ( function (window, document) {
    var h1 = document.getElementsByTagName('h1')[0],
    article = document.getElementsByTagName('article')[0],
        // change newSite value to //support.brightcove.com when we go live
        newSite = 'https://support.brightcove.com',
        searchURL,
        searchTag,
        searchLink,
        homeLink,
        message = '<div style="padding:1em;background-color:#EEEEEE"><p style="font-weight:bold">To serve you better going forward, the Brightcove documentation site has been completely revamped. The downside is that some of the links you have been using are changed, and we apologize in advance for any inconvenience this causes.</p> <p style="font-weight:bold">To get you as close as possible to the document you are seeking, an intelligent search has been implemented and will be executed when you click the Continue button located below. The search will very likely yield the desired document at or near the top of the returned list of documents.</p> <p style="font-weight:bold">Please take the time to re-bookmark the page once you find it on the new site.</p> <p style="font-weight:bold">For a video introduction to the new site, visit the <a id="homeLink" href="">home page</a> and watch the “Learn about the new Support site” video.</p><p style="text-align:center"><a id="searchLink" href=""><span class="bcls-button">Continue</span></a></p></div>';

    function injectMessage(el) {
        el.insertAdjacentHTML('afterbegin', message);
        homeLink = document.getElementById('homeLink');
        searchLink = document.getElementById('searchLink');
        homeLink.setAttribute('href', newSite);
        searchLink.setAttribute('href', searchURL);
    }

    if (h1) {
        searchURL = newSite + '/search?search=' + encodeURI(h1.textContent);
        injectMessage(article);
    } else {
        var h2 = document.getElementsByTagName('h2')[0];
        searchURL = newSite + '/search?search=' + encodeURI(h2.textContent);
        injectMessage(h2);
    }

})(window, document);
