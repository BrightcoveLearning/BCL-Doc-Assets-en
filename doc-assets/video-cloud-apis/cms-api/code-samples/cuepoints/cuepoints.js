var BCLS = (function (window, document) {
    // account info
    var useMyAccount = document.getElementById('useMyAccount'),
        basicInfo = document.getElementById('basicInfo'),
        account_id = document.getElementById('account_id'),
        client_id = document.getElementById('client_id'),
        client_secret = document.getElementById('client_secret'),
        // value below is for BrightcoveLearning
        // default client id and secret should be stored in the proxy
        default_account_id = '57838016001',
        // cuepoint fields
        name = document.getElementById('name').
        type = document.getElementById('type');

// set event listeners
useMyAccount.addEventListener('click', function () {
    if (basicInfo.getAttribute('style') === 'display:non;') {
        basicInfo.setAttribute('style', 'display:block;');
        useMyAccount.textContent = 'Use Sample Account';
    } else {
        basicInfo.setAttribute('style', 'display:none;');
        useMyAccount.textContent = 'Use My Account Instead';
    }
});})(window, document);
