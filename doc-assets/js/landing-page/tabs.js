jQuery(document).ready(function () {
  jQuery('.tabs .tab-links a').on('click', function (e) {
    var currentAttrValue = jQuery(this).attr('href');
    // prevent default click action for links
    e.preventDefault();
    // Show/Hide Tabs
    jQuery('.tabs ' + currentAttrValue).slideDown(400).siblings().slideUp(400);
    // Change/remove current tab to active
    jQuery(this).parent('li').addClass('active').siblings().removeClass('active');
    // add hash to url
    window.location.hash = currentAttrValue;
  });

  var h = window.location.hash,
  tabLinks = document.querySelectorAll('.tabs .tab-links a');
  
  if (h.length > 0) {
    var iMax = tabLinks.length,
      i;
    for (i = 0; i < iMax; i++) {
      if (tabLinks[i].getAttribute('href') === h) {
        tabLinks[i].click();
      }
    }
  }
});
