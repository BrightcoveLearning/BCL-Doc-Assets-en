var brightcove_account = '20318290001', //'1417400168''20318290001';
    auth_token = '15075c51ae4b0af095c9a619a', //'1517fd531e4b06bb5d7944c81''15075c51ae4b0af095c9a619a';
    media_token = 'v87kWelIdjUwVm7_Rzv09k-KqtLz-ty8ONbMxVYAI7-Q0eOilegqqg..', //'RjHqT0NjZG3TGZDT-d0vHJ14XRcKx90UPCpLDgd34VY.'
    today = new Date(),
    today_unix = today.getTime(),
    one_week_ago = new Date(today_unix - 1000 * 60 * 60 * 24 * 7).getTime(),
    // Video report for the last week
    url = "https://data.brightcove.com/analytics-api/videocloud/accounts/" + brightcove_account + "/report?dimensions=video&limit=all&from=" + one_week_ago + "&to=" + today_unix,
    options = {
        "headers": {
            "Authorization": "Bearer " + auth_token
        }
    };

function fetchData() {
    var response = UrlFetchApp.fetch(url, options),
        response_json = JSON.parse(response.getContentText()),
        media_response,
        media_response_json,
        media_url,
        sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(),
        i,
        headerNames = ["Video Name", "Video ID", "Reference ID", "Published Date", "Tags", "Video Duration", "Video Impression", "Video View", "Play Rate", "Engagement Score", "Total Viewed Seconds", "Total Viewed Percentage", "Views at 1%", "Views at 25%", "Views at 50%", "Views at 75%", "Views at 100%"];
    sheet.getRange(1, 1, 1, headerNames.length).setValues([headerNames]);
    for (i = 0; i < response_json.items.length; ++i) {
        media_url = "http://api.brightcove.com/services/library?command=find_video_by_id&video_id=" + response_json.items[i].video + "&video_fields=name,referenceId,publishedDate,tags&token=" + media_token;
        media_response = UrlFetchApp.fetch(media_url);
        media_response_json = JSON.parse(media_response.getContentText());
        // use media api name if video_name is missing
        if (response_json.items[i].video_name === "" || response_json.items[i].video_name === null) {
            if ( media_response_json && media_response_json.name) {
                response_json.items[i].video_name = media_response_json.name;
            }
        }
        refId = (media_response_json && media_response_json.refernceId) ? media_response_json.referenceId : "none" 
        sheet.getRange(i + 2, 1, 1, headerNames.length).setValues([
            [response_json.items[i].video_name, response_json.items[i].video, media_response_json.referenceId, new Date(Number(media_response_json.publishedDate)), media_response_json.tags, response_json.items[i].video_duration, response_json.items[i].video_impression, response_json.items[i].video_view, response_json.items[i].play_rate, response_json.items[i].engagement_score, response_json.items[i].video_seconds_viewed, response_json.items[i].video_percent_viewed, response_json.items[i].video_engagement_1, response_json.items[i].video_engagement_25, response_json.items[i].video_engagement_50, response_json.items[i].video_engagement_75, response_json.items[i].video_engagement_100 ]
        ]);
    }
}
