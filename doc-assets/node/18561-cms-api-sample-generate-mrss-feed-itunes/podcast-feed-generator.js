var BCLS = ( function (window, document) {
    var mrssStr = '<?xml version="1.0" encoding="utf-8"?><rss xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">',
    sChannel = '<channel>',
    eChannel = '</channel>',
    sTitle = '<title>',
    eTitle = '</title>',
    sSubTitle = '<itunes:subtitle>',
    eSubTitle = '</itunes:subtitle>',
    sAuthor = '<itunes:author>',
    eAuthor = '</itunes:author>',
    sOwner = '<itunes:owner>',
    eOwner = '</itunes:owner>',
    sName = '<itunes:name>',
    eName = '</itunes:name>',
    sEmail = '<itunes:email>',
    eEmail = '</itunes:email>',
    sImage = '<itunes:image href="',
    eImage = '" />',
    sCategory = '<itunes:category text="',
    eCategory1 = '">',
    eCategory2 = '"/>',
    sSubcategory = '<itunes:category text="',
    eSubCategory = '"/>',
    eCategory = '</itunes:category>',
    sExplicit = '<itunes:explicit>',
    eExplicit = '</itunes:explicit>',
    sisClosedCaptioned = '<itunes:isClosedCaptioned>',
    eisClosedCaptioned = '</itunes:isClosedCaptioned>',
    sComplete = '<itunes:complete>',
    eComplete = '</itunes:complete>',
    sDuration = '<itunes:duration>',
    eDuration = '</itunes:duration>',
    sDescription = '<description>',
    eDescription = '</description>',
    sSummary = '<itunes:summary><![CDATA[',
    eSummary = ']]></itunes:summary>',
    sEnclosure = '<enclosure ',
    eEnclosure = ' />',
    sItem = '<item>',
    eItem = '</item>',
    sLink = '<link>',
    eLink = '</link>',
    sGuid = '<guid>',
    eGuid = '</guid>',
    sPubDate = '<pubDate>',
    ePubDate = '</pubDate>',
    sCopyright = '<copyright>',
    eCopyright = '</copyright>',
    sLanguage = '<language>',
    eLanguage = '</language>',
    // input data
    account_id,
    client_id,
    client_secret,
    podcast_url,
    site_url,
    podcast_title,
    podcast_subtitle,
    podcast_image,
    podcast_author,
    podcast_owner,
    podcast_email,
    podcast_description,
    podcast_summary,
    podcast_type = 'video/mp4',
    language,
    category,
    sub_category,
    explicit = 'no',
    closed_captioned = 'no',
    complete = 'no',
    year = new Date().getFullYear().toString(),
    // api stuff
    proxyURL = 'https://solutions.brightcove.com/bcls/bcls-proxy/doc-samples-proxy-v2.php',
    baseURL = 'https://cms.api.brightcove.com/v1/accounts/',
    search_string,
    totalVideos = 0,
    totalCalls = 0,
    callNumber = 0,
    videos = [],
    all_videos = [],
    // elements
    account_id_input = document.getElementById('account_id_input'),
    client_id_input = document.getElementById('client_id_input'),
    client_secret_input = document.getElementById('client_secret_input'),
    site_url_input = document.getElementById('site_url_input'),
    podcast_url_input = document.getElementById('podcast_url_input'),
    podcast_title_input = document.getElementById('podcast_title_input'),
    podcast_subtitle_input = document.getElementById('podcast_subtitle_input'),
    podcast_image_input = document.getElementById('podcast_image_input'),
    podcast_author_input = document.getElementById('podcast_author_input'),
    podcast_owner_input = document.getElementById('podcast_owner_input'),
    podcast_email_input = document.getElementById('podcast_email_input'),
    podcast_description_input = document.getElementById('podcast_description_input'),
    podcast_summary_input = document.getElementById('podcast_summary_input'),
    language_input = document.getElementById('language_input'),
    explicit_input = document.getElementById('explicit_input'),
    closed_captioned_input = document.getElementById('closed_captioned_input'),
    complete_input = document.getElementById('complete_input'),
    main_category_input = document.getElementById('main_category_input'),
    sub_category_input = document.getElementById('sub_category_input'),
    search_string_input = document.getElementById('search_string_input'),
    get_videos = document.getElementById('get_videos'),
    returned_videos = document.getElementById('returned_videos'),
    makeFeed = document.getElementById('makeFeed'),
    logger = document.getElementById('logger'),
    apiRequest = document.getElementById('apiRequest'),
    apiResponse = document.getElementById('apiResponse'),
    feedDisplay = document.getElementById('feedDisplay'),
    allButtons = document.getElementsByName('button'),
    categories = {
      Arts: [ 'Design', 'Fashion & Beauty', 'Food', 'Literature', 'Performing Arts', 'Visual Arts' ],
      Business: [ 'Business News', 'Careers', 'Investing', 'Management & Marketing', 'Shopping' ],
      Comedy: [],
      Education: [ 'Educational Technology', 'Higher Education', 'K-12', 'Language Courses', 'Training' ],
      'Games & Hobbies': [ 'Automotive', 'Aviation', 'Hobbies', 'Other Games', 'Video Games' ],
      'Government & Organizations': ['Local', 'National', 'Non-Profit', 'Regional'],
      Health: ['Alternative Health', 'Fitness & Nutrition', 'Self-Help', 'Sexuality'],
      'Kids & Family': [],
      Music: [],
      'News & Politics': [],
      'Religion & Spirituality': ['Buddhism', 'Christianity', 'Hinduism', 'Islam', 'Judaism', 'Other', 'Spirituality'],
      'Science & Medicine': ['Medicine', 'Natural Sciences', 'Social Sciences'],
      'Society & Culture': [ 'History', 'Personal Journals', 'Philosophy', 'Places & Travel' ],
      'Sports & Recreation': [ 'Amateur', 'College & High School', 'Outdoor', 'Professional' ],
      Technology: ['Gadgets', 'Tech News', 'Podcasting', 'Software How-To'],
      'TV & Film': []
    };

    /**
     * tests for all the ways a variable might be undefined or not have a value
     * @param {String|Number} x the variable to test
     * @return {Boolean} true if variable is defined and has a value
     */
    function isDefined(x){
        if ( x === "" || x === null || x === undefined) {
            return false;
        }
        return true;
    }

    /**
     * determines if checkbox is checked
     * @param  {htmlElement}  e the checkbox to check
     * @return {Boolean}  true if box is checked
     */
    function isChecked(e) {
      if (e.checked) {
        return true;
      }
      return false;
    }

    /**
     * get selected value for single select element
     * @param {htmlElement} e the select element
     */
    function getSelectedValue(e) {
        return e.options[e.selectedIndex].value;
    }


    /**
     * disables all buttons so user can't submit new request until current one finishes
     */
    function disableButtons() {
        var i,
            iMax = allButtons.length;
        for (i = 0; i < iMax; i++) {
            allButtons[i].setAttribute('disabled', 'disabled');
        }
    }

    /**
    * re-enables all buttons
    */
    function enableButtons() {
        var i,
        iMax = allButtons.length;
        for (i = 0; i < iMax; i++) {
            allButtons[i].removeAttribute('disabled');
        }
    }

    /**
     * add a log message to the page
     * (inside an element with id="logger")
     * @param  {string} message the message to insert
     */
    function logMessage(message) {
      var p = document.createElement('p'),
          txt = document.createTextNode(message);
      p.appendChild(txt);
      logger.appendChild(p);
    }



    /**
     * sort an array of objects based on an object property
     * @param {array} targetArray - array to be sorted
     * @param {string|number} objProperty - object property to sort on
     * @return sorted array
     */
    function sortArray(targetArray, objProperty) {
        targetArray.sort(function (b, a) {
            var propA = a[objProperty], propB = b[objProperty];
            // sort ascending; reverse propA and propB to sort descending
            if (propA < propB) {
                 return -1;
            } else if (propA > propB) {
                 return 1;
            } else {
                 return 0;
            }
        });
        return targetArray;
    }


    /**
     * find index of an object in array of objects *
       based on some property value *
       * @param {array}
     targetArray array to search
       * @param {string} objProperty object property to search
       * @param {string} value of the property to search for
       * @return {integer} index of first instance if found, otherwise returns - 1
       */

     function findObjectInArray(targetArray, objProperty, value) {
       var i, totalItems = targetArray.length,
         objFound = false;
       for (i = 0; i < totalItems; i++) {
         if (targetArray[i][objProperty] === value) {
           objFound = true;
           return i;
         }
       }
       if (objFound === false) {
         return -1;
       }
     }

    /**
    * utility to extract h/m/s from milliseconds
    * @param {number} msecs - milliseconds to convert to hh:mm:ss
    * @returns {String} date string in HH:MM:SS format
    */
     function millisecondsToTime(msecs) {
         var secs = msecs / 1000,
          hours = Math.floor(secs / (60 * 60)),
             divisor_for_minutes = secs % (60 * 60),
             minutes = Math.floor(divisor_for_minutes / 60),
             divisor_for_seconds = divisor_for_minutes % 60,
             seconds = Math.ceil(divisor_for_seconds),
             str = '';

         if (hours > 0) {
           if (hours < 10) {
             hours = "0" + hours.toString();
           } else {
             str += hours.toString() + ':';
           }
         }

         if (minutes > 0) {
           if (minutes < 10) {
             minutes = "0" + minutes.toString();
           } else {
             str += minutes.toString() + ':';
           }
         }

         if (seconds < 10) {
             seconds = "0" + seconds.toString();
         } else {
             str += seconds.toString();
         }
         return str;
     }



    /**
     * remove non-MP4 sources and get highest bitrate one
     * @param  {Array} sources array of source objects
     * @return {Object} the highest bitrate MP4 source
     */
    function processSources(sources) {
        var i = sources.length;
        // remove non-MP4 sources
        while (i > 0) {
            i--;
            if (sources[i].container !== 'MP4') {
                sources.splice(i, 1);
            } else if (sources[i].hasOwnProperty('stream_name')) {
                sources.splice(i, 1);
            }
        }
        // sort sources by encoding rate
        sortArray(sources, 'encoding_rate');
        // return the first item (highest bitrate)
        return sources[0];
    }

    function setPodcastData() {
      mrssStr += sChannel;
      mrssStr += sTitle + podcast_title + eTitle;
      mrssStr += sLink + podcast_url + eLink;
      mrssStr += sLanguage + language + eLanguage;
      mrssStr += sCopyright + '&copy ' + year + ' ' + podcast_owner +eCopyright;
      mrssStr += sSubTitle + podcast_subtitle + eSubTitle;
      mrssStr += sAuthor + podcast_author + eAuthor;
      mrssStr += sSummary + podcast_summary + eSummary;
      mrssStr += sDescription + podcast_description + eDescription;
      mrssStr += sOwner;
      mrssStr += sName + podcast_owner + eName;
      mrssStr += sEmail + podcast_email + eEmail;
      mrssStr += eOwner;
      mrssStr += sImage + podcast_image + eImage;
      mrssStr += sCategory + category;
      if (isDefined(sub_category)) {
        mrssStr += eCategory1;
        mrssStr += sSubcategory + sub_category + eSubCategory;
        mrssStr += eCategory;
      } else {
        mrssStr += eCategory2;
      }
      mrssStr += sExplicit + explicit + eExplicit;
      mrssStr += sComplete + complete + eComplete;
    }

    /**
     * checks for required values
     * @param  {String[]} fieldsToCheck array of vars to check
     * @return {boolean} true if all vars have values
     */
    function requiredFieldsHaveValues(fieldsToCheck) {
      var i,
        iMax,
        tmpArr = [];
console.log('fieldsToCheck', fieldsToCheck);
      iMax = fieldsToCheck.length;
      for (i = 0; i < iMax; i++) {
        if (!isDefined(fieldsToCheck[i])) {
          tmpArr.push(fieldsToCheck[i]);
        }
      }
console.log('tmpArr', tmpArr);
      if (tmpArr.length === 0) {
        return true;
      }
      return false;
    }

    function getInputData() {
      account_id = account_id_input.value;
      client_id = client_id_input.value;
      client_secret = client_secret_input.value;
      site_url = site_url_input.value;
      podcast_url = podcast_url_input.value;
      podcast_title = podcast_title_input.value;
      podcast_description = podcast_description_input.value;
      podcast_author = podcast_author_input.value;
      podcast_owner = podcast_owner_input.value;
      podcast_email = podcast_email_input.value;
      podcast_summary = (isDefined(podcast_summary_input.value)) ? podcast_summary_input.value : podcast_description;
      language = language_input.value;
      category = getSelectedValue(main_category_input);
      sub_category = getSelectedValue(sub_category_input);
      explicit = (isChecked(explicit_input)) ? 'yes' : 'no';
      closed_captioned = (isChecked(closed_captioned_input)) ? 'yes' : 'no';
      complete = (isChecked(complete_input)) ? 'yes' : 'no';

      if (requiredFieldsHaveValues([podcast_title, site_url, podcast_author, podcast_url, podcast_description, podcast_email, language])) {
        setPodcastData();
        createRequest('getVideos');
      } else {
        alert('One or more required inputs was missing: be sure you include the podcast title, author, email, description, url and language, as well as your site url');
      }
    }

    function getVideosForFeed() {
      var checkedBoxes = getCheckedBoxValues(videosCollection),
      i,
      iMax,
      index;
      iMax = checkedBoxes.length;
      for (i = 0; i < iMax; i++) {
        index = findObjectInArray(all_videos, 'id', checkedBoxes[i]);
        videos.push(all_videos[index]);
        sortArray(videos, 'published_at');
      }
    }

    function populateMainCategorySelect() {
      var option,
        prop,
        first = true;
      for (prop in categories) {
        option = document.createElement('option');
        if (first) {
          option.setAttribute('selected', 'selected');
          first = false;
        }
        option.setAttribute('value', prop);
        option.appendChild(document.createTextNode(prop));
        main_category_input.appendChild(option);
      }
    }

    function populateSubCategorySelect() {
      var option,
        i,
        iMax,
        mainCategory = getSelectedValue(main_category_input);
        if (isDefined(mainCategory)) {
          iMax = categories[mainCategory].length;
          for (i = 0; i < iMax; i++) {
            option = document.createElement('option');
            option.setAttribute('value', categories[mainCategory][i]);
            option.appendChild(document.createTextNode(categories[mainCategory][i]));
            sub_category_input.appendChild(option);
          }
        }
    }

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
        console.log('Error: no input received');
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
        checkboxCollection[i].setAttribute('checked', 'checked');
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
        checkboxCollection[i].removeAttribute('checked');
      }
    }


    function addItems() {
        var i, iMax, video, videoURL, posterURL, doPoster = true;
        if (videos.length > 0) {
            iMax = videos.length;
            for (i = 0; i < iMax; i += 1) {
                video = videos[i];
                // video may not have a valid source
                if (isDefined(video.source) && isDefined(video.source.src)) {
                    videoURL = encodeURI(video.source.src.replace(/&/g, '&amp;'));
                } else {
                    videoURL = "";
                }
                mrssStr += sItem;
                mrssStr += sTitle + video.name + eTitle;
                mrssStr += sAuthor + author + eAuthor;
                if (isDefined(video.description)) {
                  mrssStr += sSubTitle + video.description + eSubTitle;
                }
                if (isDefined(video.long_description)) {
                  mrssStr += sSummary + video.long_description + eSummary;
                }
                if (video.images.hasOwnProperty('poster')) {
                  mrssStr += sImage + video.poster.src + eImage;
                }
                mrssStr += sEnclosure + 'length="' + video.source.size + '" type="video/mp4" ' + 'url="' + video.source.src + '"' + eEnclosure;
                mrssStr += sGuid + video.source.src + eGuid;
                mrssStr += sPubDate + video.published_at + ePubDate;
                mrssStr += sDuration + millisecondsToTime(video.duration) + eDuration;
                mrssStr += sExplicit + explicit + eExplicit;
                mrssStr += sisClosedCaptioned + closed_captioned + eisClosedCaptioned;
                mrssStr += eItem;
            }
        }
        mrssStr += eChannel + '</rss>';
        logMessage('Finished!');
        feedDisplay.textContent = vkbeautify.xml(mrssStr);
        enableButtons();
    }

    /**
     * sets up the data for the API request
     * @param {String} id the id of the button that was clicked
     */
    function createRequest(id) {
        var endPoint = '',
            options = {},
            parsedData;
        // disable buttons to prevent a new request before current one finishes
        disableButtons();
        options.proxyURL = proxyURL;
        options.account_id = account_id;
        if (isDefined(client_id) && isDefined(client_secret)) {
          options.client_id = client_id;
          options.client_secret = client_secret;
        }

        switch (id) {
            case 'getVideos':
            endPoint = account_id + '/videos?limit=20';
            if (isDefined(search_string)) {
                endPoint += '&q=' + encodeURI(search_string);
            }
            options.url = baseURL + endPoint;
            options.requestType = 'GET';
            apiRequest.textContent = options.url;
            makeRequest(options, function(response) {
              var input, label, space, text, br, i, iMax;
console.log('response', response);
              all_videos = JSON.parse(response);
              logMessage(videos.length + ' videos retrieved');
              apiResponse.textContent = JSON.stringify(all_videos, null, '  ');
              input = document.createElement('input');
              space = document.createTextNode(' ');
              label = document.createElement('label');
              input.setAttribute('name', 'videosChkAll');
              input.setAttribute('id', 'videosChkAll');
              input.setAttribute('type', 'checkbox');
              input.setAttribute('value', 'all');
              label.setAttribute('for', 'videosChkAll');
              label.setAttribute('style', 'color:#F3951D;');
              text = document.createTextNode('Select All');
              label.appendChild(text);
              br = document.createElement('br');
              fragment.appendChild(input);
              fragment.appendChild(space);
              fragment.appendChild(label);
              fragment.appendChild(br);
                iMax = all_videos.length;
                for (i = 0; i < iMax; i++) {
                  input = document.createElement('input');
                  space = document.createTextNode(' ');
                  label = document.createElement('label');
                  input.setAttribute('name', 'videosChk');
                  input.setAttribute('id', 'field' + all_videos[i].id);
                  input.setAttribute('type', 'checkbox');
                  input.setAttribute('value', all_videos[i].id);
                  label.setAttribute('for', 'field' + all_videos[i].id);
                  text = document.createTextNode(all_videos[i].name);
                  label.appendChild(text);
                  br = document.createElement('br');
                  fragment.appendChild(input);
                  fragment.appendChild(space);
                  fragment.appendChild(label);
                  fragment.appendChild(br);
                }
                // clear videos videos
                returned_videos.innerHTML = '';
                returned_videos.appendChild(fragment);
                // get references to checkboxes
                videosCollection = document.getElementsByName('videosChk');
                videosSelectAll = document.getElementById('videosChkAll');
                // add event listener for select allows
                videosSelectAll.addEventListener('change', function() {
                  if (this.checked) {
                    selectAllCheckboxes(videosCollection);
                  } else {
                    deselectAllCheckboxes(videosCollection);
                  }
                });
              });
              break;
            case 'getVideoSources':
                var i,
                    iMax = videos.length;
                endPoint = account_id + '/videos/' + videos[callNumber].id + '/sources';
                options.url = baseURL + endPoint;
                options.requestType = 'GET';
                apiRequest.textContent = options.url;
                logMessage('Getting sources for video ' + videos[callNumber].name);
                makeRequest(options, function(response) {
                  sources = JSON.parse(response);
                  apiResponse.textContent = JSON.stringify(souces, null, '  ');
                  if (sources.length > 0) {
                      // get the best MP4 rendition
                      var source = processSources(sources);
                      videos[callNumber].source = source;
                  } else {
                      // video has no sources
                      videos[callNumber].source = null;
                  }
                  callNumber++;
                  if (callNumber < iMax) {
                      createRequest('getVideoSources');
                  } else {
                      // remove videos with no sources
                      i = videos.length;
                      while (i > 0) {
                          i--;
                          console.log('videos[i]', videos[i]);
                          if (!isDefined(videos[i].source)) {
                              console.log('i', i);
                              videos.splice(i, 1);
                          }
                      }
                      addItems();
                  }
                });
                break;
        }
    }

    /**
     * send API request to the proxy
     * @param  {Object} options for the request
     * @param  {String} options.url the full API request URL
     * @param  {String="GET","POST","PATCH","PUT","DELETE"} requestData [options.requestType="GET"] HTTP type for the request
     * @param  {String} options.proxyURL proxyURL to send the request to
     * @param  {String} options.client_id client id for the account (default is in the proxy)
     * @param  {String} options.client_secret client secret for the account (default is in the proxy)
     * @param  {JSON} [options.requestBody] Data to be sent in the request body in the form of a JSON string
     * @param  {Function} [callback] callback function that will process the response
     */
    function makeRequest(options, callback) {
      var httpRequest = new XMLHttpRequest(),
        response,
        requestParams,
        dataString,
        proxyURL = options.proxyURL,
        // response handler
        getResponse = function() {
          try {
            if (httpRequest.readyState === 4) {
              if (httpRequest.status >= 200 && httpRequest.status < 300) {
                response = httpRequest.responseText;
                // some API requests return '{null}' for empty responses - breaks JSON.parse
                if (response === '{null}') {
                  response = null;
                }
                // return the response
                callback(response);
              } else {
                alert('There was a problem with the request. Request returned ' + httpRequest.status);
              }
            }
          } catch (e) {
            alert('Caught Exception: ' + e);
          }
        };
      /**
       * set up request data
       * the proxy used here takes the following request body:
       * JSON.stringify(options)
       */
      // set response handler
      httpRequest.onreadystatechange = getResponse;
      // open the request
      httpRequest.open('POST', proxyURL);
      // set headers if there is a set header line, remove it
      // open and send request
      httpRequest.send(JSON.stringify(options));
    }

    function init() {
        populateMainCategorySelect();
        // event handlers
        main_category_input.addEventListener('change', function() {
          populateSubCategorySelect();
        });
        get_videos.addEventListener('click', function() {
          getInputData();
        });
        make_feed.addEventListener('click', function() {
          getVideosForFeed();
          totalVideos = videos.length;
          totalCalls = totalVideos;
          logMessage('Total videos to retrieve: ' + totalVideos);
          createRequest('getVideoSources');
        });
        feedDisplay.addEventListener('click', function() {
            feedDisplay.select();
        });
    }

    init();
})(window, document);
