Ingest Profiles
===============

In case you haven't heard, Ingest Profiles is the service that manages ingestion profiles. Ingestion profiles are the new(ish) way to define transcoding options - as well as packaging and drm options - in JSON. They are much more flexible and extensible than the old account transcoding preferences. Currently, there is not a way to edit them through MediaManager, but there is [an api](https://bithub.brightcove.com/videocloud/ingest-profiles/wiki/APIEndpoints)! In this document we will outline the requirements, guidelines, and best practices for creating ingest profiles with any of the currently supported options.

It is recommended that you familiarize yourself with the API endpoints in the link provided above before proceeding.


Account Configurations
----------------------

These are explained thoroughly in the API Endpoints documentation. Read about them there.


Defining Profiles
-----------------

Where relevant, numeric ranges and acceptable choices for particular fields are provided.

### Basic Components

Each profile has three main parts:

#### General Profile Attributes

Here you'll provide some general data. These fields are mandatory.
Things that you can define in your profile:


- `"account_id": ACCOUNT_ID(long)` - This is just the pubId. Note that this **must** match the pubId endpoint you're trying to POST/PUT to in your curl call. 


- `"archive_master": true||false` - Defines whether or not the digital master will be archived.


- `"name": "some_name"` - The name of your profile. This should be a lowercase alphanumeric string (hyphens/underscores allowed).


- `"description": "The path of the righteous man is beset on all sides by the iniquities of the selfish and the tyranny of evil men. Blessed is he who, in the name of charity and good will, shepherds the weak through the valley of darkness, for he is truly his brother's keeper and the finder of lost children. And I will strike down upon thee with great vengeance and furious anger those who would attempt to poison and destroy My brothers. And you will know My name is the Lord when I lay My vengeance upon thee."` - What does Marcellus Wallace look like? Basically an arbitrary string describing your profile.


Thus:
```
{
  "account_id": ...,
  "archive_master": ...,
  "name": ...,
  "description": ...,
  ...
}
```

#### Renditions

Each profile must have a renditions section with one or more renditions. These are defined as an array of json objects:
```
{
  ...,
  "renditions": [
    { RENDITION-1 },
    ...
  ],
  ...
}
```

##### Rendition Attributes
For each defined rendition, all of the below are required:

- `"format": `



- `"width": 2-100000 # images= 0-10000`



- `"height": 2-100000 # images= 0-10000`


There are many optional attributes as well.
For video renditions:

- `"reference_id":`


- `"audio_bitrate": 1-1000`


- `"video_codec":`


- `"audio_codec":`


- `"video_bitrate": 10-100000`


- `"h264_profile":`


- `"keyframe_rate":`


- `"fixed_keyframe_interval": true|false`


- `"media_type": audio|video`


- `"decoder_bitrate_cap": 10-100000`


- `"decoder_buffer_size": 10-100000`


- `"type": segmented|?????`


- `"speed": [1-5]`


- `"max_video_bitrate": 10-100000`


- `"h264_reference_frames": 0-16`


- `"crf": [1-51]`


- `"vp6_2_pass_min_section": 0-100`


- `"vp6_2_pass_max_section": 0-10000`


- `"vp6_stream_prebuffer": 0-600`

- `"vp6_stream_max_buffer": 0-600`

For audio only and video renditions:

- `"audio_sample_rate": 8000-96000`


- `"audio_channels": 1-2 # are we supporting more at some point?`


- `"live_sliding_window_duration": 40-14400`


- `"max_hls_protocol_version": 2-4`

Thus, a completed rendition might look something like this:
```
{
  "media_type" : ...,
	"reference_id" : ...,
	"format" : ...,
	"audio_codec" : ...,
	"audio_bitrate" : ...,
	"video_bitrate": ...,
	"width": ...,
	"height": ...,
	"fixed_keyframe_interval": ...,
	"frame_rate": ...,
	"video_codec": ...,
	"h264_profile" : ...,
	"keyframe_rate" : ...,
	"type": ...
}
```

