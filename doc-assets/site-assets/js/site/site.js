var BCLS_site = (function(window, document) {
  var all_sidenav_links = document.querySelectorAll(".sidenav a"),
    href = window.location.pathname,
    i,
    iMax,
    currentLink,
    parentNodeName,
    p1,
    p2,
    p3,
    pSib,
    pChild,
    pNextSib,
    p1NextSib;

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
    if (currentLink.getAttribute("href") === href) {
      addClass(currentLink, 'bcls-active');
      if (currentLink.getAttribute("href") !== "/") {
        p1 = currentLink.parentElement;
        p1NextSib = p1.nextElementSibling;
        p2 = p1.parentElement;
        p3 = p2.parentElement;
        console.log('p1', p1);
        console.log('p2', p2);
        console.log('p3', p3);
        console.log('p1NextSib', p1NextSib);
        parentNodeName = p1.nodeName;
        pSib = p1.firstChild;
        if (p1.nodeName === 'H5') {
          pNextSib = p1.nextElementSibling;
          pNextSib.removeAttribute('style');
        } else if (p1.nodeName === 'LI' && p1NextSib === null && p3.nodeName == 'UL') {
          p2.removeAttribute('style');
          p3.removeAttribute('style');
        } else if (p1.nodeName === 'LI' && p1NextSib === null) {
          p2.removeAttribute('style');
        } else if (p1.nodeName === 'LI' && p1NextSib.nodeName === 'UL') {
            console.log('p1NextSib nodename', p1NextSib.nodeName);
            p2.removeAttribute('style');
            p1NextSib.removeAttribute('style');
            console.log('p1NextSib', p1NextSib);
        } else if (p2.nodeName === 'UL' && p3.nodeName === 'UL') {
          p2.removeAttribute('style');
          p3.removeAttribute('style');
        } else if (p1.nodeName === 'LI') {
          p2.removeAttribute('style');
        }
      }
    }
  }

  // highlight current section in inpage nav
  if (href.indexOf('.html') < 0 || href.indexOf('index.html' < 0)) {
    var in_page_nav = document.getElementById('in_page_nav'),
      in_page_els = in_page_nav.querySelectorAll('li>a'),
      in_view_els = document.getElementsByClassName('inView'),
      active_class = 'inpage-highlight';
      el,
      in_page_el,
      j,
      jMax;
    iMax = in_view_els.length;
    for (i = 0; i < iMax; i++) {
      el = in_view_els[i]
      el.onInView(function() {
        jMax = in_page_els.length;
        for (j = 0; j < jMax; j++) {
          in_page_el = in_page_els[j];
          removeClass(in_page_el.parent, active_class);
          if (in_page_el.textContent === el.firstChild.textContent) {
            addClass(in_page_el.parent, active_class);
          }
        }
      });
      el.onOutView(function() {
        jMax = in_page_els.length;
        for (j = 0; j < jMax; j++) {
          in_page_el = in_page_els[j];
          if (in_page_el.textContent === el.firstChild.textContent) {
            removeClass(in_page_el.parent, active_class);
          }
        }
      });
        
    }
  }
})(window, document);
