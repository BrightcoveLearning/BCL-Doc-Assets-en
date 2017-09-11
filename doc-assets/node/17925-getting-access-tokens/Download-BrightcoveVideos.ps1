$ParentPath = "C:\Temp"
$ParentCsv = "$ParentPath\Videos.csv"



Clear-Host



<#
    .SYNOPSIS
        Retrieves the TokenType and AccessToken from Brightcove.

    .DESCRIPTION
        Uses the Brightcove API to retrieve TokenType and AccessToken for use in later
        API requests. The AccessToken expires after 300 seconds (5 minutes) and a new
        AccessToken will need to be requested.
#>
function Get-BrightcoveAuthorization
{
    # https://support.brightcove.com/overview-oauth-api-v4

    $Uri = "https://oauth.brightcove.com/v4/access_token"

    $ClientId = "" # <--------------------------------------------------------------------Retrieve from Brightcove and paste here
    $ClientSecret = "" # <----------------------------------------------------------------Retrieve from Brightcove and paste here
    $Authorization = [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($ClientId + ":" + $ClientSecret))

    $Headers = @{
	    "Authorization" = "Basic " + $Authorization;
	    "Content-Type" = "application/x-www-form-urlencoded";
    }

    Invoke-RestMethod -Method "Post" -Uri $Uri -Body "grant_type=client_credentials" -Headers $Headers
}



<#
    .SYNOPSIS
        Retrieves a count of videos available for a Brightcove Video Cloud account.

    .DESCRIPTION
        Uses the Brightcove API to retrieve the count of videos.

    .PARAMETER TokenType
        Required. The token type as retrieved from Brightcove's authorization API.

    .PARAMETER AccessToken
        Required. The access toke as retrieved from Brightcove's authorization API.
#>
function Get-BrightcoveVideoCount
{
    # https://support.brightcove.com/getting-counts-videos-and-playlists

    param(
        [parameter(Mandatory=$true)]
        [string]
        $TokenType,

        [parameter(Mandatory=$true)]
        [string]
        $AccessToken
    )

    $Uri = "https://cms.api.brightcove.com/v1/accounts/1044238710001/counts/videos"

    $Headers = @{
	    "Authorization" = "$TokenType $AccessToken";
    }

    (Invoke-RestMethod -Method "Get" -Uri $Uri -Headers $Headers).count
}



<#
    .SYNOPSIS
        Retrieves a list of videos available for a Brightcove Video Cloud account.

    .DESCRIPTION
        Uses the Brightcove API to retrieve the information for a list of videos, paged
        up to a specified Limit and starting ad a specified Offset.

    .PARAMETER TokenType
        Required. The token type as retrieved from Brightcove's authorization API.

    .PARAMETER AccessToken
        Required. The access toke as retrieved from Brightcove's authorization API.

    .PARAMETER Limit
        Optional. Number of videos to return - must be an integer between 1 and 100.
        Default: 20

    .PARAMETER Offset
        Optional. Number of videos to skip (for paging results). Must be a positive integer.
        Default: 0
#>
function Get-BrightcoveVideos
{
    # https://support.brightcove.com/overview-cms-api
    # https://support.brightcove.com/using-cms-api-retrieve-video-data#bc-ipnav-1
    # https://support.brightcove.com/cmsplayback-api-videos-search

    param(
        [parameter(Mandatory=$true)]
        [string]
        $TokenType,

        [parameter(Mandatory=$true)]
        [string]
        $AccessToken,

        [ValidateRange(1, 100)]
        [int]
        $Limit = 20,

        [ValidateRange(0, [int]::MaxValue)]
        [int]
        $Offset = 0
    )

    $Uri = "https://cms.api.brightcove.com/v1/accounts/1044238710001/videos"

    if ($Limit)
    {
        $Uri += "?limit=$Limit"
    }

    if ($Offset -and $Offset -ne 0)
    {
        if ($Limit)
        {
            $Uri += "&offset=$Offset"
        }
        else
        {
            $Uri += "?offset=$Offset"
        }
    }

    $Headers = @{
	    "Authorization" = "$TokenType $AccessToken";
    }

    Invoke-RestMethod -Method "Get" -Uri $Uri -Headers $Headers
}



