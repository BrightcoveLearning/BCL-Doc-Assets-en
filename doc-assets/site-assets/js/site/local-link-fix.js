// keep on same language site
function keepLanguage() {
  var href = location.href,
    domain = location.hostname,
    lang = domain.split('.')[0],
    all_links = document.querySelectorAll('a[href]'),
    i,
    iMax,
    talla_wrapper = document.getElementById('talla_wrapper'),
    site_select = document.getElementById('site_select'),
    site_options = site_select.querySelectorAll('option');

    // if old /en/ path, redirect
    if (href.indexOf('/en/') > 0) {
      if (href.indexOf('/video-cloud/docs/') > 0) {
        href = href.replace('/video-cloud/docs/', '/');
      }
      location.href = href.replace('/en/', '/');
    }

    // if old localized site path, redirect to new and hope for the best
    if (href.indexOf('/ja/') > 0) {
      href = href.replace('/ja/', '/');
      href = href.replace('//', '//ja.');
      location.href = href;
    } else if (href.indexOf('/ko/') > 0) {
      href = href.replace('/ko/', '/');
      href = href.replace('//', '//ko.');
      location.href = href;
    } else if (href.indexOf('/es/') > 0) {
      href = href.replace('/es/', '/');
      href = href.replace('//', '//es.');
      location.href = href;
    } else if (href.indexOf('/fr/') > 0) {
      href = href.replace('/fr/', '/');
      href = href.replace('//', '//fr.');
      location.href = href;
    } else if (href.indexOf('/de/') > 0) {
      href = href.replace('/de/', '/');
      href = href.replace('//', '//de.');
      location.href = href;
    }
    
  if (lang === 'ja' || lang === 'ko' || lang === 'es' || lang === 'fr' || lang === 'de' || lang === 'zh-tw') {
    var hrefValue, 
      currentHref = window.location.href,
      newHref;

    // hide talla
    talla_wrapper.innerHTML = '';
    iMax = all_links.length;
    console.log('imax', iMax);
    
    for (i = 0; i < iMax; i++) {
      hrefValue = currentHref.split('//');
      console.log('hrefValue', hrefValue);
      if (hrefValue[0].charAt(0) !== '#') {
        if (hrefValue[1].indexOf('support.brightcove') > 0 && hrefValue[1].lastIndexOf(lang + '.') < 0) {
          newHref = hrefValue[0] + '//' + lang + '.' + hrefValue[1];
          // console.log('newHref remote', newHref);
          all_links[i].setAttribute('href', newHref);
          console.log('new link', all_links[i].getAttribute('href'));
          
        }
      }
      // fix site navigator
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
}


keepLanguage();