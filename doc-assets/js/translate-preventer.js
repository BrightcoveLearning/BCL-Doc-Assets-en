var BCLSnotranlate = ( function (window, document) {
  var classesToFix = ['bcls-highlight', 'bcls-input'],
    preBlocks = document.getElementsByTagName('pre'),
    i,
    iMax,
    j,
    jMax;

  iMax = preBlocks.length;
  for (i = 0; i < iMax; i++) {
    preBlocks[i].className += ' notranslate';
  }

  iMax = classesToFix.length;
  for (i = 0; i < iMax; i++) {
    var elements = document.getElementsByClassName(classesToFix[i]);
    jMax = elements.length;
    for (j = 0; j < jMax; j++) {
      elements[i].className += ' notranslate';
    }
  }
})(window, document);