<#
    .SYNOPSIS
        Retrieves a list of sources available for a Brightcove video.

    .DESCRIPTION
        Uses the Brightcove API to retrieve the list of video file sources for a
        specific video.

    .PARAMETER TokenType
        Required. The token type as retrieved from Brightcove's authorization API.

    .PARAMETER AccessToken
        Required. The access toke as retrieved from Brightcove's authorization API.

    .PARAMETER VideoId
        Required. ID of the video to get information for. This can be obtained using
        the Get-BrightcoveVideos function or Brightcove's website.
#>
function Get-BrightcoveVideoSources
{
    # https://support.brightcove.com/using-cms-api-retrieve-video-data#bc-ipnav-3

    param(
        [parameter(Mandatory=$true)]
        [string]
        $TokenType,

        [parameter(Mandatory=$true)]
        [string]
        $AccessToken,

        [parameter(Mandatory=$true)]
        [string]
        $VideoId
    )

    $Uri = "https://cms.api.brightcove.com/v1/accounts/1044238710001/videos/$VideoId/sources"

    $Headers = @{
	    "Authorization" = "$TokenType $AccessToken";
    }

    Invoke-RestMethod -Method "Get" -Uri $Uri -Headers $Headers
}



<#
    .SYNOPSIS
        Retrieves a list of images associated with a Brightcove video.

    .DESCRIPTION
        Uses the Brightcove API to retrieve the information of the thumbnail and poster
        for a specific video.

    .PARAMETER TokenType
        Required. The token type as retrieved from Brightcove's authorization API.

    .PARAMETER AccessToken
        Required. The access toke as retrieved from Brightcove's authorization API.

    .PARAMETER VideoId
        Required. ID of the video to get information for. This can be obtained using
        the Get-BrightcoveVideos function or Brightcove's website.
#>
function Get-BrightcoveVideoImages
{
    # https://support.brightcove.com/using-cms-api-retrieve-video-data#bc-ipnav-4

    param(
        [parameter(Mandatory=$true)]
        [string]
        $TokenType,

        [parameter(Mandatory=$true)]
        [string]
        $AccessToken,

        [parameter(Mandatory=$true)]
        [string]
        $VideoId
    )

    $Uri = "https://cms.api.brightcove.com/v1/accounts/1044238710001/videos/$VideoId/images"

    $Headers = @{
	    "Authorization" = "$TokenType $AccessToken";
    }

    Invoke-RestMethod -Method "Get" -Uri $Uri -Headers $Headers
}



<#
    .SYNOPSIS
        Downloads a file from the web.

    .DESCRIPTION
        Uses the BITS to retrieve a file from a given URI.

    .PARAMETER Path
        Required. The folder path to save the file to. The filename will be determined
        by the URI.

    .PARAMETER Uri
        Required. The URI for the location of the file on the web. This will be used to
        determine the filename of the file.

    .PARAMETER DisplayName
        Optional. This is what will be displayed at the top of the progress bar.
#>
function Start-BrightcoveDownload
{
    param(
        [parameter(Mandatory=$true)]
        [string]
        $Path,

        [parameter(Mandatory=$true)]
        [string]
        $Uri,

        [string]
        $DisplayName
    )

    $FileName = (($Uri -split "/")[-1] -split "\?")[0]

    if ([string]::IsNullOrWhiteSpace($DisplayName))
    {
        $DisplayName = "Downloading file..."
    }

    Start-BitsTransfer -Source $Uri -Destination "$Path\$FileName" -DisplayName $DisplayName -Description $FileName
}



<#
    .SYNOPSIS
        Replaces invalid characters from a filename.

    .DESCRIPTION
        Replaces the invalid characters in a filename with an underscore (_).

    .PARAMETER Name
        Required. Filename to have the invalid characters removed from.
#>
function Replace-InvalidFileNameChars {
    param(
        [Parameter(Mandatory=$true)]
        [String]$Name
    )

    $InvalidFileNameChars = [IO.Path]::GetInvalidFileNameChars() -join ''
    $Replace = "[{0}]" -f [RegEx]::Escape($InvalidFileNameChars)

    return ($Name -replace $Replace, "_")
}







# Get AccessToken for API
"Getting AccessToken for API..."
$BrightcoveAuthorization = Get-BrightcoveAuthorization

$AccessToken = $BrightcoveAuthorization.access_token
$AccessTokenExpiresIn = $BrightcoveAuthorization.expires_in #seconds (300)
$TokenType = $BrightcoveAuthorization.token_type

