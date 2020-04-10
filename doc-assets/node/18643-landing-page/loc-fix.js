var new_site_links = document.querySelectorAll('.new-site-link'),
language,
i,
iMax = new_site_links.length,
link,
href,
href_split,
new_href,
path = window.location.pathname;

// on localized site?
if (path.indexOf('ja/') > -1) {
  language = 'ja.';
} else if (path.indexOf('es/') > -1) {
  language = 'es.';
} else if (path.indexOf('fr/') > -1) {
  language = 'fr.';
} else if (path.indexOf('de/') > -1) {
  language = 'de.';
} else if (path.indexOf('ko/') > -1) {
  language = 'ko.';
}

// if on localized site, fix links
for (i = 0; i < iMax; i++) {
  link = new_site_links[i];
  href = link.getAttribute('href');
  href_split = href.split('//');
  new_href = href_split[0] + '//' + language + href_split[1];
  console.log('new_href', new_href);
}
