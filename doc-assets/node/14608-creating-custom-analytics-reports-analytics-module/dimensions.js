var BCLS = ( function ($, window, document, aapi_model) {
    var filtersTemplate = "{{#filters}}<li>{{this}}{{/filters}}",
        fieldsTemplate = "{{#fields}}<li>{{this}}{{/fields}}",
        questions,
        answers,
        $account = $("#account"),
        $player = $("#player"),
        $video = $("#video"),
        $date = $("#date"),
        $date_hour = $("#date_hour"),
        $country = $("#country"),
        $region = $("#region"),
        $city = $("#city"),
        $destination_domain = $("#destination_domain"),
        $destination_path = $("#destination_path"),
        $filtersList = $("#filtersList"),
        $referrer_domain = $("#referrer_domain"),
        $source_type = $("#source_type"),
        $search_terms = $("#search_terms"),
        $device_type = $("#device_type"),
        $device_os = $("#device_os"),
        dimensionsList = document.getElementById("dimensionsList"),
        bclslog,
        buildDimensions,
        dedupe,
        findObjectInArray,
        copyArray,
        showAnswer,
        setQAinteractions,
        init;

    /**
     * logging
     */
    bclslog = function (context, message) {
        if (window["console"] && console["log"]) {
          console.log(context, message);
        };
    };
    /**
     * dedupe a simple array of strings or numbers
     */
    dedupe = function (arr) {
    var i,
        len = arr.length,
        out = [],
        obj = {};

    for (i = 0;i < len; i++) {
    obj[arr[i]] = 0;
    }
    for (i in obj) {
    out.push(i);
    }
    return out;
    }
    /**
     * copy all values from one array into another
     * arguments: a, b
     * adds elements of a to b
     * returns: b
     */
    copyArray = function (a,b) {
        var i, imax;
        if (a !== undefined && b !== undefined && a.constructor === Array && b.constructor === Array) {
            imax = a.length;
            for (i = 0; i < imax; i++) {
                b.push(a[i]);
            }
        }
        return b;
    };
    /*
    find index of an object in array of objects
    based on some property value
    returns index if found, otherwise returns -1
    */
    findObjectInArray = function (targetArray, objProperty, value) {
        var i, totalItems = targetArray.length, objFound = false;
        for (i = 0; i < totalItems; i++) {
            if (targetArray[i][objProperty] === value) {
                objFound = true;
                return i;
            }
        }
        if (objFound === false) {
            return -1;
        }
    };
    /**
     * show answers
     */
    showAnswer = function (evt) {
        var answerNumber = parseInt(evt.target.id.substring(1)),
            i = 0,
            j = answers.length;
        // hide all answers except the one for the selected question
        for (i = 0; i < j; i++) {
            if (i === answerNumber) {
                answers[i].style.display = "block";
            } else {
                answers[i].style.display = "none";
            }
        }
    };
    /**
     * set up interactions for questions and answers
     */
    setQAinteractions = function () {
        var i, iMax;
        questions = document.getElementsByClassName("bcls-question");
        answers = document.getElementsByClassName("bcls-answer");
        iMax = questions.length;
        for (i = 0; i < iMax; i++) {
            // set ids for answers
            answers[i].setAttribute("id", ("a" + i.toString()));
            // hide all answers initially
            answers[i].setAttribute("style", "display:none");
            // set ids for questions
            questions[i].setAttribute("id", ("q" + i.toString()));
            // add event listeners
            questions[i].addEventListener("click", showAnswer);
        }
    }
    /**
     * build dimensions/fields list
     */
    buildDimensions = function () {
        var thisDimension,
            dim,
            thisFieldlist,
            i,
            iMax = aapi_model.dimensions.length,
            j,
            jMax,
            str = "";
        for (dim in aapi_model.dimensions) {
            thisDimension = aapi_model.dimensions[dim];
            str += "<dt class=\"bcls-question\">" + thisDimension.name + "<dd class=\"bcls-answer\"><ul id=\"" + thisDimension.name + "\">";
            thisFieldlist = document.getElementById(thisDimension.name);
            jMax = thisDimension.fields.length;
            for (j = 0; j < jMax; j++) {
                str += "<li>" + thisDimension.fields[j] + "";
            }
            str += "";
            dimensionsList.innerHTML = str;
            setQAinteractions();
        }
    };

    init = function () {
        buildDimensions();
    };
    init();
    return {}
})($, window, document, aapi_model);
