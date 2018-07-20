var BCLS = ( function (window, document) {
  var url = window.location.href,
    enForm = 'https://help.brightcove.com/en/contact',
    esForm = 'https://help.brightcove.com/es/contact',
    frForm = 'https://help.brightcove.com/fr/contact',
    deForm = 'https://help.brightcove.com/de/contact',
    jaForm = 'https://help.brightcove.com/ja/contact',
    koForm = 'https://help.brightcove.com/ko/contact';

    if (url.indexOf('/es/') > 0) {
      window.location.href = esForm;
    } else if (url.indexOf('/fr/') > 0) {
      window.location.href = frForm;
    } else if (url.indexOf('/de/') > 0) {
      window.location.href = deForm;
    } else if (url.indexOf('/ja/') > 0) {
      window.location.href = jaForm;
    } else if (url.indexOf('/ko/') > 0) {
      window.location.href = koForm;
    } else {
      window.location.href = enForm;
    }
})(window, document);
