token=$(curl -s -k --user 5l5Gfy_xdccStmVAGF8RGUadBgk28HCqpQk9MxwRg9BZmVaiN5DtfcTPotxDaFwNyOfAN4Vu-L5Qe3bHc4n28w -d grant_type=client_credentials https://oauth.brightcove.com/v2/access_token | cut -d'"' -f4)
curl -H "Content-Type: application/json" -H "Authorization: Bearer $token" $*
echo

