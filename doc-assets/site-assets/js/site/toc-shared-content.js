var BCLS_toc = ( function (window, document) {
  var side_nav_created = false;
  function create_inpage_nav() {
    var h2s = document.getElementsByTagName('h2'),
      in_page_nav = document.getElementById('in_page_nav'),
      h2,
      li,
      link,
      i,
      iMax,
      frag = document.createDocumentFragment(),
      parent,
      grandparent;

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
          in_page_nav.appendChild(frag);
          implementHighlighting();
          // side nav is being generated; set the flag
          side_nav_created = true;
        } else {
          parent = in_page_nav.parentNode;
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
              
              this.setAttribute('style', 'color:rgb(220, 243, 251);background-color:rgb(21, 160, 183);');
            });
          }
        }
  }
  // don't run the function till shared content has loaded the function
  // this creates a public method, allow it to be run again (imported content for example)
  return {
    create_inpage_nav: create_inpage_nav,
    side_nav_created: side_nav_created
  };
})(window, document);