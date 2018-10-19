var BCLS_feedback = ( function (window, document) {
  var cookiesArray = document.cookie.split(";"),
    iframe = document.createElement('iframe'),
    surveyDiv = document.createElement('div'),
    feedbackParams = {},
    i,
    tmpArray = [],
    tags = [],
    contentBlock  = document.querySelector('.main-container'),
    taxonomyItems = document.getElementsByClassName('field__items taxonomy__tags'),
    thirdRowGroup,
    thirdRowItems,
    productItem,
    roleItem;

    if (taxonomyItems) {
      thirdRowGroup = document.querySelector('.group-third-row.taxonomy__tags');
      if (taxonomyItems.lengh > 0) {
        productItem = taxonomyItems[0].querySelector('.field--item');
        roleItem = taxonomyItems[1].querySelector('.field--item');
      }

      if (thirdRowGroup) {
        thirdRowItems = thirdRowGroup.querySelectorAll('.field--item');
      }
    }

  iframe.setAttribute('id', 'CSAT');
  iframe.setAttribute('src', 'https://learning-services-media.brightcove.com/doc-assets/general/surveylink.html');
  iframe.setAttribute('style', 'border:none; position:fixed; bottom: 0;left: 20px;height:110px;');
  surveyDiv.setAttribute('style', 'text-align:left; position:relative;');
  surveyDiv.appendChild(iframe);
  contentBlock.appendChild(surveyDiv);
  iframeEl = document.querySelector('#CSAT');
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
  feedbackParams.q13 = document.querySelector('link[rel="shortlink"]').href.split("/").pop();
  feedbackParams.product = (productItem) ? productItem.textContent : 'unknown';
  feedbackParams.role = (roleItem) ? roleItem.textContent : 'unknown';
if (thirdRowItems) {
  for (i = 0; i < thirdRowItems.length; i++) {
    tags.push(thirdRowItems[i].textContent);
  }
  feedbackParams.tags = tags.join(',');
} else {
  feedbackParams.tags = 'none';
}

  iframeEl.addEventListener('load', function() {
    // console.log('feedbackParams', feedbackParams);
    // send message to surveyForm window
    surveyWin.postMessage(feedbackParams, 'https://learning-services-media.brightcove.com');
  });

  window.addEventListener('resize', function() {
    console.log('window size', window.innerWidth);
    console.log('iframeEl', iframeEl);
    if (window.innerWidth < 1430) {
      iframeEl.setAttribute('style', 'opacity: 0;');
    } else {
      iframeEl.setAttribute('style', 'opacity: 1;')
    }
  })

})(window, document);
