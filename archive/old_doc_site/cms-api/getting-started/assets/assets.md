# Assets resource

All types of assets are accessed in reference to the video to which they are attached.  It is not possible to access assets outside the context of a video.

GET calls will list all assets of the given type, but POST and PATCH calls only support the creation or editing of remote assets.

Be aware that text tracks are managed differently from other, legacy asset types.

## Path
[$BASE_URL](README.md)/accounts/1234/videos/1234/assets  (read-only)

#### Each sub-type has its own resource, as well:

[$BASE_URL](README.md)/accounts/1234/videos/1234/assets/bumper

[$BASE_URL](README.md)/accounts/1234/videos/1234/assets/caption

[$BASE_URL](README.md)/accounts/1234/videos/1234/assets/digital_master

[$BASE_URL](README.md)/accounts/1234/videos/1234/assets/hds_manifest

[$BASE_URL](README.md)/accounts/1234/videos/1234/assets/hls_manifest

[$BASE_URL](README.md)/accounts/1234/videos/1234/assets/ism_manifest

[$BASE_URL](README.md)/accounts/1234/videos/1234/assets/ismc_manifest

[$BASE_URL](README.md)/accounts/1234/videos/1234/assets/dash_manifests

[$BASE_URL](README.md)/accounts/1234/videos/1234/assets/poster

[$BASE_URL](README.md)/accounts/1234/videos/1234/assets/preview

[$BASE_URL](README.md)/accounts/1234/videos/1234/assets/renditions

[$BASE_URL](README.md)/accounts/1234/videos/1234/assets/text_tracks

[$BASE_URL](README.md)/accounts/1234/videos/1234/assets/thumbnail

#### Assets can also be accessed by video reference ID, e.g.,

[$BASE_URL](README.md)/accounts/1234/videos/ref:myRefId/assets/:type

## Mapping
| Asset type | Assets endpoint |
| --- | --- |
| BUMPER | bumper |
| CAPTION | caption |
| DIGITAL_MASTER | digital_master |
| HDS_MANIFEST | hds_manifest |
| HLS_MANIFEST | hls_manifest |
| ISM_MANIFEST | ism_manifest |
| ISMC_MANIFEST | ismc_manifest |
| MPD_MANIFEST | dash_manifests |
| VIDEO_STILL | poster |
| PREVIEW | preview |
| FULL_LENGTH | renditions |
| TEXT_TRACK | text_tracks |
| THUMBNAIL | thumbnail |

Not all asset types are supported in the CMS API.

**Supported and encouraged:**  'FULL_LENGTH', 'VIDEO_STILL', 'THUMBNAIL', 'DIGITAL_MASTER', 'CAPTION', 'TEXT_TRACK', 'HDS_MANIFEST', 'ISM_MANIFEST', 'ISMC_MANIFEST', 'MPD_MANIFEST', 'HLS_MANIFEST'

**Supported but discouraged:**  'PREVIEW', 'BUMPER', 'AUDIO'

**Not supported at all:**  'LIVE_FULL_LENGTH', 'WMV_FULL', 'WMV_LIVE_FULL', 'WMV_PREVIEW', 'SYNDICATION_STILL', 'BACKGROUND', 'LOGO', 'LOGO_OVERLAY', 'OTHER_IMAGE', 'PHOTO', 'LARGE_IMAGE', 'MANIFEST'

## Usage
### GET
Returns asset data for the type specified.  The main /assets endpoint returns all assets on the video.  Singular endpoints return a single object; plural endpoints return a list of objects.

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
None - you cannot sort, page, or limit the asset list.

### POST
Only remote assets can be added to a video via the CMS API.

You must post a new asset to the appropriate type endpoint, eg., /assets/renditions to add a video rendition.  You cannot post to the main /assets endpoint.

OAuth operator required: "video-cloud/asset/create"

#### Fields
The fields available to set on an asset vary based on the asset type.

You must post a new asset to the appropriate type endpoint, eg., /assets/renditions to add a video rendition.  You cannot post to the main /assets endpoint.

##### Video types
| Field | Type | Notes |
| --- | --- | --- |
| remote_url | String | Required |
| remote_stream_name | String | |
| complete | Boolean | defaults to true if a remote_url is supplied |
| audio_only | Boolean | |
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
| complete | Boolean | defaults to true if a remote_url is supplied |
| audio_only | Boolean | |
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
| complete | Boolean | defaults to true if a remote_url is supplied |
| audio_only | Boolean | |
| name | String | |
| size | Integer | |
| reference_id | String | |
| profiles | String |  |

##### The 'AUDIO' type
| Field | Type | Notes |
| --- | --- | --- |
| remote_url | String | Required |
| remote_stream_name | String | |
| complete | Boolean | defaults to true if a remote_url is supplied |
| audio_only | Boolean | |
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

Note that adding a text track asset will not automatically add a text track object to the video.  See the [text tracks](text_tracks.md) documentation for more information.

### PATCH
Not supported

### DELETE
Not supported
