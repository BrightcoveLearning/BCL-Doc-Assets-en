var BCLS = (function(window, document) {
  console.log('in make Arrays');
  var audio_renditions = document.getElementById('audio_renditions'),
    video_renditions = document.getElementById('video_renditions'),
    progressive_renditions = document.getElementById('progressive_renditions'),
    textareas = document.getElementsByTagName('textarea'),
    rendition_data = renditions,
    audioRenditions = [],
    audioFiltered = {},
    videoRenditions = [],
    progressiveRenditions = [],
    i,
    iMax,
    currentId = '',
    newId = '';
console.log('rendition_data', rendition_data);
  /**
   * sort an array of objects based on an object property
   * @param {array} targetArray - array to be sorted
   * @param {string|number} objProperty - object property to sort on
   * @return sorted array
   */
  function sortArray(targetArray, objProperty) {
    targetArray.sort(function(a, b) {
      var propA = a[objProperty],
        propB = b[objProperty];
      // sort ascending; reverse propA and propB to sort descending
      if (propA > propB) {
        return -1;
      } else if (propA < propB) {
        return 1;
      } else {
        return 0;
      }
    });
    return targetArray;
  }

  iMax = textareas.length;
  for (i = 0; i < iMax; i++) {
    textareas[i].addEventListener('click', function() {
      this.select();
    });
  }

  iMax = rendition_data.length;
  for (i = 0; i < iMax; i++) {
    var rendition = rendition_data[i];
    if (rendition.id.indexOf('audio') >= 0) {
      audioRenditions.push(rendition);
    } else if (rendition.id.indexOf('video') >= 0) {
      videoRenditions.push(rendition);
    } else if (rendition.id.indexOf('progressive') >= 0) {
      progressiveRenditions.push(rendition);
    } else {
      console.log('unknown rendition type', rendition);
    }
  }

  iMax = audioRenditions.length;
for (i = 0; i < iMax; i++) {
  var rendition = audioRenditions[i];
  newId = rendition.id;
  if (!audioFiltered.hasOwnProperty(newId)){

  }

}

  audio_renditions.textContent = JSON.stringify(audioRenditions);
  video_renditions.textContent = JSON.stringify(videoRenditions);
  progressive_renditions.textContent = JSON.stringify(progressiveRenditions);
})(window, document);
