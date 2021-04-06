/*global window, console, document, $, brightcove, APIModules, BCAuthEvent, BCMediaEvent */

/**
BrightcoveAdobePass handles the workflow associated with Adobe Pass and Brightcove

@class BrightcoveAdobePass
@constructor
@param {Object} options A configuration object, this will get added to
@param {Boolean} options.production A boolean to represent if this is a staging or production environment
@param {String} options.requestor A string that represents the requestor ID for Adobe Pass
**/
function BrightcoveAdobePass(options) {
    if (!(this instanceof BrightcoveAdobePass)) {
        return new BrightcoveAdobePass(options);
      }

    this.options = options;
}

/**
Initalization method handles initializing Adobe Pass Access Enabler and creates
the Brightcove player experience

@method init
**/
BrightcoveAdobePass.prototype.init = function() {
    var options = this.options;

    /*jslint todo: true */
    //TODO: I'm using bind, this won't work in older browsers...
    window.entitlementLoaded = this.entitlementLoaded.bind(this);
    window.displayProviderDialog = this.displayProviderDialog.bind(this);
    window.createIFrame = this.createIFrame.bind(this);
    window.setAuthenticationStatus = this.setAuthenticationStatus.bind(this);
    window.sendTrackingData = this.sendTrackingData.bind(this);
    window.setToken = this.setToken.bind(this);
    window.tokenRequestFailed = this.tokenRequestFailed.bind(this);
    window.selectedProvider = this.selectedProvider.bind(this);
    window.setMetadataStatus = this.setMetadataStatus.bind(this);

    window.onTemplateLoad = this.onTemplateLoad.bind(this);

    //Now that our callbacks are set - lets load the JavaScript to the page
    $.getScript('https://entitlement.auth-staging.adobe.com/entitlement/AccessEnabler.js');

    //Login button
    $(options.loginButtonId).on('click', {'self': this},function (evt){
        var self = evt.data.self;
        if($(this).hasClass('login')){
            self._getAuthenitcation(evt);
        }else{
            self._logout(evt);
        }
    });

    //Now initialize the experience
    brightcove.createExperiences();
};
BrightcoveAdobePass.prototype._thumbnailDriven = function (){
    return this.options.thumbnail_driven;
};
BrightcoveAdobePass.prototype._getAuthenitcation = function (evt){
    if(this._thumbnailDriven()){
        this.getAccessEnabler().getAuthentication(this._getRedirectURL());
    }else{
        this.getAccessEnabler().getAuthentication();
    }
};
BrightcoveAdobePass.prototype._logout = function (evt){
    this.getAccessEnabler().logout();
};

BrightcoveAdobePass.prototype._getAuthorization = function (resourceId) {
    if(this._thumbnailDriven){
        this.getAccessEnabler().getAuthorization(resourceId, this._getRedirectURL());
    }else{
        this.getAccessEnabler().getAuthorization(resourceId);
    }
};

BrightcoveAdobePass.prototype._getRedirectURL = function () {
    var site = window.location.origin + window.location.pathname,
    video_id_param = '?video_id=' + (this.options.selected_video || '');
    return site + video_id_param;
};
/**
Implementation of the callback handler for Adobe Pass entitlement loaded event.  This is a good
place to set the requestor and check for authenication

@method entitlementLoaded
**/
BrightcoveAdobePass.prototype.entitlementLoaded = function () {
    this.getAccessEnabler().setRequestor(this.options.requestor);
    this.getAccessEnabler().checkAuthentication();
};

/**
Implementation of the callback for Adobe Pass display provider diaglog.

@method displayProviderDialog
@param {Object} responseIdP The identification provider list
**/
BrightcoveAdobePass.prototype.displayProviderDialog = function (responseIdP) {
    //Load mvpds into options
    this.options.available_idps = responseIdP;

    //Show modal window
    this._showLoginModal();
};

