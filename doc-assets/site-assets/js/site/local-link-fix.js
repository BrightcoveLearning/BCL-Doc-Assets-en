// function doGTranslate(lang_pair) {
//   if(lang_pair.value)lang_pair=lang_pair.value;var lang=lang_pair.split('|')[1];var plang=location.pathname.split('/')[1];if(plang.length !=2 && plang != 'zh-CN' && plang != 'zh-TW')plang='en';if(lang == 'en')location.pathname=location.pathname.replace('/'+plang, '');else location.pathname='/'+lang+location.pathname.replace('/'+plang, '');
// }
// keep on same language site
function keepLanguage() {
  var domain = location.hostname,
    lang = domain.split('.')[0],
    all_links = document.querySelectorAll('a[href]'),
    i,
    iMax,
    talla_wrapper = document.getElementById('talla_wrapper'),
    site_select = document.getElementById('site_select'),
    site_options = site_select.querySelectorAll('option');

    console.log('lang', lang);
    
  if (lang === 'ja' || lang === 'ko' || lang === 'es' || lang === 'fr' || lang === 'de' || lang === 'zh-tw') {
    var hrefValue, 
      currentHref = window.location.href,
      newHref;

    // hide talla
    talla_wrapper.innerHTML = '';
    iMax = all_links.length;
    for (i = 0; i < iMax; i++) {
      hrefValue = currentHref.split('//');
      console.log('hrefValue', hrefValue);
      if (hrefValue[0].charAt(0) !== '#') {
        if (hrefValue[1].lastIndexOf('support.brightcove') > -1 && hrefValue[1].lastIndexOf(lang + '.') < 0) {
          newHref = hrefValue[0] + '//' + lang + '.' + hrefValue[1];
          // console.log('newHref remote', newHref);
          all_links[i].setAttribute('href', newHref);
        }
      }
    }
    if  (lang !== '') {
      iMax = site_options.length;
      // note: starting iteration at 1 because first option isn't a link
      for (i = 1; i < iMax; i++) {
        var site = site_options[i],
          val = site.getAttribute('value');
          site.setAttribute('value', val.replace('https://', 'https://' + lang + '.'));
          console.log('site', site.getAttribute('value'));
          
      }
    } 
  }


keepLanguage();