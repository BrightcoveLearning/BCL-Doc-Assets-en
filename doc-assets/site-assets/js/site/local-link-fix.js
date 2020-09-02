// keep on same language site
function keepLanguage() {
  var href = location.href,
    domain = location.hostname,
    lang = domain.split('.')[0],
    all_links = document.getElementsByTagName('a'),
    i,
    iMax,
    talla_wrapper = document.getElementById('talla_wrapper'),
    site_select = document.getElementById('site_select'),
    site_options = site_select.querySelectorAll('option');

    if (href === 'https://support.brightcove.com/en/contact') {
      location.href = 'https://supportportal.brightcove.com/';
    }
    // if old /en/ path, redirect
    if (href.indexOf('/en/') > 0 ) {
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
      currentLink,
      currentLinkValue,
      newHref;

    // hide talla
    talla_wrapper.innerHTML = '';
    iMax = all_links.length;
    
    for (i = 0; i < iMax; i++) {
      currentLink = all_links[i];
      
      
      currentLinkValue = currentLink.getAttribute('href');
      
      hrefValue = currentLinkValue.split('//');
      
      if (hrefValue.length === 2) {
        if (hrefValue[1].indexOf('support.brightcove') > -1) {
          newHref = hrefValue[0] + '//' + lang + '.' + hrefValue[1];
          // console.log('newHref remote', newHref);
          all_links[i].setAttribute('href', newHref);
          
        }
      }
    }
      // fix site navigator
      iMax = site_options.length;
      // note: starting iteration at 1 because first option isn't a link
      for (i = 1; i < iMax; i++) {
        var site = site_options[i],
          val = site.getAttribute('value');
          site.setAttribute('value', val.replace('https://', 'https://' + lang + '.'));
          
      }
  }
}


keepLanguage();