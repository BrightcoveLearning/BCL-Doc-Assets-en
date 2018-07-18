var BCLS_feedback = ( function (window, document) {
  var cookiesArray = document.cookie.split(";"),
    iframe = document.createElement('iframe'),
    surveyDiv = document.createElement('div'),
    feedbackParams = {},
    i,
    tmpArray = [],
    p;


  iframe.setAttribute('id', 'CSAT');
  iframe.setAttribute('src', 'https://learning-services-media.brightcove.com/doc-assets/general/surveylink.html');
  iframe.setAttribute('style', 'padding-bottom:20px;border:none');
  surveyDiv.setAttribute('style', 'text-align:center');
  surveyDiv.appendChild(iframe);
  p = document.createElement('p');
  p.setAttribute('style', 'min-height:2em;');
  document.body.appendChild(p);
  document.body.appendChild(surveyDiv);
  iframeEl = document.getElementById('CSAT');
  surveyWin = iframeEl.contentWindow;

  for (i = 0; i < cookiesArray.length; i++) {
    tmpArray = cookiesArray[i].split("=");
    if (tmpArray[0].indexOf('BC_EMAIL') > -1) {
      feedbackParams.BC_EMAIL = tmpArray[1];
    } else if (tmpArray[0].indexOf('BC_ACCOUNT') > -1) {
      feedbackParams.BC_ACCOUNT = tmpArray[1];
    }
  }
  if (!feedbackParams.hasOwnProperty('BC_EMAIL')) {
    feedbackParams.BC_EMAIL = 'unknown';
  }
  if (!feedbackParams.hasOwnProperty('BC_ACCOUNT')) {
    feedbackParams.BC_ACCOUNT = 'unknown';
  }

  iframeEl.addEventListener('load', function() {
    console.log('feedbackParams', feedbackParams);
    // send message to surveyForm window
    surveyWin.postMessage(feedbackParams, 'https://learning-services-media.brightcove.com');
  });
})(window, document);
