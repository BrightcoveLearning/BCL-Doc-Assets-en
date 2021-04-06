bold=`tput bold`
normal=`tput sgr0`
echo 'Enter your account id:'
read ACCOUNT_ID
echo Your client id: $ACCOUNT_ID
echo --------------------------
echo 'Enter your client id:'
read CLIENT_ID
echo Your client id: $CLIENT_ID
echo --------------------------
echo 'Enter your client secret:'
read CLIENT_SECRET
echo Your client secret: $CLIENT_SECRET
echo --------------------------
echo 'Enter the video title:'
read TITLE
echo Your client secret: $TITLE
echo --------------------------
echo 'Enter the URL for the video file:'
read URL
echo Your client secret: $URL
echo --------------------------
export CMS_API_CALL="https://cms.api.brightcove.com/v1/accounts/$ACCOUNT_ID/videos"
echo 'Enter the full API call:'
read API_CALL
echo Your API call: $API_CALL
echo --------------------------
export VERB="POST"
echo 'Enter data to be submitted in the request body:'
read DATA
echo Your call verb: $DATA
echo --------------------------
TOKEN=$(curl -s --data "grant_type=client_credentials" https://oauth.brightcove.com/v3/access_token --header "Content-Type: application/x-www-form-urlencoded" --user "$CLIENT_ID:$CLIENT_SECRET" | sed -E 's/.*access_token\"\:\"([^\"]+)\".*/\1/');
echo Your token: $TOKEN
echo --------------------------
RESPONSE=$(curl -s -v -X $VERB "$API_CALL" -d "$DATA" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json")
echo Raw response:
echo $RESPONSE
echo --------------------------
echo Pretty-printed response:
echo $RESPONSE | python -m json.tool
echo
