var sampleProfile = "{
  "account_id": "account_id",
  "archive_master": true,
  "name": "Protected",
  "description": "This will produce 1 MP4 rendition, 1 HLS rendition, and 2 image renditions.",
  "renditions": [
    {
      "audio_bitrate": 48,
      "reference_id": "mp1",
      "audio_codec": "aac",
      "format": "mp4",
      "h264_profile": "high",
      "height": 480,
      "keyframe_rate": 0.333,
      "fixed_keyframe_interval": true,
      "media_type": "video",
      "speed": 3,
      "video_bitrate": 1280,
      "video_codec": "h264",
      "width": 848
    },
    {
      "audio_bitrate": 48,
      "reference_id": "hls3",
      "audio_codec": "aac",
      "format": "ts",
      "type": "segmented",
      "max_hls_protocol_version": 2,
      "hls_optimized_ts": "true",
      "package_format": "zip",
      "decoder_bitrate_cap": 1920,
      "decoder_buffer_size": 5120,
      "h264_profile": "high",
      "height": 480,
      "keyframe_rate": 0.5,
      "max_frame_rate": 30,
      "media_type": "video",
      "speed": 3,
      "video_bitrate": 1280,
      "video_codec": "h264",
      "width": 848
    },
    {
      "media_type": "image",
      "format": "png",
      "label": "poster",
      "width": 480,
      "height": 360
    },
    {
      "media_type": "image",
      "format": "png",
      "label": "thumbnail",
      "width": 160,
      "height": 90
    }
  ],
  "packages": []
}";