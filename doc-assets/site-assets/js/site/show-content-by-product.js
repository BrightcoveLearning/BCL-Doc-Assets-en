var BCLSshowContentByProduct = ( function (window, document) {
    var pathArr = window.location.pathname.split('/'),
        bpContent = document.querySelectorAll('.perform-only'),
        vcContent = document.querySelectorAll('.video-cloud-only');

    /**
     * determines whether specified item is in an array
     *
     * @param {array} array to check
     * @param {string} item to check for
     * @return {boolean} true if item is in the array, else false
     */
    function arrayContains(arr, item) {
        var i,
            iMax = arr.length;
        for (i = 0; i < iMax; i++) {
            if (arr[i] === item) {
                return true;
            }
        }
        return false;
    }

    /**
     * sets style attribute display:none for each element in a nodeset
     * @param  {array|collection of nodes} nodeCollection elements to hide
     */
    function hideContent(nodeCollection) {
        var i, iMax, item;

        iMax = nodeCollection.length;
        for (i = 0; i < iMax; i++) {
            nodeCollection[i].setAttribute('style', 'display:none');
        }
    }

    // if product = perform, hide video cloud content and vice-versa
    if (arrayContains(pathArr, 'video-cloud')) {
        hideContent(bpContent);
    } else {
        hideContent(vcContent);
    }

})(window, document);
