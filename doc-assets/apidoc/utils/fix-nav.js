var BCLS_fix_nav = ( function (window, document) {
  var block_inpagenavigationblock = document.getElementById('block-inpagenavigationblock'),
    sidenav = document.getElementById('sidenav');

  /**
   * remove an HTML element from a doc
   * @param  {string} elementId the element's id
   * @return {[type]}           [description]
   */
  function removeElement(elementId) {
    if (elementId) {
      var element = document.getElementById(elementId);
      element.parentNode.removeChild(element);
      return true;
    } else {
      console.log('removeElement: no element id passed');
      return false;
    }
  }

    block_inpagenavigationblock.innerHTML = sidenav.innerHTML;
    removeElement('sidenav');

})(window, document);
