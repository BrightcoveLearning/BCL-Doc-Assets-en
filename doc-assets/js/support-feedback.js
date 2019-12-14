var BCLS_oldfeedback = ( function (window, document) {
  var oldFeedback = document.getElementById('surveyDiv'),
  t = window.setTimeout(removeOldFeedback, 2000);
  function removeOldFeedback() {
    console.log('try remove old feedback');
    oldFeedback = document.getElementById('surveyDiv');
    if (oldFeedback) {
      console.log('old feedback present');
      oldFeedback.setAttribute('style', 'display:none');
    }
  }
})(window, document);