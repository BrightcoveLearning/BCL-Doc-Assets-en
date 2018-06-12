var BCLSrenditions                = (function(window, document) {
    var renditionData   = {"renditions": [{"id":"default/progressive900","version":0,"name":"Default Progressive900","kind":"progressive","account_id":"default","created_at":"2018-06-11T22:32:53.284764088Z","updated_at":"2018-06-11T22:32:53.284764088Z","encoding_settings":
{"aspect_mode":"preserve","audio_bitrate":96,"audio_channels":2,"audio_codec":"aac","decoder_bitrate_cap":1350,"decoder_buffer_size":1800,"force_aac_profile":"aac-lc","h264_bframes":2,"h264_profile":"main","height":360,"speed":3,"upscale":false,"video_bitrate":900,"video_codec":"h264"}},{"id":"default/progressive700","version":0,"name":"Default Progressive700","kind":"progressive","account_id":"default","created_at":"2018-06-11T22:32:33.937106287Z","updated_at":"2018-06-11T22:32:33.937106287Z","encoding_settings":
{"aspect_mode":"preserve","audio_bitrate":96,"audio_channels":2,"audio_codec":"aac","decoder_bitrate_cap":1050,"decoder_buffer_size":1400,"force_aac_profile":"aac-lc","h264_profile":"baseline","height":360,"speed":3,"upscale":false,"video_bitrate":700,"video_codec":"h264"}},{"id":"default/progressive4000","version":0,"name":"Default Progressive4000","kind":"progressive","account_id":"default","created_at":"2018-06-11T22:37:50.217242316Z","updated_at":"2018-06-11T22:37:50.217242316Z","encoding_settings":
{"aspect_mode":"preserve","audio_bitrate":192,"audio_channels":2,"audio_codec":"aac","decoder_bitrate_cap":6000,"decoder_buffer_size":8000,"force_aac_profile":"aac-lc","h264_bframes":2,"h264_profile":"high","height":1080,"speed":3,"upscale":false,"video_bitrate":4000,"video_codec":"h264","width":2048}},{"id":"default/progressive3500","version":0,"name":"Default Progressive3500","kind":"progressive","account_id":"default","created_at":"2018-06-11T22:34:01.503067518Z","updated_at":"2018-06-11T22:34:01.503067518Z","encoding_settings":
{"aspect_mode":"preserve","audio_bitrate":192,"audio_channels":2,"audio_codec":"aac","decoder_bitrate_cap":5250,"decoder_buffer_size":7000,"force_aac_profile":"aac-lc","h264_bframes":2,"h264_profile":"high","height":1080,"speed":3,"upscale":false,"video_bitrate":3500,"video_codec":"h264","width":2048}},{"id":"default/progressive2500","version":0,"name":"Default Progressive2500","kind":"progressive","account_id":"default","created_at":"2018-06-11T22:33:45.851290928Z","updated_at":"2018-06-11T22:33:45.851290928Z","encoding_settings":
{"aspect_mode":"preserve","audio_bitrate":192,"audio_channels":2,"audio_codec":"aac","decoder_bitrate_cap":3750,"decoder_buffer_size":5000,"force_aac_profile":"aac-lc","h264_bframes":2,"h264_profile":"main","height":720,"speed":3,"upscale":false,"video_bitrate":2500,"video_codec":"h264"}}],
        audioRenditions = [],
        videoRenditions = [],
        th,
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

    // separate out audio and video renditions
    iMax = renditionData.renditions.length;
    for (i = 0; i < iMax; i++) {
        if (renditionData.renditions[i].kind === 'video') {
            videoRenditions.push(renditionData.renditions[i]);
        } else {
            audioRenditions.push(renditionData.renditions[i]);
        }
    }

    // sort the data sets by height and then bitrate
    videoRenditions.sort(function(a, b) {
        x = a.encoding_settings.height - b.encoding_settings.height;
        return x === 0? a.encoding_settings.video_bitrate - b.encoding_settings.video_bitrate : x;
    });
    console.log('videoRenditions', videoRenditions);

    // build the table bodies
    buildTable(audioRenditions, audioFields, audioTableBody);
    buildTable(videoRenditions, videoFields, videoTableBody);

})(window, document);
