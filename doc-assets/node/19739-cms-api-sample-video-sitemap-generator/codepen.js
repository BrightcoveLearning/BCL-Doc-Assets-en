var BCLS = (function(window, document, vkbeautify) {
  var mapStr = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">',
    sCdata = '<![CDATA[',
    eCdata = ']]>',
    sUrl = '<url>',
    eUrl = '</url>',
    sLoc = '<loc>',
    eLoc = '</loc>',
    sVideo = '<video:video>',
    eVideo = '</video:video>',
    sThumbnail = '<video:thumbnail_loc>',
    eThumbnail = '</video:thumbnail_loc>',
    sTitle = '<video:title>',
    eTitle = '</video:title>',
    sDescription = '<video:description>',
    eDescription = '</video:description>',
    sContent_loc = '<video:content_loc>',
    eContent_loc = '</video:content_loc>',
    sDuration = '<video:duration>',
    eDuration = '</video:duration>',
    sExpiration = '<video:expiration>',
    eExpiration = '</video:expiration>',
    sViewcount = '<video:view_count>',
    eViewcount = '</video:view_count>',
    sPublicationdate = '<video:publication_date>',
    ePublicationdate = '</video:publication_date>',
    sFamilyfriendly = '<video:family_friendly>',
    eFamilyfriendly = '</video:family_friendly>',
    sRestriction = '<video:restriction relationship=',
    eRestriction = '</video:restriction>',
    // account stuff
    account_id,
    account_id_default = '1485884786001',
    client_id,
    client_secret,
    // api stuff
    proxyURL = 'https://solutions.brightcove.com/bcls/bcls-proxy/bcls-proxy-v2.php',
    baseURL = 'https://cms.api.brightcove.com/v1/accounts/',
    sort,
    sortDirection = '',
    search,
    limit = 25,
    totalVideos = 0,
    totalCalls = 0,
    callNumber = 0,
    videosArray = [],
    // element references
    account_id_input = document.getElementById('account_id_input'),
    client_id_input = document.getElementById('client_id_input'),
    client_secret_input = document.getElementById('client_secret_input'),
    hostingRadioButtons = document.querySelectorAll('.hosting'),
    idTypeRadioButtons = document.querySelectorAll('.idType'),
    onePage = document.getElementById('onePage'),
    metadata = document.getElementById('metadata'),
    customField = document.querySelector('#customField'),
    customFieldName = document.querySelector('#customFieldName'),
    singlePage = document.querySelector('#singlePage'),
    pageURL = document.querySelector('#pageURL'),
    urlParam = document.querySelector('#urlParam'),
    freqSelect = document.getElementById('freqSelect'),
    familyFriendly = document.getElementById('familyFriendly'),
    numberSelect = document.getElementById('numberSelect'),
    searchStr = document.getElementById('searchStr'),
    sortSelect = document.getElementById('sortSelect'),
    directionSelect = document.getElementById('directionSelect'),
    makeMap = document.getElementById('makeMap'),
    logger = document.getElementById('logger'),
    apiRequest = document.getElementById('apiRequest'),
    feedDisplay = document.getElementById('feedDisplay');

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
   * determines whether an object has a certain property
   * @param {object} obj the object
   * @param {string} prop the property name
   * @returns {boolean}
   */
  function hasProperty(obj, prop) {
    if (prop in obj) {
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
   * get value of a selected radio buttom
   * @param {htmlElementCollection} rgroup the collection of radio buttom elements
   * @returns {string} value of the selected element
   */
  function getRadioValue(rgroup) {
    var i = 0,
      iMax = rgroup.length;
    for (i; i < iMax; i++) {
      if (rgroup[i].checked) {
        return rgroup[i].value;
      }
    }
  }

  /**
   * hide an HTML element and its children
   *
   * @param   {[type]}  block  the element to hide
   */
  function hideBlock(block) {
    block.setAttribute('style', 'display:none;');
  }

  /**
   * show a hidden HTML element and its children
   *
   * @param   {[type]}  block  the element to show
   */
  function showBlock(block) {
    block.removeAttribute('style');
  }

  /**
   * disables all buttons so user can't submit new request until current one finishes
   * @param {htmlElement} b reference to the button
   */
  function disableButton(b) {
    b.classList.add('disabled');
    b.setAttribute('disabled', 'disabled');
  }

  /**
   * enable a button
   * @param   {htmlElement}  b  reference to the button
   */
  function enableButton(b) {
    b.classList.remove('disabled');
    b.removeAttribute('disabled');
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
   * find the best MP4 source
   *
   * @param   {array}  sources  array of source objects for a video
   *
   * @return  {string}  the src for best MP4 or null if none
   */
  function processSources(sources) {
    var i = sources.length;
    // remove non-MP4 sources
    while (i > 0) {
      i--;
      if (sources[i].container !== 'MP4') {
        sources.splice(i, 1);
      } else if (hasProperty(sources[i], 'stream_name')) {
        sources.splice(i, 1);
      }
    }
    // sort sources by encoding rate
    sortArray(sources, 'encoding_rate');
    // return the first item (highest bitrate)
    return sources[0].src;
  }

  function addItems() {
    var i,
      iMax,
      video,
      fieldName,
      now = new Date(),
      endsAt,
      startsAt;
    if (videosArray.length > 0) {
      iMax = videosArray.length;
      for (i = 0; i < iMax; i += 1) {
        video = videosArray[i];

        // check for break conditions

        // only active videos
        if (video.state !== 'ACTIVE') {
          break;
        }
        // if schedule starts after or end before now, skip
        if (isDefined(video.schedule)) {
          if (isDefined(video.schedule.starts_at)) {
            startsAt = new Date(video.schedule.starts_at);
            if (startsAt > now) {
              break;
            }
          }
          if (isDefined(video.schedule.ends_at)) {
            endsAt = new Date(video.schedule.ends_at);
            if (endsAt < now) {
              break;
            } else {
              video.expiration_date = video.schedule.ends_at;
          }
        }
      }
        // must have a valid URL
        if (getRadioValue(hostingRadioButtons) === 'singlePage') {
          // single page hosting
          video.loc = pageURL.value;
          if (video.loc.indexOf('?') > -1) {
            video.loc += '&' + urlParam.value + '=';
          } else {
            video.loc += '?' + urlParam.value + '=';
          }
          if (getRadioValue(idTypeRadioButtons) === id) {
            video.loc += video.id;
          } else if (isDefined(video.reference_id)) {
            video.loc += video.reference_id;
          } else {
            // no reference id; skip video
            break;
          }
        } else {
          // URL stored in custom field
          fieldName = customFieldName.value;
          if (hasProperty(video.custom_fields, fieldName)) {
            video.loc = video.custom_fields[fieldName];
          } else {
            // video is missing custom field; skip it
            break;
          }
        }

        if (isDefined(video.images) && isDefined(video.images.thumbnail)) {
          video.thumbnailURL = video.images.thumbnail.sources[0].src;
        } else if (isDefined(video.thumbnail)) {
          video.thumbnailURL = video.thumbnail;
        } else {
          // no thumbnail, skip video
          break;
        }

        video.freqSelect = getSelectedValue(freqSelect) !== 'null' ? getSelectedValue(freqSelect) : null;

        mapStr += sUrl;
        mapStr += sLoc + video.loc + eLoc;
        mapStr += sVideo;
        mapStr += sThumbnail + video.thumbnailURL + eThumbnail;
        mapStr += sTitle + video.name + eTitle;
        mapStr += sDescription + sCdata + video.description + eCdata + eDescription;
        mapStr += sContent_loc + video.content_loc + eContent_loc;
        mapStr += sDuration + video.duration + eDuration;
        if (isDefined(video.expiration_date)) {
          mapStr += sExpiration + video.expiration_date + eExpiration;
        }
        mapStr += sPublicationdate + video.published_at + ePublicationdate;
        if (familyFriendly.checked) {
          mapStr += sFamilyfriendly + 'yes' + eFamilyfriendly;
        } else {
          mapStr += sFamilyfriendly + 'no' + eFamilyfriendly;
        }
        mapStr += eVideo;
        mapStr += eUrl;
      }
    }
    mapStr += '</urlset>';
    logger.textContent = 'Finished!';
    feedDisplay.textContent = vkbeautify.xml(mapStr);
    enableButton(makeMap);
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
    disableButton(makeMap);
    options.proxyURL = proxyURL;
    options.account_id = account_id;
    if (isDefined(client_id) && isDefined(client_secret)) {
      options.client_id = client_id;
      options.client_secret = client_secret;
    }

    switch (id) {
      case 'getCount':
        endPoint = account_id + '/counts/videos?sort=' + sort;
        if (isDefined(search)) {
          endPoint += '&q=' + search;
        }
        options.url = baseURL + endPoint;
        options.requestType = 'GET';
        apiRequest.textContent = options.url;
        makeRequest(options, function(response) {
          parsedData = JSON.parse(response);
          // set total videos
          totalVideos = parsedData.count;
          totalCalls = Math.ceil(totalVideos / limit);
          logger.textContent = 'Total videos: ' + totalVideos;
          createRequest('getVideos');
        });
        break;
      case 'getVideos':
        endPoint = account_id + '/videos?sort=' + sort + '&limit=' + limit + '&offset=' + limit * callNumber;
        if (isDefined(search)) {
          endPoint += '&q=' + search;
        }
        options.url = baseURL + endPoint;
        options.requestType = 'GET';
        apiRequest.textContent = options.url;
        makeRequest(options, function(response) {
          parsedData = JSON.parse(response);
          videosArray = videosArray.concat(parsedData);
          callNumber++;
          if (callNumber < totalCalls) {
            logger.textContent = 'Getting video set ' + callNumber;
            createRequest('getVideos');
          } else {
            logger.textContent = 'Video data for ' + totalVideos + ' retrieved; getting views and sources';
            callNumber = 0;
            totalCalls = videosArray.length;
            createRequest('getVideoViews');
          }
        });
        break;
      case 'getVideoViews':
        options.url = 'https://analytics.api.brightcove.com/v1/alltime/accounts/' + account_id + '/videos/' + videosArray[callNumber];
        options.requestType = 'GET';
        logger.textContent = 'Getting alltime views for video ' + (callNumber + 1) + ' of ' + totalCalls;
        makeRequest(options, function(response) {
          videosArray[callNumber].view_count = JSON.parse(response).alltime_video_views;
          createRequest('getVideoSources');
        });
        break;
      case 'getVideoSources':
        var i,
          iMax = videosArray.length;
        endPoint = account_id + '/videos/' + videosArray[callNumber].id + '/sources';
        options.url = baseURL + endPoint;
        options.requestType = 'GET';
        apiRequest.textContent = options.url;
        logger.textContent = 'Getting sources for video ' + videosArray[callNumber].name;
        makeRequest(options, function(response) {
          sources = JSON.parse(response);
          if (sources.length > 0) {
            // get the best MP4 rendition
            var source = processSources(sources);
            videosArray[callNumber].content_loc = source;
          } else {
            // video has no sources
            videosArray[callNumber].content_loc = null;
          }
          callNumber++;
          if (callNumber < totalCalls) {
            createRequest('getVideoSources');
          } else {
            // remove videos with no sources
            i = videosArray.length;
            while (i > 0) {
              i--;
              console.log('videosArray[i]', videosArray[i]);
              if (!isDefined(videosArray[i].content_loc)) {
                videosArray.splice(i, 1);
              }
            }
            logger.textContent = 'Sources retrieved. Generating sitemap...';
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
    var i, iMax;
    // event handlers
    makeMap.addEventListener('click', function() {
      var numVideos;
      // get the inputs
      client_id = client_id_input.value;
      client_secret = client_secret_input.value;
      // only use entered account id if client id and secret are entered also
      if (isDefined(client_id) && isDefined(client_secret)) {
        if (isDefined(account_id_input.value)) {
          account_id = account_id_input.value;
        } else {
          window.alert('To use your own account, you must specify an account id, and client id, and a client secret - since at least one of these is missing, a sample account will be used');
          client_id = '';
          client_secret = '';
          account_id = account_id_default;
        }
      } else {
        account_id = account_id_default;
      }
      sort = getSelectedValue(sortSelect);
      sortDirection = getSelectedValue(directionSelect);
      if (isDefined(sortDirection)) {
        sort = sortDirection + sort;
      }
      search = searchStr.value;
      numVideos = getSelectedValue(numberSelect);
      // if all videos wanted, get count; otherwise get videos
      if (numVideos === 'all') {
        // we need to get the count
        createRequest('getCount');
      } else {
        totalVideos = parseInt(numVideos);
        totalCalls = Math.ceil(numVideos / limit);
        logger.textContent = 'Total videos to retrieve: ' + totalVideos;
        createRequest('getVideos');
      }
    });
    iMax = hostingRadioButtons.length;
    for (i = 0; i < iMax; i++) {
      var rb = hostingRadioButtons[i];
      rb.addEventListener('change', function() {
        if (getRadioValue(hostingRadioButtons) === 'singlePage') {
          showBlock(onePage);
          hideBlock(metadata);
        } else {
          showBlock(metadata);
          hideBlock(onePage);
        }
      });
    }
    feedDisplay.addEventListener('click', function() {
      feedDisplay.select();
    });
    hideBlock(singlePage);
  }

  init();
})(window, document, vkbeautify);
