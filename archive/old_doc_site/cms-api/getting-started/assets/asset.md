# Asset resource

Individual assets are accessed via the appropriate type endpoint.

## Path
[$BASE_URL](README.md)/accounts/1234/videos/1234/assets/bumper/5678

[$BASE_URL](README.md)/accounts/1234/videos/1234/assets/caption/5678

[$BASE_URL](README.md)/accounts/1234/videos/1234/assets/digital_master/5678

[$BASE_URL](README.md)/accounts/1234/videos/1234/assets/hds_manifest/5678

[$BASE_URL](README.md)/accounts/1234/videos/1234/assets/hls_manifest/5678

[$BASE_URL](README.md)/accounts/1234/videos/1234/assets/ism_manifest/5678

[$BASE_URL](README.md)/accounts/1234/videos/1234/assets/ismc_manifest/5678

[$BASE_URL](README.md)/accounts/1234/videos/1234/assets/dash_manifests/5678

[$BASE_URL](README.md)/accounts/1234/videos/1234/assets/poster/5678

[$BASE_URL](README.md)/accounts/1234/videos/1234/assets/preview/5678

[$BASE_URL](README.md)/accounts/1234/videos/1234/assets/renditions/5678

[$BASE_URL](README.md)/accounts/1234/videos/1234/assets/text_tracks/5678

[$BASE_URL](README.md)/accounts/1234/videos/1234/assets/thumbnail/5678

#### Assets can also be accessed by reference ID, e.g.,

[$BASE_URL](README.md)/accounts/1234/videos/ref:myRefId/assets/:type/5678

## Usage
### GET
Returns metadata for the asset specified.

OAuth operator required: "video-cloud/asset/read"

#### Fields
The fields available on an asset vary based on the asset type.

##### Video types: 'FULL_LENGTH', 'PREVIEW', 'LIVE_FULL_LENGTH', 'BUMPER', 'WMV_FULL', 'WMV_LIVE_FULL', 'WMV_PREVIEW', 'DIGITAL_MASTER'
| Field | Type | Description |
| --- | --- | --- |
| id | String |  |
| audio_only | Boolean |  |
| cdn_origin_id | String |  | 
| complete | Boolean |  |
| controller_type | String |  |
| current_filename | String |  |
| name | String |  |
| progressive_download | Boolean |  |
| reference_id | String | Must be unique among assets in the account |
| remote_url | String |  |
| remote_stream_name | String |  |
| size | Integer |  |
| type | String | Must be one of the valid asset enum values |
| updated_at | String in ISO-8601 date format |  |
| uploaded_at | String in ISO-8601 date format |  |
| drm | Map |  |
| &nbsp;&nbsp; _state_ | _String_ |  |
| &nbsp;&nbsp; _packager_version_ | _String_ |  |
| &nbsp;&nbsp; _metadata_cdn_origin_id_ | _String_ |  |
| &nbsp;&nbsp; _metadata_sharded_directory_ | _String_ |  |
| hds | Map |  |
| &nbsp;&nbsp; _cdn_origin_id_ | _String_ |  |
| &nbsp;&nbsp; _sharded_directory_ | _String_ |  |
| &nbsp;&nbsp; _bcfs_provider_ | _String_ |  |
| &nbsp;&nbsp; _bcfs_key_ | _String_ |  |
| &nbsp;&nbsp; _filename_ | _String_ |  |
| hls | Array | List of segments |
| &nbsp;&nbsp; _d_ | _Integer_ | Duration |
| &nbsp;&nbsp; _filename_ | _String_ |  |
| &nbsp;&nbsp; _encryption_key_ | _String_ |  |
| encoding_rate | Integer |  |
| video_codec | String |  |
| video_container | String |  |
| video_duration | Integer |  |
| frame_height | Integer |  |
| frame_width | Integer |  |

##### Image types: 'VIDEO_STILL', 'SYNDICATION_STILL', 'THUMBNAIL', 'BACKGROUND', 'LOGO', 'LOGO_OVERLAY', 'OTHER_IMAGE', 'PHOTO', 'LARGE_IMAGE'
| Field | Type | Description |
| --- | --- | --- |
| id | String |  |
| audio_only | Boolean |  |
| cdn_origin_id | String |  | 
| complete | Boolean |  |
| controller_type | String |  |
| current_filename | String |  |
| name | String |  |
| progressive_download | Boolean |  |
| reference_id | String | Must be unique among assets in the account |
| remote_url | String |  |
| remote_stream_name | String |  |
| size | Integer |  |
| type | String | Must be one of the valid asset enum values |
| updated_at | String in ISO-8601 date format |  |
| uploaded_at | String in ISO-8601 date format |  |
| frame_height | Integer |  |
| frame_width | Integer |  |

