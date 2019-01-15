var BCLS = ( function (window, document) {
  var h = window.location.href;

  if (window.location.protocol === 'http:') {
    h = h.replace('http:', 'https:');
    window.location.href = h;
  }
})(window, document);
