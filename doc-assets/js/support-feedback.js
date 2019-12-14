var BCLS = ( function (window, document) {
  var oldFeedback = document.getElementById('surveyDiv');
  
  if (oldFeedback) {
    oldFeedback.setAttribute('style', 'display:none');
  }
})(window, document);