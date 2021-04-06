var BCLS = ( function () {
    "use strict";
    var $videoReadSamplesList = $("#videoReadSamplesList"),
        $playlistReadSamplesList = $("#playlistReadSamplesList"),
        $videoWriteSamplesList = $("#videoWriteSamplesList"),
        $playlistWriteSamplesList = $("#playlistWriteSamplesList"),
        $solutionsList = $("#solutionsList"),
        listTemplate = "{{#items}}<li><a href=\"{{url}}\">{{name}}</a></li>{{/items}}",
        section,
        // functions
        getSection,
        bclslog,
        exists,
        createLists,
        findSectionItem,
        findSubSectionItem;
    // logging utility
    bclslog = function (message) {
        if (window["console"] && console["log"]) {
            var d = new Date();
            console.log(d + ": ");
            console.log(message);
        }
    };
    // test for existence
    exists = function (x) {
        return (x !== undefined && x !== null && x !== "" && x !== []);
    };
    // find the item in the section
    findSectionItem = function (item) {
        var thisSection = bclsNavData.videoCloud.sections[section],
            itemsMax = thisSection.items.length,
            thisItem,
            i;

            for (i = 0; i < itemsMax; i++) {
                thisItem = thisSection.items[i];
                if (thisItem.name === item) {
                    return thisItem;
                }
            }
    };
    // find a subsection item
    findSubSectionItem = function (subSection, item) {
        var itemsMax = subSection.items.length,
            thisItem,
            i;
            for (i = 0; i < itemsMax; i++) {
                thisItem = subSection.items[i];
                if (thisItem.name === item) {
                    return thisItem;
                }
            }
    };
    // create the lists
    createLists = function () {
        var template = Handlebars.compile(listTemplate),
            subSection,
            subSubSection,
            thisItem;
        if (exists($videoReadSamplesList)) {
            subSection = findSectionItem("READ Samples");
            subSubSection = findSubSectionItem(subSection, "Video Read Methods");
            $videoReadSamplesList.html(template(subSubSection));
        }
        if (exists($playlistReadSamplesList)) {
            subSection = findSectionItem("READ Samples");
            subSubSection = findSubSectionItem(subSection,"Playlist Read Methods");
            $playlistReadSamplesList.html(template(subSubSection));
        }
        if (exists($videoWriteSamplesList)) {
            subSection = findSectionItem("WRITE Samples");
            subSubSection = findSubSectionItem(subSection,"Video Write Methods");
            $videoWriteSamplesList.html(template(subSubSection));
        }
        if (exists($playlistWriteSamplesList)) {
            subSection = findSectionItem("WRITE Samples");
            subSubSection = findSubSectionItem(subSection,"Playlist Write Methods");
            $playlistWriteSamplesList.html(template(subSubSection));
        }
        if (exists($solutionsList)) {
            subSection = findSectionItem("Solutions");
            $solutionsList.html(template(subSection));
        }
    };
    getSection = function () {
        var path = document.location.pathname;
        // if path ends in a /, add index.html
        if (path[path.length - 1] === "/") {
            path += "index.html";
        }
        // see if we're on the home page
        if (path.indexOf("/en/index.html") > -1) {
        } else {
            // remove the /en/video-cloud/ prefix
            section = path.slice(16);
            // see if we're on the Video Cloud index page
            if (section === "index.html") {
                section = "index";
            } else {
                // must be in a section; remove everything from the first / onward
                section = section.substring(0, section.indexOf("/"));
            }
        }
        // create the lists
        if (exists(section)) {
            createLists();
        }
    };
    // call getSection to initialize
    getSection();
    return {

    };
})();