var BCLS_learning_paths = (function (window, document) {
  var thisWindow = window,
    learning_path_wrapper document.createElement('nav'),
    learning_path_item,
    learning_path_hr;

  learning_path_wrapper.classList.add('learning-path-wrapper');
    
  if (learning_path) {
    var i,
      Imax = learning_path.length;
  }

  thisWindow.addEventListener('resize', function () {
    console.log('window size', window.innerWidth);
    if (window.innerWidth < 1200) {
      learning_path_wrapper.setAttribute('style', 'visibility:hidden');
    } else {
      learning_path_wrapper.removeAttribute('style')
    }
  });
})(window, document);