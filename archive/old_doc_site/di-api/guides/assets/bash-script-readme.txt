your customized profiles script is: ./profiles-curl.921483702001.sh

CAUTION: this script contains an oauth id/secret combo! avoid giving it to people you do not trust, because they can do Bad Things to your ingest profiles with it!

usage:
get all profiles: ./profiles-curl.921483702001.sh -X GET https://ingestion.api.brightcove.com/v1/accounts/921483702001/profiles
get one profile: ./profiles-curl.921483702001.sh -X GET https://ingestion.api.brightcove.com/v1/accounts/921483702001/profiles/PROFILE_NAME
add a profile: ./profiles-curl.921483702001.sh -X POST -d @FILE_CONTAINING_INGEST_PROFILE.json https://ingestion.api.brightcove.com/v1/accounts/921483702001/profiles

and so on. see ingest profiles documentation for more endpoints and use cases: https://bithub.brightcove.com/videocloud/ingest-profiles/wiki/APIEndpoints



your customized profiles script is: ./profiles-curl.57838016001.sh

CAUTION: this script contains an oauth id/secret combo! avoid giving it to people you do not trust, because they can do Bad Things to your ingest profiles with it!

usage:
get all profiles: 
bash ./profiles-curl.57838016001.sh -X GET https://ingestion.api.brightcove.com/v1/accounts/57838016001/profiles
get one profile: 
bash ./profiles-curl.57838016001.sh -X GET https://ingestion.api.brightcove.com/v1/accounts/57838016001/profiles/PROFILE_NAME
add a profile: 
bash ./profiles-curl.57838016001.sh -X POST -d @FILE_CONTAINING_INGEST_PROFILE.json https://ingestion.api.brightcove.com/v1/accounts/57838016001/profiles

and so on. see ingest profiles documentation for more endpoints and use cases: https://bithub.brightcove.com/videocloud/ingest-profiles/wiki/APIEndpoints