##### Text types: 'CAPTION', 'MANIFEST', 'HDS_MANIFEST', 'ISM_MANIFEST', 'ISMC_MANIFEST', 'MPD_MANIFEST', 'HLS_MANIFEST'
| Field | Type | Description |
| --- | --- | --- |
| id | String |  |
| audio_only | Boolean |  |
| cdn_origin_id | String |  | 
| complete | Boolean |  |
| controller_type | String |  |
| current_filename | String |  |
| name | String |  |
| profiles | String | Only relevant for dash manifests; should contain a comma-separated list of valid dash profiles |
| progressive_download | Boolean |  |
| reference_id | String | Must be unique among assets in the account |
| remote_url | String |  |
| remote_stream_name | String |  |
| size | Integer |  |
| type | String | Must be one of the valid asset enum values |
| updated_at | String in ISO-8601 date format |  |
| uploaded_at | String in ISO-8601 date format |  |

##### The 'AUDIO' type
| Field | Type | Description |
| --- | --- | --- |
| id | String |  |
| audio_only | Boolean |  |
| cdn_origin_id | String |  | 
| complete | Boolean |  |
| controller_type | String |  |
| current_filename | String |  |
| name | String |  |
| progressive_download | Boolean |  |
| reference_id | String | Must be unique among assets in the account |
| remote_url | String |  |
| remote_stream_name | String |  |
| size | Integer |  |
| type | String | Must be one of the valid asset enum values |
| updated_at | String in ISO-8601 date format |  |
| uploaded_at | String in ISO-8601 date format |  |
| encoding_rate | Integer |  |
| video_duration | Integer |  |

##### The 'TEXT_TRACK' type
| Field | Type | Description |
| --- | --- | --- |
| id | String |  |
| audio_only | Boolean |  |
| cdn_origin_id | String |  |
| complete | Boolean |  |
| controller_type | String |  |
| current_filename | String |  |
| name | String |  |
| progressive_download | Boolean |  |
| size | Integer |  |
| type | String | 'TEXT_TRACK' |
| updated_at | String in ISO-8601 date format |  |
| uploaded_at | String in ISO-8601 date format |  |

#### Options
None

### POST
Not supported

### PATCH
Only remote assets can be edited via the CMS API.

OAuth operator required: "video-cloud/asset/update"

#### Fields
The fields available to set on an asset vary based on the asset type.

##### Video types
| Field | Type | Notes |
| --- | --- | --- |
| remote_url | String | Required |
| remote_stream_name | String | |
| complete | String | defaults to true if a remote_url is supplied |
| audio_only | String | |
| name | String | |
| size | Integer | |
| reference_id | String | |
| encoding_rate | String | |
| video_duration | String | |
| frame_height | String | |
| frame_width | String | |

##### Image types
| Field | Type | Notes |
| --- | --- | --- |
| remote_url | String | Required |
| remote_stream_name | String | |
| complete | String | defaults to true if a remote_url is supplied |
| audio_only | String | |
| name | String | |
| size | Integer | |
| reference_id | String | |
| frame_height | String | |
| frame_width | String | |

##### Text types
| Field | Type | Notes |
| --- | --- | --- |
| remote_url | String | Required |
| remote_stream_name | String | |
| complete | String | defaults to true if a remote_url is supplied |
| audio_only | String | |
| name | String | |
| size | Integer | |
| reference_id | String | |
| profiles | String | |

##### The 'AUDIO' type
| Field | Type | Notes |
| --- | --- | --- |
| remote_url | String | Required |
| remote_stream_name | String | |
| complete | String | defaults to true if a remote_url is supplied |
| audio_only | String | |
| name | String | |
| size | Integer | |
| reference_id | String | |
| encoding_rate | String | |
| video_duration | String | |

##### The 'TEXT_TRACK' type
| Field | Type | Notes |
| --- | --- | --- |
| remote_url | String | Required |
| audio_only | Boolean |  |
| complete | Boolean | defaults to true if a remote_url is supplied |
| name | String |  |
| size | Integer |  |

### DELETE
Removes the asset the video.

OAuth operator required: "video-cloud/asset/delete"
