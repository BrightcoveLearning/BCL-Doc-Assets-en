var BCLS_oldfeedback = ( function (window, document) {
  var oldFeedback = document.getElementById('surveyDiv'),
  t = window.setTimeout(removeOldFeedback, 2000),
  CSAT = document.getElementById('CSAT'),
  retry = 0;
  function removeOldFeedback() {
    console.log('try remove old feedback');
    oldFeedback = document.getElementById('surveyDiv');
    CSAT = document.getElementById('CSAT');
    if (oldFeedback) {
      console.log('old feedback present');
      oldFeedback.setAttribute('style', 'display:none;');
    } else if (CSAT) {
      CSAT.setAttribute('style', 'display:none;');
    } else {
      retry++;
      if (retry < 5) {
        t = window.setTimeout(removeOldFeedback, 2000);
      }
    }
  }
})(window, document);