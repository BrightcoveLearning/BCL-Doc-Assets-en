var BCLS = (function(window, document) {
  var account_id,
    client_id,
    client_secret,
    // api stuff
    proxyURL = 'https://solutions.brightcove.com/bcls/bcls-proxy/bcls-proxy-v2.php',
    baseURL = 'https://cms.api.brightcove.com/v1/accounts/',
    limit = 25,
    totalVideos = 0,
    totalCalls = 0,
    callNumber = 0,
    videosCompleted = 0,
    videosArray = [],
    summaryData = {},
    csvStr,
    summaryCsvStr,
    customFields = [],
    // elements
    account_id_element = document.getElementById('account_id'),
    client_id_element = document.getElementById('client_id'),
    client_secret_element = document.getElementById('client_secret'),
    tag = document.getElementById('tag'),
    videoCount = document.getElementById('videoCount'),
    makeReport = document.getElementById('makeReport'),
    content,
    logger = document.getElementById('logger'),
    logText = document.getElementById('logText'),
    apiRequest = document.getElementById('apiRequest'),
    allButtons = document.getElementsByName('button'),
    pLogGettingVideos = document.createElement('p'),
    pLogFinish = document.createElement('p'),
    spanIntro2 = document.createElement('span'),
    spanOf2 = document.createElement('span'),
    unknown_csv = document.getElementById('unknown_csv'),
    remote_csv = document.getElementById('remote_csv'),
    live_origin_csv = document.getElementById('live_origin_csv'),
    static_origin_csv = document.getElementById('static_origin_csv'),
    dynamic_origin_csv = document.getElementById('dynamic_origin_csv'),
    unknown_table = document.getElementById('unknown_table'),
    remote_table = document.getElementById('remote_table'),
    live_origin_table = document.getElementById('live_origin_table'),
    static_origin_table = document.getElementById('static_origin_table'),
    dynamic_origin_table = document.getElementById('dynamic_origin_table'),
    remoteVideos = [],
    unknownVideos = [],
    staticVideos = [],
    dynamicVideos = [],
    liveVideos = [];

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

  /*
   * tests to see if a string is json
   * @param {String} str string to test
   * @return {Boolean}
   */
  function isJson(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
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
 * utility to extract h/m/s from seconds
 * @param {number} ms - milliseconds to convert to hh:mm:ss
 * @returns {object} object with members h (hours), m (minutes), s (seconds)
 */
    function msToTime(ms) {
      console.log('ms'. ms);
        var secs = ms / 1000,
            hours = Math.floor(secs / (60 * 60)),
            divisor_for_minutes = secs % (60 * 60),
            minutes = Math.floor(divisor_for_minutes / 60),
            divisor_for_seconds = divisor_for_minutes % 60,
            seconds = Math.ceil(divisor_for_seconds),
            obj = {};

        if (hours < 10) {
            hours = "0" + hours.toString();
        } else {
            hours = hours.toString();
        }

        if (minutes < 10) {
            minutes = "0" + minutes.toString();
        } else {
            minutes = minutes.toString();
        }

        if (seconds < 10) {
            seconds = "0" + seconds.toString();
        } else {
            seconds = seconds.toString();
        }

        obj = {
            'h': hours,
            'm': minutes,
            's': seconds
        };

        return obj.h + ':' + obj.m + ':' + obj.s;
    }

  function writeReport(videos, tableEl, csvEl) {
    var i,
      iMax,
      video,
      tr,
      td,
      frag = document.createDocumentFragment(),
      csvStr = '"ID","Name","Date Last Modified","Delivery Type",\r\n';
    if (videos.length > 0) {
      iMax = videos.length;
      for (i = 0; i < iMax; i += 1) {
        video = videos[i];
        // add csv row
        csvStr += '"' + video.id + '","' + video.name + '","' + msToTime(video.duration) + '","' + video.updated_at + '","' + video.delivery_type + '",\r\n';
        // add table row
        tr = document.createElement('tr');
        td = document.createElement('td');
        td.textContent = video.id;
        tr.appendChild(td);
        td = document.createElement('td');
        td.textContent = video.name;
        tr.appendChild(td);
        td = document.createElement('td');
        td.textContent = msToTime(video.duration);
        tr.appendChild(td);
        td = document.createElement('td');
        td.textContent = video.updated_at;
        tr.appendChild(td);
        td = document.createElement('td');
        td.textContent = video.delivery_type;
        tr.appendChild(td);
        frag.appendChild(tr);
      }
      csvEl.textContent += csvStr;
      tableEl.appendChild(frag);
    } else {
      csvEl.textContent = 'No videos with this delivery type';
    }
    return;
  }

  function processVideos(videos) {
    var i,
      iMax,
      obj,
      video;
    iMax = videos.length;
    for (i = 0; i < iMax; i++) {
      obj = {};
      video = videos[i];
      switch (video.delivery_type) {
        case 'dynamic_origin':
          obj.id = video.id;
          obj.name = video.name;
          obj.updated_at = video.updated_at;
          obj.delivery_type = video.delivery_type;
          dynamicVideos.push(obj);
          break;
        case 'static_origin':
          obj.id = video.id;
          obj.name = video.name;
          obj.updated_at = video.updated_at;
          obj.delivery_type = video.delivery_type;
          staticVideos.push(obj);
          break;
        case 'live_origin':
          obj.id = video.id;
          obj.name = video.name;
          obj.updated_at = video.updated_at;
          obj.delivery_type = video.delivery_type;
          liveVideos.push(obj);
          break;
        case 'remote':
          obj.id = video.id;
          obj.name = video.name;
          obj.updated_at = video.updated_at;
          obj.delivery_type = video.delivery_type;
          remoteVideos.push(obj);
          break;
        case 'unknown':
          obj.id = video.id;
          obj.name = video.name;
          obj.updated_at = video.updated_at;
          obj.delivery_type = video.delivery_type;
          unknownVideos.push(obj);
          break;
        default:
          console.log('should not be here', videos);
      }
    }
    writeReport(dynamicVideos, dynamic_origin_table, dynamic_origin_csv);
    writeReport(staticVideos, static_origin_table, static_origin_csv);
    writeReport(liveVideos, live_origin_table, live_origin_csv);
    writeReport(remoteVideos, remote_table, remote_csv);
    writeReport(unknownVideos, unknown_table, unknown_csv);
    logText.textContent = 'Finished! See the reports below.'
    enableButtons();
  }

  /**
   * sets up the data for the API request
   * @param {String} id the id of the button that was clicked
   */
  function createRequest(id) {
    var endPoint = '',
      parsedData,
      options = {};
    options.proxyURL = proxyURL;
    options.account_id = account_id;
    if (isDefined(client_id) && isDefined(client_secret)) {
      options.client_id = client_id;
      options.client_secret = client_secret;
    }
    // disable buttons to prevent a new request before current one finishes
    disableButtons();
    switch (id) {
      case 'getCount':
        endPoint = account_id + '/counts/videos?sort=created_at';
        if (isDefined(tag.value)) {
          endPoint += '&q=%2Btags:' + tag.value;
        }
        options.url = baseURL + endPoint;
        options.requestType = 'GET';
        apiRequest.textContent = options.url;
        makeRequest(options, function(response) {
          parsedData = JSON.parse(response);
          // set total videos
          video_count = parsedData.count;
          if (totalVideos === "All") {
            totalVideos = video_count;
          } else {
            totalVideos = (totalVideos < video_count) ? totalVideos : video_count;
          }
          totalCalls = Math.ceil(totalVideos / limit);
          logText.textContent = totalVideos + ' videos found; getting account custom fields';
          createRequest('getVideos');
        });
        break;
      case 'getVideos':
        var offset = (limit * callNumber);
        endPoint = account_id + '/videos?sort=created_at&limit=' + limit + '&offset=' + offset;
        if (isDefined(tag.value)) {
          endPoint += '&q=%2Btags:' + tag.value;
        }
        options.url = baseURL + endPoint;
        options.requestType = 'GET';
        apiRequest.textContent = options.url;
        makeRequest(options, function(response) {
          parsedData = JSON.parse(response);
          videosArray = videosArray.concat(parsedData);
          callNumber++;
          if (callNumber < totalCalls) {
            logText.textContent = 'Getting video ' + (callNumber + 1) + ' of ' + totalVideos;
            createRequest('getVideos');
          } else {
            processVideos(videosArray);
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
              if (response === '') {
                response = null;
              }
              // return the response
              callback(response);
            } else {
              logger.appendChild(document.createTextNode('There was a problem with the request. Request returned ' + httpRequest.status));
            }
          }
        } catch (e) {
          logger.appendChild(document.createTextNode('Caught Exception: ' + e));
        }
      };
    /**
     * set up request data
     * the proxy used here takes the following request body:
     * JSON.strinify(options)
     */
    // set response handler
    httpRequest.onreadystatechange = getResponse;
    // open the request
    httpRequest.open('POST', proxyURL);
    // open and send request
    httpRequest.send(JSON.stringify(options));
  }


  function init() {
    // event listeners
    unknown_csv.addEventListener('click', function() {
      this.select();
    });
    remote_csv.addEventListener('click', function() {
      this.select();
    });
    live_origin_csv.addEventListener('click', function() {
      this.select();
    });
    static_origin_csv.addEventListener('click', function() {
      this.select();
    });
    dynamic_origin_csv.addEventListener('click', function() {
      this.select();
    });

    // button event handlers
    makeReport.addEventListener('click', function() {
      // in case of re-run, cleal the results
      unknown_csv.textContent = '';
      remote_csv.textContent = '';
      live_origin_csv.textContent = '';
      static_origin_csv.textContent = '';
      dynamic_origin_csv.textContent = '';
      // get the inputs
      client_id = client_id_element.value;
      client_secret = client_secret_element.value;
      account_id = (isDefined(account_id_element.value)) ? account_id_element.value : '1752604059001'
      totalVideos = getSelectedValue(videoCount);
      // only use entered account id if client id and secret are entered also
      if (!isDefined(client_id) || !isDefined(client_secret) || !isDefined(account_id)) {
        logger.appendChild(document.createTextNode('To use your own account, you must specify an account id, and client id, and a client secret - since at least one of these is missing, a sample account will be used'));
        account_id = '1752604059001';
      }
      // get video count
      createRequest('getCount');

    });
  }


  init();
})(window, document);