/**
Show Login Modal generates a login model for the user to pick their identity provider.
When generating the buttons, we add platform_id as an attribute of the DOM node

@private
@method _showLoginModal
**/
BrightcoveAdobePass.prototype._showLoginModal = function () {
    var providers = $('#providers'),
    choosers = this.options.available_idps,
    title = $('#login-modal-title'),
    i,
    logo,
    button;

    //Only generate the buttons if they haven't been generated before...
    if(providers.children().length===0){
        for(i=0; i<choosers.length; i+=1){
            //Build button
            logo = choosers[i].logoURL;

            //Use logo if we have it...
            if(logo){
                button = $('<button><img src="'+logo+'"></img></button>');
            }else{
                button = $('<button>' + choosers[i].displayName + '</button>');
            }

            //CSS class, attributes, and click
            button.addClass('btn');
            button.attr('platform_id', choosers[i].ID);
            button.on('click', this.chooseIdP.bind(this));

            providers.append(button);
        }
    }
    //if you wanted to update title if it is thumbnail driven
    if(this.options.thumbnail_driven){
        title.text('You aren\'t authorized, please login');
        delete this.options.thumbnail_driven;
    }else{
        title.text('Login');
    }

    //show modal
    $('#login-modal').modal('show');
};

/**
On click handler for the login modal's buttons.  This function gets the platform id from
the button's DOM and tells Adobe Access Enabler to log in with the platform id

@method chooseIdP
**/
BrightcoveAdobePass.prototype.chooseIdP = function (e) {
    var platform_id = $(e.target).attr('platform_id') || $(e.target.parentElement).attr('platform_id');

    this.getAccessEnabler().setSelectedProvider(platform_id);
};

/**
Private method that toggles the login button to either show login or logout

@private
**/
BrightcoveAdobePass.prototype._toggleLoginButton = function (){

    var loginButton = $(this.options.loginButtonId);

    if(loginButton.hasClass('login')){
        loginButton.addClass('logout');
        loginButton.removeClass('login');
    }else{
        loginButton.addClass('login');
        loginButton.removeClass('logout');
    }
};

/**
Adobe Pass callback - currently not in use

@method createIFrame
**/
BrightcoveAdobePass.prototype.createIFrame = function (width, height) {

};

/**
Callback for checking authentication in Adobe Pass.

@method setAuthenticationStatus
**/
BrightcoveAdobePass.prototype.setAuthenticationStatus = function (status, errorMessage) {
    //status is either 0 or 1
    if(status) {
        //authenticated
        this._toggleLoginButton();
        this._toggleLock();
    }
};

/**
Callback for Adobe Pass, currently not being used
@method sendTrackingData
**/
BrightcoveAdobePass.prototype.sendTrackingData = function (event, data) {

};
/*************************
 **AUTHORIZATION METHODS**
 *************************/

/**
Adobe callback for when authorization is successful, this is where
you setToken on the player, and handle any authorization success login

@method setToken
**/
BrightcoveAdobePass.prototype.setToken = function (resource, token) {
    var video_auth = this.video_experience.getModule(APIModules.AUTH);

    //Set Token and Play
    video_auth.playWithToken(token, 'adobepass');

};

/**
Adobe Pass callback for when authorization fails.

@method tokenRequestFailed
**/
BrightcoveAdobePass.prototype.tokenRequestFailed = function (resourceID, errorCode, errorDetails) {
    console.log('Authorization tokenRequestFailed');
};

/**
Brightcove callback for when the video player can not play because
authorization/authentication is needed.  It is up to the developer to
figure out if you need to authenticate, authorize, or both.

@method onAuthNeeded
**/
BrightcoveAdobePass.prototype.onAuthNeeded = function (evt){
    var type = evt.type,
    resourceId = evt.resourceId;

    if(type === 'authNeeded'){
        var authMod = this.video_experience.getModule(APIModules.AUTH);

        //show message
        authMod.showMessage('Authorization in Progress', true);

        //start authz
        this._getAuthorization(resourceId);
    }
};

/*****************************
 **END AUTHORIZATION METHODS**
 *****************************/

/**
Brightcove callback when the video experience template is loaded.
This is a good time to set up Brightcove specific event handling

@method onTemplateLoad
**/
BrightcoveAdobePass.prototype.onTemplateLoad = function (experienceID){
    var bcExp = brightcove.getExperience(experienceID),
    modVP = bcExp.getModule(APIModules.VIDEO_PLAYER),
    modExp = bcExp.getModule(APIModules.EXPERIENCE),
    modCon = bcExp.getModule(APIModules.CONTENT),
    modAuth = bcExp.getModule(APIModules.AUTH);

    //Auth
    modAuth.addEventListener(BCAuthEvent.AUTH_NEEDED, this.onAuthNeeded.bind(this));
    //Changed Media
    modVP.addEventListener(BCMediaEvent.CHANGE, this.onMediaChange.bind(this));
    //Error
    modVP.addEventListener(BCMediaEvent.ERROR, this.onBrightcoveError.bind(this));

    //reference experience for later
    this.video_experience = bcExp;
};

