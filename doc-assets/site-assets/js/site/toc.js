var BCLS_toc = ( function (window, document) {
  var side_nav_created = false,
  in_page_nav_right = true;
  
  function create_inpage_nav() {
    var h2s = document.getElementsByTagName('h2'),
    in_page_nav = document.getElementById('in_page_nav'),
    centered_in_page_toc = document.getElementById('centered_in_page_toc'),
    right_side_nav = document.getElementById('right_side_nav'),
    centered_inpage_nav = document.getElementById('centered_inpage_nav'),
    navEl = in_page_nav,
    navWrapper = right_side_nav,
    h2,
    li,
    link,
    i,
    iMax,
    frag = document.createDocumentFragment(),
    parent;

    // check window width to set the element to use
    if (window.innerWidth < 1360) {
      navEl = centered_in_page_toc;
      navWrapper = centered_inpage_nav;
      in_page_nav_right = false;
    } else {
      in_page_nav_right = true;
    }

    // display the nav block we're using
    navWrapper.setAttribute('style', 'display:block');
      // in case this gets run multiple times by mistake, clear existing items
      // in_page_nav.innerHTML = '';
      // add new items
      iMax = h2s.length;
      console.log('imax', iMax);
      for (i = 0; i < iMax; i++) {
        h2 = h2s[i];
        if (h2.id) {
          li = document.createElement('li');
          li.setAttribute('class', 'toc-item');
          link = document.createElement('a');
          link.setAttribute('href', '#' + h2.id);
          link.textContent = h2.textContent;
          li.appendChild(link);
          frag.appendChild(li);
        }
      }
      
      if (frag.firstChild) {
        navEl.appendChild(frag);
        implementHighlighting();
        // side nav is being generated; set the flag
        side_nav_created = true;
      } else {
        parent = navEl.parentNode;
        parent.setAttribute('style', 'visibility:hidden;')
        // grandparent = parent.parentNode;
        // grandparent.removeChild(parent);
      }

      // implement highlighting
      // smooth scrolling for Safari
  
      function implementHighlighting() {
        var navItems = document.getElementsByClassName('toc-item'),
          linkEl,
          j,
          jMax,
          linkTarget;

        iMax = navItems.length;
        for (i = 0; i < iMax; i++) {
          linkEl = navItems[i];
          linkTarget = linkEl.firstElementChild.getAttribute('href');

          linkEl.addEventListener('click', function(e) {
            document.querySelector(linkTarget).scrollIntoView({ 
              behavior: 'smooth' 
            });
            jMax = navItems.length;
            for (j = 0; j < jMax; j++) {
              navItems[j].removeAttribute('style');
            }
            console.log('this', this);
            
            this.setAttribute('style', 'color:#dcf3fb;background-color:rgb(21, 160, 183);');
          });
        }
      }
  }
  // run the function
  create_inpage_nav();

        // set listener for window resize
        window.addEventListener("resize", function () {
          if (window.innerWidth > 1360) {
            if (!in_page_nav_right) {
              side_nav_created = false;
              centered_inpage_nav.setAttribute('style', 'visibility: hidden;')
              centered_in_page_toc.innerHTML = '';
              create_inpage_nav();
            }
          } else {
            if (in_page_nav_right) {
              side_nav_created = false;
              right_side_nav.setAttribute('style', 'visibility:hidden;');
              in_page_nav.innerHTML = '';
              create_inpage_nav();
            }
          }
        });
  
  // this creates a public method, allow it to be run again (imported content for example)
  return {
    create_inpage_nav: create_inpage_nav,
    side_nav_created: side_nav_created
  };
})(window, document);