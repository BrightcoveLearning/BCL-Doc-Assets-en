var BCLSnotranlate = ( function (window, document) {
  var codeBlocks = document.getElementsByTagName('code'),
    codeSpans = document.querySelectorAll('pre>span'),
    i,
    iMax,
    j,
    jMax;

  iMax = codeBlocks.length;
  for (i = 0; i < iMax; i++) {
    codeBlocks[i].className += ' notranslate';
  }

  iMax = codeSpans.length;
  for (i = 0; i < iMax; i++) {
    codeSpans[i].className += ' notranslate';
  }
})(window, document);
