var BCLS_oldfeedback = ( function (window, document) {
  var oldFeedback = document.getElementById('surveyDiv'),
  t = window.setTimeout(removeOldFeedback, 2000),
  surveyForm = document.getElementById('surveyForm');
  function removeOldFeedback() {
    console.log('try remove old feedback');
    oldFeedback = document.getElementById('surveyDiv');
    surveyForm = document.getElementById('surveyForm');
    if (oldFeedback) {
      console.log('old feedback present');
      oldFeedback.setAttribute('style', 'display:none;');
    } else if (surveyForm) {
      surveyForm.setAttribute('style', 'display:none;')
    }
  }
})(window, document);