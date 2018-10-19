var BCLS_feedback = ( function (window, document) {
  var cookiesArray = document.cookie.split(";"),
    iframe = document.createElement('iframe'),
    surveyDiv = document.createElement('div'),
    feedbackParams = {},
    i,
    tmpArray = [],
    tags = [],
    p;


  iframe.setAttribute('id', 'CSAT');
  iframe.setAttribute('src', 'https://learning-services-media.brightcove.com/doc-assets/general/surveylink.html');
  iframe.setAttribute('style', 'padding-bottom:20px;border:none');
  surveyDiv.setAttribute('style', 'text-align:center');
  surveyDiv.appendChild(iframe);
  p = document.createElement('p');
  p.setAttribute('style', 'min-height:2em;');
  p.setAttribute('class', 'clearfix');
  document.body.appendChild(p);
  document.body.appendChild(surveyDiv);
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
  if (!feedbackParams.hasOwnProperty('bc_email')) {
    feedbackParams.bc_email = 'unknown';
  }
  if (!feedbackParams.hasOwnProperty('bc_account')) {
    feedbackParams.bc_account = 'unknown';
  }

  feedbackParams.title = document.querySelector('title').textContent;
  if (feedbackParams.title.indexOf('Zencoder') > 0) {
    feedbackParams.product = 'Zencoder';
  } else if (feedbackParams.title.indexOf('Live') > 0) {
    feedbackParams.product = 'Live';
  } else if (feedbackParams.title.indexOf('Once') > 0) {
    feedbackParams.product = 'Once';
  } else {
    feedbackParams.product = 'Video Cloud';
  }
  feedbackParams.role = 'API Developer';
  feedbackParams.tags = 'API Reference';


  iframeEl.addEventListener('load', function() {
    console.log('feedbackParams', feedbackParams);
    // send message to surveyForm window
    surveyWin.postMessage(feedbackParams, 'https://learning-services-media.brightcove.com');
  });

  window.addEventListener('resize', function() {
    if (window.innerWidth < 1430) {
      iframe.setAttribute('style', 'visibility: hidden;');
    } else {
      iframe.setAttribute('style', 'visibility: visible;')
    }
  })
})(window, document);
