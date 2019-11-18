var BCLS_toc = ( function (window, document) {
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

      iMax = h2s.length;
      for (i = 0; i < iMax; i++) {
        h2 = h2s[i];
        if (h2.id) {
          li = document.createElement('li');
          link = document.createElement('a');
          link.setAttribute('href', '#' + h2.id);
          link.textContent = h2.textContent;
          li.appendChild(link);
          frag.appendChild(li);
        }
      }
      
      if (frag.firstChild) {
        in_page_nav.appendChild(frag);
      } else {
        parent = in_page_nav.parentNode;
        grandparent = parent.parentNode;
        grandparent.removeChild(parent);
      }

      // implement highlighting
      function implementHighlighting() {
        var navLinks = document.querySelectorAll('#in_page_nav>li>a'),
          navItems = document.querySelectorAll('#in_page_nav>li'),
          linkEl,
          j,
          jMax;

        iMax = navLinks.length;
        for (i = 0; i < iMax; i++) {
          linkEl = navLinks[i];
          linkEl.addEventListener('click', function() {
            jMax = navItems.length;
            for (j = 0; j < jMax; j++) {
              navItems[j].removeAttribute('style');
            }
            console.log('this', this);
            
            this.parent.setAttribute('style', 'color:rgb(220, 243, 251);background-color:rgb(21, 160, 183);')
          });
        }
      }
})(window, document);