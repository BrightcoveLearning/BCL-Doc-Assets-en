var BCLSCAErenditions  = (function(window, document) {
    var th,
        td,
        tr,
        txt,
        i,
        j,
        x,
        iMax,
        jMax,
        audioFields     = ['audio_bitrate', 'audio_channels', 'audio_codec', 'forced_keyframe_rate', 'fragment_duration', 'fragment_track_timescale', 'segment_seconds'],
        videoFields     = ['video_bitrate', 'height', 'aspect_mode', 'decoder_bitrate_cap', 'decoder_buffer_size', 'forced_keyframe_rate', 'fragment_duration', 'h264_bframes', 'h264_profile', 'segment_seconds', 'speed',  'video_codec'],
        audioTableBody  = document.getElementById('audioTableBody'),
        videoTableBody  = document.getElementById('videoTableBody'),
        frag,
        rendition;

    /**
     * sort an array of objects based on an object property
     * @param {array} targetArray - array to be sorted
     * @param {string|number} objProperty - object property to sort on
     * @return sorted array
     */
    function sortArray(targetArray, objProperty) {
        targetArray.sort(function (a, b) {
            var propA, propB;
            if (typeof(targetArray[0][objProperty]) === 'string') {
                propA = a[objProperty].toLowerCase();
                propB = b[objProperty].toLowerCase();
            } else {
                propA = a[objProperty];
                propB = b[objProperty];
            }
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
     * Builds a table body
     * @param {Array} dataSet array of rendition settings
     * @param {Array} fields array of fields for the rendition
     * @param {HTMLElement} table body element to add the rows to
     */
    function buildTable(dataSet, fields, el) {
        var frag = new DocumentFragment(),
            tr,
            td,
            txt,
            j,
            jMax;
        iMax = dataSet.length;
        for (i = 0; i < iMax; i++) {
            rendition = dataSet[i];
            // create row
            tr = document.createElement('tr');
            // create name cell
            td = document.createElement('td');
            txt = document.createTextNode(rendition.id);
            tr.appendChild(td);
            td.appendChild(txt);
            // add the encoding_settings
            jMax = fields.length;
            for (j = 0; j < jMax; j++) {
                td = document.createElement('td');
                if (rendition.encoding_settings[fields[j]]) {
                    txt = document.createTextNode(rendition.encoding_settings[fields[j]]);
                    td.appendChild(txt);
                }
                tr.appendChild(td);
            }
            // add the tr to the doc fragment
            frag.appendChild(tr);
        }
        // add the doc fragment to the element
        el.appendChild(frag);
    }


    // build the table bodies
    buildTable(audioRenditions, audioFields, audioTableBody);
    buildTable(videoRenditions, videoFields, videoTableBody);

})(window, document);
