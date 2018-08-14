var BCLS_style_fixes = ( function (window, document) {
  var header_block = document.querySelector('.full-width-headline'),
    header_text = document.getElementById('block-brightcoveheadlineblock'),
    side_nav_block = document.getElementById('block-inpagenavigationblock'),
    related_content_block = document.getElementById('block-views-block-related-content-block-1'),
    search_block = document.querySelector('.paragraph--type--search-block'),
    chevrons = document.querySelectorAll('.icon__chevron--down');

  if (header_block) {
    header_block.setAttribute('style', 'color:white;background-color:RGB(45, 59, 108);padding-top:10px;padding-botton:5px;margin-bottom:30px;');
    header_text.setAttribute('style', 'color:white;line-height:1;');
  }
  if (side_nav_block) {
    side_nav_block.setAttribute('style', 'background-color:transparent;')
  }
  if (related_content_block) {
    related_content_block.setAttribute('style', 'background-color:transparent;');
  }
  if (search_block) {
    search_block.setAttribute('style', 'padding-top:10px; padding-bottom:15px;')
  }
  if (chevrons) {
    var i = 0,
      iMax = chevrons.length;
      for (i; i < iMax; i++) {
        chevrons[i].setAttribute('style', 'width:1rem;');
      }
  }
})(window, document);
