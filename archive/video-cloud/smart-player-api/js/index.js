var BCLS = ( function () {
    "use strict";
    var $samplesList = $("#samplesList"),
        $solutionsList = $("#solutionsList"),
        listTemplate = "{{#items}}<li><a href=\"{{url}}\">{{name}}</a></li>{{/items}}",
        section,
        product,
        // functions
        getSection,
        bclslog,
        exists,
        createLists,
        findSectionItem;
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

    // create the lists
    createLists = function () {
        var template = Handlebars.compile(listTemplate),
            subSection,
            thisItem;
        if (exists($samplesList)) {
            subSection = findSectionItem("Sample Code");
            $samplesList.html(template(subSection));
        }
        if (exists($solutionsList)) {
            subSection = findSectionItem("Solutions");
            $solutionsList.html(template(subSection));
        }
    };
    getSection = function () {
        var path = document.location.pathname,
            pathArray = path.split("/"),
            server;
        // remove the 0 element, as it will be empty
        pathArray.splice(0, 1);
        // if path ends in a /, add index.html
        if (pathArray[pathArray.length - 1].indexOf(".html") === -1) {
            pathArray[pathArray.length - 1] = "index.html";
        }
        // figure out which server we're on
        if (pathArray[0] === "en") {
            // we're on docs
            server = "docs";
        } else if (pathArray === "bcls") {
            // we're on solutions
            server = "solutions";
        } else {
            // no idea where we are - no point going on
            bclslog(pathArray[0]);
            return;
        }
        // docs actions - multiple products
        if (server === "docs") {
            // act according to the product (or landing page)
            switch (pathArray[1]) {
                case "index.html": // on the docs landing page
                    section = "null";
                    product = "index";
                    break;
                case "video-cloud": // in video cloud
                    product = "videoCloud";
                    if (pathArray[2] === "index.html") {
                        // on video cloud landing page
                        section = "video-cloud";
                    } else {
                        section = pathArray[2];
                    }
                    bclslog(product);
                    bclslog(section);
                    break;
                case "once": // in once
                    // there is only one section
                    product = "once";
                    section = "index";
                    break;
                case "perform": // in perform
                    section = "perform";
                    product = "perform";
                    break;
                default:
                    section = "index";
                    product = "all"
            }
        } else if (server === "solutions") {
            product = "videoCloud";
            if (pathArray[1] === "index.html") {
                // on the solutions landing page
            }
            section = pathArray[1];
        } else {
            // don't know where we are
            product = null;
            section = null;
            bclslog("unknown server");
        }
        /**
         * if section is an empty string, assume we're on a site index page
         * treat opensource as indexes
         */
        if (section === "" || section === "open-source" || section === "concepts") {
            section = "video-cloud";
        } else if (section === "player-management-api" || section === "delivery-system-api") {
            section = "players";
        } else if (section === "tve") {
            section = "smart-player-api";
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