$AccessTokenExpiry = (Get-Date) + (New-TimeSpan -Seconds $AccessTokenExpiresIn)



# Get count of available videos
"Getting count of available videos..."
$BrightcoveVideoCount = Get-BrightcoveVideoCount -AccessToken $AccessToken -TokenType $TokenType



# Get list of all videos 20 at a time
"Getting list of all videos..."
$BrightcoveVideos = @()
for ($i = 0; $i -lt $BrightcoveVideoCount; $i += 20) {
    $BrightcoveVideos += Get-BrightcoveVideos -AccessToken $AccessToken -TokenType $TokenType -Offset $i
}



# Parse videos and download information, video, and thumbnail files
"Parsing videos and downloading information, video, and thumbnail files..."
foreach ($BrightcoveVideo in $BrightcoveVideos)
{
    $Thumbnail = ""
    $Poster = ""

    $Video = [pscustomobject][ordered]@{
        Id = $BrightcoveVideo.id
        Complete = $BrightcoveVideo.complete
        CreatedAt = $BrightcoveVideo.created_at
        Duration = $BrightcoveVideo.duration
        Name = $BrightcoveVideo.name
        OriginalFileName = $BrightcoveVideo.original_filename
        PublishedAt = $BrightcoveVideo.published_at
        State = $BrightcoveVideo.state
        Tags = $BrightcoveVideo.tags -join ","
        UpdatedAt = $BrightcoveVideo.updated_at
    }

    $VideoName = $Video.Name
    $PathFriendlyVideoName = Replace-InvalidFileNameChars -Name $VideoName

    $Path = "$ParentPath\$PathFriendlyVideoName"

    # Get new AccessToken if expired
    if ((Get-Date) -gt $AccessTokenExpiry)
    {
        $BrightcoveAuthorization = Get-BrightcoveAuthorization

        $AccessToken = $BrightcoveAuthorization.access_token
        $AccessTokenExpiresIn = $BrightcoveAuthorization.expires_in #seconds (300)
        $TokenType = $BrightcoveAuthorization.token_type

        $AccessTokenExpiry = (Get-Date) + (New-TimeSpan -Seconds $AccessTokenExpiresIn)
    }

    # Get list of rendition sources for video and select last MP4, sorted by width
    $BrightcoveVideoSources = Get-BrightcoveVideoSources -AccessToken $AccessToken -TokenType $TokenType -VideoId $Video.Id
    $Source = $BrightcoveVideoSources | where -Property "container" -EQ -Value "MP4" | sort -Property width | select -Last 1
    $SourceUri = $Source.src

    # Get list of images for video
    $BrightcoveVideoImages = Get-BrightcoveVideoImages -AccessToken $AccessToken -TokenType $TokenType -VideoId $Video.Id
    $Thumbnail = $BrightcoveVideoImages.thumbnail
    $ThumbnailUri = $Thumbnail.src
    $Poster = $BrightcoveVideoImages.poster
    $PosterUri = $Poster.src

    # Create video download folder
    if (-not (Test-Path $Path))
    {
        New-Item -Path $Path -ItemType Directory |
            Out-Null
    }

    # Append video information to parent CSV
    $Video |
        Export-Csv -Path $ParentCsv -NoTypeInformation -Append

    # Write video inforamtion to video CSV
    $Video |
        Export-Csv -Path "$Path\$PathFriendlyVideoName.csv" -NoTypeInformation

    # Download video thumbnail
    if (-not [string]::IsNullOrWhiteSpace($ThumbnailUri))
    {
        Start-BrightcoveDownload -Path $Path -Uri $ThumbnailUri -DisplayName "Downloading thumbnail for $VideoName"
    }

    # Download video poster
    if (-not [string]::IsNullOrWhiteSpace($PosterUri))
    {
        Start-BrightcoveDownload -Path $Path -Uri $PosterUri -DisplayName "Downloading poster for $VideoName"
    }

    # Download video file
    if (-not [string]::IsNullOrWhiteSpace($PosterUri))
    {
        Start-BrightcoveDownload -Path $Path -Uri $SourceUri -DisplayName "Downloading video for $VideoName"
    }
}



"\n"
"Finished downloading files. Look for the list of videos in a CSV file at the root of "
"the parent path. Each video is downloaded to its own separate folder along with its "
"own CSV and image files."
Explorer.exe $ParentPath
