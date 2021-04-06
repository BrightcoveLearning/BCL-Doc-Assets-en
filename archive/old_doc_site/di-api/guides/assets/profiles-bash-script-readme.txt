SAVE THESE INSTRUCTIONS

Interim process for Ingest Profiles API documentation

1. Send the Pub ID that you need access set up for to Joel Miller (jmiller@brightcove.com)
2. He will generate a customized bash script for that account named something like:
    profiles-curl.{ACCOUNTID}.sh

You only need one script per account, even if multiple people are using it.

CAUTION: this script contains an oauth id/secret combo! avoid giving it to people you do not trust, because they can do Bad Things to your ingest profiles with it!

After that, rather than running curl commands directly to make API calls, you will use this bash script, which will handle authentication and then run the curl command.

Terminal usage:

For all the commands below, you will need to replace {ACCOUNTID} with the Pub ID for the account you are working on. And of course these commands need to be run from the directory where the bash script you get from Joel resides.

1. get all profiles:

bash ./profiles-curl.{ACCOUNTID}.sh -X GET https://ingestion.api.brightcove.com/v1/accounts/{ACCOUNTID}/profiles

2. get one profile: 

bash ./profiles-curl.{ACCOUNTID}.sh -X GET https://ingestion.api.brightcove.com/v1/accounts/{ACCOUNTID}/profiles/PROFILE_NAME

3. add a profile: 

bash ./profiles-curl.{ACCOUNTID}.sh -X POST -d @FILE_CONTAINING_INGEST_PROFILE.json https://ingestion.api.brightcove.com/v1/accounts/921483702001/profiles

and so on. see ingest profiles documentation for more endpoints and use cases: //docs.brightcove.com/en/videocloud/ingest-profiles-api/index.html

