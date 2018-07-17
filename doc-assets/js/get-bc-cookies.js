var cookiesArray = document.cookie.split(";"), params = {}, i, tmpArray = [];
for (i = 0; i < cookiesArray.length; i++) {
    tmpArray = cookiesArray[i].split("=");
    if (tmpArray[0].indexOf('BC_EMAIL') > -1) {
      params.BC_EMAIL = tmpArray[1];
    } else if (tmpArray[0].indexOf('BC_ACCOUNT') > -1) {
      params.BC_ACCOUNT = tmpArray[1];
    }
}
if (!params.hasOwnProperty('BC_EMAIL')) {
  params.BC_EMAIL = 'unknown';
}
if (!params.hasOwnProperty('BC_ACCOUNT')) {
  params.BC_ACCOUNT = 'unknown';
}
console.log('params', params);
