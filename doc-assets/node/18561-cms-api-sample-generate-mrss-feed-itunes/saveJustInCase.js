/**
 * get array of values for checked boxes in a collection
 * @param {htmlElementCollection} checkBoxCollection collection of checkbox elements
 * @return {Array} array of the values of the checked boxes
 */
function getCheckedBoxValues(checkBoxCollection) {
  var checkedValues = [],
    i,
    iMax;
  if (checkBoxCollection) {
    iMax = checkBoxCollection.length;
    for (i = 0; i < iMax; i++) {
      if (checkBoxCollection[i].checked === true) {
        checkedValues.push(checkBoxCollection[i].value);
      }
    }
    return checkedValues;
  } else {
    console.log("Error: no input received");
    return null;
  }
}

/**
 * selects all checkboxes in a collection
 * @param {htmlElementCollection} checkboxCollection a collection of the checkbox elements, usually gotten by document.getElementsByName()
 */
function selectAllCheckboxes(checkboxCollection) {
  var i,
    iMax = checkboxCollection.length;
  for (i = 0; i < iMax; i += 1) {
    checkboxCollection[i].setAttribute("checked", "checked");
  }
}

/**
 * deselects all checkboxes in a collection
 * @param {htmlElementCollection} checkboxCollection a collection of the checkbox elements, usually gotten by document.getElementsByName()
 */
function deselectAllCheckboxes(checkboxCollection) {
  var i,
    iMax = checkboxCollection.length;
  for (i = 0; i < iMax; i += 1) {
    checkboxCollection[i].removeAttribute("checked");
  }
}

function getVideosForFeed() {
  var checkedBoxes = getCheckedBoxValues(videosCollection),
    i,
    iMax,
    index;
  iMax = checkedBoxes.length;
  for (i = 0; i < iMax; i++) {
    index = findObjectInArray(all_videos, "id", checkedBoxes[i]);
    videos.push(all_videos[index]);
    sortArray(videos, "published_at");
  }
}
