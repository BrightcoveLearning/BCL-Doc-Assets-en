var BCLS = (function (window, document) {
    var account_id    = document.getElementById('account_id'),
        client_id     = document.getElementById('client_id'),
        client_secret = document.getElementById('client_secret'),
        videoCount = 0,
        totalCalls = 0,
        callNumber = 0;

    function setUpRequest(type) {
        var baseURL = 'https://cms.api.brightcove.com/v1/accounts',
            endpoint,
            options = {};
        options.client_id = client_id.value;
        options.client_secret = client_secret.value;

        switch (type) {
            case 'getCount':
                endpoint = '/' + account_id.value + '/counts/videos/q=%2Bis_clip:true';
                options.url = baseURL + endpoint;
                break;
            case 'getVideoClips':
                endpoint = '/' + account_id.value + '/videos/q=%2Bis_clip:true';
                options.url = baseURL + endpoint;
                break;
        }
    }
})(window, document);
