var BCLS_toc = ( function (window, document) {
  var side_nav_created = false;
  function create_inpage_nav() {
    var h2s = document.getElementsByTagName('h2'),
      in_page_nav = document.getElementById('in_page_nav'),
      centered_in_page_toc = document.getElementById('centered_in_page_toc'),
      right_side_nav = document.querySelector('.right-side-nav'),
      centered_inpage_nav = document.getElementById('centered_inpage_nav'),
      navEl = in_page_nav,
      navWrapper = right_side_nav,
      h2,
      li,
      link,
      i,
      iMax,
      frag = document.createDocumentFragment(),
      parent,
      grandparent,
      windowWidth = window.innerWidth;

      // check window width to set the element to use
      if (windowWidth < 1360) {
        navEl = centered_in_page_toc;
        navWrapper = centered_inpage_nav;
      }
      // display the nav block we're using
      navWrapper.setAttribute('style', 'display:block');
        // in case this gets run multiple times by mistake, clear existing items
        // in_page_nav.innerHTML = '';
        // add new items
        iMax = h2s.length;
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
          grandparent = parent.parentNode;
          grandparent.removeChild(parent);
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
  // this creates a public method, allow it to be run again (imported content for example)
  return {
    create_inpage_nav: create_inpage_nav,
    side_nav_created: side_nav_created
  };
})(window, document);