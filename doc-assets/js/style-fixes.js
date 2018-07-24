var BCLS_style_fixes = ( function (window, document) {
  var headerBlock = document.querySelector('.full-width-headline'),
    headerText = document.getElementById('block-brightcoveheadlineblock'),
    side_nav_block = document.getElementById('block-inpagenavigationblock');

    headerBlock.setAttribute('style', 'color:white;background-color:RGB(45, 59, 108);padding-top:10px;padding-botton:5px;margin-bottom:30px;');
    headerText.setAttribute('style', 'color:white;');
    side_nav_block.setAttribute('style', 'background-color:transparent;')
})(window, document);
