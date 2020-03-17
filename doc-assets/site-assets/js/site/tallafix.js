var BCLS_tallafix = ( function (window, document) {
  var  talla_parent = document.getElementById('talla_parent'),
  t,
  n = 0;

  function fix_talla() {
    if (talla_parent) {
      var talla_frame = talla_parent.firstElementChild;
      if (talla_frame) {
        talla_style = talla_frame.getAttribute('style');
        talla_frame.setAttribute('style', talla_style + 'bottom:unset;top:9rem;');
      } else {
        n++;
        if (n < 5) {
          console.log('n', n);
          
          t = window.setTimeout(fix_talla, 2000);
        }
      }
    }
  }

  // fix_talla();
})(window, document);