var BCLS_learning_paths = (function (window, document) {
  var thisWindow = window,
    learning_path_wrapper document.createElement('nav'),
    learning_path_item,
    learning_path_hr,
    thisPath = window.location.pathname;

  learning_path_wrapper.classList.add('learning-path-wrapper');
    
  if (learning_path) {
    var i,
      Imax = learning_path.length,
      item,
      a;
    for (i = 0; i < Imax; i++) {
      item = learning_path[i];
      learning_path_item = document.createElement('div');
      learning_path_item.classList.add('learning-path-item');
    }
  }

  thisWindow.addEventListener('resize', function () {
    if (window.innerWidth < 1200) {
      learning_path_wrapper.setAttribute('style', 'visibility:hidden');
    } else {
      learning_path_wrapper.removeAttribute('style')
    }
  });
})(window, document);