var BCLS_oldfeedback = ( function (window, document) {
  var t = window.setTimeout(removeOldFeedback, 2000),
  retry = 0;
  function removeOldFeedback() {
    console.log('try remove old feedback');
    var CSAT = document.getElementById('CSAT');
    if (CSAT) {
      console.log('old feedback detected');
      CSAT.setAttribute('style', 'display:none;');
    } else {
      retry++;
      if (retry < 5) {
        t = window.setTimeout(removeOldFeedback, 2000);
      }
    }
  }
})(window, document);