/**
Utility method used to get the Access Enabler from the page

@method getAccessEnabler
@return {Object} Adobe's Access Enabler
**/
BrightcoveAdobePass.prototype.getAccessEnabler = function (){
    return window.ae;
};

/**
Adobe callback to get the selected provider for the user, we do not
need to use this for our reference implementation

@method selectedProvider
**/
BrightcoveAdobePass.prototype.selectedProvider = function (result) {
    if(!this.options.production){
        console.log(result);
    }
};

/**
Adobe callback when you ask for metadata with getMetadata, we aren't
using this for the reference app

@method setMetadataStatus
**/
BrightcoveAdobePass.prototype.setMetadataStatus = function (key, encrypted, data) {
    if(!this.options.production){
        console.log(key, encrypted, data);
    }
};

/**
Method to get the playlist from video cloud. This method gets
two different playlists and merges the video content together and
on completion, calls createThumbnailsForVideos

@method loadPlaylist
**/
BrightcoveAdobePass.prototype.loadPlaylist = function (){

    //pull this out
    var callback = function (x, y){
        var data = x[0].videos;
        $.merge(data, y[0].videos);

        this[0].createThumbnailsForVideos(data);
    };

    $.when(
        $.ajax({
            url:'../get_playlist.php',
            context: this
        }),
        $.ajax({
            url:'../get_playlist_unprotected.php',
            context: this
        })
    ).done(callback);
};

/**
Callback for when the video player errors -

@method onBrightcoveError
**/
BrightcoveAdobePass.prototype.onBrightcoveError = function (error) {
    console.log(error, arguments);
};

/**
Method that takes an array of videos and creates thumbnails in a DOM object
with the id of video_thumbnails.  This method looks to see if the media requires
authorization and puts a lock badge on the thumbnail.  It also sets the id of the
video to the id of the DOM node

@param {Object} videos An array of videos from the Media API
@method createThumbnailsForVideos
**/
BrightcoveAdobePass.prototype.createThumbnailsForVideos = function (videos){
    var thumbnail_holder = $('#video_thumbnails'),

    //reference to this
    self = this;
    $.each(videos, function (index, value){

        var prot,
        li = $('<li />'),
        badge;

        if(this.customFields && this.customFields.protected){
            prot = ("true" === this.customFields.protected);
        }

        //Generate a new list item for the thumbnail
        thumbnail_holder.append(
            li.append(
                $('<div />').addClass('thumbnail').attr('id', this.id).append(
                    $('<img />').attr('src', this.videoStillURL).attr('width', '260px'),
                    $('<h4 />').text(this.name)
                )
            )
        );

        //Click and add a reference to self for the event
        li.on('click', {'self': self} ,self.handleThumbnailClick);

        //Add lock badge
        if(prot){
            badge = $('<span class="badge badge-important tab icon-lock"> </span>');
            $('.thumbnail', li).append(badge);
        }
    });
};

/**
Callback for when a thumbnail is clicked

@param {Object} evt The on click event
@method handleThumbnailClick
**/
BrightcoveAdobePass.prototype.handleThumbnailClick = function (evt){
    var self = evt.data.self,
    target = evt.target,
    id = $(target).attr('id'),
    video_player = self.video_experience.getModule(APIModules.VIDEO_PLAYER);

    if(!id){
        id = $(target.parentElement).attr('id');
    }

    //Thumbnail driven...
    self.options.thumbnail_driven = true;

    video_player.loadVideo(id);
};

/**

**/
BrightcoveAdobePass.prototype._toggleLock = function (lock){
    var lockIcons = $('.badge.icon-lock');
    if(lock){
        lockIcons.removeClass('icon-unlock');
    }else{
        lockIcons.addClass('icon-unlock');
    }
};
/**
Brightcove callback for BrightcoveAdobePass to keep track of what video is
attempted to be played

@param {Object} evt
@method onMediaChange
**/
BrightcoveAdobePass.prototype.onMediaChange = function (evt){
    this.options.selected_video = evt.media.id;
};

/**
To bootstrap the creation of BrightcoveAdobePass

**/
$(document).ready(function(){
    //Set up the options
    var options = {
        'production': true,
        'requestor': 'BRIGHTCOVE',
        'entitlementVideoField': 'protected',
        'loginButtonId': '#login-button'
    },
    //Create a new object
    bcap = new BrightcoveAdobePass(options);

    //Run init and load playlist
    bcap.init();
    bcap.loadPlaylist();
});