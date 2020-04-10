function doGTranslate(lang_pair) {
  if(lang_pair.value)lang_pair=lang_pair.value;var lang=lang_pair.split('|')[1];var plang=location.pathname.split('/')[1];if(plang.length !=2 && plang != 'zh-CN' && plang != 'zh-TW')plang='en';if(lang == 'en')location.pathname=location.pathname.replace('/'+plang, '');else location.pathname='/'+lang+location.pathname.replace('/'+plang, '');
}
// keep on same language site
function keepLanguage() {
  var plang = location.pathname.split('/')[1],
    domain = location.hostname,
    all_links = document.querySelectorAll('a[href]'),
    i,
    iMax;
    console.log('plang', plang);
    
    if (plang.length === 2) {
      var hrefValue;
      newPath = domain + '/' + plang;
      console.log('newpath', newPath);
      iMax = all_links.length;
      for (i = 0; i < iMax; i++) {
        hrefValue = all_links[i].getAttribute('href');
        if (hrefValue.charAt(0) !== '#' && hrefValue.indexOf('studio.support.brightcove.') < 0 && hrefValue.indexOf('player.support.brightcove.') < 0 && hrefValue.indexOf('sdks.support.brightcove.') < 0 && hrefValue.indexOf('live.support.brightcove.') < 0 && hrefValue.indexOf('apis.support.brightcove.') < 0 && hrefValue.indexOf('audience.support.brightcove.') < 0 && hrefValue.indexOf('social.support.brightcove.') < 0 && hrefValue.indexOf('gallery.support.brightcove.') < 0 && hrefValue.indexOf('zencoder.support.brightcove.') < 0 && hrefValue.indexOf('beacon.support.brightcove.') < 0 && hrefValue.indexOf('campaign.support.brightcove.') < 0 && hrefValue.indexOf('engage.support.brightcove.') < 0 && hrefValue.indexOf('general.support.brightcove.') < 0 && hrefValue.indexOf('integrations.support.brightcove.') < 0 && hrefValue.indexOf('ssai.support.brightcove.') < 0 && hrefValue.lastIndexOf('support.brightcove') > -1) {
          all_links[i].setAttribute('href', hrefValue.replace(domain, newPath));
        }
      }
    }
  } 

function absolute(relative) {
  var base = location.href;
  if (relative.indexOf('//') === -1) { 
    var stack = base.split("/"),
      parts = relative.split("/");
    stack.pop(); // remove current file name (or empty string)
                  // (omit if "base" is the current folder without trailing slash)
    for (var i=0; i<parts.length; i++) {
      if (parts[i] == ".") {
        continue;
      }
      if (parts[i] == "..") {
        stack.pop();
      } else {
        stack.push(parts[i]);
      }
    }
    return stack.join("/");
  } else {
    return relative;
  }
}

keepLanguage();