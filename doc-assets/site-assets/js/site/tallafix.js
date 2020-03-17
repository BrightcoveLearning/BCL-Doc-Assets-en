var BCLS_tallafix = ( function (window, document) {
  var  talla_frame = document.querySelector('talla_parent>iframe'),
  talla_style = talla_frame.getAttribute('style');
  talla_frame.setAttribute('style', talla_style + 'bottom:unset;top:9rem;');
})(window, document);