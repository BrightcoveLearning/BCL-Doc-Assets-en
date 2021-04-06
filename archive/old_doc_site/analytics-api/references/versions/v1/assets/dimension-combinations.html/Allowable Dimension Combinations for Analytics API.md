** Allowable Dimension Combinations for Analytics API Reports

x indicates a valid combination

*** 2 Dimensions|

|                 | Account | Player | Video | Day | referrer_domain | source_type | search_terms | device_type | device_os |
| :------         | :-----: | :----: | :---: | :-: | :-------------: | :---------: | :----------: | :---------: | :-------: |
| Account         |         | x      | x     |     | x               | x           | x            | x           | x         |
| Player          | x       |        | x     |     | x               | x           | x            | x           | x         |
| Video           | x       | x      |       |     | x               | x           | x            | x           | x         |
| Day             |         |        |       |     |                 |             |              |             |           |
| referrer_domain | x       | x      | x     |     |                 | x           | x            | x           | x         |
| source_type     | x       | x      | x     |     | x               |             | x            | x           | x         |
| search_terms    | x       | x      | x     |     | x               | x           |              | x           | x         |
| device_type     | x       | x      | x     |     | x               | x           | x            |             | x         |
| device_os       | x       | x      | x     |     | x               | x           | x            | x           |           |

*** 3 Dimensions
|                             | Account | Player | Video | Day | referrer_domain | source_type | search_terms | device_type | device_os |
| :------                     | :-----: | :----: | :---: | :-: | :-------------: | :---------: | :----------: | :---------: | :-------: |
| Account-Player              |         |        | x     |     | x               | x           | x            | x           | x         |
| Account-Video               |         | x      |       |     | x               | x           | x            | x           | x         |
| Account-Referrer_domain     |         | x      | x     |     |                 | x           | x            | x           | x         |
| Account-Source_type         |         | x      | x     |     | x               |             | x            | x           | x         |
| Account-Search_terms        |         | x      | x     |     | x               | x           |              | x           | x         |
| Account-Device_type         |         | x      | x     |     |                 |             |              |             | x         |
| Account-Device_os           |         | x      | x     |     |                 |             |              | x           |           |
| Player-Video                | x       |        |       |     |                 |             |              |             |           |
| Player-Referrer_domain      | x       |        |       |     |                 | x           | x            |             |           |
| Player-Source_type          | x       |        |       |     | x               |             | x            |             |           |
| Player-Search_terms         | x       |        |       |     | x               | x           |              |             |           |
| Player-device_type          | x       |        |       |     |                 |             |              |             | x         |
| Player-device_os            | x       |        |       |     |                 |             |              | x           |           |
| Video-Referrer_domain       | x       |        |       |     |                 | x           | x            |             |           |
| Video-source_type           | x       |        |       |     | x               |             | x            |             |           |
| Video-search_terms          | x       |        |       |     | x               | x           |              |             |           |
| Video-device_type           | x       |        |       |     |                 |             |              |             | x         |
| Video-device_os             | x       |        |       |     |                 |             |              | x           |           |
| referrer_domain-souce_type  | x       | x      | x     |     |                 |             | x            |             |           |
| referrer_domain-search_terms| x       | x      | x     |     |                 | x           |              |             |           |
| source_type-search_terms    | x       | x      | x     |     | x               |             |              |             |           |
| device_type-device_os       | x       | x      | x     |     |                 |             |              |             |           |

*** 4 Dimensions|
* account + video/player + any two of referrer_domain, source_type, or search_terms
* account + referrer_domain + source_type + search_terms
*** 5 Dimensions|
* account + video/player + referrer_domain + source_type + search_terms

No dimensions beyond 5 will work.
