var BCLS = (function(window, document) {
  var mrssStr =
      '<?xml version="1.0" encoding="UTF-8"?> <?xml-stylesheet type="text/xsl" href="https://feeds.podcastmirror.com/assets/rssfeedstyle.xsl"?> <rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:wfw="http://wellformedweb.org/CommentAPI/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:sy="http://purl.org/rss/1.0/modules/syndication/" xmlns:slash="http://purl.org/rss/1.0/modules/slash/" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:rawvoice="http://www.rawvoice.com/rawvoiceRssModule/" xmlns:googleplay="http://www.google.com/schemas/play-podcasts/1.0" >',
    sCdata = '<![CDATA[',
    eCdata = ']]>',
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
    eCategory2 = '" />',
    sSubcategory = '<itunes:category text="',
    eSubCategory = '" />',
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
    sSummary = '<itunes:summary>',
    eSummary = '</itunes:summary>',
    sKeywords = '<itunes:keywords>',
    eKeywords = '</itunes:keywords>',
    sEnclosure = '<enclosure ',
    eEnclosure = ' />',
    sItem = '<item>',
    eItem = '</item>',
    sLink = '<link>',
    eLink = '</link>',
    sGuid = '<guid isPermaLink="false">',
    eGuid = '</guid>',
    sPubDate = '<pubDate>',
    ePubDate = '</pubDate>',
    sCopyright = '<copyright>',
    sLastBuildDate = '<lastBuildDate>',
    eLastBuildDate = '</lastBuildDate>',
    eCopyright = '</copyright>',
    sLanguage = '<language>',
    eLanguage = '</language>',
    sType = '<itunes:type>',
    eType = '</itunes:type>',
    sSeason = '<itunes:season>',
    eSeason = '</itunes:season>',
    sEpisode = '<itunes:episode>',
    eEpisode = '</itunes:episode>',
    sEpisodeType = '<itunes:episodeType>',
    eEpisodeType = '</itunes:episodeType>',
    // input data
    account_id,
    client_id,
    client_secret,
    podcast_item,
    podcast_guid,
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
    podcast_keywords,
    podcast_type = 'video/mp4',
    type,
    episode_type,
    language,
    category,
    sub_category,
    explicit = 'no',
    closed_captioned = 'no',
    complete = 'no',
    year = new Date().getFullYear().toString(),
    today = new Date().toUTCString(),
    // api stuff
    proxyURL =
      'https://solutions.brightcove.com/bcls/bcls-proxy/bcls-proxy-v2.php',
    baseURL = 'https://cms.api.brightcove.com/v1/accounts/',
    search_string,
    totalVideos = 0,
    totalCalls = 0,
    callNumber = 0,
    videos = [],
    videos = [],
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
    type_select = document.getElementById('type_select'),
    podcast_description_input = document.getElementById(
      'podcast_description_input'
    ),
    podcast_summary_input = document.getElementById('podcast_summary_input'),
    language_input = document.getElementById('language_input'),
    podcast_keywords_input = document.getElementById('podcast_keywords_input'),
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
    seasonSelectors,
    episodeSelectors,
    episodeTypeSelectors,
    guidInputs,
    categories = {
      Arts: [ 'Design', 'Fashion & Beauty', 'Food', 'Literature', 'Performing Arts', 'Visual Arts' ],
      Business: [ 'Business News', 'Careers', 'Investing', 'Management & Marketing', 'Shopping'
      ],
      Comedy: [],
      Education: [ 'Educational Technology', 'Higher Education', 'K-12', 'Language Courses', 'Training' ],
      'Games & Hobbies': [ 'Automotive', 'Aviation', 'Hobbies', 'Other Games', 'Video Games' ],
      'Government & Organizations': [ 'Local', 'National', 'Non-Profit', 'Regional' ],
      Health: [ 'Alternative Health', 'Fitness & Nutrition', 'Self-Help', 'Sexuality'
      ],
      'Kids & Family': [],
      Music: [],
      'News & Politics': [],
      'Religion & Spirituality': [ 'Buddhism', 'Christianity', 'Hinduism', 'Islam', 'Judaism', 'Other', 'Spirituality' ],
      'Science & Medicine': ['Medicine', 'Natural Sciences', 'Social Sciences'],
      'Sports & Recreation': [ 'Amateur', 'College & High School', 'Outdoor', 'Professional' ],
      Technology: ['Gadgets', 'Tech News', 'Podcasting', 'Software How-To'],
      'TV & Film': []
    };

  /**
   * tests for all the ways a variable might be undefined or not have a value
   * @param {String|Number} x the variable to test
   * @return {Boolean} true if variable is defined and has a value
   */
  function isDefined(x) {
    if (x === '' || x === null || x === undefined) {
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
   * replace spaces in a string with + signs
   * @param {String} str string to process
   * @return {String} fixed string
   */
  function replaceSpaces(str) {
      str= str.replace(/\s/g, '+');
      return str;
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
   * (inside an element with id='logger')
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
    targetArray.sort(function(b, a) {
      var propA = a[objProperty],
        propB = b[objProperty];
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
    var i,
      totalItems = targetArray.length,
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
    var milliseconds = (isDefined(msecs)) ? msecs : 0,
      secs = msecs / 1000,
      hours = Math.floor(secs / (60 * 60)),
      divisor_for_minutes = secs % (60 * 60),
      minutes = Math.floor(divisor_for_minutes / 60),
      divisor_for_seconds = divisor_for_minutes % 60,
      seconds = Math.ceil(divisor_for_seconds),
      str = '';

    if (seconds === 60) {
      minutes++;
      seconds = 0;
    }
    if (minutes === 60) {
      hours++;
      minutes = 0;
    }

    if (hours > 0) {
      if (hours < 10) {
        hours = '0' + hours.toString() + ':';
      } else {
        str += hours.toString() + ':';
      }
    } else {
      str += '00:'
    }

    if (minutes > 0) {
      if (minutes < 10) {
        str += '0' + minutes.toString() + ':';
      } else {
        str += minutes.toString() + ':';
      }
    } else {
      str += '00:'
    }

    if (seconds < 10) {
      str += '0' + seconds.toString();
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
    mrssStr += sTitle + sCdata + podcast_title = eCdata + eTitle;
    mrssStr += sLink + sCdata + podcast_url + eCdata + eLink;
    mrssStr += sLanguage + language + eLanguage;
    mrssStr += sCopyright + sCdata + podcast_owner + ' year ' + eCdata + eCopyright;
    if (isDefined(podcast_subtitle)) {
      mrssStr += sSubTitle + sCdata + podcast_subtitle + eCdata + eSubTitle;
    }
    mrssStr += sAuthor + sCdata + podcast_author + eCdata + eAuthor;
    mrssStr += sSummary + sCdata + podcast_summary + eCdata + eSummary;
    mrssStr += sDescription + sCdata + podcast_description + eCdata + eDescription;
    mrssStr += sOwner;
    mrssStr += sName + sCdata + podcast_owner + eCdata + eName;
    mrssStr += sEmail + sCdata + podcast_email+ eCdata + eEmail;
    mrssStr += eOwner;
    mrssStr += sImage + sCdata + podcast_image + eCdata + eImage;
    mrssStr += sPubDate + sCdata + today + eCdata + ePubDate;
    mrssStr += sLastBuildDate + sCdata + today + eCdata + eLastBuildDate;
    mrssStr += sCategory + category;
    if (isDefined(sub_category)) {
      mrssStr += eCategory1;
      mrssStr += sSubcategory + sub_category + eSubCategory;
      mrssStr += eCategory;
    } else {
      mrssStr += eCategory1 + eCategory;
    }
    if (isDefined(podcast_keywords)) {
      mrssStr += sKeywords + sCdata + podcast_keywords + eCdata + eKeywords;
    }
    mrssStr += sExplicit + explicit + eExplicit;
    mrssStr += sComplete + complete + eComplete;
    mrssStr += sType + type + eType;
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
    iMax = fieldsToCheck.length;
    for (i = 0; i < iMax; i++) {
      if (!isDefined(fieldsToCheck[i])) {
        tmpArr.push(fieldsToCheck[i]);
      }
    }
    if (tmpArr.length === 0) {
      return true;
    }
    return false;
  }

  function getInputData() {
    account_id = isDefined(account_id_input.value)
      ? account_id_input.value
      : '1752604059001';
    client_id = client_id_input.value;
    client_secret = client_secret_input.value;
    site_url = site_url_input.value;
    podcast_url = podcast_url_input.value;
    podcast_title = podcast_title_input.value;
    podcast_subtitle = podcast_subtitle_input.value;
    podcast_description = podcast_description_input.value;
    podcast_keywords = podcast_keywords_input.value;
    podcast_image = podcast_image_input.value;
    podcast_author = podcast_author_input.value;
    podcast_owner = isDefined(podcast_owner_input.value) ? podcast_owner_input.value : podcast_author_input.value;
    podcast_email = podcast_email_input.value;
    podcast_summary = isDefined(podcast_summary_input.value)
      ? podcast_summary_input.value
      : podcast_description;
    language = language_input.value;
    category = getSelectedValue(main_category_input);
    sub_category = getSelectedValue(sub_category_input);
    explicit = isChecked(explicit_input) ? 'yes' : 'no';
    closed_captioned = isChecked(closed_captioned_input) ? 'yes' : 'no';
    complete = isChecked(complete_input) ? 'yes' : 'no';
    type = getSelectedValue(type_select);
    search_string = search_string_input.value;
    if (
      requiredFieldsHaveValues([
        podcast_title,
        site_url,
        podcast_author,
        podcast_url,
        podcast_description,
        podcast_email,
        language,
        client_id,
        client_secret,
        account_id,
        podcast_image,
        type,
        category,
        search_string
      ])
    ) {
      setPodcastData();
      createRequest('getVideos');
    } else {
      alert(
        'One or more required inputs was missing'
      );
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
        option.appendChild(
          document.createTextNode(categories[mainCategory][i])
        );
        sub_category_input.appendChild(option);
      }
    }
  }


  function addItems() {
    var i,
      iMax,
      video,
      videoURL,
      posterURL,
      pubdate,
      doPoster = true;
    if (videos.length > 0) {
      iMax = videos.length;
      for (i = 0; i < iMax; i += 1) {
        video = videos[i];
        pubDate = new Date(video.published_at);
        pubDate = pubDate.toUTCString();
        // video may not have a valid source
        if (isDefined(video.source) && isDefined(video.source.src)) {
          videoURL = encodeURI(video.source.src.replace(/&/g, '&amp;'));
        } else {
          videoURL = '';
        }
        mrssStr += sItem;
        mrssStr += sTitle + video.name + eTitle;
        mrssStr += sAuthor + podcast_author + eAuthor;
        if (isDefined(video.description)) {
          mrssStr += sSubTitle + video.description + eSubTitle;
        }
        if (isDefined(video.long_description)) {
          mrssStr += sSummary + video.long_description + eSummary;
        }
        if (video.images.hasOwnProperty('poster')) {
          mrssStr += sImage + video.images.poster.src + eImage;
        }
        mrssStr += sEnclosure + 'length="' + video.source.size + '" type="video/mp4" ' + 'url="' + video.source.src + '"' + eEnclosure;
        mrssStr += sGuid + guidInputs[i].value + eGuid;
        mrssStr += sPubDate + pubDate + ePubDate;
        console.log('duration', millisecondsToTime(video.duration) );
        mrssStr += sDuration + millisecondsToTime(video.duration) + eDuration;
        mrssStr += sExplicit + explicit + eExplicit;
        mrssStr += sisClosedCaptioned + closed_captioned + eisClosedCaptioned;
        mrssStr += sSeason + getSelectedValue(seasonSelectors[i]) + eSeason;
        mrssStr += sEpisode + getSelectedValue(episodeSelectors[i]) + eEpisode;
        mrssStr += sEpisodeType + getSelectedValue(episodeTypeSelectors[i]) + eEpisodeType;
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
        endPoint = account_id + '/videos?limit=100';
        if (isDefined(search_string)) {
          endPoint += '&q=' + replaceSpaces(search_string);
        }
        options.url = baseURL + endPoint;
        options.requestType = 'GET';
        apiRequest.textContent = options.url;
        makeRequest(options, function(response) {
          var input,
            seasonSelect,
            episodeSelect,
            episodeTypeSelect,
            option,
            space,
            p,
            a,
            video,
            span,
            input,
            space,
            text,
            br,
            i,
            iMax,
            j,
            fragment = document.createDocumentFragment();
          videos = JSON.parse(response);
          logMessage(videos.length + ' videos retrieved');
          apiResponse.textContent = JSON.stringify(videos, null, '  ');
          iMax = videos.length;
          for (i = 0; i < iMax; i++) {
            video = videos[i];
            fragment.appendChild(document.createTextNode(video.name));
            space =  document.createTextNode(' ');
            fragment.appendChild(space);
            seasonSelect = document.createElement('select');
            seasonSelect.setAttribute('name', 'season_select');
            option = document.createElement('option');
            option.textContent = 'Season';
            seasonSelect.appendChild(option);
            for (j = 1; j < 11; j++) {
              option = document.createElement('option');
              option.setAttribute('value', j);
              option.textContent = j;
              seasonSelect.appendChild(option);
            }
            fragment.appendChild(seasonSelect);
            space =  document.createTextNode(' ');
            fragment.appendChild(space);
            episodeSelect = document.createElement('select');
            episodeSelect.setAttribute('name', 'episode_select');
            option = document.createElement('option');
            option.textContent = 'Episode';
            episodeSelect.appendChild(option);
            for (j = 1; j < 11; j++) {
              option = document.createElement('option');
              option.setAttribute('value', j);
              option.textContent = j;
              episodeSelect.appendChild(option);
            }
            fragment.appendChild(episodeSelect);
            space =  document.createTextNode(' ');
            fragment.appendChild(space);
            episodeTypeSelect = document.createElement('select');
            episodeTypeSelect.setAttribute('name', 'episode_type_select');
            option = document.createElement('option');
            option.textContent = 'Episode Type';
            episodeTypeSelect.appendChild(option);
            option = document.createElement('option');
            option.setAttribute('value', 'full');
            option.textContent = 'Full';
            episodeTypeSelect.appendChild(option);
            option = document.createElement('option');
            option.setAttribute('value', 'trailer');
            option.textContent = 'Trailer';
            episodeTypeSelect.appendChild(option);
            option = document.createElement('option');
            option.setAttribute('value', 'bonus');
            option.textContent = 'Bonus';
            episodeTypeSelect.appendChild(option);
            fragment.appendChild(episodeTypeSelect);
            br = document.createElement('br');
            fragment.appendChild(br);
            fragment.appendChild(document.createTextNode('GUID**'));
            space =  document.createTextNode(' ');
            fragment.appendChild(space);
            input = document.createElement('input');
            input.setAttribute('name', 'guid_input');
            input.setAttribute('type', 'text');
            fragment.appendChild(input);
            br = document.createElement('br');
            fragment.appendChild(br);
            br = document.createElement('br');
            fragment.appendChild(br);
          }
          p = document.createElement('p');
          p.appendChild(document.createTextNode('** GUIDs for episodes should remain constant over the life of feed, so save them in case you want to add additional episodes localStorage. If you need to generate GUIDs, you can use '));
          a = document.createElement('a');
          a.setAttribute('href', 'https://guidgenerator.com/online-guid-generator.aspx');
          a.textContent = 'this online tool.';
          p.appendChild(a);
          fragment.appendChild(p);
          // clear videos videos
          returned_videos.innerHTML = '';
          returned_videos.appendChild(fragment);
          // get references to selectors
          seasonSelectors = document.getElementsByName('season_select');
          episodeSelectors = document.getElementsByName('episode_select');
          episodeTypeSelectors = document.getElementsByName('episode_type_select');
          guidInputs = document.getElementsByName('guid_input');
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
          apiResponse.textContent = JSON.stringify(sources, null, '  ');
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
              if (!isDefined(videos[i].source)) {
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
   * @param  {String='GET','POST','PATCH','PUT','DELETE'} requestData [options.requestType='GET'] HTTP type for the request
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
              alert(
                'There was a problem with the request. Request returned ' +
                  httpRequest.status
              );
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
