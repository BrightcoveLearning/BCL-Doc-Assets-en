token=$(curl -s -k --user f2499b79-9b4d-44bd-ba91-8c0223a7a918:qVAO__Wok5lnSO0KHJn_pa3yxQmfcawrx1UEZXbO0tL9NKwHUr53OEEPSiO6XYkSPxCjbvaPwld0629KlX0Mdw -d grant_type=client_credentials https://oauth.brightcove.com/v2/access_token | cut -d'"' -f4)
curl -H "Content-Type: application/json" -H "Authorization: Bearer $token" $*
echo

