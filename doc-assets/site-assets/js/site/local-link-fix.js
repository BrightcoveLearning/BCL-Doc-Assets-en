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
    talla_wrapper = document.getElementById('talla_wrapper');
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
          console.log('newHref remote', newHref);
          all_links[i].setAttribute('href', newHref);
        }
      }
    }
  }

// function absolute(relative) {
//   var base = location.href;
//   if (relative.indexOf('//') === -1) { 
//     var stack = base.split("/"),
//       parts = relative.split("/");
//     stack.pop(); // remove current file name (or empty string)
//                   // (omit if "base" is the current folder without trailing slash)
//     for (var i=0; i<parts.length; i++) {
//       if (parts[i] == ".") {
//         continue;
//       }
//       if (parts[i] == "..") {
//         stack.pop();
//       } else {
//         stack.push(parts[i]);
//       }
//     }
//     return stack.join("/");
//   } else {
//     return relative;
//   }
}

keepLanguage();