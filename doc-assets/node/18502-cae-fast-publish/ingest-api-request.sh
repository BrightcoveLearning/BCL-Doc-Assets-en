curl --request POST \
  --url https://ingestion.api.brightcove.com/v1/accounts/57838016001/profiles \
  --header 'authorization: Bearer ALGRD4YMibquRwWhfgKxSLR2AbQXWsJ8J1EzzowufJCJnaiia9zjO4P_zqPcPeBbeuvOu3CjfIgx36sn1CAKlW3lua4i4VUZP8cZotNlNdWpD3Kbzu5NqS85SJBRon-jFmvT5ZjttoNm9drrAnIoVt7KjMuJHGuLfSm5UAlteiUWWB91S0OxyPh8Rfbs2NZONTUnuIntadGXfMu8mDouaH-AOCU1we2q7asEne3qMLX1lAlGmF2gg7-heqiS6oxUxM5CY7DfrQkri715lDSWq1TZfSgFflbHN9oZ0twSLxTZZPsXEkzgFWr7a7RUZUN6EYmWunlFarZ0h47UTbAknZKw7G9vpTbDkLv8mRbKLRhQlSPEuetsTEEdvCvfeVNEWGq2FZAUW7k-xOhH_jSf4fl92rHq1ZMDQEopOuBWOM3PHcLqi-WC0_b7xHLkD33krpndVKywJAiCFSsW5Lhd9O2pzwqmSMZ1PmnhXYo63QllsPsYOzP_oJ_59R2vhgjZU0dMowOl45l4xWlH_OV1dx6u3EQGEw_zncesr8fKx7SYU-zolbFGDLl3YZ3Q1hi6AnUFsBLboxZdGNw3gWRHklHgTnY2FnqZO4DN5qaCYWwxGx5HTXoI4JpdCA477buwu1ZwxLYqGKrcfLRtMzHx4Cr3RqH6MijOqPhSo04caiZ-jj5ViM1PZ5-lge8OOD3mhvREZ3S3srdA7P1MQOi8VM1kgC9XjmfHEJuKPAjqvLT_iOCut4q7FIXgVRJU2qQKlsmXBE51k8tCfvhEHb3LBxpMOoGzsj7q5XFDbt8QeSCW4shROPrwRpDopktPZo1qK2BEGiLa0PnS5okcV6s4-GIH1m5pfoK-iba1wPEBQHdWo2rotf9BV0g' \
  --header 'content-type: application/json' \
  --data '{
  "name": "standard-dynamic-fast-publish",
  "display_name": "Fast Publish Standard (CAE)",
  "description": "Deliver a wide range of content types across a variety of platforms on mobile and desktop.",
  "account_id": "57838016001",
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
}
'
