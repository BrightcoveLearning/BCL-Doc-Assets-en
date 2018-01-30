var BCLS_fix_nav = ( function (window, document) {
  var block_inpagenavigationblock = document.getElementById('block-inpagenavigationblock'),
    sidenav = document.getElementById('sidenav');

    function removeElement(elementId) {
    // Removes an element from the document
    var element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
}

    block_inpagenavigationblock.innerHTML = sidenav.innerHTML;

})(window, document);
