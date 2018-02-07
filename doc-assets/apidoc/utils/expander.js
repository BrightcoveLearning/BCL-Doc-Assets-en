var BCLS_expander = (function(window, document) {
    var expanderHeads = document.getElementsByClassName('bcls-expander-head'),
        i,
        iMax;
    iMax = expanderHeads.length;

    function toggleBody() {
        console.log('toggle body');
        var expanderBody = this.nextElementSibling,
            thisParent = this.parentNode,
            siblings = thisParent.childNodes,
            expanderBodies = [],
            i,
            iMax;

        iMax = siblings.length;
        for (i = 0; i < iMax; i++) {
            if (siblings[i].className === 'bcls-expander-content') {
                expanderBodies.push(siblings[i]);
            }
        }
        if (expanderBody.getAttribute('style') === 'height:0;visibility:hidden;display:none;' || expanderBody.getAttribute('style') === null) {
            expanderBody.setAttribute('style', 'height:auto;visibility:visible;display:block;');
        } else {
            expanderBody.setAttribute('style', 'height:0;visibility:hidden;display:none;');
        }
    }

    for (i = 0; i < iMax; i++) {
        expanderHeads[i].addEventListener('click', toggleBody);
    }
})(window, document);
