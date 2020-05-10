var BCLS = ( function (window, document) {
  var search_field = document.getElementById('search_field'),
    search_button = document.getElementById('search_button'),
    search_back = document.getElementById('search_back'),
    search_forward = document.getElementById('search_forward');
  search_button.addEventListener('click', function() {
    console.log('search string', window.find(search_field.value, false, false, true, false, true, true));
    window.find(search_field.value, false, false, true, false, true, true);
  });
  search_back.addEventListener('click', function() {
    console.log('search string', window.find(search_field.value, false, true, true, false, true, true));
    window.find(search_field.value, false, true, true, false, true, true);
  });
  search_forward.addEventListener('click', function() {
    console.log('search string', window.find(search_field.value, false, false, true, false, true, true));
    window.find(search_field.value, false, false, true, false, true, true);
  });
})(window, document);
