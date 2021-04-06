var aapi_model = {
        dimensions : ["account", "video", "player", "day", "destination_domain", "destination_path", "country", "city", "region", "referrer_domain", "source_type", "search_terms", "device_type", "device_os"],
        filters : ["video", "player", "day", "destination_domain", "destination_path", "country", "city", "region", "referrer_domain", "source_type", "search_terms", "device_type", "device_os"],
        baseFields : {items : ["engagement_score", "play_rate", "player_load", "video_impression", "video_view", "video_percent_viewed", "video_seconds_viewed"]},
        accountFields : {items : ["account", "active_media", "bytes_delivered", "bytes_in", "bytes_out", "bytes_overhead", "bytes_player", "bytes_stored", "cdn_log_line", "chimera_report", "content_delivered", "drm_bytes_packaged", "engagement_score", "licenses_served", "play_rate", "player_load", "video_engagement_1", "video_engagement_25", "video_engagement_50", "video_engagement_75", "video_engagement_100", "video_impression", "video_percent_viewed", "video_seconds_viewed", "live_seconds_viewed", "video_view"]},
        dayFields : {items : ["account", "active_media", "bytes_delivered", "bytes_in", "bytes_out", "bytes_overhead", "bytes_player", "bytes_stored", "cdn_log_line", "chimera_report", "content_delivered", "day", "drm_bytes_packaged", "engagement_score", "licenses_served", "play_rate", "player_load", "video_engagement_1", "video_engagement_25", "video_engagement_50", "video_engagement_75", "video_engagement_100", "video_impression", "video_percent_viewed", "video_seconds_viewed", "video_view"]},
        dimensionCombinations : {
            account_player : ["account", "player"],
            account_video : ["account", "video"],
            account_player_video : ["account", "player", "video"],
            account_traffic_sources : ["account", "referrer_domain", "source_type", "search_terms"],
            account_player_traffic_sources : ["account", "player", "referrer_domain", "source_type", "search_terms"],
            account_video_traffic_sources : ["account", "video", "referrer_domain", "source_type", "search_terms"],
            account_devices : ["account", "device_type", "device_os"],
            account_player_devices : ["account", "player", "device_type", "device_os"],
            account_video_devices : ["account", "video", "device_type", "device_os"],
            account_geo : ["account", "country", "region", "city"],
            account_player_geo : ["account", "player", "country", "region", "city"],
            account_video_geo : ["account", "video", "country", "region", "city"],
            account_destination : ["account", "destination_domain", "destination_path"],
            account_player_destination : ["account", "player", "destination_domain", "destination_path"],
            account_video_destination : ["account", "video", "destination_domain", "destination_path"]
        }
    };
aapi_model.videoFields = {items : aapi_model.baseFields.items.concat(["video", "video_name", "video_duration", "video_engagement", "video_engagement_1", "video_engagement_25", "video_engagement_50", "video_engagement_75", "video_engagement_100", "bytes_delivered", "content_delivered"])};
aapi_model.playerFields = {items : aapi_model.baseFields.items.concat(["player", "player_name", "video_duration", "video_engagement", "video_engagement_1", "video_engagement_25", "video_engagement_50", "video_engagement_75", "video_engagement_100"])};
aapi_model.countryFields = {items : aapi_model.baseFields.items.concat(["country", "country_name"])};
aapi_model.cityFields = {items : aapi_model.baseFields.items.concat(["city"])};
aapi_model.regionFields = {items : aapi_model.baseFields.items.concat(["region"])};
aapi_model.destination_domainFields = {items : aapi_model.baseFields.items.concat(["destination_domain"])};
aapi_model.destination_pathFields = {items : aapi_model.baseFields.items.concat(["destination_path"])};
aapi_model.referrer_domainFields = {items : aapi_model.baseFields.items.concat(["player_load", "referrer_domain"])};
aapi_model.source_typeFields = {items : aapi_model.baseFields.items.concat(["player_load", "source_type"])};
aapi_model.search_termsFields = {items : aapi_model.baseFields.items.concat(["player_load", "search_terms"])};
aapi_model.device_typeFields = {items : aapi_model.baseFields.items.concat(["player_load", "device_type"])};
aapi_model.device_osFields = {items : aapi_model.baseFields.items.concat(["player_load", "device_os"])};

