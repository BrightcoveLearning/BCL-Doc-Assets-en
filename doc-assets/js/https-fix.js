var BCLS = ( function (window, document) {
  var p = window.location.protocol,
    h = window.location.href;

  if (p === 'http:') {
    h = h.replace('http:', 'https:');
    window.location.href = h;
  }
})(window, document);
