var BCLSrenditions = (function(window, document) {
      var videoRenditions = [{"id":"default/video450","version":5,"name":"Default Video450","kind":"video","account_id":"default","created_at":"2016-06-06T23:39:54.333556376Z","updated_at":"2018-04-10T17:54:07.315641088Z","encoding_settings":{"aspect_mode":"preserve","decoder_bitrate_cap":675,"decoder_buffer_size":900,"fixed_keyframe_interval":true,"fragment_duration":2000,"h264_profile":"baseline","height":270,"keyframe_rate":1,"segment_seconds":2,"speed":3,"upscale":false,"video_bitrate":450,"video_codec":"h264"}},{"id":"default/video700","version":5,"name":"Default Video700","kind":"video","account_id":"default","created_at":"2016-06-06T23:39:54.742007828Z","updated_at":"2018-04-10T17:54:07.905886133Z","encoding_settings":{"aspect_mode":"preserve","decoder_bitrate_cap":1050,"decoder_buffer_size":1400,"fixed_keyframe_interval":true,"fragment_duration":2000,"h264_profile":"baseline","height":360,"keyframe_rate":1,"segment_seconds":2,"speed":3,"upscale":false,"video_bitrate":700,"video_codec":"h264"}},{"id":"default/video900","version":5,"name":"Default Video900","kind":"video","account_id":"default","created_at":"2016-06-06T23:39:55.150904095Z","updated_at":"2018-04-10T17:54:08.469543676Z","encoding_settings":{"aspect_mode":"preserve","decoder_bitrate_cap":1350,"decoder_buffer_size":1800,"fixed_keyframe_interval":true,"fragment_duration":2000,"h264_bframes":2,"h264_profile":"main","height":360,"keyframe_rate":1,"segment_seconds":2,"speed":3,"upscale":false,"video_bitrate":900,"video_codec":"h264"}},{"id":"default/video1200","version":5,"name":"Default Video1200","kind":"video","account_id":"default","created_at":"2016-06-06T23:39:52.256973266Z","updated_at":"2018-04-10T17:54:03.36884425Z","encoding_settings":{"aspect_mode":"preserve","decoder_bitrate_cap":1800,"decoder_buffer_size":2400,"fixed_keyframe_interval":true,"fragment_duration":2000,"h264_bframes":2,"h264_profile":"main","height":540,"keyframe_rate":1,"segment_seconds":2,"speed":3,"upscale":false,"video_bitrate":1200,"video_codec":"h264"}},{"id":"default/video1700","version":5,"name":"Default Video1700","kind":"video","account_id":"default","created_at":"2016-06-06T23:39:52.657713254Z","updated_at":"2018-04-10T17:54:03.875572539Z","encoding_settings":{"aspect_mode":"preserve","decoder_bitrate_cap":2550,"decoder_buffer_size":3400,"fixed_keyframe_interval":true,"fragment_duration":2000,"h264_bframes":2,"h264_profile":"main","height":540,"keyframe_rate":1,"segment_seconds":2,"speed":3,"upscale":false,"video_bitrate":1700,"video_codec":"h264"}},{"id":"default/video2000","version":4,"name":"Default Video2000","kind":"video","account_id":"default","created_at":"2016-09-01T16:23:46.83319503Z","updated_at":"2018-04-10T17:54:04.369727738Z","encoding_settings":{"aspect_mode":"preserve","decoder_bitrate_cap":3000,"decoder_buffer_size":4000,"fixed_keyframe_interval":true,"fragment_duration":2000,"h264_bframes":2,"h264_profile":"main","height":720,"keyframe_rate":1,"segment_seconds":2,"speed":3,"upscale":false,"video_bitrate":2000,"video_codec":"h264"}},{"id":"default/video2500","version":5,"name":"Default Video2500","kind":"video","account_id":"default","created_at":"2016-06-06T23:39:53.062872982Z","updated_at":"2018-04-10T17:54:04.900867342Z","encoding_settings":{"aspect_mode":"preserve","decoder_bitrate_cap":3750,"decoder_buffer_size":5000,"fixed_keyframe_interval":true,"fragment_duration":2000,"h264_bframes":2,"h264_profile":"main","height":720,"keyframe_rate":1,"segment_seconds":2,"speed":3,"upscale":false,"video_bitrate":2500,"video_codec":"h264"}},{"id":"default/video3500","version":5,"name":"Default Video3500","kind":"video","account_id":"default","created_at":"2016-06-06T23:39:53.493670562Z","updated_at":"2018-04-10T17:54:05.394946466Z","encoding_settings":{"aspect_mode":"preserve","decoder_bitrate_cap":5250,"decoder_buffer_size":7000,"fixed_keyframe_interval":true,"fragment_duration":2000,"h264_bframes":2,"h264_profile":"high","height":1080,"keyframe_rate":1,"segment_seconds":2,"speed":3,"upscale":false,"video_bitrate":3500,"video_codec":"h264","width":2048}},{"id":"default/video4000","version":5,"name":"Default Video4000","kind":"video","account_id":"default","created_at":"2016-06-06T23:39:53.907017826Z","updated_at":"2018-04-10T17:54:06.725040326Z","encoding_settings":{"aspect_mode":"preserve","decoder_bitrate_cap":6000,"decoder_buffer_size":8000,"fixed_keyframe_interval":true,"fragment_duration":2000,"h264_bframes":2,"h264_profile":"high","height":1080,"keyframe_rate":1,"segment_seconds":2,"speed":3,"upscale":false,"video_bitrate":4000,"video_codec":"h264","width":2048}},{"id":"default/video6000","version":2,"name":"Default Video6000","kind":"video","account_id":"default","created_at":"2016-10-12T00:28:00.605692603Z","updated_at":"2018-06-12T16:54:10.44674261Z","encoding_settings":{"aspect_mode":"preserve","decoder_bitrate_cap":9000,"decoder_buffer_size":12000,"fixed_keyframe_interval":true,"fragment_duration":2000,"h264_bframes":2,"h264_profile":"high","height":2160,"keyframe_rate":1,"segment_seconds":2,"speed":3,"upscale":false,"video_bitrate":6000,"video_codec":"h264"}}],
        progressiveRenditions = [{"id":"default/progressive700","version":0,"name":"Default Progressive700","kind":"progressive","account_id":"default","created_at":"2018-06-11T22:32:33.937106287Z","updated_at":"2018-06-11T22:32:33.937106287Z","encoding_settings":{"aspect_mode":"preserve","audio_bitrate":96,"audio_channels":2,"audio_codec":"aac","decoder_bitrate_cap":1050,"decoder_buffer_size":1400,"force_aac_profile":"aac-lc","h264_profile":"baseline","height":360,"speed":3,"upscale":false,"video_bitrate":700,"video_codec":"h264"}},{"id":"default/progressive900","version":0,"name":"Default Progressive900","kind":"progressive","account_id":"default","created_at":"2018-06-11T22:32:53.284764088Z","updated_at":"2018-06-11T22:32:53.284764088Z","encoding_settings":{"aspect_mode":"preserve","audio_bitrate":96,"audio_channels":2,"audio_codec":"aac","decoder_bitrate_cap":1350,"decoder_buffer_size":1800,"force_aac_profile":"aac-lc","h264_bframes":2,"h264_profile":"main","height":360,"speed":3,"upscale":false,"video_bitrate":900,"video_codec":"h264"}},{"id":"default/progressive2500","version":0,"name":"Default Progressive2500","kind":"progressive","account_id":"default","created_at":"2018-06-11T22:33:45.851290928Z","updated_at":"2018-06-11T22:33:45.851290928Z","encoding_settings":{"aspect_mode":"preserve","audio_bitrate":192,"audio_channels":2,"audio_codec":"aac","decoder_bitrate_cap":3750,"decoder_buffer_size":5000,"force_aac_profile":"aac-lc","h264_bframes":2,"h264_profile":"main","height":720,"speed":3,"upscale":false,"video_bitrate":2500,"video_codec":"h264"}},{"id":"default/progressive3500","version":0,"name":"Default Progressive3500","kind":"progressive","account_id":"default","created_at":"2018-06-11T22:34:01.503067518Z","updated_at":"2018-06-11T22:34:01.503067518Z","encoding_settings":{"aspect_mode":"preserve","audio_bitrate":192,"audio_channels":2,"audio_codec":"aac","decoder_bitrate_cap":5250,"decoder_buffer_size":7000,"force_aac_profile":"aac-lc","h264_bframes":2,"h264_profile":"high","height":1080,"speed":3,"upscale":false,"video_bitrate":3500,"video_codec":"h264","width":2048}},{"id":"default/progressive4000","version":0,"name":"Default Progressive4000","kind":"progressive","account_id":"default","created_at":"2018-06-11T22:37:50.217242316Z","updated_at":"2018-06-11T22:37:50.217242316Z","encoding_settings":{"aspect_mode":"preserve","audio_bitrate":192,"audio_channels":2,"audio_codec":"aac","decoder_bitrate_cap":6000,"decoder_buffer_size":8000,"force_aac_profile":"aac-lc","h264_bframes":2,"h264_profile":"high","height":1080,"speed":3,"upscale":false,"video_bitrate":4000,"video_codec":"h264","width":2048}}],
        audioRenditions = [{"id":"default/audio64","version":5,"name":"Default Audio64","kind":"audio","account_id":"default","created_at":"2016-06-06T23:39:51.49858741Z","updated_at":"2017-12-05T19:52:36.125618038Z","encoding_settings":{"audio_bitrate":64,"audio_channels":2,"audio_codec":"aac","force_aac_profile":"aac-lc","forced_keyframe_rate":1,"fragment_duration":2000,"segment_seconds":2}},{"id":"default/audio96","version":5,"name":"Default Audio96","kind":"audio","account_id":"default","created_at":"2016-06-06T23:39:51.876947888Z","updated_at":"2017-12-05T19:52:36.652493367Z","encoding_settings":{"audio_bitrate":96,"audio_channels":2,"audio_codec":"aac","force_aac_profile":"aac-lc","forced_keyframe_rate":1,"fragment_duration":2000,"segment_seconds":2}},{"id":"default/audio128","version":5,"name":"Default Audio128","kind":"audio","account_id":"default","created_at":"2016-06-06T23:39:51.093305379Z","updated_at":"2017-12-05T19:52:35.587897334Z","encoding_settings":{"audio_bitrate":128,"audio_channels":2,"audio_codec":"aac","force_aac_profile":"aac-lc","forced_keyframe_rate":1,"fragment_duration":2000,"segment_seconds":2}},{"id":"default/audio192","version":2,"name":"audio192","kind":"audio","account_id":"default","created_at":"2016-10-12T00:52:48.575372031Z","updated_at":"2017-03-22T14:20:39.115514582Z","encoding_settings":{"audio_bitrate":192,"audio_channels":2,"audio_codec":"aac","force_aac_profile":"aac-lc","forced_keyframe_rate":1,"fragment_duration":2000,"segment_seconds":2}}],
        th,
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
console.log('dataSet', dataSet);
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
