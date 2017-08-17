CAE Advanced Ingest Profile Settings

[https://docs.google.com/document/d/14yt8o4zL3Sz6GE1xbpzxWXcGSdQCb1Be6ixReC2cO30/edit\#](https://docs.google.com/document/d/14yt8o4zL3Sz6GE1xbpzxWXcGSdQCb1Be6ixReC2cO30/edit#)

This document provides a list of advanced CAE parameters than can be set as part of a custom Video Cloud CAE Ingest Profile. By default Video Cloud offers three preset CAE enabled profiles: multi-platform-standard-dynamic, multi-platform-extended-dynamic, and low-bandwidth-dynamic. Customers who prefer to fine tune their CAE settings can create custom Ingest profiles including any of the following parameters. 

dynamic\_profile\_options 
--------------------------

The following parameters may be specified as part of the dynamic\_profiles\_options block for a CAE enabled Video Cloud Ingest Profile:

Name

Type

Description

Defaults

"min\_renditions"

integer number

Minimum number of renditions to generate. 

Default = 1
Range = 1 - 15

"max\_renditions"

integer number

Maximum number of renditions to generate.

Default = 6
Range = 1 - 15

"max\_resolution"

structure
{"width" : \<int\>, "height": \<int\> }

Maximum resolution to be considered for the ladder.

(Aspect ratio of source will be preserved for outputs)

Default = source resolution
Range = 1x1 - 8192x8192.

"max\_frame\_rate"

floating point number

Maximum frame rate that can be used.

Default = 30

Range = 0.1 - 120

"keyframe\_rate"

floating point number

Keyframe rate. This value can be either 0.5 or 1\. For SSAI enabled content, this value needs to be 1.

Default = 0.5fps

"min\_bitrate"

floating point number

Minimum bitrate [kbps] that can be used.

Default = 200 Kbps
Range = 40 - 400

"max\_bitrate"

floating point number

Maximum bitrate [kbps] that can be used. 

Default = 15000 Kbps
Range = 400 - 40000

"max\_first\_rendition\_bitrate"

floating point number

Maximum bitrate [kbps] that can be used for first rendition.

Default = 400 Kbps
Range = 40 - 1000

"min\_ssim"

floating point number

Lowest allowed SSIM for each rendition. 

Default = 0.94

Range = 0.8 - 0.99

"max\_ssim"

floating point number

Highest allowed SSIM for each rendition. 

Default = 0.99

Range = 0.9 - 0.99

"video\_configurations"

array 

An array of structures describing resolutions, framerates and associated codec parameters that should be preferentially or mandatorily generated as part of the CAE encoding. See section below.

"select\_baseline\_profile\_configuration"

boolean

At least one rendition used in the profile will be baseline profile

Default = false

video\_configurations 
----------------------

This is an array of structures describing video resolutions and codec parameters that CAE should/must produce as part of its output. This array is optional. If omitted, an array of 16 resolutions, ranging from 192x108 to 1920x1080 will be used as the default input set for CAE.

Each element in video\_configurations array, may include the following elements:

Name

Type

Description

Required/optional

"width"

integer number

Video frame width [pixels]

Required

"height"

integer number

Video frame height [pixels]

Required

“sample\_aspect\_ratio”

integer:integer pair

Sample aspect ratio (e.g. 1:1, 4:3)

Optional

"frame\_rate"

floating point number

Video frame rate [fps]

Optional

"video\_codec\_profile"

string 

video codec profile

Optional

"video\_codec\_level"

string

video codec level

Optional

"video\_reference\_frames"

integer number

Constraint on number of reference frames. Default=4.

Optional

"video\_bframes"

integer number

Constraint on number of B frames. 

Default=3\. 

Optional

"required"

boolean

Setting this to true will guarantee the suggested configuration settings in the output

Default = false

Ingest Profile example: 

The following JSON provides an example custom Video Cloud CAE Ingest Profile:

{

 "id": "1234567890",

 "version": 1,

 "name": "custom-cae-profile",

 "description": "My custom CAE profile",

 "account\_id": 40000000001,

 "brightcove\_standard" : false,

 "digital\_master": {

 "rendition": "passthrough",

 "distribute": false

 },

 "dynamic\_origin": {

 "renditions": [

 "default/audio64",

 "default/audio96",

 "default/audio128",

 "default/audio192"

 ],

 "dynamic\_profile\_options": {

 "min\_renditions": 3,

 "max\_renditions": 6,

 "max\_resolution": {

 "width": 1920,

 "height": 1080

 },

 "max\_bitrate": 4200,

 "max\_first\_rendition\_bitrate": 400,

 "max\_frame\_rate": 30,

 "keyframe\_rate": 0.5,

 "select\_baseline\_profile\_configuration": true,

 "min\_ssim": 0.95,

 "video\_configurations": [
 {"width": 1280, "height": 720}, 
 {"width": 960, "height": 540}, 
 {"width": 640, "height": 360} 

 ]

 },

 "images": [

 {

 "label": "poster",

 "height": 720,

 "width": 1280

 }, 

 {

 "label": "thumbnail",

 "height": 90,

 "width": 160

 }

 ]

 }

}

Please use the instructions at http://docs.brightcove.com/en/video-cloud/ingest-profiles-api/index.html to create custom Ingest Profiles. 

Guidelines for using CAE options: 

The following table includes some guidelines for using CAE parameters

Profile characteristics

Guidelines

number of renditions

Is controllable by using “min\_renditions”, ”max\_renditions” parameters. When setting these parameters it is desirable to leave a certain gap (e.g. 3-4 renditions) between “min\_renditions” and ”max\_renditions” limits. This gap will allow profile generator to adapt the number of renditions based on characteristics of the content. E.g., for easy to encode content, it may produce fewer renditions, while for more complex content it may produce more.

set of resolutions

By default, profile generator uses a ladder of over 20 common resolutions, ranging from 192x108 to 3840x2160\. It can truncated at any point by setting "max\_resolution" parameter. 

Alternatively, a custom list of resolutions and associated codec parameters can be provided by using “video\_configurations” array.

GOP length

Is settable by "keyframe\_rate" parameter. This value can be either 0.5 (meaning 1 keyframe every 2 seconds) or 1 . For SSAI enabled content, this value needs to be 1.

Range of bitrates 

Can be set by using the "min\_bitrate" and "max\_bitrate" parameters. This will guarantee that first rendition will use at least "min\_bitrate" kbps, and that last rendition will use less or equal than "max\_bitrate" kbps.

Startup latency

Is controllable by setting "max\_first\_rendition\_bitrate" limit.

Support for legacy devices

Is controllable by setting "select\_baseline\_profile\_configuration" parameter. When this is true, at least one rendition will be encoded with H.264 baseline profile. 

Quality control

Parameter “min\_ssim” can be used to ensure that all renditions are encoded at given structural similarity (SSIM) index level. Foe example setting “min\_ssim”: 0.97, will enforce all renditions to be encoded at at least 0.97 SSIM level. Overly aggressive settings may reduce the effectiveness of CAE.