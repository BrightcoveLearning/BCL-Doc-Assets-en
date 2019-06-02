function BCLS_landing_page( {
  var samples_wrapper = document.getElementById('samples_wrapper'),
    samples = samples_wrapper.querySelectorAll('section.samples-section'),
    sample_groups = {},
    buttons;
  /**
   * converts string to title case (all words)
   * @param {string} str string to convert
   * @returns {string} converted string
   */
  function to_title_case(str) {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
  }

  /**
   * determines whether an element has a specified class
   * @param {element} elem the html element
   * @param {string} class_name the class
   * @return {boolean}
   */
  function has_class(elem, class_name) {
    return (elem.classList.contains(class_name));
  }



  function init() {
    
  }

  init();

}
