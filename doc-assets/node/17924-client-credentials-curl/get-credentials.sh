  curl \
    --include \
    --header "Authorization: BC_TOKEN AEnTxTgSMVjWlnK5zHiN1MV_kpF3VDxGMkd8FajkiJCa8-MjEajaPC0WPnQ0bmeJDXsoOS94jc0CU-F_UzPg3g4NIOeU5B_J1gb-6YRq_1rP2EFn9BX47C4" \
    --data {'name=TEST-DELETE&maximum_scope=[{
        "identity": {
          "type": "video-cloud-account",
          "account-id": 57838016001
        },
        "operations": [
          "video-cloud/video/all"
        ]
    }]'} \
  https://oauth.brightcove.com/v4/client_credentials