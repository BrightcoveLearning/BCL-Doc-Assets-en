var BCLS_learning_paths = (function (window, document) {
  var thisWindow = window,
    learning_path_wrapper = document.createElement('nav'),
    learning_path_item,
    span,
    shortLink = document.querySelector('link[rel="shortlink"]'),
    nodePath = shortLink.getAttribute('href'),
    thisNode = nodePath.substring(nodePath.lastIndexOf('/') + 1),
    body = document.querySelector('body'),
    surveyDiv = document.getElementById('surveyDiv');

    
    if (learning_path) {
    var i,
    iMax = learning_path.length,
    item,
    h5,
    a;
      learning_path_wrapper.classList.add('learning-path-wrapper');
      h5 = document.createElement('h5');
      h5.textContent = 'Learning Path';
      learning_path_wrapper.appendChild(h5);
    for (i = 0; i < iMax; i++) {
      item = learning_path[i];
      learning_path_item = document.createElement('div');
      learning_path_item.classList.add('learning-path-item');
      learning_path_wrapper.appendChild(learning_path_item);
      console.log('thisPath', thisPath);
      console.log('item path', item.path);
      if (thisNode === item.node) {
        learning_path_item.classList.add('selected');
        learning_path_item.textContent = item.title;
      } else {
        a = document.createElement('a');
        a.setAttribute('href', '/node/' + item.node );
        a.textContent = item.title;
        learning_path_item.appendChild(a);
      }
      if (i < (iMax - 1)) {
        span = document.createElement('span');
        span.classList.add('learning-path');
        span.textContent = '|';
        learning_path_wrapper.appendChild(span);
      }
    }
    body.appendChild(learning_path_wrapper);
  }

  thisWindow.addEventListener('resize', function () {
    if (window.innerWidth < 1300) {
      learning_path_wrapper.setAttribute('style', 'visibility:hidden');
    } else {
      learning_path_wrapper.removeAttribute('style');
      if (surveyDiv) {
        surveyDiv.setAttribute('style', 'visibility:hidden');
      }
    }
  });
})(window, document);