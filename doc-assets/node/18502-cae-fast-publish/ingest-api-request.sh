curl --request POST \
  --url https://ingestion.api.brightcove.com/v1/accounts/57838016001/profiles \
  --header 'authorization: Bearer YOUR_ACCESS_TOKEN' \
  --header 'content-type: application/json' \
  --data '{
  "name": "multi-platform-standard-dynamic-fast-publish",
  "display_name": "Fast Publish Standard (CAE)",
  "description": "Deliver a wide range of content types across a variety of platforms on mobile and desktop.",
  "account_id": "YOUR_ACCOUNT_ID",
  "digital_master": {
    "rendition": "passthrough",
    "distribute": false
  },
  "renditions": [],
  "packages": [],
  "dynamic_origin": {
    "renditions": [
      "default/audio64",
      "default/audio128",
      "default/audio96"
    ],
    "temporary_renditions": [
      {"name": "default/video450"},
      {"name": "default/video700"},
      {"name": "default/video900"}
    ],
    "images": [
      {
        "label": "thumbnail",
        "height": 90,
        "width": 160
      },
      {
        "label": "poster",
        "height": 720,
        "width": 1280
      }
    ],
    "dynamic_profile_options": {
      "min_renditions": 2,
      "max_renditions": 6,
      "min_resolution": {
        "width": 320,
        "height": 180
      },
      "max_resolution": {
        "width": 1280,
        "height": 720
      },
      "max_frame_rate": 30,
      "max_bitrate": 2400,
      "max_first_rendition_bitrate": 250,
      "keyframe_rate": 0.5,
      "select_baseline_profile_configuration": true
    }
  }
}'
