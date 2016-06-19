var BCLS = (function ($, window, document, datepickr) {
    "use strict";
    var proxyURL = "https://solutions.brightcove.com/bcls/bcls-proxy/bcls-proxy.php",
        callNumber = 0,
        callType = "",
        // call limit will be reset once we know how many countries have data for the period
        callLimit = 200,
        useMyAccount = document.getElementById("useMyAccount"),
        basicInfo = document.getElementById("basicInfo"),
        accountID = document.getElementById("accountID"),
        client_id = document.getElementById("client_id"),
        client_secret = document.getElementById("client_secret"),
        dateSelector = document.getElementById("dateSelector"),
        reportTableBody = document.getElementById("reportTableBody"),
        account_id,
        currentDayIndex = 0,
        currentDay,
        dayMax,
        daysObj = {},
        daysArray = [],
        dateToMS,
        dateFromMS,
        analyticsData = {},
        dayMS,
        fromDate = document.getElementById("fromDatePicker"),
        toDate = document.getElementById("toDatePicker"),
        countrySelector = document.getElementById("countrySelector"),
        getData = document.getElementById("getData"),
        gettingDataDisplay = document.getElementById("gettingDataDisplay"),
        today = new Date(),
        weekAgo = new Date(today - 604800000),
        countryDisplayTemplate = "{{#items}}<option value=\"{{country}}\">{{country_name}}</option>{{/items}}",
        dateDisplayTemplate = "{{#items}}<option value=\"{{date}}\">{{date}}</option>{{/items}}",
        dataDisplayBodyTemplate = "<tr><th colspan=\"2\">{{date}}</th></tr>{{#items}}<tr><td>{{country_name}}</td><td>{{video_view}}</td></tr>{{/items}}",
        /**
         * tests for all the ways a variable might be undefined or not have a value
         * @param {*} x the variable to test
         * @return {Boolean} true if variable is defined and has a value
         */
        isDefined = function(x){
            if( x !== "" && x !== null && x !== undefined && x !== NaN && x !== {} && x !== []){
                return true;
            } else{
                return false;
            }
        },
        /**
         * Logging function - safe for IE
         * @param  {string} context description of the data
         * @param  {*} message the data to be logged by the console
         * @return {}
         */
        bclslog = function (context, message) {
            if (window["console"] && console["log"]) {
              console.log(context, message);
            }
            return;
        },
        /**
         * function that returns iso date for JS date object
         * @param {date} date the date object
         * @return {string} iso date string
         */
        dateToISO = function (date) {
            var y = date.getFullYear(),
                m = date.getMonth(),
                d = date.getDate(),
                isoDate;
            y = y.toString();
            m = m + 1;
            if (m < 10) {
                m = "0" + m.toString();
            } else {
                m = m.toString();
            }
            if (d < 10) {
                d = "0" + d.toString();
            } else {
                d = d.toString();
            }
            isoDate = y + "-" + m + "-" + d;
            return isoDate;
        },
        getSelectValue = function (e) {
            return e.options[e.selectedIndex].value;
        },

        getMonthName = function (month) {
            var name;
            switch (month) {
                case 1:
                name = "Jan";
                break;
                case 2:
                name = "Feb";
                break;
                case 3:
                name = "Mar";
                break;
                case 4:
                name = "Apr";
                break;
                case 5:
                name = "May";
                break;
                case 6:
                name = "Jun";
                break;
                case 7:
                name = "Jul";
                break;
                case 8:
                name = "Aug";
                break;
                case 9:
                name = "Sep";
                break;
                case 10:
                name = "Oct";
                break;
                case 11:
                name = "Nov";
                break;
                case 12:
                name = "Dec";
                break;
            }
            return name;
        },
        displayData = function () {
            var displayStr, template, tempObj = {}, barChartData, chart, day, i, item, thisDay, totalItems, selectedDate, selectedCountry;
            bclslog("analyticsData", analyticsData);
            // clear the table body
            reportTableBody.innerHTML = "";
            template = Handlebars.compile(dataDisplayBodyTemplate);
            if (getSelectValue(dateSelector) === "all") {
                if (getSelectValue(countrySelector) === "all") {
                    for (day in analyticsData) {
                        reportTableBody.innerHTML += template(analyticsData[day]);
                    }
                } else {
                    // we have a selected country
                    selectedCountry = getSelectValue(countrySelector);
                    for (day in analyticsData) {
                        tempObj[day] = {};
                        tempObj[day].items = [];
                        tempObj[day].date = day;
                        thisDay = analyticsData[day];
                        totalItems = thisDay.items.length;
                        for (i = 0; i < totalItems; i++) {
                            item = thisDay.items[i];
                            if (item.country === selectedCountry) {
                                tempObj[day].items.push(item);
                            }
                        }
                    }
                    for (day in tempObj) {
                        reportTableBody.innerHTML += template(tempObj[day]);
                    }
                }
            } else if (getSelectValue(countrySelector) === "all") {
                // a specific data is selected
                selectedDate = getSelectValue(dateSelector);
                reportTableBody.innerHTML += template(analyticsData[selectedDate]);

            } else {
                // a specific date and country are selected
                selectedDate = getSelectValue(dateSelector);
                selectedCountry = getSelectValue(countrySelector);
                totalItems = analyticsData[selectedDate].items.length;
                for (i = 0; i < totalItems; i++) {
                    if (analyticsData[selectedDate].items[i].country === selectedCountry) {
                        item = analyticsData[selectedDate].items[i];
                        tempObj[selectedDate] = {};
                        tempObj[selectedDate].date = selectedDate;
                        tempObj[selectedDate].items = [];
                        tempObj[selectedDate].items.push(item);
                        reportTableBody.innerHTML += template(tempObj[selectedDate]);
                    }
                }
            }
        },
        makeAnalyticsCall = function (callURL) {
            var newItem = {}, options = {};
            options.client_id = (isDefined(client_id.value)) ? client_id.value : "742d6440-58d1-49ed-b2fb-f60d33bf02ae";
            options.client_secret = (isDefined(client_secret.value)) ? client_secret.value : "xs3vuzzKPz5fWHInsON26SXOL54X1GObFW70KylVqdVuIHdkqwqlCs9yVSCRF3i5u_0NcNb7MrzntCLaveZmeQ";
            options.url = callURL;
            options.requestMethod = "GET";
            options.requestData = null;

            $.ajax({
                url: proxyURL,
                type: "POST",
                data: options,
                success : function (data) {
                    var template, results, i, player, video, analytics, item, itemsMax, newItem = {}, str = "", thisVideo;
                    try {
                      var data = JSON.parse(data);
                    } catch (e) {
                      alert('invalid json');
                    }
                    callNumber++;
                    itemsMax = data.items.length;
                    switch (callType) {
                        case "countries":
                        str = "";
                        for (i = 0; i < itemsMax; i++) {
                            item = data.items[i];
                            str += "<option value=\"" + item.country + "\">" + item.country_name + "</option>";
                        }
                        countrySelector.innerHTML = "<option value=\"all\" selected=\"selected\">All</option>" + str;
                        gettingDataDisplay.innerHTML = "Country data retrieved!";
                        getData.innerHTML = "Get Analytics Data";
                        getAnalyticsData();
                        callLimit = itemsMax;
                        break;
                        case "analytics":
                        analyticsData[currentDay] = {};
                        analyticsData[currentDay].date = currentDay;
                        analyticsData[currentDay].items = [];
                        for (i = 0; i < itemsMax; i++) {
                            newItem = {};
                            item = data.items[i];
                            newItem.video_view = item.video_view;
                            newItem.country = item.country;
                            newItem.country_name = item.country_name;
                            analyticsData[currentDay].items.push(newItem);
                        }
                        if (currentDayIndex < dayMax - 1) {
                            currentDayIndex++;
                            getAnalyticsData();
                        } else {
                            gettingDataDisplay.innerHTML = "Data retrieved - " + callNumber + " API calls made. See and filter your data below.";
                            displayData();
                        }
                    }
                },
                error : function (XMLHttpRequest, textStatus, errorThrown)
                    {
                        if (window.console) {
                            console.log("Request was not successful. Here's what the server sent back: " + errorThrown);
                        }
                    }
                });
        },
        // get country data
        getCountryData = function () {
            var callURL;
            account_id = (isDefined(accountID.value)) ? accountID.value : "20318290001";
            gettingDataDisplay.textContent = "Getting country data...";
            callType = "countries";
            callURL = "https://analytics.api.brightcove.com/v1/data?accounts=" + account_id + "&dimensions=country&from=" + daysArray[0] + "&to=" + daysArray[daysArray.length - 1] + "&fields=country,country_name&sort=country_name&format=json&limit=" + callLimit;
            makeAnalyticsCall(callURL);
        },
        // get the analytics data for the videos
        getAnalyticsData = function () {
            var callURL;
            account_id = (isDefined(accountID.value)) ? accountID.value : "20318290001";
            gettingDataDisplay.textContent = "Getting analytics data...";
            callType = "analytics";
            // currentVideo = videoData.items[currentVideoIndex].video;
            currentDay = daysArray[currentDayIndex];
            callURL = "https://analytics.api.brightcove.com/v1/data?accounts=" + account_id + "&dimensions=country&from=" + currentDay + "&to=" + currentDay + "&fields=video_view,country,country_name&sort=country_name&format=json&limit=" + callLimit;
            makeAnalyticsCall(callURL);

        },
        initializeData = function () {
        var totalDays,
            i,
            item,
            str = "";
        dateFromMS = new Date(fromDate.value).valueOf();
        dateToMS = new Date(toDate.value).valueOf();
        /**
        * what follows is just math
        * to create to and from params for API calls
        * 86400000 = 1 day in milliseconds
        */
        totalDays = Math.round((dateToMS - dateFromMS)/86400000);
        for (i = 0; i < totalDays; i++) {
            var newDate = new Date(dateFromMS + (i * 86400000));
            daysArray[i] = dateToISO(newDate);
        }
        dayMax = daysArray.length;
        for (i = 0; i < dayMax; i++) {
            item = daysArray[i];
            str += "<option value=\"" + item + "\">" + item + "</option>";
        }
        dateSelector.innerHTML =  "<option value=\"all\" selected=\"selected\">All</option>" + str;
        currentDayIndex = 0;
        currentDay = daysArray[0];
        getCountryData();
    };
    // add date pickers to the date input fields
    new datepickr('fromDatePicker', {
        'fullCurrentMonth': false,
        'dateFormat': 'F j, Y'
    });
    new datepickr('toDatePicker', {
        'fullCurrentMonth': false,
        'dateFormat': 'F j, Y'
    });
    // default date range values
    toDate.value = today.toDateString();
    fromDate.value = weekAgo.toDateString();

    getData.addEventListener("click", initializeData);
    countrySelector.addEventListener("change", displayData);
    dateSelector.addEventListener("change", displayData);
    useMyAccount.addEventListener("click", function () {
        if (basicInfo.getAttribute('style') === "display:none;") {
            basicInfo.setAttribute('style', 'display:block;');
            useMyAccount.innerHTML = "Use Sample Account";
        } else {
            basicInfo.setAttribute('style', 'display:none;');
            useMyAccount.innerHTML = "Use My Account Instead";
        }
    });
})($, window, document, datepickr);
