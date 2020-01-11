var BCLS_site = (function(window, document) {
  var all_sidenav_links = document.querySelectorAll(".sidenav a"),
    href = window.location.pathname,
    i,
    iMax,
    currentLink,
    currentLinkNextSib,
    parentNodeName,
    p1,
    p2,
    p3,
    pSib,
    pChild,
    pNextSib,
    p1NextSib,
    p1NextSibList;

// utilities for adding/removing classes
function hasClass(el, name) {
  return new RegExp('(\\s|^)'+name+'(\\s|$)').test(el.className);
}
function addClass(el, name)
{
  if (!hasClass(el, name)) { el.className += (el.className ? ' ' : '') +name; }
}
function removeClass(el, name)
{
  if (hasClass(el, name)) {
     el.className=el.className.replace(new RegExp('(\\s|^)'+name+'(\\s|$)'),' ').replace(/^\s+|\s+$/g, '');
  }
}
  // side navigation
  iMax = all_sidenav_links.length;
  for (i = 0; i < iMax; i++) {
    currentLink = all_sidenav_links[i];
    currentLinkNextSib = currentLink.nextElementSibling;
    if (currentLink.getAttribute("href") === href) {
      addClass(currentLink, 'bcls-active');
      if (currentLink.getAttribute("href") !== "/") {
        p1 = currentLink.parentElement;
        p1NextSib = p1.nextElementSibling;
        if (p1NextSib && p1NextSib.firstElementChild) {
          p1NextSibList = p1NextSib.firstElementChild.nextElementSibling;
        }
        p2 = p1.parentElement;
        p3 = p2.parentElement;
        p4 = p3.parentElement;
        console.log('currentLink', currentLink);
        console.log('p1', p1);
        console.log('p2', p2);
        console.log('p3', p3);
        console.log('p4', p4);
        console.log('p1NextSib', p1NextSib);
        console.log('p1NextSibList', p1NextSibList);
        console.log('currentLinkNextSib', currentLinkNextSib);
        parentNodeName = p1.nodeName;
        pSib = p1.firstChild;
        if (p1.nodeName === 'H5') {
          pNextSib = p1.nextElementSibling;
          pNextSib.removeAttribute('style');
        } else if (currentLinkNextSib && p2.nodeName === 'UL' && p3.nodeName === 'NAV' && currentLinkNextSib.nodeName == "UL") {
          p2.removeAttribute('style');
          currentLinkNextSib.removeAttribute('style');
        } else if (p1.nodeName === 'LI' && p4.nodeName === 'UL') {
          p2.removeAttribute('style');
          p4.removeAttribute('style');
        } else if (p1.nodeName === 'LI' && p2.nodeName === 'UL' && p4.nodeName === 'UL') {
          p2.removeAttribute('style');
          p4.removeAttribute('style');
        } else if (p1NextSibList && p1.nodeName === 'LI' && p1NextSibList.nodeName === 'UL') {
            console.log('p1NextSib nodename', p1NextSib.nodeName);
            p2.removeAttribute('style');
            p1NextSibList.removeAttribute('style');
        } else if (p2.nodeName === 'UL' && p3.nodeName === 'UL') {
          p2.removeAttribute('style');
          p3.removeAttribute('style');
        } else if (p1.nodeName === 'LI') {
          p2.removeAttribute('style');
        }
      }
    }
  }

})(window, document);
