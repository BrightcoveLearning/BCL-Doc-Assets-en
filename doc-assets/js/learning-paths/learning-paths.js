var BCLS_learning_paths = (function (window, document) {
  var thisWindow = window,
    learning_path_wrapper = document.createElement('nav'),
    learning_path_item,
    learning_path_hr,
    thisPath = window.location.pathname,
    body = document.querySelector('body');

  learning_path_wrapper.classList.add('learning-path-wrapper');
    
  if (learning_path) {
    var i,
      iMax = learning_path.length,
      item,
      a;
    for (i = 0; i < iMax; i++) {
      item = learning_path[i];
      learning_path_item = document.createElement('div');
      learning_path_item.classList.add('learning-path-item');
      learning_path_wrapper.appendChild(learning_path_item);
      if (thisPath === item.path) {
        learning_path_item.classList.add('selected');
      }
      a = document.createElement('a');
      a.setAttribute('href', '/node/' + item.node );
      a.textContent = item.title;
      learning_path_item.appendChild(a);
      if (i < (iMax - 1)) {
        learning_path_hr = document.createElement('hr');
        learning_path_hr.classList.add('learning-path');
        learning_path_item.appendChild(learning_path_hr);
      }
    }
    body.appendChild(learning_path_wrapper);
  }

  thisWindow.addEventListener('resize', function () {
    if (window.innerWidth < 1200) {
      learning_path_wrapper.setAttribute('style', 'visibility:hidden');
    } else {
      learning_path_wrapper.removeAttribute('style');
    }
  });
})(window, document);