#### Packages

Packages allow you to define DRM'ed/packaged renditions that should be created with the transcoded renditions. Note that if any rendition refId is not mentioned in one of the packages, that rendition will be considered as an output rendition. E.g., if you have a bunch of drm packages but fail to mention one of your renditions in your packages, you'll have a bunch of DRM'ed stuff as well as one un-DRM'ed rendition pushed to the CDN! You will almost certainly not want to do this, so be careful.

##### Package Attributes

- `"drm": zero or more of ["marlin", "playready"] (array)` - Currently, this field is only used for Dash CENC. New DRM types will add more options.

- `"package_type": "dash"||"faxs"||"hds-faxs"||widevine||smooth-playready` - Packages were originally implemented to cover both packages and drm (hence smooth-playready). Legacy drm/package hybrids will be maintained for now, but going forward new additions will separate the two.

- `"renditions": [one or more rendition refids, depending on DRM and packaging scheme]` - Renditions you want included in this package. Usually one, except for special cases.

Thus, a complete package specification might look something like this:
```
{
    ...,
    packages": 
        [
           {
               "drm": [ "marlin", "playready" ],
			   "package_type": "dash",
               "renditions": [ "av0" ]
           },
		   {
               "drm": [ "marlin", "playready" ],
			   "package_type": "dash",
               "renditions": [ "av1" ]
           },
		   {
               "drm": [ "marlin", "playready" ],
			   "package_type": "dash",
               "renditions": [ "av2" ]
           },
		   {
               "drm": [ "marlin", "playready" ],
			   "package_type": "dash",
               "renditions": [ "av3" ]
           }
       ],
    ...
}
```

DRM / Package combinations have special considerations that must be observed when you're creating a profile for them. In light of this, generic examples are not terribly helpful. Case-specific examples are provided in the following section.

### Packages and DRM Types: Details
...as well as the restrictions and caveats thereof. Examples provided in linked JSON documents.

#### [Widevine](https://bithub.brightcove.com/drm/drm-docs/blob/master/profiles/widevine-sample.json)
The provided example produces two renditions packaged into a single Widevine container.
##### Requirements:
- DRM: None
- Package Type: `"widevine"`
- Renditions: one or more renditions, all of which have an identical resolution (e.g. 1280x720). if an "audio-only" rendition is desired, its resolution should match the others, but the `"video_bitrate"` for the rendition in question should be nerfed.

#### [FAXS (+ mp4)](https://bithub.brightcove.com/drm/drm-docs/blob/master/profiles/faxs-sample.json)
The provided example will produce two FAXS packaged renditions for delivery over RTMP/HTTP (not HDS).
##### Requirements:
- DRM: None
- Package Type: `"faxs"`
- Renditions: Each package should contain only a single rendition. 

#### [HDS + FAXS](https://bithub.brightcove.com/drm/drm-docs/blob/master/profiles/hds-faxs-sample.json)
The provided example will produce two FAXS packaged renditions for delivery over HDS (not RTMP/HTTP).
##### Requirements:
- DRM: None
- Package Type: `"hds-faxs"`
- Renditions: Each package should contain only a single rendition.

#### [Dash + CENC](https://bithub.brightcove.com/drm/drm-docs/blob/master/profiles/dash-CENC.json)
The provided example will produce four Dash renditions with CENC.
##### Requirements:
- DRM: one or both of `"marlin"`, `"playready"`
- Package Type: `"dash"`
- Renditions: Each package should contain only a single rendition.

#### Dash Unencrypted
Basically identical to the case specified above; just omit the `"drm"` field.

#### [Smooth + Playready](https://bithub.brightcove.com/drm/drm-docs/blob/master/profiles/protected-sony-sample.json)
The provided example will produce Widevine, FAXS, and Smooth + Playready packages.
##### Requirements:
- DRM: None
- Package Type: `"smooth-playready"`
- Renditions: Each package should contain only a single rendition.
