var BCLS_toc = ( function (window, document) {
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
  implementHighlighting();

  return {
    implementHighlighting: implementHighlighting
  };
})(window, document);