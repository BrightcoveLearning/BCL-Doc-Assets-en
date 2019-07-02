var BCLSDDrenditions = (function(window, document) {
      var th,
        td,
        tr,
        txt,
        i,
        j,
        x,
        iMax,
        jMax,
        audioFields = ['audio_bitrate', 'audio_channels', 'audio_codec', 'forced_keyframe_rate', 'fragment_duration', 'fragment_track_timescale', 'segment_seconds'],
        videoFields = ['video_bitrate', 'height', 'aspect_mode', 'decoder_bitrate_cap', 'decoder_buffer_size', 'forced_keyframe_rate', 'fragment_duration', 'h264_bframes', 'h264_profile', 'segment_seconds', 'speed', 'video_codec'],
        progressiveFields = ['video_bitrate', 'audio_bitrate', 'height', 'decoder_bitrate_cap', 'decoder_buffer_size', 'h264_profile'],
        audioTableBody = document.getElementById('audioTableBody'),
        videoTableBody = document.getElementById('videoTableBody'),
        progressiveTableBody = document.getElementById('progressiveTableBody'),
        frag,
        rendition;

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
        buildTable(progressiveRenditions, progressiveFields, progressiveTableBody);
        return {
          videoRenditions: videoRenditions,
          audioRenditions: audioRenditions,
          progressiveRenditions: progressiveRenditions
        }
      })(window, document);
