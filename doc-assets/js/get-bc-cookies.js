var cookiesArray = document.cookie.split(";"),
  feedbackParams = {},
  i,
  tmpArray = [];
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
console.log('feedbackParams', feedbackParams);
