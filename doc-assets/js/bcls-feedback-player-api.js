var BCLS_feedback = ( function (window, document) {
  var cookiesArray = document.cookie.split(";"),
    iframe = document.createElement('iframe'),
    surveyDiv = document.createElement('div'),
    feedbackParams = {},
    i,
    tmpArray = [],
    contentBlock = document.querySelector('section>article.readme');

console.log('contentBlock', contentBlock);
  iframe.setAttribute('id', 'CSAT');
  iframe.setAttribute('src', 'https://learning-services-media.brightcove.com/doc-assets/general/surveylink.html');
  iframe.setAttribute('style', 'padding-bottom:20px;border:none');
  surveyDiv.setAttribute('style', 'text-align:center');
  surveyDiv.appendChild(iframe);
  contentBlock.appendChild(surveyDiv);
  iframeEl = document.getElementById('CSAT');
  surveyWin = iframeEl.contentWindow;

  for (i = 0; i < cookiesArray.length; i++) {
    tmpArray = cookiesArray[i].split("=");
    if (tmpArray[0].indexOf('BC_EMAIL') > -1) {
      feedbackParams.bc_email = tmpArray[1];
    } else if (tmpArray[0].indexOf('BC_ACCOUNT') > -1) {
      feedbackParams.bc_account = tmpArray[1];
    }
  }
  if (!feedbackParams.hasOwnProperty('BC_EMAIL')) {
    feedbackParams.bc_email = 'unknown';
  }
  if (!feedbackParams.hasOwnProperty('BC_ACCOUNT')) {
    feedbackParams.bc_account = 'unknown';
  }
  feedbackParams.title = document.getElementById('index-api-docs-title').textContent;
    feedbackParams.product = 'Video Cloud';
  feedbackParams.role = 'Player Developer';
  feedbackParams.tags = 'API Reference';

  iframeEl.addEventListener('load', function() {
    console.log('feedbackParams', feedbackParams);
    // send message to surveyForm window
    surveyWin.postMessage(feedbackParams, 'https://learning-services-media.brightcove.com');
  });
})(window, document);
