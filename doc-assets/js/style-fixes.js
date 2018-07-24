var BCLS_style_fixes = ( function (window, document) {
  var headerBlock = document.querySelector('.full-width-headline'),
    headerText = document.getElementById('block-brightcoveheadlineblock'),
    side_nav_block = document.getElementById('block-inpagenavigationblock'),
    related_content_block = document.getElementById('block-views-block-related-content-block-1');

  if (headerBlock) {
    headerBlock.setAttribute('style', 'color:white;background-color:RGB(45, 59, 108);padding-top:10px;padding-botton:5px;margin-bottom:30px;');
    headerText.setAttribute('style', 'color:white;');
  }
  if (side_nav_block) {
    side_nav_block.setAttribute('style', 'background-color:transparent;')
  }
  if (related_content_block) {
    related_content_block.setAttribute('style', 'background-color:transparent;');
  }
})(window, document);
