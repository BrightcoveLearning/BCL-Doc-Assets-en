/* 
* !html5-sdk v2.0.17.17.0 | client-side HTML5 SDK 2.x
* Copyright (c) 2017 by Ooyala, www.ooyala.com 
* email: info@ooyala.com 
*/ 
(function(window, undefined) {
    'use strict';

    // Core namespace
    var videoplaza = {
    	adrequest: { },
    	adresponse: { },
    	tracking: { }
    };
	
	// Pulse SDK namespace
	var OO;
	if(window.OO) {
		if(window.OO.Pulse) {
		    // If the Pulse SDK is reloaded on the same page (via react or similar),
		    // don't load it again
			return;			
		}

		OO = window.OO;
	} else {
		OO = { };
	}
(function (videoplaza){

    /**
     * The Session is the core object returned when an ad call to Ooyala Pulse has been made.
     * It contains all information needed to display ads and track information back to Ooyala Pulse.
     * @constructor
     */
    videoplaza.adresponse.Session = function() {
        if(!(this instanceof videoplaza.adresponse.Session))
        {
            return new videoplaza.adresponse.Session();
        }

        /**
         * The Ooyala Pulse session id, or ticket id
         * @type {string}
         */
        this.id = "";

        /**
         * Language
         * @type {string}
         */
        this.language = "";

        /**
         * Map of URLs for various tracking events.
         * @type {object}
         */
        this.trackingEvents = {};

        /**
         * List of InsertionPoints in the Session
         * @type {Array}
         */
        this.insertionPoints = [];

        /**
         * True if the session is secure (over HTTPS). HTTP tracking URLs won't be tracked when in secure mode.
         * Can be overridden with the ignoreSecure setting.
         * @type {boolean}
         */
        this.secure = false;

    };

})(videoplaza);
(function (videoplaza){

    /**
     * The InsertionPoint object is the second outmost object carrying returned ads delivered from Ooyala Pulse. It is provided within a Session.
     * @constructor
     */
    videoplaza.adresponse.InsertionPoint = function() {
        if(!(this instanceof videoplaza.adresponse.InsertionPoint))
        {
            return new videoplaza.adresponse.InsertionPoint();
        }

        /**
         * The Session which the InsertionPoint is part of.
         * @type {videoplaza.adresponse.Session}
         *
         * @member parentSession
         * @memberOf videoplaza.adresponse.InsertionPoint
         * @instance
         */
        this.parentSession = null;

        /**
         * List of {@link videoplaza.adresponse.EventCondition}s and/or {@link videoplaza.adresponse.PropertyCondition}s, which are used to determine when to trigger the insertion point.
         * @type {Array}
         *
         * @see videoplaza.adresponse.EventCondition
         * @see videoplaza.adresponse.PropertyCondition
         * @member conditions
         * @memberOf videoplaza.adresponse.InsertionPoint
         * @instance
         */
        this.conditions = [];

        /**
         * List of Slots within the InsertionPoint.
         * @type {Array}
         *
         * @member slots
         * @memberOf videoplaza.adresponse.InsertionPoint
         * @instance
         */
        this.slots = [];
    };

    /**
     * Returns 'true' if one or more ads in this InsertionPoint have to be retrieved on demand using {@link videoplaza.adrequest.AdRequester.requestThirdParty}.
     * @param insertionPoint The InsertionPoint to query.
     *
     * @method isReady
     * @memberOf videoplaza.adresponse.InsertionPoint
     */
    videoplaza.adresponse.InsertionPoint.isReady = function(insertionPoint) {
        var slot;

        // For each slot and each ad:
        for(var i = 0; i < insertionPoint.slots.length; ++i) {
            slot = insertionPoint.slots[i];

            for(var j = 0; j < slot.ads.length; ++j) {
                // .. if any ad is not ready, the InsertionPoint is not ready
                if(!slot.ads[j].ready) {
                    return false;
                }
            }
        }

        // All ads ready; InsertionPoint is ready
        return true;
    };

    /**
     * Calculates the maximum time in seconds (SS.mm) the SDK waits for a 'lazy' InsertionPoint to load (including potential passback candidate requests).
     * @param insertionPoint
     *
     * @method maximumPreparationTime
     * @memberOf videoplaza.adresponse.InsertionPoint
     */
    videoplaza.adresponse.InsertionPoint.maximumPreparationTime = function(insertionPoint) {
        var slot, ad, totalTimeout = 0;

        // For each slot and each ad:
        for(var i = 0; i < insertionPoint.slots.length; ++i) {
            slot = insertionPoint.slots[i];

            for(var j = 0; j < slot.ads.length; ++j) {
                ad = slot.ads[j];

                totalTimeout += ad.maximumPreparationTime;
            }
        }

        return totalTimeout;
    };
})(videoplaza);
(function (videoplaza){

    /**
     * The Slot contains {@link videoplaza.adresponse.Ad} objects delivered from Ooyala Pulse, and is delivered within an {@link videoplaza.adresponse.InsertionPoint} object.
     * @constructor
     */
    videoplaza.adresponse.Slot = function() {
        if(!(this instanceof videoplaza.adresponse.Slot))
        {
            return new videoplaza.adresponse.Slot();
        }

        /**
         * The InsertionPoint of which the Slot is part of.
         * @type {videoplaza.adresponse.InsertionPoint}
         */
        this.parentInsertionPoint = null;

        /**
         * Map of URLs for various tracking events.
         * @type {{}}
         */
        this.trackingEvents = {};

        /**
         * List of Ads within the Slot.
         * @type {videoplaza.adresponse.Ad[]}
         */
        this.ads = [];
    };
})(videoplaza);

(function (videoplaza){

    /**
     * Represents a {@link videoplaza.adresponse.InsertionPoint} trigger condition that is considered true
     * when a certain player event, determined by {@link videoplaza.adresponse.EventCondition.name}, is fired.
     * @constructor
     */
    videoplaza.adresponse.EventCondition = function() {
        if(!(this instanceof videoplaza.adresponse.EventCondition))
        {
            return new videoplaza.adresponse.EventCondition();
        }
        /**
         * The base event or state when this condition should be evaluated.
         * @type {videoplaza.adresponse.EventCondition.ConditionName}
         */
        this.type = undefined;

        /**
         * List of additional conditions which need to be evaluated.
         * Can contain instances of {@link videoplaza.adresponse.EventCondition} and/or {@link videoplaza.adresponse.PropertyCondition}.
         * @type {Array}
         * @see videoplaza.adresponse.EventCondition
         * @see videoplaza.adresponse.PropertyCondition
         */
        this.conditions = [];
    };

    /**
     * Indicates the type of an EventCondition.
     *
     * @enum {string}
     * @memberOf videoplaza.adresponse.EventCondition
     */
    videoplaza.adresponse.EventCondition.ConditionName = {
        /** Condition is only fulfilled immediately when content playback starts. */
        ON_BEFORE_CONTENT: 'onBeforeContent',
        /** Condition is only fulfilled when content playback completes. */
        ON_CONTENT_END: 'onContentEnd',
        /** Condition is only fulfilled when content has been paused. */
        ON_PAUSE: 'onPause'
    };
})(videoplaza);

(function (videoplaza){
    /**
     * Represents a {@link videoplaza.adresponse.InsertionPoint} trigger condition that requires evaluating
     * the session or content playback state against a given property.
     * @constructor
     */
    videoplaza.adresponse.PropertyCondition = function() {
        if(!(this instanceof videoplaza.adresponse.PropertyCondition))
        {
            return new videoplaza.adresponse.PropertyCondition();
        }
        /**
         * The base state when this condition should be evaluated.
         * @type {videoplaza.adresponse.PropertyCondition.ConditionName}
         */
        this.type = undefined;

        /**
         * The comparative operator used when applying this condition.
         * @type {videoplaza.adresponse.PropertyCondition.Operator}
         */
        this.operator = undefined;

        /**
         * The value used when applying this condition.
         * @type {number}
         */
        this.value = undefined;

        /**
         * List of additional conditions which need to be evaluated.
         * Can contain instances of {@link videoplaza.adresponse.EventCondition} and/or {@link videoplaza.adresponse.PropertyCondition}.
         * @type {Array}
         * @see videoplaza.adresponse.EventCondition
         * @see videoplaza.adresponse.PropertyCondition
         */
        this.conditions = [];
    };

    /**
     * Indicates the operator used to evaluate a PropertyCondition's property value.
     *
     * @enum {string}
     * @memberOf videoplaza.adresponse.PropertyCondition
     */
    videoplaza.adresponse.PropertyCondition.Operator = {
        EQ: 'eq',
        GEQ: 'geq'
    };

    /**
     * Indicates the type of a PropertyCondition.
     *
     * @enum {string}
     * @memberOf videoplaza.adresponse.PropertyCondition
     */
    videoplaza.adresponse.PropertyCondition.ConditionName = {
        /** Condition is only fulfilled if a certain playback position has been reached, specified in seconds by the Condition's value field. */
        PLAYBACK_POSITION: 'playbackPosition',
        /** Condition is only fulfilled if a previous linear ad ended playback a certain amount of time ago, specified in seconds by the Condition's value field. */
        TIME_SINCE_LINEAR: 'timeSinceLinear',
        /** Condition is only fulfilled if content has played for a total amount of time, regardless of position, specified in seconds by the Condition's value field. */
        PLAYBACK_TIME: 'playbackTime'
    };
})(videoplaza);
(function (videoplaza){
    /**
     * A companion is used to represent additional banner ads that display along with a main ad.
     * @constructor
     */
    videoplaza.adresponse.Companion = function() {
        if(!(this instanceof videoplaza.adresponse.Companion))
        {
            return new videoplaza.adresponse.Companion();
        }

        /**
         * The companion ad id assigned by Ooyala Pulse.
         * @type {string}
         *
         * @member id
         * @memberof videoplaza.adresponse.Companion
         * @instance
         */
	    this.id = '';

        /**
         * The custom companion ad id set in the Ooyala Pulse UI.
         * @type {string}
         *
         * @member customId
         * @memberof videoplaza.adresponse.Companion
         * @instance
         */	    
	    this.customId = '';

        /**
         * The Ad the Companion is to be shown along with.
         * @type {videoplaza.adresponse.Ad}
         *
         * @member parentAd
         * @memberOf videoplaza.adresponse.Companion
         * @instance
         */
	    this.parentAd = null;

        /**
         * The order in which the Companion is to be displayed. If Companions have the same sequence number, they should be displayed at the same time.
         * @type {number}
         *
         * @member sequence
         * @memberOf videoplaza.adresponse.Companion
         * @instance
         */
        this.sequence = 0;

        /**
         * Width of the companion's display area in pixels.
         *
         * @member width
         * @memberof videoplaza.adresponse.Companion
         * @instance
         * @type {number}
         */
        this.width = 0;

        /**
         * Height of the companion's display area in pixels.
         *
         * @member height
         * @memberof videoplaza.adresponse.Companion
         * @instance
         * @type {number}
         */
        this.height = 0;
        
        /**
         * Map of URLs for various tracking events.
         * @type {object}
		 *
		 * @member trackingEvents
		 * @memberOf videoplaza.adresponse.Companion
		 * @instance
         */	 
	    this.trackingEvents = {};
	 
	 	/**
	 	 * The resources used to display the companion ad. If this array contains multiple resources, the video player
         * should determine the most appropriate type to display. The resources can be any of the following types:
         * {@link videoplaza.adresponse.IFrameResource}, {@link videoplaza.adresponse.HtmlResource}, {@link videoplaza.adresponse.StaticResource}.
	 	 * @type {Array}
	 	 *
	 	 * @member resources
	 	 * @memberOf videoplaza.adresponse.Companion
	 	 * @instance
	 	 */
	    this.resources = [];

        /**
         * Determines whether this companion is required to be displayed along with its parentAd or not.
         * @see {videoplaza.adresponse.Companion.RequiredRule}
         * @type {videoplaza.adresponse.Companion.RequiredRule}
         */
        this.required = videoplaza.adresponse.Companion.RequiredRule.NO;

	 	/**
	 	 * The placement zone ID of the companion set in the Ooyala Pulse UI.
	 	 * @type {string}
	 	 *
	 	 * @member zone
	 	 * @memberOf videoplaza.adresponse.Companion
	 	 * @instance
	 	 */	    
	    this.zone = '';
    };

    /**
     * Used to determine whether all, at least one or none of the Companions with the same
     * sequence number need to be displayed successfully for their parentAd to not be failed.
     *
     * @enum {string}
     * @memberOf videoplaza.adresponse.Companion
     */
    videoplaza.adresponse.Companion.RequiredRule = {
        /** Indicates that the parentAd must be failed if this Companion is not successfully displayed. */
        YES: "yes",
        /** Indicates that the parentAd must be failed if not at least one of its Companions, sharing the same sequence number as this one, is successfully displayed. */
        AT_LEAST_ONE_FOR_THIS_SEQUENCE: "atLeastOne",
        /** Indicates that this Companion is not required to be displayed along with the parentAd. */
        NO: "no"
    };    
})(videoplaza);
(function (videoplaza){


    /**
     * Ad is a representation of an ad. Do not construct: instances are created internally.
     * @constructor
     */
    videoplaza.adresponse.Ad = function() {
        if(!(this instanceof videoplaza.adresponse.Ad))
        {
            return new videoplaza.adresponse.Ad();
        }
        
        /**
         * The ad id assigned by Ooyala Pulse.
         * @type {string}
         */
        this.id = "";

        /**
         * The title of the ad.
         * @type {string}
         */
        this.title = '';

        /**
         * The description of the ad.
         * @type {string}
         */
        this.description = '';

        /**
         * The advertiser of the ad.
         * @type {string}
         */
        this.advertiser = '';

        /**
         * The custom ad id set in the Ooyala Pulse UI.
         * @type {string}
         */
        this.customId = "";

        /**
         * The id of the goal to which the ad belongs; supplied by Ooyala Pulse.
         * @type {string}
         */
        this.goalId = "";

        /**
         * The custom id of the goal to which the ad belongs; set in the Ooyala Pulse UI.
         * @type {string}
         */
        this.customGoalId = "";

        /**
         * The id of the campaign to which the ad belongs; supplied by Ooyala Pulse.
         * @type {string}
         */
        this.campaignId = "";

        /**
         * The custom id of the campaign to which the ad belongs; set in the Ooyala Pulse UI.
         * @type {string}
         */
        this.customCampaignId = ""; // Ooyala Pulse's custom campaign id.

        /**
         * The Slot which the Ad belongs to.
         * See {@link videoplaza.adresponse.Slot}
         * @type {{}}
         */
        this.parentSlot = null;

        /**
         * Whether or not the ad can change linearity or not.
         * @type {boolean}
         */
        this.allowLinearityToChange = false;

        /**
         * Whether or not the ad is part of an exclusive campaign.
         * @type {boolean}
         */
        this.partOfAnExclusiveCampaign = false;

        /**
         * The sequence number of the ad.
         * @type {number}
         */
        //this.sequence = 0;
        // Not currently provided by Ooyala Pulse

        /**
         * Whether or not to display a remaining time countdown when this ad is being displayed.
         * @type {boolean}
         */
        this.showCountdown = false;

        /**
         * The format of the ad. An unloaded ('lazy') ad will have this field undefined.
         * @type {videoplaza.adresponse.Ad.AdType}
         */
        this.type = undefined;

        /**
         * The variant of the Ad.
         * @type {videoplaza.adresponse.Ad.Variant}
         */
        this.variant = undefined;

        /**
         * The maximum time in seconds the SDK waits for a 'lazy' ad to load (including potential passback candidate requests).
         * @type {number}
         */
        this.maximumPreparationTime = 0;

        /**
         * The maximum time in seconds the video player should wait for an ad to show (including potential passback candidate requests).
         * @type {number}
         */
        this.startTimeout = 0;

        /**
         * URL to the 3rd party ad source from where the ad will be requested. In VAST this is referred to as a wrapper url.
         * @type {string}
         */
        this.thirdPartyURL = "";

        /**
         * List of wrapper URLs that were requested from third parties, if any, before receiving a valid ad response.
         * @type {string[]}
         */
        this.thirdPartyChain = [];

        /**
         * Survey URI from the VAST Ad (if any).
         * @type {string}
         */
        this.survey = "";

        /**
         * Map of URLs for various tracking events.
         * @type {object}
         */
        this.trackingEvents = {};

        /**
         * List of linear creatives contained in the ad.
         * @type {videoplaza.adresponse.LinearCreative[]}
         */
        this.creatives = [];

        /**
         * List of Companions in the ad.
         * @type {Array}
         */
        this.companions = [];

        /**
         * List of Ads. Used for nested ads found in the Selector Ad format, or in Passback Ads where every ad candidate is listed.
         * @type {videoplaza.adresponse.Ad[]}
         */
        this.ads = [];

        /**
         * If true, this ad is ready to be displayed. If false, it needs to be retrieved on demand using {@link videoplaza.adrequest.AdRequester.requestThirdParty}.
         * @type {boolean}
         */
        this.ready = false;

        /**
         * Stores ad labels, such as overlay captions and the like.
         * @type {object}
         */
        this.labels = {};

        /**
         * Specifies whether or not an ad unit is marked as conditional, meaning it cannot be guaranteed to result in ad playback. If null, it means the conditional state if the ad is unknown.
         * @type {boolean}
         */
        this.conditional = null;

        /**
         * Contains information on ad categories.
         * @type {videoplaza.adresponse.Ad.AdCategory[]}
         */        
        this.categories = [ ];

        /**
         * Contains information from any ad verification elements provided by a third party.
         * @type {videoplaza.adresponse.Ad.AdVerification[]}
         */
        this.verifications = [ ];

        /**
         * The pricing information in the ad, if any.
         * @type {videoplaza.adresponse.Ad.AdPricing}
         */
        this.pricing = null;        
    };

    /**
     * Helper function that returns 'true' if this (3rd party) Ad has passback ad sources.
     * @param ad
     */
    videoplaza.adresponse.Ad.hasPassback = function(ad) {
        return (ad.ready && ad.type !== videoplaza.adresponse.Ad.AdType.SPOT_SELECTOR && ad.ads.length > 0);
    };

    /**
     * Indicates the type or format of an Ad.
     *
     * @enum {string}
     * @memberOf videoplaza.adresponse.Ad
     */
    videoplaza.adresponse.Ad.AdType = {
        INVENTORY: "inventory",
        SPOT_STANDARD: "spot_standard",
        SPOT_INTERACTIVE: "spot_interactive",
        SPOT_SELECTOR: "spot_selector",
        SPOT_TAKEOVER: "spot_takeover",
        OVERLAY_STANDARD: "overlay_standard",
        OVERLAY_VIDEO: "overlay_video",
        OVERLAY_IMAGESET: "overlay_imageset",
        OVERLAY_SPLASH: "overlay_splash",
        SPLASH_STANDARD: "splash_standard",
        SKIN_INSKIN: "skin_inskin"
    };

    /**
     * Indicates the variant of an ad.
     *
     * @enum {string}
     * @memberOf videoplaza.adresponse.Ad
     */
    videoplaza.adresponse.Ad.Variant = {
        NORMAL: 'normal',
        SPONSOR: 'sponsor'
    };


    /**
     * @typedef AdCategory
     * @type {object}
     * @memberOf videoplaza.adresponse.Ad

     * @property {string} label The ad category label or code.
     * @property {string} authority The organizational authority responsible for the ad categorization relevant to this category.
     */

    /**
     * @typedef AdVerification
     * @type {object}
     * @memberOf videoplaza.adresponse.Ad

     * @property {string} javascriptResource A URL to a Javascript-based ad verification unit.
     * @property {string} javascriptResourceAPIFramework The API framework with which the Javascript resource is implemented.
     * @property {string} flashResource A URL to a Flash-based ad verification unit.
     * @property {string} flashResourceAPIFramework The API framework with which the Flash resource is implemented
     */

    /**
     * @typedef AdPricing
     * @type {object}
     * @memberOf videoplaza.adresponse.Ad

     * @property {string} model The pricing model used by this ad.
     * @property {string} currency The currency used by this ad, in ISO-4217 format.
     * @property {number} value The pricing of this ad.
     */
})(videoplaza);
(function (videoplaza){
    /**
     * Represents a linear creative, or a linear visual element of an ad, which always interrupts or pauses the main content
     * while the ad is displayed.
     * @constructor
     */
    videoplaza.adresponse.LinearCreative = (function() {
        var LinearCreative = function(){
            if(!(this instanceof videoplaza.adresponse.LinearCreative))
            {
                return new videoplaza.adresponse.LinearCreative();
            }

            /**
             * The Ad the LinearCreative is a part of.
             * @type {videoplaza.adresponse.Ad}
             *
             * @member parentAd
             * @memberof videoplaza.adresponse.LinearCreative
             * @instance
             */
            this.parentAd = null;

            /**
             * The clickthrough URL for the creative, set in Ooyala Pulse.
             * @type {string}
             *
             * @member clickThroughUrl
             * @memberof videoplaza.adresponse.LinearCreative
             * @instance
             */
            this.clickThroughUrl = '';

            /**
             * The duration of the creative in seconds. In some cases, third parties might
             * supply tickets containing empty durations; in such cases, this field will be undefined.
             * @type {number}
             *
             * @member duration
             * @memberof videoplaza.adresponse.LinearCreative
             * @instance
             * @optional
             */
            this.duration = undefined;

            /**
             * The order in which the creative is to be displayed. If creatives have the same sequence number,
             * they should be displayed at the same time.
             * @type {number}
             *
             * @memberof videoplaza.adresponse.LinearCreative
             * @member sequence
             * @instance
             */
            this.sequence = 0;

            /**
             * The type of the creative.
             * @type {string}
             * @member type
             * @memberof videoplaza.adresponse.LinearCreative
             * @instance
             */
            this.type = '';

            /**
             * Object/map where each property/key is an event with a list of tracking URLs as it value.
             * @type {object}
             * @member trackingEvents
             * @memberof videoplaza.adresponse.LinearCreative
             * @instance
             */
            this.trackingEvents = {};

            /**
             * The time an ad must play before a skip button can be presented to the viewer.
             * <p><ul>
             * <li>If value is a number: time in seconds from the start of playback before the skip button can be shown.</li>
             * <li>If value is a string: textual representation of a percentage of the creative which must be played
             * before the skip button can be shown.</li>
             * </ul><p>
             * <p>
             * Additionally, the value of {@link videoplaza.adresponse.LinearCreative.skipButtonMode} must be taken into account.
             * </p>
             * @see videoplaza.adresponse.LinearCreative.skipButtonMode
             * @see videoplaza.adresponse.LinearCreative.duration
             *
             * @type {(number|string)}
             *
             * @member skipOffset
             * @memberof videoplaza.adresponse.LinearCreative
             * @instance
             * @optional
             */
            this.skipOffset = undefined;

            /**
             * Determines when a skip button should be shown for this ad; set in Ooyala Pulse.
             * @type {videoplaza.adresponse.LinearCreative.SkipButtonMode}
             * @member skipButtonMode
             * @memberof videoplaza.adresponse.LinearCreative
             * @instance
             * @optional
             */
            this.skipButtonMode = undefined;

            /**
             * The last time this LinearCreative was played to completion.
             * If this has never happened, lastCompletion will be undefined.
             *
             * @member lastCompletion
             * @memberof videoplaza.adresponse.LinearCreative
             * @type {Date}
             * @instance
             * @optional
             */
            this.lastCompletion = undefined;

            /**
             * Time in seconds how old a LinearCreative.lastCompletion can be before it is ignored.
             * @member skipResetTime
             * @memberof videoplaza.adresponse.LinearCreative
             * @type {number}
             * @optional
             * @instance
             */
            this.skipResetTime = undefined;

            /**
             * List of {@link videoplaza.adresponse.MediaFile}s which belong to this creative.
             * @type {videoplaza.adresponse.MediaFile[]}
             * @see videoplaza.adresponse.MediaFile
             * @member mediaFiles
             * @memberof videoplaza.adresponse.LinearCreative
             * @instance
             */
            this.mediaFiles = [];

            /**
             * Ad parameters which should be passed into an executable ad, such as VPAID, if present.
             * For more information on how to pass the ad parameters to a VPAID ad, refer to [the VPAID specification]{@link http://www.iab.net/media/file/VPAID_2.0_Final_04-10-2012.pdf}
             *
             * @type {string}
             * @member adParameters
             * @memberOf videoplaza.adresponse.LinearCreative
             * @instance
             */
            this.adParameters = '';

            /**
             * Contains information used to uniquely identify a creative across ad systems.
             * 
             * @type {videoplaza.adresponse.LinearCreative.UniversalAdId}
             * @member universalAdId
             * @memberOf videoplaza.adresponse.LinearCreative
             * @instance
             */
            this.universalAdId = null;            
        };

        /**
         * @typedef UniversalAdId
         * @type {object}
         * @memberOf videoplaza.adresponse.LinearCreative

         * @property {string} identifier The universal ad id for this creative.
         * @property {string} registry A URL for the registry in which the universal ad id is registered.
         */

        return LinearCreative;
    })();

    /**
     * Determines when to show a skip button for a linear creative.
     *
     * @enum {string}
     * @memberOf videoplaza.adresponse.LinearCreative
     */
    videoplaza.adresponse.LinearCreative.SkipButtonMode = {
        /** Always show skip button. */
        ALWAYS: 'always',
        /** Never show skip button. */
        NEVER: 'never',
        /** Show skip button if creative has previously been viewed to completion. */
        AFTER_FIRST_COMPLETION: 'after_first_completion'
    };
})(videoplaza);
(function (videoplaza){
    /**
     * Represents a nonlinear creative, or a nonlinear visual element of an ad, which does not interrupt or pause the main content
     * while the ad is displayed.
     * @constructor
     */
    videoplaza.adresponse.NonLinearCreative = (function() {
        var NonLinearCreative = function(){
            if(!(this instanceof videoplaza.adresponse.NonLinearCreative))
            {
                return new videoplaza.adresponse.NonLinearCreative();
            }

            /**
             * The Ad the LinearCreative is a part of.
             * @type {videoplaza.adresponse.Ad}
             *
             * @member parentAd
             * @memberof videoplaza.adresponse.NonLinearCreative
             * @instance
             */
            this.parentAd = null;

            /**
             * The duration of the creative in seconds.
             * @type {number}
             *
             * @member duration
             * @memberof videoplaza.adresponse.NonLinearCreative
             * @instance
             * @optional
             */
            this.duration = undefined;

            /**
             * The order in which the creative is to be displayed. If creatives have the same sequence number,
             * they should be displayed at the same time.
             * @type {number}
             *
             * @memberof videoplaza.adresponse.NonLinearCreative
             * @member sequence
             * @instance
             */
            this.sequence = 0;

            /**
             * Width of the nonlinear creative's display area in pixels.
             *
             * @member width
             * @memberof videoplaza.adresponse.NonLinearCreative
             * @instance
             * @type {number}
             */
            this.width = 0;

            /**
             * Height of the nonlinear creative's display area in pixels.
             *
             * @member height
             * @memberof videoplaza.adresponse.NonLinearCreative
             * @instance
             * @type {number}
             */
            this.height = 0;

            /**
             * The type of the creative.
             * @type {string}
             * @member type
             * @memberof videoplaza.adresponse.NonLinearCreative
             * @instance
             */
            this.type = '';

            /**
             * Object/map where each property/key is an event with a list of tracking URLs as it value.
             * @type {object}
             * @member trackingEvents
             * @memberof videoplaza.adresponse.NonLinearCreative
             * @instance
             */
            this.trackingEvents = {};

            /**
             * The resources used to display the nonlinear creative. If this array contains multiple resources, the video player
             * should determine the most appropriate type to display. The resources can be any of the following types:
             * {@link videoplaza.adresponse.IFrameResource}, {@link videoplaza.adresponse.HtmlResource}, {@link videoplaza.adresponse.StaticResource}.
             * @type {Array}
             *
             * @member resources
             * @memberOf videoplaza.adresponse.NonLinearCreative
             * @instance
             */
            this.resources = [];

        };

        return NonLinearCreative;
    })();

})(videoplaza);
(function (videoplaza){


    /**
     * Represents a resource file used to display a linear creative.
     * @class MediaFile
     * @memberOf videoplaza.adresponse
     */
    videoplaza.adresponse.MediaFile = function() {
        if(!(this instanceof videoplaza.adresponse.MediaFile))
        {
            return new videoplaza.adresponse.MediaFile();
        }

        /**
         * String value indicating the the API needed to execute the file.
         * @type {videoplaza.adresponse.MediaFile.ApiFramework}
         */
        this.apiFramework = undefined;

        /**
         * Ad parameters should, when they exist, be sent to the (executable) asset, but they are only sent if the API framework property identifies a
         * framework that is recognized as one that receives ad parameters.
         * The most common case is when the MediaFile represents a <a href="http://www.iab.net/vpaid">VPAID</a> (API framework is set to {@link videoplaza.adresponse.MediaFile.ApiFramework.VPAID}).
         * @type {string}
         *
         */
        this.adParameters = undefined;

        /**
         * The bitrate of the media file.
         * @type {number}
         */
        this.bitRate = 0;

        /**
         * Delivery method of the asset.
         * @type {videoplaza.adresponse.MediaFile.DeliveryMethod}
         */
        this.deliveryMethod = undefined;

        /**
         * Height of the asset in pixels.
         * @type {number}
         */
        this.height = 0;

        /**
         * Asset mime type.
         * @type {string}
         */
        this.mimeType = "";

        /**
         * Width of the asset in pixels.
         * @type {number}
         */
        this.width = 0;

        /**
         * URL to mediaFile.
         * @type {string}
         */
        this.url = "";
    };

    /**
     * Indicates the delivery method of a given media file.
     *
     * @enum {string}
     * @memberOf videoplaza.adresponse.MediaFile
     */
    videoplaza.adresponse.MediaFile.DeliveryMethod = {
        PROGRESSIVE: 'progressive',
        STREAMING: 'streaming'
    };

    /**
     * Indicates the API framework required to display a given MediaFile.
     *
     * @enum {string}
     * @memberOf videoplaza.adresponse.MediaFile
     */
    videoplaza.adresponse.MediaFile.ApiFramework = {
        VPAID: 'VPAID'
    };
})(videoplaza);
(function (videoplaza){
    /**
     * A resource containing HTML code, used by {@link videoplaza.adresponse.Companion}.
     * @constructor
     */
    videoplaza.adresponse.HtmlResource = function() {
        /**
         * The HTML code to render when the companion is displayed.
         * @type {string}
         *
         * @member source
         * @memberof videoplaza.adresponse.HtmlResource
         * @instance
         */     
        this.source = '';
    };
})(videoplaza);
(function (videoplaza){
	/**
     * A resource used by {@link videoplaza.adresponse.Companion} to be displayed within an IFrame.
     * @constructor
     */
	videoplaza.adresponse.IFrameResource = function() {
        /**
         * The URL of the resource that should be loaded within the IFrame.
         * @type {string}
         *
         * @member url
         * @memberof videoplaza.adresponse.IFrameResource
         * @instance
         */		
	    this.url = '';
	};
})(videoplaza);
(function (videoplaza){
    /**
     * A static resource, such as an image or Flash banner, used by {@link videoplaza.adresponse.Companion}.
     * @constructor
     */

    videoplaza.adresponse.StaticResource = function() {
        /**
         * Any information that is to be sent into the ad unit if it is of an executable type.
         * @type {string}
         *
         * @member adParameters
         * @memberof videoplaza.adresponse.StaticResource
         * @instance
         * @optional
         */
        this.adParameters = undefined;

        /**
         * Indicates whether or not the adParameters field contains XML-encoded data.
         * @type {boolean}
         *
         * @member adParametersXmlEncoded
         * @memberof videoplaza.adresponse.StaticResource
         * @instance
         * @optional
         */
        this.adParametersXmlEncoded = undefined;

        /**
         * Indicates the framework needed, if any, to display an executable asset.
         * @type {videoplaza.adresponse.StaticResource.ApiFramework}
         *
         * @member apiFramework
         * @memberof videoplaza.adresponse.StaticResource
         * @instance
         * @optional
         */
        this.apiFramework = undefined;

        /**
         * Width of the static asset in pixels.
         *
         * @member assetWidth
         * @memberof videoplaza.adresponse.StaticResource
         * @instance
         * @optional
         * @type {number}
         */
        this.assetWidth = undefined;

        /**
         * Height of the static asset in pixels.
         *
         * @member assetHeight
         * @memberof videoplaza.adresponse.StaticResource
         * @instance
         * @optional
         * @type {number}
         */
        this.assetHeight = undefined;

        /**
         * Width of the parent companion's display area when expanded, in pixels.
         *
         * @member expandedWidth
         * @memberof videoplaza.adresponse.StaticResource
         * @instance
         * @optional
         * @type {number}
         */
        this.expandedWidth = undefined;

        /**
         * Height of the parent companion's display area when expanded, in pixels.
         *
         * @member expandedHeight
         * @memberof videoplaza.adresponse.StaticResource
         * @instance
         * @optional
         * @type {number}
         */
        this.expandedHeight = undefined;

        /**
         * A URL of a page which should be opened when the user clicks a companion displaying the static resource.
         * @type {string}
         *
         * @member clickThroughUrl
         * @memberof videoplaza.adresponse.StaticResource
         * @optional
         * @instance
         */
        this.clickThroughUrl = undefined;
        
        /**
         * Asset MIME type. Equal to creativeType in the VAST 3.0 spec.
         * Possible values are: image/gif, image/jpeg, image/png, application/x-javascript, application/x-shockwave-flash
         * @type {string}
         * 
         * @member mimeType
         * @memberof videoplaza.adresponse.StaticResource
         * @optional
         * @instance
         */
        this.mimeType = undefined;

        /**
         * The URL of the asset to display.
         * @type {string}
         *
         * @member url
         * @memberof videoplaza.adresponse.StaticResource
         * @instance
         */
        this.url = '';
    };

    /**
     * Indicates the API framework required to display a given StaticResource.
     *
     * @enum {string}
     * @memberOf videoplaza.adresponse.StaticResource
     */
    videoplaza.adresponse.StaticResource.ApiFramework = {
        /** The resource is a VPAID ad. */
        VPAID: 'VPAID',
        /** The resource is a clickTAG ad. */
        CLICK_TAG: 'clickTAG'
    };
})(videoplaza);
(function(videoplaza) {
    videoplaza.adrequest.URLBuilder = (function() {
    	/*
    		static functions
    	*/

        function getVersion(requestSettings) {
            if(requestSettings && requestSettings.hasOwnProperty('callerVersion')) {
                return requestSettings.callerVersion;
            }

            return 'h5_'+ window.videoplaza.versionNumber;
        }

        function createAdSourceUrl(vpHost, adRequesterSettings, contentMetadata, requestSettings, log){


            try{
                validateContentMetadata(contentMetadata);
                validateRequestSettings(requestSettings);
            }catch(e)
            {
                throw e;
            }

            var uri = vpHost;

            if (uri.indexOf('http://') === -1 && uri.indexOf('https://') === -1) {
                uri = 'http://' + uri;
            }

            if (uri.lastIndexOf('/') !== uri.length - 1) {
                uri += '/';
            }

            uri += 'proxy/distributor/v2?';
            uri += 'rt=vp_3.0';
            uri += '&pf=html5';
            uri += '&cv=' + getVersion(requestSettings);

            if (contentMetadata) {
                //start contentMestadata stuff
                if (contentMetadata.hasOwnProperty('flags') && contentMetadata.flags.length > 0) {
                    uri += '&f=' + encodeURIComponent(contentMetadata.flags.join(','));
                }

                if (contentMetadata.hasOwnProperty('tags') && contentMetadata.tags.length > 0) {
                    uri += '&t=' + encodeURIComponent(contentMetadata.tags.join(','));
                }

                //start shares stuff
                var shares = '';
                if (contentMetadata.hasOwnProperty('category') && contentMetadata.category.length > 0) {
                    shares += contentMetadata.category;
                }
                if (contentMetadata.hasOwnProperty('contentPartner') && contentMetadata.contentPartner) {
                    shares = (shares) ? shares += ',' + contentMetadata.contentPartner : contentMetadata.contentPartner;
                }
                if (shares) {
                    uri += '&s=' + encodeURIComponent(shares);
                }
                //end shares stuff

                if (contentMetadata.hasOwnProperty('contentForm') && contentMetadata.contentForm) {

                    uri += '&cf=' + translateContentForm(contentMetadata.contentForm);
                }

                if (contentMetadata.hasOwnProperty('id') && contentMetadata.id) {
                    uri += '&ci=' + encodeURIComponent(contentMetadata.id);
                }

                // TODO: Default value for duration is zero. In case user sends Zero or doesn't set the optionaly parameter we will not send the duration in the request. Check with product !!
                if (contentMetadata.hasOwnProperty('duration') && contentMetadata.duration) {
                    uri += '&cd=' + contentMetadata.duration;
                }

                if (contentMetadata.hasOwnProperty('customParameters') && Object.keys(contentMetadata.customParameters).length > 0) {

//				ALLOWED KEY CHARACTERS:
//				abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_~-.
                    var regex = /[^A-Za-z0-9_~\-.]/; //Finds not allowed characters

                    for (var key in contentMetadata.customParameters) {
                        if (contentMetadata.customParameters.hasOwnProperty(key) && !regex.test(key)) {
                            uri += '&cp.' + key + '=' + encodeURIComponent(contentMetadata.customParameters[key]);
                        }
                    }
                }

                if(contentMetadata.hasOwnProperty('contentProviderInformation') && contentMetadata.contentProviderInformation) {
                    var contentProviderInformation = contentMetadata.contentProviderInformation;

                    if(contentProviderInformation.pcode) {
                        uri += '&opc=' + contentProviderInformation.pcode;
                    }

                    if(contentProviderInformation.embedCode) {
                        uri += '&oec=' + contentProviderInformation.embedCode;
                    }
                }
            }
            
            //end contentMetadata Stuff

            if (requestSettings) {

                // TODO: Check with product the behavior when Width is ZERO
                if (requestSettings.hasOwnProperty('width') && requestSettings.width) {
                    uri += '&vwt=' + requestSettings.width;
                }
                //pulse-preview / vp-preview
                if (requestSettings.hasOwnProperty('pulse_preview') && requestSettings.pulse_preview) {
                    uri += '&vppreview=' + requestSettings.pulse_preview;
                }

                // TODO: Check with product the behavior when Height is ZERO
                if (requestSettings.hasOwnProperty('height') && requestSettings.height) {
                    uri += '&vht=' + requestSettings.height;
                }

                if (requestSettings.hasOwnProperty('maxBitRate') && requestSettings.maxBitRate) {
                    uri += '&vbw=' + requestSettings.maxBitRate;
                }

                if (requestSettings.hasOwnProperty('linearSlotSize') && requestSettings.linearSlotSize) {
                    uri += '&pp=' + requestSettings.linearSlotSize;
                    uri += '&mp=' + requestSettings.linearSlotSize;
                    uri += '&pop=' + requestSettings.linearSlotSize;
                }

                var hasPlaybackPosition = false,
                    requestSkin = false;

                if (requestSettings.hasOwnProperty('insertionPointFilter') && requestSettings.insertionPointFilter.length > 0) {
                    var ticketTypes = [];

                    for(var i = 0; i < requestSettings.insertionPointFilter.length; i++)
                    {
                        try {
                            ticketTypes.push(translateInsertionPointType(requestSettings.insertionPointFilter[i]));

                            if(requestSettings.insertionPointFilter[i] === videoplaza.adrequest.AdRequester.InsertionPointType.PLAYBACK_POSITION) {
                                hasPlaybackPosition = true;

                                if(requestSettings.hasOwnProperty('linearPlaybackPositions') && requestSettings.linearPlaybackPositions.length > 0) {
                                    requestSkin = true;
                                }

                                // Position-based overlays
                                if(requestSettings.hasOwnProperty('nonlinearPlaybackPositions') && requestSettings.nonlinearPlaybackPositions.length > 0) {
                                    ticketTypes.push('o');
                                }
                            } else if(requestSettings.insertionPointFilter[i] === videoplaza.adrequest.AdRequester.InsertionPointType.ON_BEFORE_CONTENT) {
                                requestSkin = true;
                            }
                        } catch(e) { /* Don't request unknown insertion points */ }
                    }

                    // Skin
                    if(requestSkin) {
                        ticketTypes.push('s');
                    }

                    // Remove duplicate insertion points
                    ticketTypes = ticketTypes.filter(function (v, i, a) { return (a.indexOf(v) == i); });

                    uri += '&tt=' + ticketTypes.join(',');
                } else {
                    hasPlaybackPosition = true;
                }


                // Playback positions
                if (hasPlaybackPosition) {
                    if(requestSettings.hasOwnProperty('linearPlaybackPositions') &&  requestSettings.linearPlaybackPositions.length > 0) {
                        uri += '&bp=' + encodeURIComponent(requestSettings.linearPlaybackPositions.join(","));
                    }

                    if(requestSettings.hasOwnProperty('nonlinearPlaybackPositions') &&  requestSettings.nonlinearPlaybackPositions.length > 0) {
                        uri += '&obp=' + encodeURIComponent(requestSettings.nonlinearPlaybackPositions.join(","));
                    }
                }
                
                if (!hasPlaybackPosition && requestSettings.hasOwnProperty('linearPlaybackPositions') &&  requestSettings.linearPlaybackPositions.length > 0){
                    var sessionInfo = new videoplaza.LogItem();
                    sessionInfo.message = "linearPlaybackPositions provided, but insertionPointFilter excludes PLAYBACK_POSITION. No linear insertion points will be requested for the given playback positions.";
                    sessionInfo.source = videoplaza.LogItem.SourceType.SESSION;
                    sessionInfo.event = videoplaza.LogItem.EventType.WARNING;
                    log(sessionInfo);
                }
                
                if (!hasPlaybackPosition && requestSettings.hasOwnProperty('nonlinearPlaybackPositions') &&  requestSettings.nonlinearPlaybackPositions.length > 0){
                    var sessionInfo = new videoplaza.LogItem();
                    sessionInfo.message = "nonlinearPlaybackPositions provided, but insertionPointFilter excludes PLAYBACK_POSITION. No nonlinear insertion points will be requested for the given playback positions.";
                    sessionInfo.source = videoplaza.LogItem.SourceType.SESSION;
                    sessionInfo.event = videoplaza.LogItem.EventType.WARNING;
                    log(sessionInfo);
                }

                if (requestSettings.hasOwnProperty('referrerUrl') && requestSettings.referrerUrl) {
                    uri += '&ru=' + encodeURIComponent(requestSettings.referrerUrl);
                }

                if (requestSettings.hasOwnProperty('maxLinearBreakDuration') && requestSettings.maxLinearBreakDuration) {
                    uri += '&tbbl=' + requestSettings.maxLinearBreakDuration;
                }

                if(requestSettings.hasOwnProperty('forceSiteId') && requestSettings.forceSiteId) {
                    uri += '&sid=' + requestSettings.forceSiteId;
                }
            }

            //end requestSettings stuff

            if (adRequesterSettings && adRequesterSettings.hasOwnProperty('deviceContainer') && adRequesterSettings.deviceContainer) {
                uri += '&dcid=' + encodeURIComponent(adRequesterSettings.deviceContainer );
            }

            if (adRequesterSettings && adRequesterSettings.hasOwnProperty('persistentId') && adRequesterSettings.persistentId ) {
                uri += '&pid=' + encodeURIComponent(adRequesterSettings.persistentId);
            }

            var vppreview = getURLParameter('vppreview');

            if (vppreview) {
                uri += '&vppreview=' + vppreview;
            }

            uri += '&xpb=1';
            // temp disable
            // uri += '&xsat=1';
            uri += '&st=20:1';
            uri += '&rnd=' + Math.floor(Math.random()*10000000000000000);

            return uri;
        }


        // ************************   STATIC FUNCTIONS  ************************
        
        //CONTENTMETADATA VALIDATION
        function validateContentMetadata(contentMetadata) {

            // Deep copy the object and pass it in return.

            var vContentMetadata = {
                id: "",
                category: "",
                contentForm: "",
                contentPartner: "",
                duration: 0,
                flags: [],
                tags: [],

                customParameters: {}
            };

            if(contentMetadata){

                // ID Validation
                if(contentMetadata.hasOwnProperty('id') ){

                    if(typeof(contentMetadata.id) === "string")
                    {
                        if( contentMetadata.id  ) {
                            vContentMetadata.id = contentMetadata.id;
                        }
                    }else{
                        throw new Error("InvalidType of contentMetadata.id, should be string but is " + typeof(contentMetadata.id));
                    }
                }

                //Category Validation
                if(contentMetadata.hasOwnProperty('category') && contentMetadata.category){

                    if(typeof(contentMetadata.category) === "string")
                    {
                        vContentMetadata.category = contentMetadata.category;
                    }else{
                        throw new Error("InvalidType of property contentMetadata.category, should be string but is " + typeof(contentMetadata.category));
                    }

                }

                //Content Form
                if(contentMetadata.hasOwnProperty('contentForm')) {
                    if(typeof(contentMetadata.contentForm) === "string"){
                        if (contentMetadata.contentForm === videoplaza.adrequest.AdRequester.ContentForm.SHORT_FORM || contentMetadata.contentForm === videoplaza.adrequest.AdRequester.ContentForm.LONG_FORM){
                            vContentMetadata.contentForm = contentMetadata.contentForm;
                        }else {
                            throw new Error("Invalid contentMetadata.contentForm Value");
                        }
                    }else{
                        throw new Error("InvalidType of property contentMetadata.contentForm, should be string but is " + typeof(contentMetadata.contentForm));
                    }
                }

                //ContentPartner Validation
                if(contentMetadata.hasOwnProperty('contentPartner') && contentMetadata.contentPartner){

                    if(typeof(contentMetadata.contentPartner) === "string")
                    {
                        vContentMetadata.contentPartner = contentMetadata.contentPartner;
                    }else{
                        throw new Error("InvalidType of property contentMetadata.contentPartner, should be string but is " + typeof(contentMetadata.contentPartner));
                    }
                }

                // Duration validation
                if(contentMetadata.hasOwnProperty('duration')) {
                    if(typeof(contentMetadata.duration) === 'number') {
                        if(contentMetadata.duration >= 0) {
                            vContentMetadata.duration = contentMetadata.duration;
                        } else {
                            throw new Error("contentMetadata.duration value must be 0 or greater, but is " + contentMetadata.duration);
                        }
                    } else {
                        throw new Error("InvalidType of property contentMetadata.duration, should be number but is "+ typeof(contentMetadata.duration));
                    }
                }

                //Flags validation
                if(contentMetadata.hasOwnProperty('flags')){
                    if( Object.prototype.toString.call( contentMetadata.flags ) === '[object Array]' ) {
                        vContentMetadata.flags = contentMetadata.flags;
                    } else {
                        throw new Error("InvalidType of contentMetadata.flags, should be Array but is " + Object.prototype.toString.call( contentMetadata.flags));
                    }
                }

                //Tags validation
                if(contentMetadata.hasOwnProperty('tags')){
                    if( Object.prototype.toString.call( contentMetadata.tags ) === '[object Array]' ) {
                        vContentMetadata.tags = contentMetadata.tags;
                    } else {
                        throw new Error("InvalidType of contentMetadata.tags, should be Array but is " + Object.prototype.toString.call( contentMetadata.tags));
                    }
                }

                //CustomParameters validation
                if(contentMetadata.hasOwnProperty('customParameters')){
                    if( Object.prototype.toString.call( contentMetadata.customParameters ) === '[object Object]' ) {
                        for (var prop in contentMetadata.customParameters) {

                            // TODO: SYNC WITH PRODUCT on should we skip properties with empty key or throw ERROR
                            if(prop){
                                if(typeof(contentMetadata.customParameters[prop]) !== 'string') {
                                    throw new Error("InvalidType of contentMetadata.customParameters property " + prop + ". Should be string but is " + typeof(contentMetadata.customParameters[prop]));
                                }
                            }else{
                                throw new Error("Empty contentMetadata.customParameters key");
                            }
                        }
                        vContentMetadata.customParameters = contentMetadata.customParameters;
                    } else {
                        throw new Error("InvalidType of contentMetadata.customParameters, should be Object but is " + Object.prototype.toString.call( contentMetadata.customParameters));
                    }
                }
            }
            return vContentMetadata;
        }

        //REQUESTSETTINGS VALIDATION

        function validateRequestSettings(requestSettings) {
            var linearPlaybackPosition, nonlinearPlaybackPosition;

            var vRequestSettings = {
                height: 0,
                maxBitRate: 0,
                referrerUrl: "",
                width: 0,
                linearPlaybackPositions: [],
                nonlinearPlaybackPositions: [],
                insertionPointFilter: [] // ON_BEFORE_CONTENT || PLAYBACK_POSITION || ON_CONTENT_END || ON_PAUSE
            };

            if(requestSettings.hasOwnProperty('height')) {
                if(typeof(requestSettings.height) === 'number' ){
                    if(requestSettings.height >= 0) {
                        vRequestSettings.height = requestSettings.height;
                    } else {
                        throw new Error("Invalid value of requestSettings.height, must be larger than or equal to 0");
                    }
                } else {
                    throw new Error("InvalidType of requestSettings.height, should be number but is " + typeof(requestSettings.height));
                }

            }

            if(requestSettings.hasOwnProperty('width')) {
                if(typeof(requestSettings.width) === 'number' ){
                    if(requestSettings.width >= 0) {
                        vRequestSettings.width = requestSettings.width;
                    } else {
                        throw new Error("Invalid value of requestSettings.width, must be larger than or equal to 0");
                    }
                } else {
                    throw new Error("InvalidType of requestSettings.width, should be number but is " + typeof(requestSettings.width));
                }

            }

            if(requestSettings.hasOwnProperty('maxBitRate'))
            {
                if(typeof(requestSettings.maxBitRate) === 'number')
                {
                    if(requestSettings.maxBitRate >= 0)
                    {
                        vRequestSettings.maxBitRate = requestSettings.maxBitRate;
                    }else{
                        throw new Error("Invalid value of requestSettings.maxBitRate, must be larger than or equal to 0");
                    }
                }else{
                    throw new Error("InvalidType of requestSettings.maxBitRate, should be number but is " + typeof(requestSettings.maxBitRate));
                }
            }

            if(requestSettings.hasOwnProperty('linearSlotSize'))
            {
                if(typeof(requestSettings.linearSlotSize) === 'number')
                {
                    if(requestSettings.linearSlotSize >= 0)
                    {
                        vRequestSettings.linearSlotSize = requestSettings.linearSlotSize;
                    }else{
                        throw new Error("Invalid value of requestSettings.linearSlotSize, must be larger than or equal to 0");
                    }
                }else{
                    throw new Error("InvalidType of requestSettings.linearSlotSize, should be number but is " + typeof(requestSettings.linearSlotSize));
                }
            }

            if(requestSettings.hasOwnProperty('referrerUrl'))
            {
                if(typeof(requestSettings.referrerUrl) === 'string')
                {
                    if(requestSettings.referrerUrl)
                    {
                        vRequestSettings.referrerUrl = requestSettings.referrerUrl;
                    }else{
                        //TODO Allow empty string
                        //throw new Error("Invalid value of requestSettings.referrerUrl, can not be empty string");
                    }
                }else{
                    throw new Error("InvalidType of requestSettings.referrerUrl, should be string but is " + typeof(requestSettings.referrerUrl));
                }
            }

            if(requestSettings.hasOwnProperty('linearPlaybackPositions'))
            {
                if( Object.prototype.toString.call( requestSettings.linearPlaybackPositions ) === '[object Array]')
                {
                    if(requestSettings.linearPlaybackPositions.length > 0)
                    {
                        for(var i = 0; i<requestSettings.linearPlaybackPositions.length; i++){
                            linearPlaybackPosition = requestSettings.linearPlaybackPositions[i];
                            if(typeof(linearPlaybackPosition) === 'number' && linearPlaybackPosition === linearPlaybackPosition)
                            {
                                vRequestSettings.linearPlaybackPositions.push(requestSettings.linearPlaybackPositions[i]);
                            }else{
                                //TODO: Should we ignore the linear playbackposition which are passed in other than of type NUMBER?
                                throw new Error("InvalidType of requestSettings.linearPlaybackPositions at index " + i + ". Should be of type number but is " + typeof(requestSettings.linearPlaybackPositions[i]));
                            }
                        }
                    }
                }else{
                    throw new Error("InvalidType of requestSettings.linearPlaybackPositions, should be [object Array] but is " + Object.prototype.toString.call( requestSettings.linearPlaybackPositions ));
                }
            }


            if(requestSettings.hasOwnProperty('nonlinearPlaybackPositions'))
            {
                if( Object.prototype.toString.call( requestSettings.nonlinearPlaybackPositions ) === '[object Array]')
                {
                    if(requestSettings.nonlinearPlaybackPositions.length > 0)
                    {
                        for(var k = 0; k<requestSettings.nonlinearPlaybackPositions.length; k++){
                            nonlinearPlaybackPosition = requestSettings.nonlinearPlaybackPositions[k];
                            if(typeof(nonlinearPlaybackPosition) === 'number' && nonlinearPlaybackPosition === nonlinearPlaybackPosition)
                            {
                                vRequestSettings.nonlinearPlaybackPositions.push(requestSettings.nonlinearPlaybackPositions[k]);
                            }else{
                                //TODO: Should we ignore the nonlinear playbackposition which are passed in other than of type NUMBER?
                                throw new Error("InvalidType of requestSettings.nonlinearPlaybackPositions at index " + k + ". Should be of type number but is " + typeof(requestSettings.nonlinearPlaybackPositions[k]));
                            }
                        }
                    }
                }else{
                    throw new Error("InvalidType of requestSettings.nonlinearPlaybackPositions, should be [object Array] but is " + Object.prototype.toString.call( requestSettings.nonlinearPlaybackPositions ));
                }
            }


            if(requestSettings.hasOwnProperty('insertionPointFilter'))
            {
                if( Object.prototype.toString.call( requestSettings.insertionPointFilter ) === '[object Array]')
                {
                    if(requestSettings.insertionPointFilter.length > 0)
                    {
                        for(var j = 0; j<requestSettings.insertionPointFilter.length; j++){
                            if(typeof(requestSettings.insertionPointFilter[j]) === 'string')
                            {
                                if(requestSettings.insertionPointFilter[j] === videoplaza.adrequest.AdRequester.InsertionPointType.ON_BEFORE_CONTENT
                                || requestSettings.insertionPointFilter[j] === videoplaza.adrequest.AdRequester.InsertionPointType.PLAYBACK_POSITION
                                || requestSettings.insertionPointFilter[j] === videoplaza.adrequest.AdRequester.InsertionPointType.ON_CONTENT_END
                                || requestSettings.insertionPointFilter[j] === videoplaza.adrequest.AdRequester.InsertionPointType.ON_PAUSE
                                || requestSettings.insertionPointFilter[j] === videoplaza.adrequest.AdRequester.InsertionPointType.PLAYBACK_TIME)
                                {
                                    vRequestSettings.insertionPointFilter.push(requestSettings.insertionPointFilter[j]);
                                } else {
                                    throw new Error("Invalid Value of requestSettings.insertionPointFilter at index " + j + ". Accepted values are onBeforeContent, playbackPosition, onContentEnd, onPause or playbackTime, but is " + requestSettings.insertionPointFilter[j]);
                                }
                            }else{
                                //TODO: Should we ignore the insertionPointFilter which are passed in other than the accepted string values?
                                throw new Error("InvalidType of requestSettings.insertionPointFilter at index " + j + ". Should be of type string but is " + typeof(requestSettings.insertionPointFilter[j]));
                            }
                        }
                    }
                }else{
                    throw new Error("InvalidType of requestSettings.insertionPointFilter, should be [object Array] but is " + Object.prototype.toString.call( requestSettings.insertionPointFilter ));
                }
            }

            if(requestSettings.hasOwnProperty('maxLinearBreakDuration'))
            {
                if(typeof(requestSettings.maxLinearBreakDuration) === 'number')
                {
                    if(requestSettings.maxLinearBreakDuration >= 0)
                    {
                        vRequestSettings.maxLinearBreakDuration = requestSettings.maxLinearBreakDuration;
                    }else{
                        throw new Error("Invalid value of requestSettings.maxLinearBreakDuration, must be larger than or equal to 0");
                    }
                }else{
                    throw new Error("InvalidType of requestSettings.maxLinearBreakDuration, should be number but is " + typeof(requestSettings.maxLinearBreakDuration));
                }
            }

            return vRequestSettings;
        }

        function translateContentForm(cf){
            switch (cf){
                case 'longForm':
                    return 'long_form';
                case 'shortForm':
                    return 'short_form';
            }
        }

        function translateInsertionPointType(insertionPointType) {
            switch (insertionPointType) {
                case videoplaza.adrequest.AdRequester.InsertionPointType.ON_BEFORE_CONTENT:
                    return 'p';
                case videoplaza.adrequest.AdRequester.InsertionPointType.PLAYBACK_POSITION:
                    return 'm';
                case videoplaza.adrequest.AdRequester.InsertionPointType.ON_CONTENT_END:
                    return 'po';
                case videoplaza.adrequest.AdRequester.InsertionPointType.ON_PAUSE:
                    return 'pa';
                case videoplaza.adrequest.AdRequester.InsertionPointType.PLAYBACK_TIME:
                    return 'o';
                default :
                    throw new Error('InvalidInsertionPointType passed');
            }
        }

        function getURLParameter (paramName) {
            var paramValue = '',
                regexS = '[\\?&]' + paramName + '=([^&#]*)',
                regex = new RegExp(regexS),
                results = regex.exec(window.location.href.toString());

            if (results !== null) {
                paramValue = results[1];
            }

            return paramValue;
        }

    	/*
    		the class
		*/
        var URLBuilder = function() {
        	this.log = function() { };
        };

        URLBuilder.prototype = {
        	setLogMethod: function(logFn) { this.log = logFn; },
        	buildSessionRequestURL: function(vpHost, adRequesterSettings, contentMetadata, requestSettings, session) {
        		var url = createAdSourceUrl(vpHost, adRequesterSettings, contentMetadata, requestSettings, this.log);

        		if(session) {
                    url += '&tid=' + encodeURIComponent(session.id);        			
        		}

        		return url;
        	}
        };

        return URLBuilder;
    }());
})(videoplaza);
(function(videoplaza) {
    // Log to console using Pulse SDK function if available
    function plog() {
        if(OO && OO.Pulse) {
            OO.Pulse.Utils.log.apply(null, arguments);
        }
    }

    /*
        JSDoc callback definitions
    */

    /**
     * Callback returned by requestPassback(), requestThirdParty() and requestSession().
     * @callback videoplaza.adrequest.AdRequester~cancelCallback
     * @param {string} error Message describing the reason for canceling
    **/

    /**
     * Callback passed into requestSession() to notify that a session is available.
     * @callback videoplaza.adrequest.AdRequester~onCompleteSession
     * @param {videoplaza.adresponse.Session} session Ready to use session object
    **/

    /**
     * Callback passed into requestPassback() to notify that the request succeeded.
     * @callback videoplaza.adrequest.AdRequester~onCompletePassback
     * @param {videoplaza.adresponse.Ad} ad Ready to use Ad object
    **/

    /**
     * Callback passed into requestThirdParty() to notify that the request succeeded.
     * @callback videoplaza.adrequest.AdRequester~onCompleteLazy
     * @param {videoplaza.adresponse.Ad|videoplaza.adresponse.InsertionPoint} container Ready to use Ad or InsertionPoint object
    **/

    /**
     * Callback passed into requestSession() to notify that the session request failed.
     * @callback videoplaza.adrequest.AdRequester~onFailSession
     * @param {string} message Error message explaining the failure
    **/

    /*
        Code
    */

    /**
     * The AdRequester is used to make ad requests to Ooyala Pulse; create an instance and then use
     * {@link videoplaza.adrequest.AdRequester.requestSession} method to send information about the ads
     * that you want to request.
     *
     * @param {string} vpHost Full hostname of the Ooyala account being used.
     * @param {object} adRequesterSettings Optional settings.
     * @param {string} adRequesterSettings.deviceContainer Ooyala Pulse device container.
     * @param {string} adRequesterSettings.persistentId Ooyala Pulse persistent id. Used for unique user tracking.
     * @param {boolean} adRequesterSettings.ignoreSecure If not set, HTTP tracking URLs will not be used when using an HTTPS vpHost. If set, HTTP tracking will be enabled. False by default.
     * @constructor
     *
     */
    videoplaza.adrequest.AdRequester = (function(){
        // Constructor for AdRequester
        var AdRequester = function (vpHost, adRequesterSettings) {
            if(!(this instanceof videoplaza.adrequest.AdRequester)){
                return new AdRequester(vpHost, adRequesterSettings);
            }

            if(!verifyVpHost(vpHost))
            {
                //TODO : Verify the implementation. Is it the correct way of implementing Error.
                var err = new Error('Argument vpHost invalid or missing');
                err.name = 'Invalid_Arguments';
                throw err;
            }

            this._vpHost = vpHost;

            if(!adRequesterSettings || !(adRequesterSettings instanceof Object)) {
                throw new Error('Argument adRequesterSettings invalid or missing');
            }

            this._logCallbacks = [];

            adRequesterSettings = JSON.parse(JSON.stringify(adRequesterSettings));

            if(adRequesterSettings.hasOwnProperty('persistentId')) {
                this._pid = adRequesterSettings.persistentId;
            } else {
                this._pid = undefined;
            }

            var thisAdRequester = this;
            var requestSessionInternal = function(contentMetadata, requestSettings, onSuccess, onFail, session) {
                if(!contentMetadata) {
                    contentMetadata = { }
                }

                if(!requestSettings) {
                    requestSettings = { }
                }

                var previewMode = false;

                if(requestSettings && requestSettings.hasOwnProperty("pulse_preview")){
                    previewMode = requestSettings.pulse_preview;
                }

                /*
                    Check for some parser options
                */

                if(requestSettings.enforceCacheBusting === false) {
                    this._enforceCacheBusting = false;
                } else {
                    this._enforceCacheBusting = true;
                }

                if(requestSettings.useVASTSkipOffset === true) {
                    this._useVASTSkipOffset = true;
                } else {
                    this._useVASTSkipOffset = false;
                }

                /*
                    Check for mandatory callbacks
                */

                if(!onSuccess){
                    var sessionInfo = new videoplaza.LogItem();

                    sessionInfo.message = "Required parameter missing: 'onSuccess' callback";
                    sessionInfo.event = videoplaza.LogItem.EventType.INVALID_ARGUMENT;
                    sessionInfo.source = videoplaza.LogItem.SourceType.SESSION;
                    log(this, sessionInfo);

                    return function(){};
                }

                if(!onFail){
                    var sessionInfo = new videoplaza.LogItem();
                    sessionInfo.message = "Required parameter missing: 'onFail' callback";
                    sessionInfo.event = videoplaza.LogItem.EventType.INVALID_ARGUMENT;
                    sessionInfo.source = videoplaza.LogItem.SourceType.SESSION;
                    log(this, sessionInfo);

                    return function(){};
                }

                var requestURL = null;

                var manualCancel = false;

                var httpRequester = new videoplaza.HTTPRequester();

                var eagerLoadCancel = function(){};
                var requestCancel = function(){};

                var requestDone = false;

                var requestFailed = function(msg){
                    var logItem = new videoplaza.LogItem();
                    logItem.source = videoplaza.LogItem.SourceType.SESSION;

                    if(manualCancel) {
                        logItem.message = "Session request canceled: " + msg;
                        logItem.event = videoplaza.LogItem.EventType.REQUEST_CANCELED;
                    } else {
                        logItem.message = "Session request failed: " + msg + " URL: " + requestURL;
                        logItem.event = videoplaza.LogItem.EventType.REQUEST_FAILED;
                    }

                    log(thisAdRequester, logItem);

                    /*
                        If session is present, we called requestSessionExtension(),
                            so always provide session on cancel or failure

                        Otherwise, provide cancel/failure message
                    */



                    if (window.OO && OO.Pulse && OO.Pulse.SessionRequestFailedCallback && requestURL){
                        OO.Pulse.SessionRequestFailedCallback(requestURL, msg, ticketReceived, onFail);
                    } else if(session) {
                        onFail(session);
                    } else {
                        onFail(msg);
                    }
                };

                var ticketReceived = function (rawTicket) {
                    requestDone = true;

                    var parser = new videoplaza.adrequest.VPTP3Parser(previewMode);
                    var ticketObject, parsedSession;

                    try {
                        ticketObject = JSON.parse(rawTicket);
                    } catch(err) {
                        throw new Error("Unable to parse VPTP Ticket, malformed JSON data: " + err.message);
                    }

                    try {
                        parsedSession = parser.parse(ticketObject);
                        parsedSession.secure = isVpHostSecure(vpHost) && !adRequesterSettings.ignoreSecure;
                    } catch(e) {
                        var sessionInfo = new videoplaza.LogItem();
                        sessionInfo.message = e.message;
                        sessionInfo.event = videoplaza.LogItem.EventType.INVALID_RESPONSE;
                        sessionInfo.source = videoplaza.LogItem.SourceType.SESSION;
                        log(thisAdRequester, sessionInfo);

                        onFail(e.message);

                        return;
                    }

                    // Eager load before calling complete
                    eagerLoadCancel = loadSession.call(this,
                        thisAdRequester, parsedSession,
                        // onSuccess
                        onSuccess,
                        // onFail
                        requestFailed,
                        // Skip lazy ads
                        true
                    );
                }.bind(this);

                var onCancel = function(error) {
                    manualCancel = true;

                    if(requestDone === false) {
                        requestCancel(error);
                    } else {
                        eagerLoadCancel(error);
                    }
                };

                var hasVPTPTicketData = function(){
                    return requestSettings && requestSettings.hasOwnProperty("vptpTicketData") && requestSettings.vptpTicketData;
                };

                if(hasVPTPTicketData()){

                    setTimeout(ticketReceived, 0, requestSettings.vptpTicketData);

                    return function () {
                    };

                } else {

                    if (hasDuplicatePlaybackPositions(requestSettings, this)) {
                        setTimeout(function () {
                            if (session) {
                                onFail(session);
                            } else {
                                onFail('Incompatible request settings');
                            }
                        }, 0);

                        return function () {
                        };
                    }

                    try {
                        var urlBuilder = new videoplaza.adrequest.URLBuilder();
                        urlBuilder.setLogMethod((function(item) { log(this, item); }).bind(this));
                        var requestURL = urlBuilder.buildSessionRequestURL(vpHost, adRequesterSettings, contentMetadata, requestSettings, session);

                        var makeRequest = function (url) {
                            requestCancel = httpRequester.request(url, ticketReceived, requestFailed);
                        };

                        if (window.OO && OO.Pulse && OO.Pulse.HTTPRequesterOverride && OO.Pulse.HTTPRequesterOverride.hasOwnProperty("overrideTicketRequestURL")) {
                            OO.Pulse.HTTPRequesterOverride.overrideTicketRequestURL(requestURL, makeRequest, "firstPartyAdRequest");
                        } else {
                            makeRequest(requestURL);
                        }


                    } catch (e) {
                        var sessionInfo = new videoplaza.LogItem();
                        sessionInfo.message = e.message;
                        sessionInfo.event = videoplaza.LogItem.EventType.INVALID_ARGUMENT;
                        sessionInfo.source = videoplaza.LogItem.SourceType.SESSION;
                        log(this, sessionInfo);

                        onFail(e.message);

                        return null;
                    }

                    return onCancel;

                }

            }.bind(this);

            /**
             * @typedef RequestSettings
             * @type {Object}
             * @property {number} height Height in pixels of the video area where ads should be shown.
             * @property {number} width Width in pixels of the video area where ads should be shown.
             * @property {number} maxBitRate The maximum bitrate (in kbps) of the media files in the ad response.
             * @property {number[]} linearPlaybackPositions An Array of numbers which define at what points in time linear ads should be shown.
             * @property {number[]} nonlinearPlaybackPositions An Array of numbers which define at what points in time non-linear ads should be shown.
             * @property {videoplaza.adrequest.AdRequester.InsertionPointType} insertionPointFilter If not set, the request is for every kind of insertion point. If set, only the types provided are requested.
             * @property {string} referrerUrl Overrides the HTTP header's referrer property.
             * @property {number} linearSlotSize Overrides the number of linear ads per slot.
             * <p><strong>NOTE!</strong> Using this affects the predictability of the Ooyala Pulse forecast functionality. Use with caution.</p>
             * @property {number} maxLinearBreakDuration The maximum duration in seconds of linear ad breaks.
             * @property {bool} enforceCacheBusting If set to false, a randomized cache busting parameter is not added to VAST 2.0 tracking URLs which are missing the [CACHEBUSTING] macro. If not set, or set to true (default), the parameter is added.
             * @property {bool} useVASTSkipOffset If set to true, skip offset information provided in third party VAST tickets determines the skip behaviour of third party ads. If not set, or set to false (default), the insertion policy configured in Pulse determines the skip behaviour instead.
             */

            /**
             * @typedef ContentMetadata
             * @type {Object}
             * @property {string} category <p>Content category is used by Ooyala Pulse to target ads and determine
             * the ad insertion policy. The content category can be represented by either its unique id or one
             * of its aliases set in Ooyala Pulse.</p>
             * @property {OO.adrequest.AdRequester.ContentForm} contentForm Content form is used to determine the ad insertion policy.
             * @property {string} id Ooyala Pulse content id. Id is used to identify the content to 3rd parties.
             * @property {string} contentPartner <p>Ooyala Pulse content partner. Content partners can be used by
             * Ooyala Pulse to target ads. The content partner can be represented by either its unique id or one of its
             * aliases set in Ooyala Pulse.</p>
             * @property {number} duration This value can not be negative.
             * @property {string[]} flags Ooyala Pulse flags. Since flags overrides Ooyala Pulse's ad insertion policy they
             * should be used with caution. For more information please talk to your contact at Ooyala. Supported flags:
             * nocom, noprerolls, nomidrolls, nopostrolls, nooverlays, noskins.
             * @property {string[]} tags  Ooyala Pulse content tags, used to target specific ads.
             * @property {object} customparameters The Custom parameters to add to the
             * session request. Parameters with names containing invalid characters will be omitted.
             * These custom parameters are added to the adserver request URL in the style
             * of "cp.[parameter_name]=[parameter_value]".
             */

            /**
             * The requestSession method is used to make an ad request to Ooyala.
             *
             * @param {ContentMetadata} contentMetadata Information about the content that is making the ad request.
             * @param {RequestSettings} requestSettings Settings about the environment in which the ad will play.
             * @param {videoplaza.adrequest.AdRequester~onCompleteSession} onSuccess Required. Function that gets called when the request completes successfully. A {@link videoplaza.adresponse.Session} object
             * representing the response is passed into this function as its only argument.
             * @param {videoplaza.adrequest.AdRequester~onFailSession} onFail Required. Function that gets called in case the request fails, with a string describing the request error as its only argument.
             *
             * @returns {videoplaza.adrequest.AdRequester~cancelCallback}
             *
             * @method requestSession
             * @memberOf videoplaza.adrequest.AdRequester
             * @instance
             */
            this.requestSession = function (contentMetadata, requestSettings, onSuccess, onFail) {
                return requestSessionInternal.call(this, contentMetadata, requestSettings, onSuccess, onFail);
            };

            /**
             * The requestSessionExtension method is used to make an ad request to Ooyala, extending the provided Session with additional insertionPoints.
             * @param {videoplaza.adresponse.Session} session Required. The Session object to extend with additional {@link videoplaza.adresponse.InsertionPoint}s.
             *
             * @param {ContentMetadata} contentMetadata Information about the content that is making the ad request.
             * @param {RequestSettings} requestSettings Settings about the environment in which the ad will play.
             * @param {function} onComplete Required. Function that gets called when the request completes, success or not. The extended {@link videoplaza.adresponse.Session} object
             * representing the passed Session object merged with the response is passed into this function as its only argument.
             * @returns {videoplaza.adrequest.AdRequester~cancelCallback}
             * @method requestSessionExtension
             * @memberOf videoplaza.adrequest.AdRequester
             * @instance
            */
            this.requestSessionExtension = function(session, contentMetadata, requestSettings, onComplete) {
                var logItem;

                // Validate session argument
                if(session === null || session === undefined || !(session instanceof videoplaza.adresponse.Session)) {
                    logItem = new videoplaza.LogItem();

                    logItem.source = videoplaza.LogItem.SourceType.SESSION;
                    logItem.event = videoplaza.LogItem.EventType.INVALID_ARGUMENT;

                    if(session) {
                        logItem.message = "Invalid type: only Session accepted for argument 'session'";
                    } else {
                        logItem.message = "Required parameter missing: 'session'";
                    }

                    log(this, logItem);

                    // Empty cancel callback
                    return function() { };
                }

                // Validate requestSettings
                if(requestSettings === null || requestSettings === undefined) {
                    logItem = new videoplaza.LogItem();

                    logItem.source = videoplaza.LogItem.SourceType.SESSION;
                    logItem.event = videoplaza.LogItem.EventType.INVALID_ARGUMENT;
                    logItem.message = "Required parameter missing: 'requestSettings'";

                    log(this, logItem);

                    // Empty cancel callback
                    return function() { };
                }

                // Validate onComplete
                if(onComplete === null || onComplete === undefined) {
                    logItem = new videoplaza.LogItem();

                    logItem.source = videoplaza.LogItem.SourceType.SESSION;
                    logItem.event = videoplaza.LogItem.EventType.INVALID_ARGUMENT;
                    logItem.message = "Required parameter missing: 'onComplete' callback";

                    log(this, logItem);

                    // Empty cancel callback
                    return function() { };
                }

                // contentMetadata will be validated by requestSessionInternal()

                // Validate insertion point filter
                var insertionPointFilter = [],
                    requestFilter = [],
                    requestLinearPlaybackPositions = [],
                    requestNonlinearPlaybackPositions = [];

                // If user has provided no filter, or an empty filter
                if(!requestSettings.hasOwnProperty('insertionPointFilter') || (requestSettings.hasOwnProperty('insertionPointFilter') && requestSettings.insertionPointFilter.length === 0)) {
                    // Build filter with all available types
                    for(var type in videoplaza.adrequest.AdRequester.InsertionPointType) {
                        insertionPointFilter.push(videoplaza.adrequest.AdRequester.InsertionPointType[type]);
                    }

                    requestFilter.push(videoplaza.adrequest.AdRequester.InsertionPointType.PLAYBACK_POSITION);
                } else {
                    // Copy user's provided filter
                    insertionPointFilter = insertionPointFilter.concat(requestSettings.insertionPointFilter);

                    for(var i = 0; i < insertionPointFilter.length; ++i) {
                        if(insertionPointFilter[i] === videoplaza.adrequest.AdRequester.InsertionPointType.PLAYBACK_POSITION) {
                            requestFilter.push(videoplaza.adrequest.AdRequester.InsertionPointType.PLAYBACK_POSITION);
                            break;
                        }
                    }
                }

                var excludedInsertionPointTypes = [],
                    excludedPlaybackPositions = [];

                // Validate playback positions
                var keepPosition;

                // Linear
                if(requestSettings.linearPlaybackPositions) {
                    for(var j = 0; j < requestSettings.linearPlaybackPositions.length; ++j) {
                        keepPosition = true;

                        for(var i = 0; i < session.insertionPoints.length; ++i) {
                            insertionPoint = session.insertionPoints[i];

                            if(insertionPoint.conditions[0].type === videoplaza.adresponse.PropertyCondition.ConditionName.PLAYBACK_POSITION) {
                                if(insertionPoint.conditions[0].value === requestSettings.linearPlaybackPositions[j]) {
                                    keepPosition = false;
                                    excludedPlaybackPositions.push(requestSettings.linearPlaybackPositions[j]);
                                    break;
                                }
                            }
                        }

                        if(keepPosition) {
                            requestLinearPlaybackPositions.push(requestSettings.linearPlaybackPositions[j]);
                        }
                    }
                }

                // Nonlinear
                if(requestSettings.nonlinearPlaybackPositions) {
                    for(var j = 0; j < requestSettings.nonlinearPlaybackPositions.length; ++j) {
                        keepPosition = true;

                        // Check currently present playback positions
                        for(var i = 0; i < session.insertionPoints.length; ++i) {
                            insertionPoint = session.insertionPoints[i];

                            if(insertionPoint.conditions[0].type === videoplaza.adresponse.PropertyCondition.ConditionName.PLAYBACK_POSITION) {
                                if(insertionPoint.conditions[0].value === requestSettings.nonlinearPlaybackPositions[j]) {
                                    keepPosition = false;
                                    excludedPlaybackPositions.push(requestSettings.nonlinearPlaybackPositions[j]);
                                    break;
                                }
                            }
                        }

                        if(keepPosition) {
                            requestNonlinearPlaybackPositions.push(requestSettings.nonlinearPlaybackPositions[j]);
                        }
                    }
                }

                if(hasDuplicatePlaybackPositions(requestSettings, this)) {
                    setTimeout(function() { onComplete(session); }, 0);
                    return function() { };
                }

                for (var f = 0; f < insertionPointFilter.length; ++f) {
                    var filter = insertionPointFilter[f];
                    var keepFilter = true;

                    // Pause ads can always be requested
                    if(filter === videoplaza.adrequest.AdRequester.InsertionPointType.ON_PAUSE) {
                        requestFilter.push(filter);
                        continue;
                    }

                    // See if provided filter includes any insertion points which already exist (except for PLAYBACK_POSITION)
                    for (var ip = 0; ip < session.insertionPoints.length; ip++) {
                        var insertionPoint = session.insertionPoints[ip];

                        if(insertionPoint.conditions[0].type === filter && filter !== videoplaza.adrequest.AdRequester.InsertionPointType.PLAYBACK_POSITION) {
                            excludedInsertionPointTypes.push(filter);
                            keepFilter = false;
                            break;
                        }
                    }

                    // No conflicting insertion point, keep this filter
                    if(keepFilter && filter !== videoplaza.adrequest.AdRequester.InsertionPointType.PLAYBACK_POSITION) {
                        requestFilter.push(filter);
                    }
                }

                // Warn about excluded insertion points
                if(excludedInsertionPointTypes.length > 0) {
                    for(var i = 0; i < excludedInsertionPointTypes.length; ++i) {
                        if(insertionPointTypeReverse[excludedInsertionPointTypes[i]]) {
                            excludedInsertionPointTypes[i] = insertionPointTypeReverse[excludedInsertionPointTypes[i]];
                        }
                    }

                    var excludeList = excludedInsertionPointTypes.join(', ');

                    logItem = new videoplaza.LogItem();
                    logItem.source = videoplaza.LogItem.SourceType.SESSION;
                    logItem.event = videoplaza.LogItem.EventType.WARNING;
                    logItem.message = 'Some insertion point types were excluded from the request, as they already exist: ' + excludeList;
                    log(this, logItem);
                }

                // Warn about excluded linear playback positions
                if(excludedPlaybackPositions.length > 0) {
                    var excludeList = excludedPlaybackPositions.join(', ');

                    logItem = new videoplaza.LogItem();
                    logItem.source = videoplaza.LogItem.SourceType.SESSION;
                    logItem.event = videoplaza.LogItem.EventType.WARNING;
                    logItem.message = 'Some playback positions were excluded from the request, as they already exist: ' + excludeList;
                    log(this, logItem);
                }

                // If no [non]linear playback positions remain or have been provided, remove PLAYBACK_POSITION
                if(requestLinearPlaybackPositions.length === 0 && requestNonlinearPlaybackPositions.length === 0) {
                    requestFilter = requestFilter.filter(function(value, index, filter) {
                        return value !== videoplaza.adrequest.AdRequester.InsertionPointType.PLAYBACK_POSITION;
                    });
                }

                // Make request if any filters remain
                if(requestFilter.length > 0) {
                    var validateSessionExtension = function(extensionResult) {
                        if(extensionResult.id !== session.id) {
                            logItem = new videoplaza.LogItem();
                            logItem.source = videoplaza.LogItem.SourceType.SESSION;
                            logItem.event = videoplaza.LogItem.EventType.ILLEGAL_OPERATION;
                            logItem.message = 'The request response\'s session id does not match; unmodified session returned';
                            log(thisAdRequester, logItem);

                            onComplete(session);
                            return;
                        }

                        mergeSession(extensionResult, session, thisAdRequester);
                        onComplete(session);
                    };

                    // Don't modify user's input data
                    var requestSettingsCopy = JSON.parse(JSON.stringify(requestSettings));
                    requestSettingsCopy.insertionPointFilter = requestFilter;

                    if(requestSettings) {
                        requestSettingsCopy.linearPlaybackPositions = requestLinearPlaybackPositions;
                        requestSettingsCopy.nonlinearPlaybackPositions = requestNonlinearPlaybackPositions;
                    }

                    // Call validateSessionExtension before onComplete if successful,
                    // otherwise call onComplete immediately
                    var onExtensionFailed = function(error) {
                        if(OO && OO.Pulse) {
                            OO.Pulse.Utils.logTagged([{ tag: 'error', color: '#B82F00' }], error);
                        }
                        onComplete(session);
                    };
                    return requestSessionInternal.call(this, contentMetadata, requestSettingsCopy, validateSessionExtension, onExtensionFailed, session);
                // No filters left, nothing to request
                } else {
                    logItem = new videoplaza.LogItem();
                    logItem.source = videoplaza.LogItem.SourceType.SESSION;
                    logItem.event = videoplaza.LogItem.EventType.ILLEGAL_OPERATION;
                    logItem.message = 'None of the provided insertion point types and/or playback positions can be requested again; unmodified session returned';
                    log(this, logItem);

                    // Don't call onComplete before returning
                    setTimeout(function() { onComplete(session); }, 0);
                    return function() { };
                }
            };
        };

        function hasDuplicatePlaybackPositions(requestSettings, adRequester) {
            if(requestSettings === undefined || requestSettings === null) {
                return false;
            }

            // Make sure we have valid linear & nonlinear playback positions first
            // If something is wrong here, validateRequestSettings() will log the proper error
            if(!requestSettings.hasOwnProperty('linearPlaybackPositions')
            || Object.prototype.toString.call(requestSettings.linearPlaybackPositions ) !== '[object Array]'
            || requestSettings.linearPlaybackPositions.length === 0) {
                return false;
            }

            if(!requestSettings.hasOwnProperty('nonlinearPlaybackPositions')
            || Object.prototype.toString.call(requestSettings.nonlinearPlaybackPositions ) !== '[object Array]'
            || requestSettings.nonlinearPlaybackPositions.length === 0) {
                return false;
            }

            // Any duplicates across the lists?
            for(var i = 0; i < requestSettings.linearPlaybackPositions.length; ++i) {
                if(requestSettings.nonlinearPlaybackPositions.indexOf(requestSettings.linearPlaybackPositions[i]) !== -1) {
                    var logItem = new videoplaza.LogItem();
                    logItem.source = videoplaza.LogItem.SourceType.SESSION;
                    logItem.event = videoplaza.LogItem.EventType.ILLEGAL_OPERATION;
                    logItem.message = 'Both linear and nonlinear ads requested for playback position ' + requestSettings.linearPlaybackPositions[i] + ', but only one type per position is allowed; request canceled';
                    log(adRequester, logItem);

                    return true;
                }
            }

            // All good
            return false;
        }

        /**
         * Registers a handler function to be called when important information is available.
         * @param {videoplaza.LogItem~logItemCallback} logCallback A callback which will receive logging information.
         *
         * @method addLogListener
         * @memberOf videoplaza.adrequest.AdRequester.prototype
         */
        AdRequester.prototype.addLogListener = function(logCallback) {
            if(logCallback && Object.prototype.toString.call(logCallback) == '[object Function]') {
                this._logCallbacks.push(logCallback);
            }
            // else: exception or ignore?
        };


        /*
            Log 'logItem' on AdRequester instance 'adRequester'
        */
        function log(adRequester, logItem) {
            for(var i = 0; i < adRequester._logCallbacks.length; ++i) {
                adRequester._logCallbacks[i](logItem);
            }

            // If using the Pulse SDK, debug log the same stuff
            if(OO && OO.Pulse) {
                var error = logItem.message;

                if(logItem.errorCode) {
                    error += ' (VAST error code ' + logItem.errorCode + ')';
                }

                OO.Pulse.Utils.logTagged([{ tag: 'error', color: '#B82F00' }], error);
            }
        };

        function generateParserOptions(adRequester) {
            return {
                enforceCacheBusting: adRequester._enforceCacheBusting === true,
                useVASTSkipOffset: adRequester._useVASTSkipOffset === true
            };
        }

        /**
         * Sends a request to complete loading of an unloaded/'lazy' Ad or Insertion Point
         *
         * @param {(videoplaza.adresponse.Ad|videoplaza.adresponse.InsertionPoint)} thirdPartyContainer The {@link videoplaza.adresponse.Ad} or {@link videoplaza.adresponse.InsertionPoint} to load.
         * @param {videoplaza.adrequest.AdRequester~onCompleteLazy} onComplete Callback providing the container passed in once it is ready to play
         *
         * @returns {videoplaza.adrequest.AdRequester~cancelCallback}
         *
         * @method  requestThirdParty
         * @memberOf videoplaza.adrequest.AdRequester.prototype
         * @instance
         */
        AdRequester.prototype.requestThirdParty = function(thirdPartyContainer, onComplete) {
            var isInsertionPoint;

            // Type check
            if(thirdPartyContainer instanceof videoplaza.adresponse.InsertionPoint) {
                isInsertionPoint = true;
            } else if(thirdPartyContainer instanceof videoplaza.adresponse.Ad) {
                isInsertionPoint = false;
            } else {
                throw new Error('The supplied third party container is not of a valid type: only InsertionPoints and Ads are accepted');
            }

            //If the passed item is already processing, throw error:
            if(thirdPartyContainer._partOfOngoingRequest) {
                throw new Error('The supplied container is already waiting for a request response');
            } else if(isInsertionPoint && !thirdPartyContainer._partOfOngoingRequest) {
                // The passed item is an InsertionPoint that is not marked as processing. Check if any ads in it are processing:
                // This will happen if the user first passed in an ad, and then passes the insertionPoint of that same ad. We don't allow that.
                for (var s = 0; s < thirdPartyContainer.slots.length; s++) {
                    var slot = thirdPartyContainer.slots[s];
                    for (var a = 0; a < slot.ads.length; a++) {
                        var ad = slot.ads[a];
                        if (ad._partOfOngoingRequest) {
                            throw new Error('The supplied insertionPoint has ads already waiting for a request response');
                        }
                    }
                }
            }

            // If we get an ad that's not lazy, just return it immediately
            if(!isInsertionPoint && thirdPartyContainer.ready) {
                onComplete(thirdPartyContainer);
                return;
            }


            // Loops through all ads in an InsertionPoint to set them all as part of ongoing,
            // to prevent loading single ads within the same InsertionPoint before the first has completed.
            var setPartOfOngoingRequest = function(value) {
                if(value) {
                    thirdPartyContainer._partOfOngoingRequest = value;
                } else {
                    delete thirdPartyContainer._partOfOngoingRequest;
                }

                if(isInsertionPoint) {
                    for (var s = 0; s < thirdPartyContainer.slots.length; s++) {
                        var slot = thirdPartyContainer.slots[s];
                        for (var a = 0; a < slot.ads.length; a++) {
                            var ad = slot.ads[a];
                            if(value){
                                ad._partOfOngoingRequest = value;
                            } else {
                                delete ad._partOfOngoingRequest;
                            }
                        }
                    }
                }
            }


            setPartOfOngoingRequest(true);

            var requestCompleted = false;

            // In case the loading sequence somehow fails
            // (runs out of candidates, even the fallback first party one)
            var requestFailed = function(message) {
                setPartOfOngoingRequest(false);
                throw new Error('Third party request failed unexpectedly: ' + message);
            };

            // Called when loadAd()/loadInsertionPoint() completes
            var requestLoaded = function() {
                setPartOfOngoingRequest(false);
                requestCompleted = true;
                onComplete.call(this, thirdPartyContainer);
            }.bind(this);

            // Try to fulfill the request
            var parser = new videoplaza.adrequest.VASTParser(generateParserOptions(this));
            var sessionContext = { target: this, vastParser: parser, sessionCancelled: false, skipLazyAds: false };

            var cancelledRequest = false;

            // Container-specific cancel function
            var realCancel;

            if(isInsertionPoint) {
                realCancel = function(error) {
                    // Request already completed: do nothing
                    // Not needed on Ad level requests because loadAd() already has this functionality
                    if(requestCompleted) {
                        return;
                    }

                    if(sessionContext.sessionCancelled === false) {
                        var noop = function() { };
                        // Select first party ad/inventory for each unloaded ad
                        var slot, ad, adCancel;

                        for(var i = 0; i < thirdPartyContainer.slots.length; ++i) {
                            slot = thirdPartyContainer.slots[i];

                            if(i === thirdPartyContainer.slots.length - 1)

                            for(var j = 0; j < slot.ads.length; ++j) {
                                ad = slot.ads[j];

                                // Request and then immediately cancel, because loadAd()
                                // will pick the last candidate automatically when cancelled
                                // Put error code -1 to signal that we don't want to log each of these
                                adCancel = loadAd.call(this, ad, sessionContext, noop, undefined, noop);
                                adCancel('Third party ad request cancelled', true);
                            }
                        }

                        var cancelLogItem = new videoplaza.LogItem();
                        cancelLogItem.message = "Third party request for insertion point canceled: " + error;
                        cancelLogItem.source = videoplaza.LogItem.SourceType.AD;
                        cancelLogItem.event = videoplaza.LogItem.EventType.REQUEST_CANCELED;
                        log(sessionContext.target, cancelLogItem);

                        sessionContext.sessionCancelled = true;
                        requestLoaded();
                    }
                }.bind(this);

                loadInsertionPoint.call(this, thirdPartyContainer, sessionContext, requestLoaded, undefined /* unused */, requestFailed);
            } else {
                realCancel = loadAd.call(this, thirdPartyContainer, sessionContext, requestLoaded, undefined /* unused */, requestFailed);
            }

            var cancel = function(message) {
                if(cancelledRequest) {
                    throw new Error('Request has already been cancelled');
                }

                cancelledRequest = true;
                realCancel(message);
            };

            // Return the cancel function
            return cancel;
        };

        /**
         * If an ad fails to play, use this method to report the error and receive a new ad in turn. You can check if the ad has more passback candidates available with {@link videoplaza.adresponse.Ad.hasPassback}, to avoid getting an error if this is not the case.
         * @see videoplaza.adresponse.Ad.hasPassback
         * @param {(videoplaza.adresponse.Ad|videoplaza.adresponse.LinearCreative)} failedItem The {@link videoplaza.adresponse.Ad} or {@link videoplaza.adresponse.LinearCreative} that failed.
         * @param {string} errorString An error string describing why the previous item failed; valid errors are available in {@link videoplaza.tracking.Tracker.AdErrors} and {@link videoplaza.tracking.Tracker.CreativeErrors}
         * @param {videoplaza.adrequest.AdRequester~onCompletePassback} onComplete Callback providing the next ad candidate
         *
         * @returns {videoplaza.adrequest.AdRequester~cancelCallback}
         *
         * @method requestPassback
         * @memberOf videoplaza.adrequest.AdRequester.prototype
         * @instance
         */
        AdRequester.prototype.requestPassback = function(failedItem, errorString, onComplete) {
            var creative = false;
            var errorCode;

            // Resolve real error code
            errorCode = videoplaza.tracking.Tracker.resolveErrorCode(failedItem, errorString);

            // Type check
            if(failedItem instanceof videoplaza.adresponse.LinearCreative) {
                failedItem = failedItem.parentAd;
                creative = true;
            } else if(!(failedItem instanceof videoplaza.adresponse.Ad)) {
                throw new Error('Invalid type: only Creative or Ad accepted');
            }

            // Check if error has already been tracked
            if(failedItem.hasOwnProperty('trackingEvents') &&
               failedItem.trackingEvents.hasOwnProperty('error') &&
               failedItem.trackingEvents['error'].hasOwnProperty('blocked') &&
               failedItem.trackingEvents['error'].blocked === true)
            {
                throw new Error('Cannot request passback after tracking error');
            }
            // Same for impression
            else if(failedItem.hasOwnProperty('trackingEvents') &&
               failedItem.trackingEvents.hasOwnProperty('impression') &&
               failedItem.trackingEvents['impression'].hasOwnProperty('blocked') &&
               failedItem.trackingEvents['impression'].blocked === true)
            {
                throw new Error('Cannot request passback after tracking impression');
            }

            if(failedItem._partOfOngoingRequest) {
                if(creative) {
                    throw new Error('The supplied creative\'s parent ad is already waiting for a request response');
                } else {
                    throw new Error('The supplied ad is already waiting for a request response');
                }
            }

            failedItem._partOfOngoingRequest = true;

            // Check if any passback candidates are available
            // TODO: differentiate from selector ads
            if(!videoplaza.adresponse.Ad.hasPassback(failedItem)) {
                if(creative) {
                    throw new Error('The supplied creative\'s parent ad has no passback candidates available');
                } else {
                    throw new Error('The supplied ad has no passback candidates available');
                }
            }

            var previousCandidateErrorUrls;

            // In case the passback loading somehow fails
            // (runs out of candidates, even the fallback first party one)
            var passbackFailed = function(message) {
                delete failedItem._partOfOngoingRequest;
                throw new Error('Passback loading failed unexpectedly: ' + message);
            };

            // Called when loadAd() completes
            var passbackLoaded = function() {
                for(var i = 0; i < previousCandidateErrorUrls.length; ++i)
                    if(previousCandidateErrorUrls[i].thirdParty)
                        failedItem.trackingEvents['error'].urls.push(previousCandidateErrorUrls[i]);

                delete failedItem._partOfOngoingRequest;
                onComplete.call(this, failedItem);
            }.bind(this);

            // Clear ad of current data, update error tracking
            failedItem.trackingEvents['impression'].urls.length = 0;

            updateAdErrors(failedItem, errorCode);

            previousCandidateErrorUrls = failedItem.trackingEvents['error'].urls;
            failedItem.trackingEvents['error'].urls = [];

            for(var i = 0; i < failedItem.creatives.length; ++i) {
                failedItem.creatives[i].trackingEvents = {};
                failedItem.creatives[i].mediaFiles = [];
            }

            failedItem.companions = [];

            // Try to load another candidate
            var parser = new videoplaza.adrequest.VASTParser(generateParserOptions(this));
            var sessionContext = { target: this, vastParser: parser, sessionCancelled: false, skipLazyAds: true, logPassbackURL: true };

            var cancelledRequest = false;

            var realCancel = loadAd.call(this, failedItem, sessionContext, passbackLoaded, undefined /* unused here */, passbackFailed);
            var cancel = function(message) {
                if(cancelledRequest) {
                    throw new Error('Request has already been cancelled');
                }

                cancelledRequest = true;
                realCancel.call(this, message);
            }.bind(this);

            return cancel;
            // Return the cancel function
        };

        /**
         * Internal utility stuff
         */

        /*
            Call 'operation' with every item in 'list', then call 'onComplete' when list is empty
                Generated step, finish and cancel methods are passed into 'operation' so the
                iteration can be aborted with a success or fail state at any time

            Currently possible operations: loadInsertionPoint, loadSlot, loadAd
            Currently used values for list: Array of InsertionPoint, Array of Slot, Array of Ad

            See more about this and the general passback solution
                at https://confluence.videoplaza.org/display/ENG/HTML5+SDK+2.x+passback+solution
        */
        function processList(operation, list, context, onComplete, onCancel) {
            var state = {
                operation: operation,
                list: list,
                context: context,

                step: function() {
                    if(state.list.length === 0) {
                        state.finish();
                    } else {
                        // Shift one item and operate on it
                        state.operation(state.list.shift(), state.context, state.step, state.finish, state.cancel);
                    }
                },

                finish: onComplete,
                cancel: onCancel
            };

            state.step();
        }

        /*
            Internal: Request and parse a single third party ad using the given parser
            Merges the parsed Ad instance with the original ad and calls onComplete() with the result
            Or if we receive an invalid response, we call onFail with the most recently retrieved ad
            (no deep copy is made, original ad is modified in the merge)
        */

        function internalRequestThirdPartyAd(ad, chainContext, onComplete, onFail) {
            if(chainContext.cancelled === true || chainContext.adContext.cancelled === true || chainContext.adContext.sessionContext.sessionCancelled === true) {
                return;
            }

            var complete = function(rawTicket) {
                if(chainContext.cancelled === true || chainContext.adContext.cancelled === true || chainContext.adContext.sessionContext.sessionCancelled === true) {
                    return;
                }

                var parsedAd;
                var adInfo = new videoplaza.LogItem();
                var ec;
                try {
                    plog('Parsing VAST response from: ', ad.thirdPartyURL);
                    parsedAd = chainContext.adContext.sessionContext.vastParser.parse(rawTicket);
                } catch(e) {
                    if(e.hasOwnProperty('errorCode')) {
                        ec = e.errorCode;
                    } else {
                        ec = "100";
                    }

                    adInfo.message = "Could not parse third party ad: " + e.message;

                    adInfo.event = videoplaza.LogItem.EventType.INVALID_RESPONSE;
                    adInfo.thirdPartySourceURLs = ad.thirdPartyChain.toString();
                    adInfo.source = videoplaza.LogItem.SourceType.AD;
                    adInfo.errorCode = ec;
                    log(chainContext.adContext.sessionContext.target, adInfo);

                    onFail.call(this, ad, ec);
                    chainContext.cancelled = true;

                    return;
                }

                if(parsedAd) {
                    // Inventory ad? Copy tracking events and fail this chain
                    if(parsedAd.type === "inventory") {
                        mergeAd.call(this, parsedAd, ad);

                        adInfo.message = "No ads VAST response.";
                        adInfo.event = videoplaza.LogItem.EventType.NO_AD_RESPONSE;
                        adInfo.thirdPartySourceURLs = parsedAd.thirdPartyChain.toString();
                        adInfo.source = videoplaza.LogItem.SourceType.AD;
                        adInfo.errorCode = '303';
                        log(chainContext.adContext.sessionContext.target, adInfo);

                        onFail(parsedAd, "303"); // VAST no ad response error
                        chainContext.cancelled = true;
                    // Wrapper or real ad; merge and continue
                    } else {
                        mergeAd.call(this, parsedAd, ad);
                        setTimeout(function() { onComplete(parsedAd); }, 0);
                    }

                    // Store currently merged chain in case we time out (chain or ad level)
                    chainContext.currentNode = parsedAd;
                    chainContext.adContext.currentChain = parsedAd;
                } else {
                    // Invalid ad response: fail this chain
                    setTimeout(function() { onFail(ad, '900' /* undefined error */); }, 0);
                    chainContext.cancelled = true;
                }
            }.bind(this);

            var httpRequester = new videoplaza.HTTPRequester();
            ad.thirdPartyChain.push(ad.thirdPartyURL);

            var makeRequest = function(url) {
                httpRequester.request(url, complete,
                    // onError
                    function (message) {
                        if (chainContext.cancelled === true || chainContext.adContext.cancelled === true || chainContext.adContext.sessionContext.sessionCancelled === true) {
                            return;
                        }

                        var adInfo = new videoplaza.LogItem();
                        adInfo.message = "Could not retrieve third party ad: " + message;
                        adInfo.event = videoplaza.LogItem.EventType.REQUEST_FAILED;
                        adInfo.thirdPartySourceURLs = ad.thirdPartyChain.toString();
                        adInfo.source = videoplaza.LogItem.SourceType.AD;
                        adInfo.errorCode = '300';
                        log(chainContext.adContext.sessionContext.target, adInfo);

                        // Fail current chain
                        onFail(ad, "300");
                        chainContext.cancelled = true;
                    }
                );
            };

            if(OO && OO.Pulse && OO.Pulse.HTTPRequesterOverride && OO.Pulse.HTTPRequesterOverride.hasOwnProperty("overrideTicketRequestURL")){
                OO.Pulse.HTTPRequesterOverride.overrideTicketRequestURL(ad.thirdPartyURL, makeRequest, "thirdPartyAdRequest");
            } else {
                if(chainContext.adContext.sessionContext.logPassbackURL === true) {
                    if(OO && OO.Pulse) {
                        OO.Pulse.Utils.log('Loading third party ad: ' + ad.thirdPartyURL);
                    }
                }

                makeRequest(ad.thirdPartyURL);
            }
        }

        // Load subsequent nodes in a passback chain after the initial one
        // loaded by loadChain() below
        function loadWrapper(ad, chainContext, finishChain, failChain) {
            // Called for each ad requested
            var checkAdResponse = function(newAd) {
                loadWrapper.call(this, newAd, chainContext, finishChain, failChain);
            };

            // wrapper? request it and then keep going
            if(ad.thirdPartyURL.length > 0) {
                internalRequestThirdPartyAd.call(this, ad, chainContext, checkAdResponse, failChain);
            }
            // not a wrapper: just keep going right away
            else {
                chainContext.completed = true;
                finishChain(ad);
            }
        }

        // Load the initial node in a passback chain
        function loadChain(ad, adContext, finishChain, failChain) {
            var chainContext = {
                adContext: adContext,
                cancelled: false,
                completed: false,
                currentNode: ad
            };

            // Chain traversal timeout stuff
            var timeoutStart = Date.now();
            var timeoutId;

            // Called when the chain's timeout hits
            var cancelChain = function() {
                if(chainContext.completed === true || chainContext.cancelled === true || chainContext.adContext.cancelled === true || chainContext.adContext.sessionContext.sessionCancelled === true) {
                    return;
                }

                chainContext.cancelled = true;

                var timeout = (Date.now() - timeoutStart) / 1000;
                var adInfo = new videoplaza.LogItem();

                adInfo.message = "Could not retrieve third party ad: chain timed out after " + timeout + "s";
                adInfo.event = videoplaza.LogItem.EventType.REQUEST_TIMEOUT;
                adInfo.thirdPartySourceURLs = ad.thirdPartyChain.toString();
                adInfo.source = videoplaza.LogItem.SourceType.AD;
                adInfo.errorCode = '301';
                log(adContext.sessionContext.target, adInfo);

                // Remove any Creative tracking picked up along the way
                for(var i = 0; i < chainContext.currentNode.creatives.length; ++i) {
                    chainContext.currentNode.creatives[i].trackingEvents = {};
                }

                failChain.call(this, chainContext.currentNode, "301");
            };

            var chainCompleted = function(ad) {
                clearTimeout(timeoutId);
                finishChain.call(this, ad);
            };

            var checkAdResponse = function(newAd) {
                loadWrapper.call(this, newAd, chainContext, chainCompleted, failChain);
            }.bind(this);

            // wrapper? request it and then keep going
            if(ad.thirdPartyURL.length > 0) {
                if(ad.maximumPreparationTime !== undefined) {
                    timeoutId = setTimeout(cancelChain, ad.maximumPreparationTime * 1000);
                }

                internalRequestThirdPartyAd.call(this, ad, chainContext, checkAdResponse, failChain);
            }
            // not a wrapper: just keep going right away
            else {
                chainContext.completed = true;
                finishChain.call(this, ad);
            }
        }

        // Prepare ad
        // During eager loading, nextAd and failSession are self explanatory,
        // but during a requestPassback() call, nextAd() means the passback call succeeded
        // and failSession() means it failed
        function loadAd(ad, sessionContext, nextAd, unused_argument, failSession) {
            var adContext = {
                sessionContext: sessionContext,
                cancelled: false,
                completed: false,
                currentChain: null
            };

            // Updated for each attempted candidate, and finally set in chainFinished()
            var currentCandidate;
            var timeoutStart;
            var timeoutId;

            var cancelAd = function(errorCode, errorMessage, noLog) {
                if(adContext.completed === true || adContext.cancelled === true || sessionContext.sessionCancelled === true) {
                    return;
                }


                // Track report URL
                if(ad.ads[0] && ad.ads[0].trackingEvents.report && ad.ads[0].trackingEvents.report.urls.length > 0) {
                    if(OO && OO.Pulse && OO.Pulse._instance) {
                        var pulseError = errorCode === "301" ? "2" : errorCode;
                        OO.Pulse._instance._tracker.reportPulseError(ad.ads[0], pulseError);
                    }
                }


                var adInfo = new videoplaza.LogItem();

                if(!noLog) {
                    adInfo.message = errorMessage;

                    if(errorCode === '301') {
                        adInfo.event = videoplaza.LogItem.EventType.REQUEST_TIMEOUT;
                    } else {
                        adInfo.event = videoplaza.LogItem.EventType.REQUEST_CANCELED;
                    }

                    adInfo.thirdPartySourceURLs = ad.thirdPartyChain.toString();
                    adInfo.source = videoplaza.LogItem.SourceType.AD;
                    adInfo.errorCode = errorCode;
                    log(sessionContext.target, adInfo);
                }

                // Clear lazy flag/prep time
                ad.ready = true;

                // At this stage our current ad chain is still in the list
                // So check for >= 2 ads remaining (current chain + first party ad/inventory + potentially more)
                if(ad.ads.length >= 2) {
                    var lastAd = ad.ads[ad.ads.length - 1];
                    ad.ads = [];

                    // Merge the chain we interrupted, if any, as if it had failed
                    if(adContext.currentChain !== null) {
                        copyTrackingEvents(adContext.currentChain, ad, 'error');
                    }

                    updateAdErrors(ad, errorCode);

                    for(var i = 0; i < ad.creatives.length; ++i) {
                        ad.creatives[i].trackingEvents.urls = [];
                    }

                    // Merge last ad, update type and continue
                    // (always trust ad type stated in session ticket)
                    mergeAd(ad, lastAd, false, true);
                    mergePulseAdInfo.call(this, ad, lastAd);

                    // Make sure inventory ads erase any companions they might hold
                    if(lastAd.type === 'inventory') {
                        ad.companions = [];
                    }

                    nextAd();
                } else {
                    failSession('No passback candidates remaining');
                }

                adContext.cancelled = true;
            }.bind(this);

            var manualCancel = function(errorMessage, noLog) {
                // 900: VAST undefined error code
                cancelAd('900', errorMessage, noLog);
            };

            // Called when the ad's timeout hits
            var timeoutAd = function() {
                var timeout = (Date.now() - timeoutStart) / 1000;
                // 301: VAST wrapper timeout error code
                cancelAd('301', "Could not retrieve third party ad: passback timed out after " + timeout + "s");
            };

            // Called when VAST wrapper chain has completed
            var chainFinished = function(mergedChainAd) {
                clearTimeout(timeoutId);

                adContext.completed = true;

                // Merge the final ad with the original source ad
                mergeAd(ad, mergedChainAd, false, true);
                mergePulseAdInfo.call(this, ad, currentCandidate);

                // Candidate no longer of interest; remove
                ad.ads.shift();

                // Make sure ad is marked ready
                ad.ready = true;

                // Make sure inventory ads erase any companions they might hold
                if(ad.type === 'inventory') {
                    ad.companions = [];
                }

                // Continue loading ads in the slot
                nextAd.call(this);
            }.bind(this);

            // Called when VAST wrapper chain has been failed
            // Receives all ads merged before hitting the failing node
            var chainFailed = function(previousChain, errorCode) {
                // Track report URL
                if(ad.ads[0] && ad.ads[0].trackingEvents.report && ad.ads[0].trackingEvents.report.urls.length > 0) {
                    if(OO && OO.Pulse && OO.Pulse._instance) {
                        OO.Pulse._instance._tracker.reportPulseError(ad.ads[0], errorCode);
                    }
                }

                // Remove previous chain from the ad
                // Candidate no longer of interest; remove
                ad.ads.shift();

                // Clear Creative tracking events
                for(var i = 0; i < previousChain.creatives.length; ++i) {
                    previousChain.creatives[i].trackingEvents = {};
                }

                // Clear third party URLs, impressions
                previousChain.thirdPartyChain.length = 0;

                if(previousChain.trackingEvents.hasOwnProperty('impression'))
                    previousChain.trackingEvents['impression'].urls.length = 0;


                // Are there more chains available?
                if(ad.ads.length > 0) {
                    // Copy errors from failed chain to next chain
                    mergeAd.call(this, ad.ads[0], previousChain, true);
                    updateAdErrors(ad.ads[0], errorCode);

                    // Store next chain's starting wrapper
                    currentCandidate = ad.ads[0];
                    loadChain.call(this, currentCandidate, adContext, chainFinished, chainFailed);
                } else {
                    // All chains exhausted with no ad or inventory obtained
                    // Current behaviour is to fail the entire session
                    failSession('No passback candidates remaining');
                }
            }.bind(this);

            /*
                skipLazyAds and Ad.ready are mutually exclusive:

                - If we want to skip lazy ads, and the ad is not ready (it's lazy and unloaded),
                    we skip it.

                - If we don't want to skip lazy ads, and the ad *is* ready,
                    we also want to skip it.

                Otherwise, continue to the next statement and load the ad.
            */

            if( (ad.ready && sessionContext.skipLazyAds === false) ||
                (!ad.ready && sessionContext.skipLazyAds === true))
            {
                nextAd.call(this);
            }
            // Passback candidates available or ad is not loaded?
            else if((sessionContext.skipLazyAds && videoplaza.adresponse.Ad.hasPassback(ad)) || !ad.ready)
            {
                if(ad.maximumPreparationTime !== undefined) {
                    timeoutStart = Date.now();
                    timeoutId = setTimeout(timeoutAd, ad.maximumPreparationTime * 1000);
                }

                adContext.currentChain = ad.ads[0];

                // Store the ad type to set if this chain/candidate succeeds
                currentCandidate = ad.ads[0];
                loadChain.call(this, currentCandidate, adContext, chainFinished, chainFailed);
            }
            // Real ad
            else
            {
                nextAd();
            }

            return manualCancel;
        }

        function loadSlot(slot, sessionContext, nextSlot, finish, failSession) {
            var ads = slot.ads.slice(0);

            processList(loadAd.bind(this), ads, sessionContext, nextSlot, failSession);
        }

        function loadInsertionPoint(insertionPoint, sessionContext, nextPoint, finish, failSession) {
            var slots = insertionPoint.slots.slice(0);
            processList(loadSlot.bind(this), slots, sessionContext, nextPoint, failSession);
        }

        // This will be called once to eager load an entire session
        function loadSession(target, session, onComplete, onFail, skipLazyAds) {
            var parser = new videoplaza.adrequest.VASTParser(generateParserOptions(this));

            var sessionContext = { target: target, vastParser: parser, sessionCancelled: false, skipLazyAds: skipLazyAds };

            var completeSession = function() {
                // Don't complete session even if we get a valid response
                // after it's been cancelled
                if(sessionContext.sessionCancelled === false) {
                    onComplete.call(this, session);
                }
            }.bind(this);

            var failSession = function() {
                if(sessionContext.sessionCancelled === false) {
                    onFail(session);
                }
            }.bind(this);

            var insertionPoints = session.insertionPoints.slice(0);

            processList(loadInsertionPoint, insertionPoints, sessionContext, completeSession, failSession);

            var cancelCallback = function(error) {
                if(sessionContext.sessionCancelled === false) {
                    sessionContext.sessionCancelled = true;
                    onFail(error);
                }
            };

            return cancelCallback;
        }

        /*
            Merge the insertion points from one session into another one,
                if matching types are not already present (except ON_PAUSE)
        */
        function mergeSession(sourceSession, targetSession, adRequester) {
            var logItem,
                insertionPoint,
                newInsertionPoint,
                alreadyTaken,
                playbackPositionTypesReceived = 0;

            var currentPlaybackPositions = [],
                excludedPlaybackPositions = [],
                excludedInsertionPointTypes = [];

            // Store current playback positions, if any
            for(var j = 0; j < targetSession.insertionPoints.length; ++j) {
                insertionPoint = targetSession.insertionPoints[j];

                if(insertionPoint.conditions[0].type === videoplaza.adresponse.PropertyCondition.PLAYBACK_POSITION) {
                    currentPlaybackPositions.push(insertionPoint.conditions[0].value);
                }
            }

            // For each new insertion point:
            for(var i = 0; i < sourceSession.insertionPoints.length; ++i) {
                newInsertionPoint = sourceSession.insertionPoints[i];
                alreadyTaken = false;


                // For PLAYBACK_POSITION, we only need to compare against the list created above
                if(newInsertionPoint.conditions[0].type === videoplaza.adresponse.PropertyCondition.ConditionName.PLAYBACK_POSITION) {
                    ++playbackPositionTypesReceived;
                    if(currentPlaybackPositions.indexOf(newInsertionPoint.conditions[0].value) !== -1) {
                        alreadyTaken = true;
                        excludedPlaybackPositions.push(newInsertionPoint.conditions[0].value);
                    }
                } else {
                    // Otherwise, compare against all current ones
                    for(var j = 0; j < targetSession.insertionPoints.length; ++j) {
                        insertionPoint = targetSession.insertionPoints[j];

                        // Already present?
                        if(insertionPoint.conditions[0].type === newInsertionPoint.conditions[0].type) {

                            // Special case for ON_PAUSE: remove current insertion point, accept new one
                            if(newInsertionPoint.conditions[0].type === videoplaza.adresponse.EventCondition.ConditionName.ON_PAUSE) {
                                // Remove this insertion point first
                                targetSession.insertionPoints.splice(j, 1);
                                // Break here so we don't remove any other pause ads
                                break;
                            } else {
                                alreadyTaken = true;
                                excludedInsertionPointTypes.push(newInsertionPoint.conditions[0].type);
                                break;
                            }
                        }
                    }
                }

                // Merge this insertion point
                if(!alreadyTaken) {
                    targetSession.insertionPoints.push(newInsertionPoint);
                }
            }

            // Did we discard all PLAYBACK_POSITIONs received?
            if(playbackPositionTypesReceived > 0 && playbackPositionTypesReceived === excludedPlaybackPositions.length) {
                excludedInsertionPointTypes.push(videoplaza.adrequest.AdRequester.InsertionPointType.PLAYBACK_POSITION);
            }

            // Warn about excluded insertion points
            if(excludedInsertionPointTypes.length > 0) {
                for(var i = 0; i < excludedInsertionPointTypes.length; ++i) {
                    if(insertionPointTypeReverse[excludedInsertionPointTypes[i]]) {
                        excludedInsertionPointTypes[i] = insertionPointTypeReverse[excludedInsertionPointTypes[i]];
                    }
                }

                var excludeList = excludedInsertionPointTypes.join(', ');

                logItem = new videoplaza.LogItem();
                logItem.source = videoplaza.LogItem.SourceType.SESSION;
                logItem.event = videoplaza.LogItem.EventType.WARNING;
                logItem.message = 'Some insertion point types were received, but not merged, as they already exist: ' + excludeList;
                log(adRequester, logItem);
            }

            // Warn about excluded playback positions
            if(excludedPlaybackPositions.length > 0) {
                var excludeList = excludedPlaybackPositions.join(', ');

                logItem = new videoplaza.LogItem();
                logItem.source = videoplaza.LogItem.SourceType.SESSION;
                logItem.event = videoplaza.LogItem.EventType.WARNING;
                logItem.message = 'Some playback positions were received, but not merged, as they already exist: ' + excludeList;
                log(adRequester, logItem);
            }
        }

        /*
            Merge third party chain's initial native wrapper ad (sourceAd)'s
            Ooyala Pulse ad info into the main ad (targetAd)
        */
        function mergePulseAdInfo(targetAd, sourceAd) {
            targetAd.id = sourceAd.id;

            targetAd.type = sourceAd.type;
            targetAd.candidate = sourceAd.candidate;

            targetAd.customId = sourceAd.customId;
            targetAd.campaignId = sourceAd.campaignId;
            targetAd.customCampaignId = sourceAd.customCampaignId;
            targetAd.goalId = sourceAd.goalId;
            targetAd.customGoalId = sourceAd.customGoalId;
            targetAd.allowLinearityToChange = sourceAd.allowLinearityToChange;
            targetAd.partOfAnExclusiveCampaign = sourceAd.partOfAnExclusiveCampaign;
            targetAd.showCountdown = sourceAd.showCountdown;
            targetAd.variant = sourceAd.variant;

            for(var i = 0; i < sourceAd.creatives.length; ++i) {
                mergePulseCreativeProperties.call(this, targetAd.creatives[i], sourceAd.creatives[i]);
            }
        }

        /*
            Merge creative properties which only come from Ooyala Pulse or
            are always taken from candidate ad
        */

        function mergePulseCreativeProperties(targetCreative, sourceCreative) {
            targetCreative.type = sourceCreative.type;
            targetCreative.sequence = sourceCreative.sequence;

            /*
                If _useVASTSkipOffset === false, we don't override the skip information
                from third party tickets with the Pulse wrapper's insertion policy
            */
            if(this._useVASTSkipOffset !== true) {
                targetCreative.skipOffset = sourceCreative.skipOffset;
                targetCreative.skipResetTime = sourceCreative.skipResetTime;
                targetCreative.skipButtonMode = sourceCreative.skipButtonMode;
            }

            targetCreative.lastCompletion = sourceCreative.lastCompletion;
        }

        function mergeCreativeProperties(targetCreative, sourceCreative) {
            targetCreative.duration = sourceCreative.duration;
            targetCreative.clickThroughUrl = sourceCreative.clickThroughUrl;
            targetCreative.adParameters = sourceCreative.adParameters;
            targetCreative.universalAdId = sourceCreative.universalAdId;

            targetCreative.skipOffset = sourceCreative.skipOffset;
            targetCreative.skipResetTime = sourceCreative.skipResetTime;
            targetCreative.skipButtonMode = sourceCreative.skipButtonMode;
        }

        /*
            Merge two ads together
            The contents of 'sourceAd' will be merged into 'targetAd'

            Does not merge ad type or any other info received
                from Ooyala Pulse; see loadAd()
        */
        function mergeAd(targetAd, sourceAd, clearSource, shouldMergeCreativeProperties) {
            if(targetAd === sourceAd)
                return;

            if(targetAd.thirdPartyURL && targetAd.creatives.length === 0) {
                targetAd.creatives.push(new videoplaza.adresponse.LinearCreative());
            }

            // Add third party URL to chain
            for(var i = 0; i < sourceAd.thirdPartyChain.length; ++i) {
                targetAd.thirdPartyChain.push(sourceAd.thirdPartyChain[i]);
            }

            // Clear old first party tracking
            if(clearSource) {
                removePulseTrackingURLs(sourceAd, 'error');
                removePulseTrackingURLs(sourceAd, 'impression');
            } else {
                removePulseTrackingURLs(targetAd, 'error');
                removePulseTrackingURLs(targetAd, 'impression');
            }

            // Copy tracking events
            copyTrackingEvents(sourceAd, targetAd);

            if(targetAd.type === 'inventory') {
                return;
            }

            // Merge creatives
            // (for the time being, only used for linear ads with only 1 creative each)
            for(var j = 0; j < sourceAd.creatives.length; ++j) {
                var targetAdCreative = targetAd.creatives[j];
                var sourceAdCreative = sourceAd.creatives[j];

                copyTrackingEvents(sourceAdCreative, targetAdCreative);

                // Copy MediaFiles
                for(var k = 0; k < sourceAdCreative.mediaFiles.length; ++k) {
                    targetAdCreative.mediaFiles.push(duplicateMediaFile(sourceAdCreative.mediaFiles[k]));
                }

                if(shouldMergeCreativeProperties) {
                    mergeCreativeProperties(targetAdCreative, sourceAdCreative);
                }
            }

            // Merge companions
            for(var k = 0; k < sourceAd.companions.length; ++k) {
                sourceAd.companions[k].targetAd = targetAd;
                targetAd.companions.push(sourceAd.companions[k]);
            }

            // Merge title also
            // ('shouldMergeCreativeProperties' actually indicates this is
            // the final merge from third party chain to native ad)
            if(shouldMergeCreativeProperties) {
                targetAd.title = sourceAd.title;
                targetAd.pricing = sourceAd.pricing;
                targetAd.verifications = sourceAd.verifications;
                targetAd.categories = sourceAd.categories;
                targetAd.conditional = sourceAd.conditional;
                targetAd.description = sourceAd.description;
                targetAd.advertiser = sourceAd.advertiser;
            } else {
                if(!targetAd.pricing) {
                    targetAd.pricing = sourceAd.pricing;
                }
            }
        }

        function removePulseTrackingURLs(ad, trackingType) {
            if(ad.trackingEvents.hasOwnProperty(trackingType))
            {
                var trackingUrl;
                var thirdPartyEvents = [];

                for(var i = 0; i < ad.trackingEvents[trackingType].urls.length; ++i) {
                    trackingUrl = ad.trackingEvents[trackingType].urls[i];

                    if(trackingUrl.thirdParty) {
                        thirdPartyEvents.push(trackingUrl);
                    }
                }

                ad.trackingEvents[trackingType].urls = thirdPartyEvents;
            }
        }

        // Copy all tracking events from source to target
        // If filter is supplied, only copy events of type 'filter'
        // Arguments can be either Creative:s or Ad:s
        function copyTrackingEvents(source, target, filter) {
            if(!target) { return; }

            var key;
            var trackingKeys = Object.keys(source.trackingEvents);

            for(var i = 0; i < trackingKeys.length; ++i) {
                key = trackingKeys[i];

                if(filter && key !== filter) {
                    continue;
                }

                if(!source.trackingEvents.hasOwnProperty(key)) {
                    continue;
                }

                if(key === 'progress') {
                    copyProgressEvents(source.trackingEvents.progress, target);
                    continue;
                }

                if(!target.trackingEvents.hasOwnProperty(key)) {
                    target.trackingEvents[key] = { urls: [], blocked: false };
                }

                if(key === 'report' && source.trackingEvents.hasOwnProperty('report') && target.trackingEvents['report'].urls.length == 0) {
                    target.trackingEvents['report'].urls = source.trackingEvents['report'].urls;
                    continue;
                }

                var sourceURL;
                for(var j = 0; j < source.trackingEvents[key].urls.length; ++j) {
                    sourceURL = source.trackingEvents[key].urls[j];
                    target.trackingEvents[key].urls.push(sourceURL);
                }
            }
        }

        function copyProgressEvents(progressEvents, target) {
            var offset;
            var offsets = Object.keys(progressEvents);

            // Make sure target has a progress event collection
            if(!target.trackingEvents.hasOwnProperty('progress')) {
                target.trackingEvents.progress = { };
            }

            var targetProgress = target.trackingEvents.progress;

            // For each progress offset ..
            for(var i = 0; i < offsets.length; ++i) {
                offset = offsets[i];

                // Make sure target has a URL collection for this offset
                if(!targetProgress.hasOwnProperty(offset)) {
                    targetProgress[offset] = { urls: [ ], blocked: false };
                }

                // Now, copy all the URLs
                var sourceURL;
                for(var j = 0; j < progressEvents[offset].urls.length; ++j) {
                    sourceURL = progressEvents[offset].urls[j];
                    targetProgress[offset].urls.push(sourceURL)
                }
            }
        }

        // Create a new MediaFile instance with its properties
        // identical to those of the source MediaFile
        function duplicateMediaFile(source) {
            var mediaFile = new videoplaza.adresponse.MediaFile();

            mediaFile.apiFramework = source.apiFramework;
            mediaFile.bitRate = source.bitRate;
            mediaFile.deliveryMethod = source.deliveryMethod;
            mediaFile.height = source.height;
            mediaFile.id = source.id;
            mediaFile.mimeType = source.mimeType;
            mediaFile.url = source.url;
            mediaFile.width = source.width;

            return mediaFile;
        }

        /*
            Replace ERRORCODE macro in all of 'ad's error URLs,
             & copy error events to impression
        */

        // No need to allocate this for every call
        var errorMacroRegex = /\[ERRORCODE\]|%5BERRORCODE%5D/g;

        function updateAdErrors(ad, errorCode) {
            if(!ad.trackingEvents.hasOwnProperty('error'))
                ad.trackingEvents['error'] = { urls: [], blocked: false };

            // Macro-ize & copy third party errors
            var errorUrls = ad.trackingEvents['error'].urls;

            for(var i = 0; i < errorUrls.length; ++i) {
                if(!errorUrls[i].thirdParty)
                    continue;

                if(errorCode)
                    errorUrls[i].url = errorUrls[i].url.replace(errorMacroRegex, encodeURIComponent(errorCode));

                // No impression id for errors (for now?)
                if(!ad.trackingEvents.hasOwnProperty('impression'))
                    ad.trackingEvents['impression'] = { urls: [], blocked: false };

                ad.trackingEvents['impression'].urls.push({ url: errorUrls[i].url, thirdParty: true });
            }
        }

        function  isVpHostSecure(vpHost) {
            return (vpHost.toLowerCase().indexOf("https") === 0);
        }

        function verifyVpHost(vpHost) {
            return (/(^(http|https)\:\/\/)?([a-z0-9\-]+)\.([a-z0-9\-]+)\.[a-z]+/i).test(vpHost);
        }


        return AdRequester;
    }());

    /**
     * All valid types you can pass in the insertionPointFilter list in requestSettings, as an argument to {@link videoplaza.adrequest.AdRequester.requestSession}.
     * These will determine when the received ads are to be played.
     *
     * @enum {string}
     * @memberOf videoplaza.adrequest.AdRequester
     */
    videoplaza.adrequest.AdRequester.InsertionPointType = {
        /** Request ads to be played before the content, or 'preroll' ads. */
        ON_BEFORE_CONTENT : "onBeforeContent",
        /** Request ads to be played during the content, or 'midroll' ads; don't forget to specify which positions the ads are to be played at, in the linearPlaybackPositions field.
            Additionality, specifying positions in the nonLinearPlaybackPositions field will request overlay ads. */
        PLAYBACK_POSITION : "playbackPosition",
        /** Request ads to be played after the content, or 'postroll' ads. */
        ON_CONTENT_END : "onContentEnd",
        /** Request ads to be played when the content is paused. */
        ON_PAUSE : "onPause",
        /** Request ads to be displayed based on the content duration. */
        PLAYBACK_TIME : "playbackTime"
    };

    var insertionPointTypeReverse = {};

    for(var key in videoplaza.adrequest.AdRequester.InsertionPointType) {
        var value = videoplaza.adrequest.AdRequester.InsertionPointType[key];

        insertionPointTypeReverse[value] = key;
    }

    /**
     * Potential content form values passed to {@link videoplaza.adrequest.AdRequester.requestSession}, used to
     * determine the ad insertion policy.
     *
     * @enum {string}
     * @memberOf videoplaza.adrequest.AdRequester
     */
    videoplaza.adrequest.AdRequester.ContentForm = {
        /** Short form content. Typically used for news summaries, game highlights and the like. */
        SHORT_FORM: 'shortForm',
        /** Long form content. Typically used for feature films, TV series, complete games, and the like. */
        LONG_FORM: 'longForm'
    };
})(videoplaza);

(function(videoplaza){
    videoplaza.adrequest.VASTParser = (function() {
        var progressOffsetRegex = /^(\d\d:\d\d:\d\d(.\d\d\d)?)$|^((100)|(\d\d?)|(1\d\d?\.0*)|(\d\d?\.\d?\d?)|(\.\d\d?))%$/;

        var VASTParser = function (options) {
            options = options || { };
            if(options.enforceCacheBusting !== false) {
                options.enforceCacheBusting = true;
            }

            if(options.useVASTSkipOffset !== true) {
                options.useVASTSkipOffset = false;
            }

            this.options = options;
            this.parser = new window.DOMParser();

            if (!(this instanceof videoplaza.adrequest.VASTParser)) {
                return new VASTParser();
            }

        };

        VASTParser.prototype.parse = function (ticket) {
            var doc,
                vastRoot,
                adNodes,
                errorNodes,
                error,
                vastVersion;

            try {
                doc = this.parser.parseFromString(ticket, 'text/xml');
            } catch(e) {
                error = new Error();
                error.message = 'Could not parse VAST. ' + e.message;
                error.errorCode = '100';
                throw error;
            }

            vastRoot = doc.documentElement;
            removeTextNodesAndComments(vastRoot);
            if (!vastRoot) {
                error = new Error();
                error.message = 'Could not parse VAST. No root element';
                error.errorCode = '100';
                throw error;
            } else if (vastRoot.nodeName !== 'VAST') {
                error = new Error();
                error.message = 'Could not parse VAST. Root element is not "VAST".';
                error.errorCode = '100';
                throw error;
            }

            vastVersion = getAttributeValue(vastRoot, 'version');

            var ad;
            if(vastRoot.hasChildNodes()){
                adNodes = vastRoot.getElementsByTagName('Ad'); // TODO: Add error handling
                errorNodes = vastRoot.getElementsByTagName('Error');
                if(vastRoot.firstChild.nodeName === "Ad") {
                    if (adNodes.length > 1) {
                        error = new Error();
                        error.message = 'Invalid VAST. Found more than one ad.';
                        error.errorCode = '101';
                        throw error;
                    }
                    ad = createAd.call(this, adNodes[0], vastVersion);
                } else if(vastRoot.firstChild.nodeName === "Error"){ // VAST 3 inventory ad / 'no ad response':
                    ad = new videoplaza.adresponse.Ad();
                    ad.id = '0';
                    ad.type = "inventory";

                    for (var j = 0; j < errorNodes.length; j++) {
                        if(!ad.trackingEvents.hasOwnProperty("error")) {
                            ad.trackingEvents["error"] = {urls: [], blocked: false};
                        }
                        ad.trackingEvents["error"].urls.push({url:addCacheBusting.call(this, trim(errorNodes[j].textContent), vastVersion),thirdParty:true});
                    }
                } else if(vastRoot.firstChild.nodeName === "parsererror") {
                    error = new Error();
                    error.message = 'Could not parse VAST. XML bad form: ' + trim(vastRoot.firstChild.textContent);
                    error.errorCode = '100';
                    throw error;
                }
            } else { // VAST 2 inventory ad / 'no ad response':
                ad = new videoplaza.adresponse.Ad();
                ad.id = '0';
                ad.type = "inventory";
            }

            // Sort media files by bitrate
            for(var i = 0; i < ad.creatives.length; ++i) {
                var creative = ad.creatives[i];
                if(!(creative instanceof videoplaza.adresponse.LinearCreative)) {
                    continue;
                }

                creative.mediaFiles.sort(function(a, b) {
                    if(!a.bitRate) {
                        a.bitRate = 0;
                    }

                    if(!b.bitRate) {
                        b.bitRate = 0;
                    }

                    // Both are VPAIDs
                    if(a.bitRate === 0 && b.bitRate === 0) {
                        return 0;
                    }

                    // a is VPAID: sort it earlier
                    if(a.bitRate === 0 & b.bitRate > 0) {
                        return -1;
                    }

                    // Vice versa
                    if(a.bitRate > 0 & b.bitRate === 0) {
                        return 1;
                    }

                    // two regular media files
                    return b.bitRate - a.bitRate;
                });
            }

            return ad;
        };


        function createAd(adNode, vastVersion) {
            var ad,
                vastAdTagUri,
                j,
                extentionNodes,
                adInfoNode,
                companionNodes,
                errorNodes,
                error,
                creativeNodes,
                surveyNodes,
                isVideoplazaAdSystem = false;


            ad = new videoplaza.adresponse.Ad();

            if (adNode.getElementsByTagName('AdSystem').length > 0) {
                var adSystem = adNode.getElementsByTagName('AdSystem')[0].textContent;
                if (adSystem && adSystem.toLowerCase().indexOf('videoplaza karbon') > -1) {
                    isVideoplazaAdSystem = true;
                }
            } else {
                error = new Error();
                error.message = 'Invalid VAST. VAST Ad missing "AdSystem" element.';
                error.errorCode = '101';
                throw error;
            }

            if (adNode.getElementsByTagName('AdTitle').length > 0) {
                var adTitle = adNode.getElementsByTagName('AdTitle')[0].textContent;
                if(adTitle) {
                    ad.title = adTitle;
                }
            }

            if (adNode.getElementsByTagName('Description').length > 0) {
                var adDescription = adNode.getElementsByTagName('Description')[0].textContent;
                if(adDescription) {
                    ad.description = adDescription;
                }
            }

            if (adNode.getElementsByTagName('Advertiser').length > 0) {
                var advertiser = adNode.getElementsByTagName('Advertiser')[0].textContent;
                if(advertiser) {
                    ad.advertiser = advertiser;
                }
            }

            if (adNode.firstChild.nodeName === 'Wrapper') {
                vastAdTagUri = adNode.getElementsByTagName('VASTAdTagURI');
                if (vastAdTagUri.length > 0) {
                    ad.thirdPartyURL = vastAdTagUri[0].textContent;
                } else {
                    error = new Error();
                    error.message = 'Invalid VAST. VAST Wrapper Ad missing VASTAdTagURI element.';
                    error.errorCode = '101';
                    throw error;
                }
            } else {
                vastAdTagUri = null;
            }

            ad.sequence = getAttributeValue(adNode, 'sequence') ? parseInt(getAttributeValue(adNode, 'sequence')) : 0;

            ad.id = getAttributeValue(adNode, 'id');
            if(ad.id === null) {
                if(isVideoplazaAdSystem) {
                    ad.id = '0';
                    ad.type = "inventory";
                } else {
                    ad.id = '';
                }
            }

            extentionNodes = adNode.getElementsByTagName('Extension');
            for (j = 0; j < extentionNodes.length; j++) {
                if (getAttributeValue(extentionNodes[j], 'type') === 'AdServer' && getAttributeValue(extentionNodes[j], 'name') === 'Videoplaza') {
                    adInfoNode = extentionNodes[j].getElementsByTagName('AdInfo')[0]; // TODO: Add error handling

                    ad.campaignId = getAttributeValue(adInfoNode, 'cid');
                    ad.customId = getAttributeValue(adInfoNode, 'customaid');
                    ad.customGoalId = getAttributeValue(adInfoNode, 'customgid');
                    ad.customCampaignId = getAttributeValue(adInfoNode, 'customcid');
                    ad.goalId = getAttributeValue(adInfoNode, 'gid');
                    ad.type = translateIncorrectAdType(getAttributeValue(adInfoNode, 'format'));
                    ad.variant =  validateAdVariant(getAttributeValue(adInfoNode, 'variant'));
                    ad.partOfAnExclusiveCampaign =  (getAttributeValue(adInfoNode, 'exclusive') === 'true');

                    companionNodes = adInfoNode.getElementsByTagName('Companion');
                }
            }

            parseImpressions.call(this, ad, adNode, 'Impression', 'impression', vastVersion);

            surveyNodes = adNode.getElementsByTagName('Survey');
            if(surveyNodes.length > 0) {
                ad.survey = trim(surveyNodes[0].textContent);
            }

            errorNodes = adNode.getElementsByTagName('Error');

            if (vastAdTagUri === null && isVideoplazaAdSystem && errorNodes.length === 0 &&
                ad.type === "inventory") {

                errorNodes = adNode.getElementsByTagName('Impression');
            }

            for (j = 0; j < errorNodes.length; j++) {
                if(!ad.trackingEvents.hasOwnProperty("error")) {
                    ad.trackingEvents["error"] = {urls: [], blocked: false};
                }
                ad.trackingEvents["error"].urls.push({url:addCacheBusting.call(this, trim(errorNodes[j].textContent), vastVersion),thirdParty:true});
            }

            creativeNodes = adNode.getElementsByTagName('Creative');


            if (!isVideoplazaAdSystem && creativeNodes.length === 0 && vastAdTagUri === null) {
                error = new Error();
                error.message = 'Invalid VAST. VAST InLine Ad missing creatives!';
                error.errorCode = '101';
                throw error;
            }

            ad.creatives = createCreatives.call(this, creativeNodes, ad, vastVersion);
            //If it's not a VPAID, make sure we have an impression tracking URL
            if(ad.creatives && ad.creatives[0] &&
                ad.creatives[0].mediaFiles &&
                ad.creatives[0].mediaFiles[0] &&
                ad.creatives[0].mediaFiles[0].apiFramework !== "VPAID" &&
                adNode.getElementsByTagName('Impression').length < 1) {
                error = new Error();
                error.message = 'Invalid VAST. VAST Ad missing Impression elements!';
                error.errorCode = '101';
                throw error;
            }

            // VAST 4 woohoo
            if(vastVersion === '4.0') {
                // conditional?
                var conditionalAd = getAttributeValue(adNode, 'conditionalAd');
                if(conditionalAd === 'false') {
                    ad.conditional = false;
                } else if(conditionalAd === 'true') {
                    ad.conditional = true;
                }

                // additional impression tracking
                var viewableImpressionsNode = adNode.getElementsByTagName('ViewableImpression');
                if(viewableImpressionsNode.length > 0) {
                    viewableImpressionsNode = viewableImpressionsNode[0];
                    parseImpressions.call(this, ad, viewableImpressionsNode, 'Viewable', 'impressionViewable', vastVersion);
                    parseImpressions.call(this, ad, viewableImpressionsNode, 'NotViewable', 'impressionNotViewable', vastVersion);
                    parseImpressions.call(this, ad, viewableImpressionsNode, 'ViewUndetermined', 'impressionViewUndetermined', vastVersion);
                }

                // Ad verifications
                var adVerifications = adNode.getElementsByTagName('AdVerifications')[0];
                if(adVerifications) {
                    var verificationNodes = adVerifications.getElementsByTagName('Verification');
                    for(var i = 0; i < verificationNodes.length; ++i) {
                        var adVerificationNode = verificationNodes[i];
                        var adVerification = { trackingEvents: { } };

                        var javascriptResource = adVerificationNode.getElementsByTagName('JavaScriptResource')[0];
                        if(javascriptResource) {
                            var javascriptResourceAPIFramework = getAttributeValue(javascriptResource, 'apiFramework');
                            //if(javascriptResourceAPIFramework) { <-- NOT REQUIRED? SOME IAB TEST TICKETS DO NOT CONTAIN API FRAMEWORK PARAM.
                                adVerification.javascriptResource = trim(javascriptResource.textContent);
                                adVerification.javascriptResourceAPIFramework = javascriptResourceAPIFramework;
                            //}
                        }

                        var flashResource = adVerificationNode.getElementsByTagName('FlashResource')[0];
                        if(flashResource) {
                            var flashResourceAPIFramework = getAttributeValue(flashResource, 'apiFramework');
                            //if(flashResourceAPIFramework) { <-- NOT REQUIRED? SOME IAB TEST TICKETS DO NOT CONTAIN API FRAMEWORK PARAM.
                                adVerification.flashResource = trim(flashResource.textContent);
                                adVerification.flashResourceAPIFramework = flashResourceAPIFramework;
                            //}
                        }

                        var viewableImpressionsNode = adVerificationNode.getElementsByTagName('ViewableImpression');
                        if(viewableImpressionsNode.length > 0) {
                            viewableImpressionsNode = viewableImpressionsNode[0];
                            parseImpressions.call(this, adVerification, viewableImpressionsNode, 'Viewable', 'impressionViewable', vastVersion);
                            parseImpressions.call(this, adVerification, viewableImpressionsNode, 'NotViewable', 'impressionNotViewable', vastVersion);
                            parseImpressions.call(this, adVerification, viewableImpressionsNode, 'ViewUndetermined', 'impressionViewUndetermined', vastVersion);
                        }

                        if(adVerification.javascriptResource || adVerification.flashResource) {
                            ad.verifications.push(adVerification);
                        }
                    }
                }

                // Ad categories
                var adCategories = adNode.getElementsByTagName('Category');
                for(var i = 0; i < adCategories.length; ++i) {
                    var categoryNode = adCategories[i];
                    var categoryLabel = trim(categoryNode.textContent);
                    var categoryAuthority = getAttributeValue(categoryNode, 'authority');

                    if(categoryAuthority) {
                        ad.categories.push({
                            label: categoryLabel,
                            authority: categoryAuthority
                        });
                    } else if(categoryLabel) { // Only fail if label is empty, so empty Category node is accepted. Iab examples contain empty Category node sometimes...
                        error = new Error();
                        error.message = 'Invalid VAST. Category without authority attribute.';
                        error.errorCode = '101';
                        throw error;
                    }
                }

                // Pricing
                var adPricing = adNode.getElementsByTagName('Pricing')[0];
                if(adPricing) {
                    var pricingModel = getAttributeValue(adPricing, 'model');
                    var pricingCurrency = getAttributeValue(adPricing, 'currency');
                    var pricingValue = parseFloat(trim(adPricing.textContent));

                    if(!pricingModel || !pricingCurrency) {
                        error.message = 'Invalid VAST. Pricing is missing model or currency attributes.';
                        error.errorCode = '101';
                        throw error;
                    }

                    pricingModel = pricingModel.toLowerCase();

                    if(
                        pricingModel !== 'cpm' &&
                        pricingModel !== 'cpc' &&
                        pricingModel !== 'cpe' &&
                        pricingModel !== 'cpv'
                    ) {
                        error.message = 'Invalid VAST. Unknown pricing model "' + pricingModel + '".';
                        error.errorCode = '101';
                        throw error;
                    }

                    ad.pricing = {
                        model: pricingModel,
                        currency: pricingCurrency,
                        value: pricingValue
                    };
                }
            }


            return ad;
        }

        function parseImpressions(target, sourceNode, tagName, eventName, vastVersion) {
            var impressionNodes = sourceNode.getElementsByTagName(tagName);
            for (var i = 0; i < impressionNodes.length; i++) {
                if(!target.trackingEvents.hasOwnProperty(eventName)) {
                    target.trackingEvents[eventName] = { urls: [ ], blocked: false };
                }
                var id = getAttributeValue(impressionNodes[i], 'id');
                if(id){
                    target.trackingEvents[eventName].urls.push({ id: id, url: addCacheBusting.call(this, trim(impressionNodes[i].textContent), vastVersion), thirdParty: true });
                } else {
                   target.trackingEvents[eventName].urls.push({ url: addCacheBusting.call(this, trim(impressionNodes[i].textContent), vastVersion), thirdParty: true });
                }
            }
        }

        function createCreatives(creativeNodes, ad, vastVersion) {
            var creatives = [],
                linearNode,
                nonlinearNode,
                companionNode,
                creativeId,
                duration,
                error,
                trackingEventsUris,
                j,
                clickTrackingNodes,
                clickThroughUris,
                mediaFileNodes,
                mediaFile,
                resourceTypeTranslation = {
                    'StaticResource': "staticResource",
                    'IFrameResource': "iFrame",
                    'HTMLResource': "html"
                },
                resourceNode,
                nonLinearNodes,
                companionAdsRequired,
                skipOffset;

                var linearCreativeCount = 0;

            for (var i = 0; i < creativeNodes.length; i++) {
                creativeId = getAttributeValue(creativeNodes[i], 'id');

                var creative;
                linearNode = creativeNodes[i].getElementsByTagName('Linear')[0];
                nonlinearNode = creativeNodes[i].getElementsByTagName('NonLinearAds')[0];
                companionNode = creativeNodes[i].getElementsByTagName('CompanionAds')[0];

                if (linearNode) {
                    ++linearCreativeCount;
                    creative = new videoplaza.adresponse.LinearCreative();
                    creative.parentAd = ad;
                    creative.type = 'linear';
                    creative.id = creativeId;
                    creative.sequence = getAttributeValue(creativeNodes[i], 'sequence') ? parseInt(getAttributeValue(creativeNodes[i], 'sequence')) : 0;

                    trackingEventsUris = creativeNodes[i].getElementsByTagName('TrackingEvents');
                    if (trackingEventsUris.length > 0) {
                        creative.trackingEvents = createTrackingUris.call(this, trackingEventsUris[0], vastVersion);
                    }

                    clickTrackingNodes = creativeNodes[i].getElementsByTagName('ClickTracking');
                    for (j = 0; j < clickTrackingNodes.length; j++) {
                        if(!creative.trackingEvents.hasOwnProperty("clickthrough")) {
                            creative.trackingEvents["clickthrough"] = {urls: [], blocked: false};
                        }
                        creative.trackingEvents["clickthrough"].urls.push({url:addCacheBusting.call(this, trim(clickTrackingNodes[j].textContent), vastVersion),thirdParty:true});
                    }

                    var customClickNodes = creativeNodes[i].getElementsByTagName('CustomClick');
                    for (var l = 0; l < customClickNodes.length; l++) {
                        if(!creative.trackingEvents.hasOwnProperty("customClick")) {
                            creative.trackingEvents["customClick"] = {urls: [], blocked: false};
                        }
                        creative.trackingEvents["customClick"].urls.push({url:addCacheBusting.call(this, trim(customClickNodes[l].textContent), vastVersion),thirdParty:true});
                    }

                    clickThroughUris = creativeNodes[i].getElementsByTagName('ClickThrough');
                    if (clickThroughUris.length > 0) {
                        creative.clickThroughUrl = trim(clickThroughUris[0].textContent);
                    }

                    mediaFileNodes = creativeNodes[i].getElementsByTagName('MediaFile');
                    //If this is not a wrapper, mediaFiles are required:
                    if(ad.thirdPartyURL.length === 0) {
                        if(!mediaFileNodes || mediaFileNodes.length === 0){
                            error = new Error();
                            error.message = 'Invalid VAST. Creative element has no MediaFiles.';
                            error.errorCode = '101';
                            throw error;
                        } else {
                            for (j = 0; j < mediaFileNodes.length; j++) {
                                mediaFile = new videoplaza.adresponse.MediaFile();
                                if(!getAttributeValue(mediaFileNodes[j], 'delivery')) {
                                    error = new Error();
                                    error.message = 'Invalid VAST. MediaFile missing property "delivery".';
                                    error.errorCode = '101';
                                    throw error;
                                } else if(!getAttributeValue(mediaFileNodes[j], 'width')) {
                                    error = new Error();
                                    error.message = 'Invalid VAST. MediaFile missing property "width".';
                                    error.errorCode = '101';
                                    throw error;
                                } else if(!getAttributeValue(mediaFileNodes[j], 'height')) {
                                    error = new Error();
                                    error.message = 'Invalid VAST. MediaFile missing property "height".';
                                    error.errorCode = '101';
                                    throw error;
                                } else if(!getAttributeValue(mediaFileNodes[j], 'type')) {
                                    error = new Error();
                                    error.message = 'Invalid VAST. MediaFile missing property "type".';
                                    error.errorCode = '101';
                                    throw error;
                                }

                                mediaFile.apiFramework = getAttributeValue(mediaFileNodes[j], 'apiFramework');
                                mediaFile.bitRate = parseFloat(getAttributeValue(mediaFileNodes[j], 'bitrate'));
                                mediaFile.deliveryMethod = getAttributeValue(mediaFileNodes[j], 'delivery');
                                mediaFile.height = parseFloat(getAttributeValue(mediaFileNodes[j], 'height'));
                                mediaFile.id = getAttributeValue(mediaFileNodes[j], 'id');
                                mediaFile.mimeType = getAttributeValue(mediaFileNodes[j], 'type');
                                mediaFile.url = mediaFileNodes[j].textContent;
                                mediaFile.width = parseFloat(getAttributeValue(mediaFileNodes[j], 'width'));
                                creative.mediaFiles.push(mediaFile);
                            }
                        }

                        if(vastVersion === '4.0') {
                            // Universal ad id
                            var universalAdIdNode = creativeNodes[i].getElementsByTagName('UniversalAdId')[0];
                            if(universalAdIdNode) {
                                var universalAdId = trim(universalAdIdNode.textContent);
                                var universalAdIdRegistry = getAttributeValue(universalAdIdNode, 'idRegistry');

                                if(!universalAdIdRegistry) {
                                    universalAdIdRegistry = 'unknown';
                                }

                                creative.universalAdId = {
                                    identifier: universalAdId,
                                    registry: universalAdIdRegistry
                                };
                            } else {
                                error = new Error();
                                error.message = 'Invalid VAST. VAST 4.0 creative without UniversalAdId element.';
                                error.errorCode = '101';
                                throw error;
                            }
                        }
                    } else {
                        //If this IS a wrapper, mediaFiles are not allowed:
                        if(mediaFileNodes.length !== 0) {
                            error = new Error();
                            error.message = 'Invalid VAST. MediaFile elements not allowed in Wrapper Linear.';
                            error.errorCode = '101';
                            throw error;
                        }
                    }

                    //If this is not a wrapper, duration is required:
                    if(ad.thirdPartyURL.length === 0) {
                        duration = creativeNodes[i].getElementsByTagName('Duration');
                        if(!duration || duration.length === 0) {
                            error = new Error();
                            error.message = 'Invalid VAST. No Duration element.';
                            error.errorCode = '101';
                            throw error;
                        } else {
                            try {
                                creative.duration = convertFromStandardFormatTimeToSeconds(duration[0].textContent);
                            } catch(e) {
                                creative.duration = undefined;
                            }
                        }
                    } else {
                        duration = 0;
                    }


                    // Convert skipOffset to seconds if possible
                    skipOffset = getAttributeValue(linearNode, 'skipoffset');

                    creative.skipResetTime = 0;
                    if(skipOffset) {
                        var offsetInSeconds;


                        // Percentage value:
                        if(skipOffset.indexOf("%") > -1) {
                            // If we have duration, we can calculate the real value
                            if(creative.duration) {
                                var percentage = parseFloat(String(skipOffset).substring(0, skipOffset.indexOf("%")));

                                if(isNaN(percentage)) {
                                    offsetInSeconds = undefined;
                                } else {
                                    offsetInSeconds = (creative.duration || 0) * (percentage / 100);
                                }
                            // Otherwise leave the original
                            } else {
                                offsetInSeconds = skipOffset;
                            }
                        // Timestamp value:
                        } else {
                            offsetInSeconds = convertFromStandardFormatTimeToSeconds(skipOffset);
                        }

                        creative.skipOffset = offsetInSeconds;
                        creative.skipButtonMode = videoplaza.adresponse.LinearCreative.SkipButtonMode.ALWAYS;
                    } else {
                        creative.skipButtonMode = videoplaza.adresponse.LinearCreative.SkipButtonMode.NEVER;
                    }

                    creative.adParameters =  creativeNodes[i].getElementsByTagName('AdParameters');
                    if (creative.adParameters.length > 0) {
                        creative.adParameters = trim(creative.adParameters[0].textContent);
                    } else {
                        creative.adParameters = null;
                    }

                    creatives.push(creative);
                } else if(nonlinearNode && ad.thirdPartyURL.length === 0) {
                    var nonlinearAds = nonlinearNode.getElementsByTagName('NonLinear');
                    if(nonlinearAds.length > 0) {                        
                        error = new Error();
                        error.message = 'Invalid VAST. VAST nonlinear creatives not accepted.';
                        error.errorCode = '101';
                        throw error;
                    }
                } else if (companionNode) {
                    // On VAST 3, invalidate ticket if any companion is required
                    if(vastVersion === '3.0') {
                        companionAdsRequired = getAttributeValue(companionNode, 'required');

                        if(companionAdsRequired !== null && companionAdsRequired !== 'none') {
                            error = new Error();
                            error.message = 'Invalid VAST. VAST 3.0 companions not accepted unless "required" attribute is "none".';
                            error.errorCode = '101';
                            throw error;
                        }
                    }
                } else {

                }
            }

            if(linearCreativeCount > 1) {
                error = new Error();
                error.message = 'Invalid VAST. Ads with multiple linear creatives are not supported.';
                error.errorCode = '101';
                throw error;
            }

            return creatives;
        }



        function createTrackingUris(trackingEventsNode, vastVersion) {
            var newTrackingUris,
                trackingNodes,
                trackingNode,
                trackingEvent,
                progressOffset;

            newTrackingUris = {};
            trackingNodes = trackingEventsNode.getElementsByTagName('Tracking');
            for (var i = 0; i < trackingNodes.length; i++) {
                trackingNode = trackingNodes.item(i);

                trackingEvent = getAttributeValue(trackingNode, 'event');

                // Special cases: acceptInvitationLinear, closeLinear:
                if(trackingEvent.toLowerCase() === "acceptinvitationlinear") {
                    trackingEvent = videoplaza.tracking.Tracker.CreativeEventType.ACCEPT_INVITATION;
                } else if(trackingEvent.toLowerCase() === "closelinear") {
                    trackingEvent = videoplaza.tracking.Tracker.CreativeEventType.CLOSE;
                }

                // Special case: progress event
                if(trackingEvent === 'progress') {
                    progressOffset = getAttributeValue(trackingNode, 'offset');

                    if(!isValidProgressOffset(progressOffset)) {
                        var error = new Error();
                        error.message = 'Invalid VAST. Progress event with missing or invalid offset value.';
                        error.errorCode = '101';
                        throw error;
                    }

                    // Extra inner level for progress offset
                    if(!newTrackingUris.hasOwnProperty(trackingEvent)) {
                        newTrackingUris[trackingEvent] = {};
                    }

                    if(!newTrackingUris[trackingEvent].hasOwnProperty(progressOffset)) {
                        newTrackingUris[trackingEvent][progressOffset] = { urls: [], blocked: false };
                    }

                    newTrackingUris[trackingEvent][progressOffset].urls.push({url:addCacheBusting.call(this, trim(trackingNode.textContent), vastVersion),thirdParty:true});

                } else {
                    if(!newTrackingUris.hasOwnProperty(trackingEvent)) {
                        newTrackingUris[trackingEvent] = { urls: [], blocked: false };
                    }

                    newTrackingUris[trackingEvent].urls.push({url:addCacheBusting.call(this, trim(trackingNode.textContent), vastVersion),thirdParty:true});
                }
            }

            return newTrackingUris;
        }

        // HELPER FUNCTIONS:

        function isValidProgressOffset(offset) {
            return offset && offset.match(progressOffsetRegex) !== null;
        }

        // Helper function to convert duration from standard Standard format time (ISO 8601 <hh:mm:ss[.ff]) to seconds.
        function convertFromStandardFormatTimeToSeconds(time) {
            var components = time.split(':'),
                secs = 0;

            if (!(components.length > 0 && components.length <= 3)){
                throw new Error('Invalid VAST. Invalid timestamp format');
            }

            for (var i = 0; i < components.length; i++) {
                secs += Number(components[components.length - i - 1] * (i ? Math.pow(60, i) : 1));
            }

            if (isNaN(secs)) {
                throw new Error('Invalid VAST. Invalid timestamp format');
            }

            return secs;
        }

        function addCacheBusting(uri, version) {
           if(this.options.enforceCacheBusting) {
            if (version === '2.0' && uri.indexOf('[CACHEBUSTING]') === -1 && uri.indexOf('%5BCACHEBUSTING%5D') === -1 && uri.length > 0 ) {
                if (uri.indexOf('?') > -1) {
                    uri = uri + '&rnd=[CACHEBUSTING]';
                } else {
                    uri = uri + '?rnd=[CACHEBUSTING]';
                }
            }
           }
            return uri;
        }

        function validateAdVariant(variant) {

            if (variant) {
                variant = variant.toLowerCase();
                if (variant === 'bumper' || variant === "sponsor") {
                    return "sponsor";
                }
            }

            return "normal";
        }

        function getAttributeValue(node, attributeName) {
            var attribute;

            if (node && node.attributes) {
                attribute = node.attributes.getNamedItem(attributeName);
                if (attribute) {
                    return attribute.value;
                }
            }
            return null;
        }

        function translateIncorrectAdType(adType){
            if (adType === 'spot_standard') {
                return 'standard_spot';
            } else {
                return adType;
            }
        }

        //from http://stackoverflow.com/questions/5817069/dom-navigation-eliminating-the-text-nodes
        function removeTextNodesAndComments(node) {
            var regBlank = /^\s*$/,
                child,
                next;

            if (node.nodeType === 3) {
                if (regBlank.test(node.nodeValue)) {
                    node.parentNode.removeChild(node);
                }
            } else if ((node.nodeType === 8)  && (node.nodeName === "#comment")) {
                node.parentNode.removeChild(node);
            } else if (node.nodeType === 1 || node.nodeType === 9) {
                child = node.firstChild;
                while (child) {
                    next = child.nextSibling;
                    removeTextNodesAndComments(child);
                    child = next;
                }
            }
        }

        function trim(str) {
            return str.replace(/^\s+|\s+$/g, '');
        }



        return VASTParser;
    })();

    // Maintain previous name for core integrations backwards compatibility
    videoplaza.adrequest.VAST3Parser = videoplaza.adrequest.VASTParser;
})(videoplaza);

(function(videoplaza){

    videoplaza.adrequest.VPTP3Parser = (function(){

        var VPTP3Parser = function (previewMode){
            // TODO:
            if(!(this instanceof videoplaza.adrequest.VPTP3Parser)){
                return new VPTP3Parser(previewMode);
            }

            this._previewMode = previewMode;
        };

        VPTP3Parser.prototype.parse = function(jsonTicket) {
            var session = new videoplaza.adresponse.Session();

            session.id          = jsonTicket.tid  || "";
            session.language    = jsonTicket.lang || "";

            //TODO:: What should be added to trackingEvents, list or entire object ?
            // Parse Session TrackingEvents
            if(hasOwnPropertyWithValidKey(jsonTicket,"trackingEvents")){
                session.trackingEvents = parseSessionTrackingEvents(jsonTicket.trackingEvents);
            } else {
                //TODO: VPAID passback Konnect tickets provided as parameters will not contain trackingEvents on root. How to validate?
                //throw new Error("VPTP Ticket is missing trackingEvents!");
            }
            // Parse Session InsertionPoints
            if(hasOwnPropertyWithValidKey(jsonTicket,"insertionPoint")) {
                session.insertionPoints = parseInsertionPoints(jsonTicket.insertionPoint, session, this._previewMode);

            } else {
                throw new Error("VPTP Ticket is missing insertionPoints!");
            }

            return session;
        };

        function parseSessionTrackingEvents(trackingEvents){
            var result = [];
            if(Object.prototype.toString.call( trackingEvents) === "[object Object]") {
                if(trackingEvents.tracking.length > 0) {
                    for(var i = 0; i < trackingEvents.tracking.length; i++){

                        if(result[trackingEvents.tracking[i].event])
                        {
                            result[trackingEvents.tracking[i].event].urls.push({url:trackingEvents.tracking[i].value});
                        }
                        else
                        {
                            result[trackingEvents.tracking[i].event] = {
                                urls: [{url:trackingEvents.tracking[i].value}],
                                blocked : false
                            };
                        }
                    }
                } else {
                    throw new Error("VPTP Ticket trackingEvents.tracking can not be empty");
                }

            }else {
                throw new Error("VPTP Ticket trackingEvents should be object but is " + Object.prototype.toString.call(trackingEvents));
            }
            return result;
        }

        function parseInsertionPoints(insertionPoint, session, previewMode){
            var result = [];

            if(Object.prototype.toString.call(insertionPoint) === "[object Array]") {
                //InsertionPoints can be empty, so we don't look for that.
                for (var ip = 0; ip < insertionPoint.length; ip++) {
                    var inPoint = new videoplaza.adresponse.InsertionPoint();
                    inPoint.parentSession = session;

                    if (hasOwnPropertyWithValidKey(insertionPoint[ip],"conditions")) {
                        // Parse Conditions in Session.InsertionPoints
                        inPoint.conditions = parseConditions(insertionPoint[ip].conditions.condition);
                    } else {
                        throw new Error("VPTP Ticket insertionPoint is missing conditions!");
                    }

                    if (hasOwnPropertyWithValidKey(insertionPoint[ip],"slot")) {
                        // Parse Slots in Session.InsertionPoints
                        inPoint.slots = parseSlot(insertionPoint[ip].slot, inPoint, session, previewMode);
                    } else {
                        throw new Error("VPTP Ticket insertionPoint is missing slots!");
                    }


                    result.push(inPoint);
                }
            }else {
                throw new Error("VPTP Ticket insertionPoint should be array but is " + Object.prototype.toString.call( insertionPoint));
            }
            return result;
        }

        function parseSlot(slot, inPoint, session, previewMode){
            var result = [];
            if (Object.prototype.toString.call(slot) === "[object Array]") {
                if(slot.length > 0){
                    for (var s = 0; s < slot.length; s++) {
                        var currentSlotData = slot[s];
                        var newSlot = new videoplaza.adresponse.Slot();
                        newSlot.parentInsertionPoint = inPoint;

                        if(hasOwnPropertyWithValidKey(currentSlotData, "trackingEvents")){
                            if(Object.prototype.toString.call(currentSlotData.trackingEvents) === "[object Object]"){
                                if(hasOwnPropertyWithValidKey(currentSlotData.trackingEvents,"tracking")){
                                    if(Object.prototype.toString.call(currentSlotData.trackingEvents.tracking) === "[object Array]"){
                                        for (var i = 0; i < currentSlotData.trackingEvents.tracking.length; ++i) {
                                            var trackingObject = currentSlotData.trackingEvents.tracking[i];
                                            if(hasOwnPropertyWithValidKey(trackingObject,"event")){
                                                if(typeof(trackingObject.event) === "string" ){
                                                    if(hasOwnPropertyWithValidKey(trackingObject,"value")){
                                                        if(typeof(trackingObject.value) === "string"){
                                                            if(newSlot.trackingEvents[trackingObject.event])
                                                            {
                                                                newSlot.trackingEvents[trackingObject.event].urls.push({url:trackingObject.value});
                                                            }
                                                            else
                                                            {
                                                                newSlot.trackingEvents[trackingObject.event] = {
                                                                    urls: [{url:trackingObject.value}],
                                                                    blocked : false
                                                                };
                                                            }
                                                        } else {
                                                            throw new Error("VPTP Ticket slot.trackingEvent object value property should be string but is " + typeof(trackingObject.value));
                                                        }
                                                    } else {
                                                        throw new Error("VPTP Ticket slot.trackingEvent object is missing value property!");
                                                    }
                                                } else {
                                                    throw new Error("VPTP Ticket slot.trackingEvent object event property should be string but is " + typeof(trackingObject.event));
                                                }
                                            }else{
                                                throw new Error("VPTP Ticket slot.trackingEvent object is missing event property!");
                                            }
                                        }
                                    } else {
                                        throw new Error("VPTP Ticket insertionPoint.slot.trackingEvents.tracking should be array but is " + Object.prototype.toString.call(currentSlotData.trackingEvents.tracking));
                                    }

                                }else {
                                    throw new Error("VPTP Ticket slot.trackingEvents is missing tracking object!");
                                }
                            } else {
                                throw new Error("VPTP Ticket insertionPoint.slot.trackingEvents should be object but is " + Object.prototype.toString.call(currentSlotData.trackingEvents));
                            }
                        } else {
                            // Slots does not necessarily carry trackingEvents (ie nonLinear ads).
                            //TODO: Possibly add error if ad is linear, as linears should carry slotStart.
                        }
                        // Loop through ads
                        if(hasOwnPropertyWithValidKey(currentSlotData,"vast")) {
                            if(hasOwnPropertyWithValidKey(currentSlotData.vast, "ad")) {
                                if(Object.prototype.toString.call(currentSlotData.vast.ad) === "[object Array]"){
                                    if(currentSlotData.vast.ad.length > 0){
                                        var slotAdsData = currentSlotData.vast.ad;
                                        var adCount = slotAdsData.length;
                                        var newAds = [];

                                        for(var m = 0; m < adCount; m++) {
                                            var ad = null;

                                            if (hasOwnPropertyWithValidKey(slotAdsData[m], "inLine")) {
                                                if(Object.prototype.toString.call(slotAdsData[m].inLine) === "[object Object]") {
                                                    if (hasOwnPropertyWithValidKey(slotAdsData[m].inLine, "creatives")) {
                                                        if(Object.prototype.toString.call(slotAdsData[m].inLine.creatives) === "[object Object]") {
                                                            if(hasOwnPropertyWithValidKey(slotAdsData[m].inLine.creatives, "creative")){
                                                                if(Object.prototype.toString.call(slotAdsData[m].inLine.creatives.creative) === "[object Array]") {
                                                                    for (var c = 0; c < slotAdsData[m].inLine.creatives.creative.length; c++) {
                                                                        var creative = slotAdsData[m].inLine.creatives.creative[c];

                                                                        if (hasOwnPropertyWithValidKey(creative, "linear")) {
                                                                            if(Object.prototype.toString.call(creative.linear) === "[object Object]") {
                                                                                if (hasOwnPropertyWithValidKey(creative.linear,"adParameters")) {
                                                                                    if(Object.prototype.toString.call(creative.linear.adParameters) === "[object Object]") {
                                                                                        if (hasOwnPropertyWithValidKey(creative.linear.adParameters,"value")) {
                                                                                            if (Object.prototype.toString.call(creative.linear.adParameters.value) === "[object String]") {
                                                                                                creative.linear.adParameters.value = JSON.parse(creative.linear.adParameters.value);
                                                                                            } else {
                                                                                                throw new Error("Unparsed AdParameters.value should be string but is " + Object.prototype.toString.call(creative.linear.adParameters.value));
                                                                                            }
                                                                                        } else {
                                                                                            throw new Error("Linear AdParameters is missing 'value' property!");
                                                                                        }
                                                                                    } else {
                                                                                        throw new Error("Linear AdParameters should be object but is " + Object.prototype.toString.call(creative.linear.adParameters));
                                                                                    }
                                                                                } else {
                                                                                    throw new Error("Linear is missing AdParameters!");
                                                                                }
                                                                            } else {
                                                                                throw new Error("Creative.linear should be object but is " + Object.prototype.toString.call(creative.linear));
                                                                            }
                                                                        } else if(hasOwnPropertyWithValidKey(creative, "nonLinearAds")) {
                                                                            // Try to parse wrapped nonLinear ad
                                                                            if(Object.prototype.toString.call(creative.nonLinearAds) !== "[object Object]") {
                                                                                throw new Error("Creative.nonLinearAds should be object but is " + Object.prototype.toString.call(creative.nonLinearAds));
                                                                            }

                                                                            if(!hasOwnPropertyWithValidKey(creative.nonLinearAds, "nonLinear")) {
                                                                                throw new Error("Creative.nonLinearAds is missing nonLinear!");
                                                                            }

                                                                            if(Object.prototype.toString.call(creative.nonLinearAds.nonLinear) !== "[object Array]") {
                                                                                throw new Error("Creative.nonLinearAds.nonLinear should be array but is " + Object.prototype.toString.call(creative.nonLinearAds.nonLinear));
                                                                            }

                                                                            if(creative.nonLinearAds.nonLinear.length === 0) {
                                                                                throw new Error("Creative.nonLinearAds.nonLinear is empty!");
                                                                            }

                                                                            if(!hasOwnPropertyWithValidKey(creative.nonLinearAds.nonLinear[0],"adParameters")) {
                                                                                throw new Error("Creative.nonLinearAds.nonLinear is missing AdParameters!");
                                                                            }

                                                                            if(Object.prototype.toString.call(creative.nonLinearAds.nonLinear[0].adParameters) !== "[object Object]") {
                                                                                throw new Error("Creative.nonLinearAds.nonLinear.adParameters should be object but is " + Object.prototype.toString.call(creative.nonLinearAds.nonLinear[0].adParameters));
                                                                            }

                                                                            if(!hasOwnPropertyWithValidKey(creative.nonLinearAds.nonLinear[0].adParameters,"value")) {
                                                                                throw new Error("Creative.nonLinearAds.nonLinear.adParameters is missing 'value' property!");
                                                                            }

                                                                            if (Object.prototype.toString.call(creative.nonLinearAds.nonLinear[0].adParameters.value) !== "[object String]") {
                                                                                throw new Error("Unparsed AdParameters.value should be string but is " + Object.prototype.toString.call(creative.nonLinearAds.nonLinear[0].adParameters.value));
                                                                            }

                                                                            // All clear
                                                                            creative.nonLinearAds.nonLinear[0].adParameters.value = JSON.parse(creative.nonLinearAds.nonLinear[0].adParameters.value);
                                                                        } else {
                                                                            throw new Error("Creative is missing linear or nonLinearAds property!");
                                                                        }

                                                                        if(c === 0) {
                                                                            if(hasOwnPropertyWithValidKey(creative,"linear")) {
                                                                                if (hasOwnPropertyWithValidKey(creative.linear, "mediaFiles")) {
                                                                                    if (hasOwnPropertyWithValidKey(creative.linear.mediaFiles, "mediaFile")) {
                                                                                        if(Object.prototype.toString.call(creative.linear.mediaFiles.mediaFile) === "[object Array]"){
                                                                                            if (creative.linear.mediaFiles.mediaFile.length === 0) {
                                                                                                ad = createAd(slotAdsData[m], newSlot, previewMode);
                                                                                            } else if (hasOwnPropertyWithValidKey(creative.linear.mediaFiles.mediaFile[0],"value")) {
                                                                                                if(typeof(creative.linear.mediaFiles.mediaFile[0].value) === "string") {
                                                                                                    //Ignore spot_selector, it's not supported.
                                                                                                    if(creative.linear.mediaFiles.mediaFile[0].value.indexOf("spot_selector") != -1) {
                                                                                                        ad = createAd(slotAdsData[m], newSlot, previewMode);
                                                                                                        ad.type = videoplaza.adresponse.Ad.AdType.SPOT_SELECTOR;
                                                                                                    }
                                                                                                } else {
                                                                                                    throw new Error("VPTP MediaFile value property should be string but is " + typeof(creative.linear.mediaFiles.mediaFile[0].value));
                                                                                                }

                                                                                            } else {
                                                                                                throw new Error("VPTP MediaFile missing value property!");
                                                                                            }
                                                                                        } else {
                                                                                            throw new Error("VPTP Linear Creative.mediaFiles.mediaFile should be Array but is " + Object.prototype.toString.call(creative.linear.mediaFiles.mediaFile));
                                                                                        }
                                                                                    } else {
                                                                                        //Creatives does not have to have mediaFiles
                                                                                    }

                                                                                } else {
                                                                                    //Creatives does not have to have mediaFiles
                                                                                }

                                                                                if(!ad) {
                                                                                    ad = createAd(slotAdsData[m].inLine.creatives.creative[0].linear.adParameters.value.ad[0], newSlot, previewMode);
                                                                                }
                                                                            } else if(hasOwnPropertyWithValidKey(creative, "nonLinearAds")) {
                                                                                ad = createAd(slotAdsData[m].inLine.creatives.creative[0].nonLinearAds.nonLinear[0].adParameters.value.ad[0], newSlot, previewMode);
                                                                            }
                                                                        } else {
                                                                            // Creatives does not have to have linears or nonlinears.
                                                                        }
                                                                    }
                                                                } else {
                                                                    throw new Error("VPTP Ticket ad.inLine.creatives.creative property should be array but is " + Object.prototype.toString.call(slotAdsData[m].inLine.creatives.creative));
                                                                }

                                                            } else {
                                                                throw new Error("VPTP Ticket ad.inLine.creatives missing 'creative' property!");
                                                            }
                                                        } else {
                                                            throw new Error("VPTP Ticket ad.inLine.creatives property should be object but is " + Object.prototype.toString.call(slotAdsData[m].inLine.creatives));
                                                        }
                                                    } else {
                                                        ad = createAd(slotAdsData[m], newSlot, previewMode);
                                                        ad.type = "inventory";
                                                    }
                                                } else {
                                                    throw new Error("VPTP Ticket ad.inLine property should be object but is " + Object.prototype.toString.call(slotAdsData[m].inLine));
                                                }
                                            } else {
                                                throw new Error("VPTP Ticket ad missing 'inLine' property!");
                                            }

                                            /*
                                                Calculate optimal timeout value if necessary

                                                Ad type is probably always undefined here but
                                                    not 100% sure
                                            */
                                            if(ad != null) {
                                                if(ad.type !== 'spot_selector' && ad.ads.length > 0) {
                                                    var totalInnerTimeout = 0;

                                                    for(var innerAd = 0; innerAd < ad.ads.length; ++innerAd) {
                                                        totalInnerTimeout += ad.ads[innerAd].maximumPreparationTime;
                                                    }

                                                    ad.maximumPreparationTime = Math.min(ad.maximumPreparationTime, totalInnerTimeout);
                                                }
                                                //inSkin, interactive, selector and takeover ads are not supported, convert these to inventory
                                                switch(ad.type) {
                                                    case videoplaza.adresponse.Ad.AdType.SKIN_INSKIN:
                                                    case videoplaza.adresponse.Ad.AdType.SPOT_INTERACTIVE:
                                                    case videoplaza.adresponse.Ad.AdType.SPOT_SELECTOR:
                                                    case videoplaza.adresponse.Ad.AdType.SPOT_TAKEOVER:
                                                        ad = createInventoryAd(ad);
                                                    default:
                                                        newAds.push(ad);
                                                }
                                            }
                                        }

                                        newSlot.ads = newAds;
                                    } else {
                                        throw new Error("VPTP Ticket insertionPoint.slot.vast.ad array is empty!");
                                    }
                                } else {
                                    throw new Error("VPTP Ticket insertionPoint.slot.vast.ad property should be array but is " + Object.prototype.toString.call(currentSlotData.vast.ad));
                                }

                            } else {
                                throw new Error("VPTP Ticket insertionPoint.slot.vast missing 'ad' property!");
                            }

                        } else {
                            throw new Error("VPTP Ticket insertionPoint.slot missing VAST property!");
                        }
                        result.push(newSlot);
                    }

                } else {
                    throw new Error("VPTP Ticket insertionPoint.slot cannot be empty!");
                }
            } else {
                throw new Error("VPTP Ticket insertionPoint.slot should be array but is " + Object.prototype.toString.call(slot));
            }

            return result;
        }

        function createAd(adData, slot, previewMode, candidateNumber) {
            var ad = new videoplaza.adresponse.Ad();
            ad.parentSlot = slot;

            if(candidateNumber){
                ad.candidate = candidateNumber;
            } else {
                ad.candidate = 1;
            }


            // The ready flag gets set to false if requestType is lazy, inside parseAdInfo();
            // therefore default to true
            ad.ready = true;

            // Get the ad ID
            if(hasOwnPropertyWithValidKey(adData,"id")) {
                ad.id = adData.id;
            } else {
                //VPTP Inventory ads don't have id.
                //throw new Error("VPTP Ad missing id property!");
            }

            if(hasOwnPropertyWithValidKey(adData,"inLine") || hasOwnPropertyWithValidKey(adData,"wrapper")) {

                var adType = "inLine";

                if(hasOwnPropertyWithValidKey(adData,"wrapper")) {
                    adType = "wrapper";

                    if(hasOwnPropertyWithValidKey(adData[adType],"vastadTagURI")) {
                        if(adData[adType].vastadTagURI.length > 0) {
                            ad.thirdPartyURL = adData[adType].vastadTagURI;
                        } else {
                            throw new Error("VPTP Wrapper ad vastadTagURI is empty!");
                        }
                    } else {
                        throw new Error("VPTP Wrapper ad missing vastadTagURI!");
                    }
                }

                if(hasOwnPropertyWithValidKey(adData[adType],"impression")) {
                    if (Object.prototype.toString.call(adData[adType].impression) === "[object Array]") {
                        if (adData[adType].impression.length > 0) {
                            var impressionData = adData[adType].impression;
                            var impressionCount = impressionData.length;

                            for (var i = 0; i < impressionCount; i++) {
                                var currentImpressionItem = impressionData[i];
                                //Create the object carrying impression tracking upfront if it doesn't already exist:
                                if (!hasOwnPropertyWithValidKey(ad.trackingEvents, "impression")) {
                                    ad.trackingEvents.impression = {
                                        urls: [],
                                        blocked: false
                                    };
                                }

                                // inline ads can have id therefore the url is wrapped in the value property of an object
                                if (adType === "inLine" && hasOwnPropertyWithValidKey(currentImpressionItem, "value")) {
                                    ad.trackingEvents.impression.urls.push({url:currentImpressionItem.value.toString()});
                                }
                                else if (adType === "wrapper") {
                                    ad.trackingEvents.impression.urls.push({url:currentImpressionItem.toString()});
                                } // no need to check for other adType, as we already do that and throw error if it's not one of these
                            }
                        } else {
                              //Passbacks don't have impressions (and neither does any vpPreview ticket):
                            //throw new Error("VPTP ad , that is NOT a passback, has empty impression array!")
                        }
                    } else {
                        throw new Error("VPTP ad " + adType + " impression property should be array but is " + Object.prototype.toString.call(adData[adType].impression));
                    }
                } else {
                    throw new Error("VPTP ad " + adType + " is missing impression property!");
                }

                // Loop through errors
                if(hasOwnPropertyWithValidKey(adData[adType], "error")) {
                    if(typeof(adData[adType].error) === "string"){
                        if(adData[adType].error.length > 0) {

                            if(hasOwnPropertyWithValidKey(ad.trackingEvents,"error")) {
                                ad.trackingEvents.error.urls.push({url:adData[adType].error});
                            } else {
                                ad.trackingEvents.error = {
                                    urls: [{url:adData[adType].error}],
                                    blocked: false
                                };
                            }

                        } else {
                            // Error are not required. (Optional property)
                            //throw new Error("VPTP Ad error property is empty!");
                        }
                    } else {
                        throw new Error("VPTP Ad error property should be string but is " + typeof(adData[adType]));
                    }

                } else {
                    // Missing errors, throw error ???
                }

                // check adTitle
                var adTitle = '';
                if(hasOwnPropertyWithValidKey(adData[adType], 'adTitle')) {
                    ad.title = adData[adType].adTitle.toString();
                }

                // Loop through creatives
                if(hasOwnPropertyWithValidKey(adData[adType],"creatives")) {
                    if (Object.prototype.toString.call(adData[adType].creatives) === "[object Object]") {
                        if (hasOwnPropertyWithValidKey(adData[adType].creatives, "creative")) {
                            if (Object.prototype.toString.call(adData[adType].creatives.creative) === "[object Array]") {
                                if (adData[adType].creatives.creative.length > 0) {
                                    var creativesData = adData[adType].creatives.creative;
                                    var creativesCount = creativesData.length;
                                    var creativeSequence;

                                    for (var l = 0; l < creativesCount; l++) {

                                        var currentCreative = creativesData[l];
                                        creativeSequence = 0;

                                        if (hasOwnPropertyWithValidKey(currentCreative, "sequence")) {
                                            creativeSequence = parseInt(currentCreative.sequence);

                                            if(creativeSequence === NaN) {
                                                creativeSequence = 0;
                                            }
                                        }

                                        // Loop through linear ads
                                        if (hasOwnPropertyWithValidKey(currentCreative, "linear")) {

                                            var linearCreative = new videoplaza.adresponse.LinearCreative();

                                            linearCreative.parentAd = ad;
                                            linearCreative.sequence = creativeSequence;

                                            if (hasOwnPropertyWithValidKey(currentCreative, "id")) {
                                                linearCreative.type = currentCreative.id;
                                            } else {
                                                // Top level creatives don't have id:
                                                //throw new Error("VPTP Creative missing id property!");
                                            }

                                            // Parse duration
                                            if (hasOwnPropertyWithValidKey(currentCreative.linear, "duration")) {
                                                if (typeof(currentCreative.linear.duration) === "string") {
                                                    linearCreative.duration = vastTimeToSeconds(currentCreative.linear.duration);
                                                } else if (typeof(currentCreative.linear.duration) === "number") {
                                                    linearCreative.duration = currentCreative.linear.duration;
                                                }
                                            } else {
                                                //Top level creatives don't have duration:
                                                //throw new Error("VPTP Creative missing duration!");
                                            }

                                            // Loop through mediaFiles
                                            if (hasOwnPropertyWithValidKey(currentCreative.linear, "mediaFiles")) {
                                                if (hasOwnPropertyWithValidKey(currentCreative.linear.mediaFiles, "mediaFile")) {
                                                    if (Object.prototype.toString.call(currentCreative.linear.mediaFiles.mediaFile) === "[object Array]") {
                                                        if (currentCreative.linear.mediaFiles.mediaFile.length > 0) {

                                                            var mediaFilesData = currentCreative.linear.mediaFiles.mediaFile;
                                                            var mediaFilesCount = mediaFilesData.length;

                                                            for (var m = 0; m < mediaFilesCount; m++) {

                                                                var currentMediaFileData = mediaFilesData[m];
                                                                var newMediaFile = new videoplaza.adresponse.MediaFile();

                                                                if (hasOwnPropertyWithValidKey(currentMediaFileData, "value")) {
                                                                    if (typeof(currentMediaFileData.value) === "string") {
                                                                        newMediaFile.url = currentMediaFileData.value;
                                                                    } else {
                                                                        /* For selector ads, we check the value property type to identify the selector ad,
                                                                         so we will have already thrown an error if it was missing and never enter here.
                                                                         */
                                                                        throw new Error("VPTP MediaFile value property should be string but is " + typeof(currentMediaFileData.value));
                                                                    }
                                                                } else {
                                                                    /* For selector ads, we check the value property to identify the selector ad,
                                                                     so we will have already thrown an error if it was missing and never enter here.
                                                                     */
                                                                    throw new Error("VPTP MediaFile missing value property!");
                                                                }

                                                                if (hasOwnPropertyWithValidKey(currentMediaFileData, "type")) {
                                                                    if (typeof(currentMediaFileData.type) === "string") {
                                                                        newMediaFile.mimeType = currentMediaFileData.type;
                                                                    } else {
                                                                        throw new Error("VPTP MediaFile type property should be string but is " + typeof(currentMediaFileData.type));
                                                                    }
                                                                } else {
                                                                    throw new Error("VPTP MediaFile missing type property!");
                                                                }

                                                                if (hasOwnPropertyWithValidKey(currentMediaFileData, "width")) {
                                                                    if (typeof(currentMediaFileData.width) === "number") {
                                                                        newMediaFile.width = parseFloat(currentMediaFileData.width);
                                                                    } else {
                                                                        throw new Error("VPTP MediaFile width property should be number but is " + typeof(currentMediaFileData.width));
                                                                    }
                                                                } else {
                                                                    throw new Error("VPTP MediaFile missing width property!");
                                                                }

                                                                if (hasOwnPropertyWithValidKey(currentMediaFileData, "height")) {
                                                                    if (typeof(currentMediaFileData.height) === "number") {
                                                                        newMediaFile.height = parseFloat(currentMediaFileData.height);
                                                                    } else {
                                                                        throw new Error("VPTP MediaFile height property should be number but is " + typeof(currentMediaFileData.height));
                                                                    }
                                                                } else {
                                                                    throw new Error("VPTP MediaFile missing height property!");
                                                                }

                                                                if (hasOwnPropertyWithValidKey(currentMediaFileData, "bitrate")) {
                                                                    if (typeof(currentMediaFileData.bitrate) === "number") {
                                                                        newMediaFile.bitRate = parseFloat(currentMediaFileData.bitrate);
                                                                    } else {
                                                                        throw new Error("VPTP MediaFile bitrate property should be number but is " + typeof(currentMediaFileData.bitrate));
                                                                    }
                                                                } else {
                                                                    throw new Error("VPTP MediaFile missing bitrate property!");
                                                                }

                                                                if (hasOwnPropertyWithValidKey(currentMediaFileData, "delivery")) {
                                                                    if (typeof(currentMediaFileData.delivery) === "string") {
                                                                        newMediaFile.deliveryMethod = currentMediaFileData.delivery;
                                                                    } else {
                                                                        throw new Error("VPTP MediaFile delivery property should be string but is " + typeof(currentMediaFileData.delivery));
                                                                    }
                                                                } else {
                                                                    throw new Error("VPTP MediaFile missing delivery property!");
                                                                }


                                                                if (hasOwnPropertyWithValidKey(currentMediaFileData, "apiFramework")) {
                                                                    if (typeof(currentMediaFileData.apiFramework) === "string") {
                                                                        newMediaFile.apiFramework = currentMediaFileData.apiFramework;
                                                                    } else {
                                                                        throw new Error("VPTP MediaFile apiFramework property should be string but is " + typeof(currentMediaFileData.apiFramework));
                                                                    }
                                                                } else {
                                                                    // Inner ads (ads inside adParameter) does not need to have the apiFramework property
                                                                    //throw new Error("VPTP MediaFile missing apiFramework property!");
                                                                }

                                                                // If the linear creative hasn't added any mediaFiles yet:
                                                                if (!hasOwnPropertyWithValidKey(linearCreative, "mediaFiles")) {
                                                                    linearCreative.mediaFiles = [];
                                                                }

                                                                linearCreative.mediaFiles.push(newMediaFile);
                                                            }

                                                        } else {
                                                            //Passbacks don't have mediaFiles:
                                                            //throw new Error("VPTP Linear Creative.mediaFiles.mediaFile array is empty!");
                                                        }
                                                    } else {
                                                        //We will never enter here, as we already check this when trying to identify passback or selector ads:
                                                        //throw new Error("VPTP Linear Creative.mediaFiles.mediaFile should be Array but is " + Object.prototype.toString.call(currentCreative.linear.mediaFiles.mediaFile) );
                                                    }
                                                } else {
                                                    throw new Error("VPTP Linear Creative.mediaFiles missing mediaFile property!");
                                                }
                                            } else {
                                                //Wrapper ads don't have mediaFiles:
                                                if (adType !== "wrapper") {
                                                    throw new Error("VPTP Linear Creative missing mediaFiles property!");
                                                }
                                            }


                                            if (hasOwnPropertyWithValidKey(currentCreative.linear, "videoClicks")) {
                                                if (Object.prototype.toString.call(currentCreative.linear.videoClicks) === "[object Object]") {
                                                    if (hasOwnPropertyWithValidKey(currentCreative.linear.videoClicks, "clickTracking")) {
                                                        if (Object.prototype.toString.call(currentCreative.linear.videoClicks.clickTracking) === "[object Array]") {
                                                            if (currentCreative.linear.videoClicks.clickTracking.length > 0) {

                                                                //Create the clickThrough object with url array and blocked flag upfront if it's not there:
                                                                if (!hasOwnPropertyWithValidKey(linearCreative.trackingEvents, "clickthrough")) {
                                                                    linearCreative.trackingEvents.clickthrough = {
                                                                        urls: [],
                                                                        blocked: false
                                                                    };
                                                                }
                                                                for (var i = 0; i < currentCreative.linear.videoClicks.clickTracking.length; ++i) {
                                                                    var ctURL = currentCreative.linear.videoClicks.clickTracking[i];
                                                                    if (hasOwnPropertyWithValidKey(ctURL, "value")) {
                                                                        if (typeof(ctURL.value) === "string") {
                                                                            linearCreative.trackingEvents.clickthrough.urls.push({url:ctURL.value});
                                                                        } else {
                                                                            throw new Error("VPTP ClickTracking value property should be string but is " + typeof(ctURL.value));
                                                                        }
                                                                    } else {
                                                                        throw new Error("VPTP ClickTracking object missing value property!");
                                                                    }
                                                                }
                                                            } else {
                                                                //TODO: Clicktracking
                                                                // throw new Error("VPTP Linear Creative.videoClicks.clickTracking array is empty!");
                                                            }
                                                        } else {
                                                            throw new Error("VPTP Linear Creative.videoClicks.clickTracking should be Array but is " + Object.prototype.toString.call(currentCreative.linear.videoClicks.clickTracking));
                                                        }
                                                    } else {
                                                        throw new Error("VPTP Linear Creative videoClicks missing clickTracking property!");
                                                    }
                                                    if (hasOwnPropertyWithValidKey(currentCreative.linear.videoClicks, "clickThrough")) {
                                                        if (Object.prototype.toString.call(currentCreative.linear.videoClicks.clickThrough) === "[object Object]") {
                                                            if (hasOwnPropertyWithValidKey(currentCreative.linear.videoClicks.clickThrough, "value")) {
                                                                if (typeof(currentCreative.linear.videoClicks.clickThrough.value) === "string") {
                                                                    linearCreative.clickThroughUrl = currentCreative.linear.videoClicks.clickThrough.value;
                                                                } else {
                                                                    throw new Error("VPTP Linear Creative.videoClicks.clickThrough value property should be string but is " + typeof(currentCreative.linear.videoClicks.clickThrough.value));
                                                                }
                                                            } else {
                                                                throw new Error("VPTP Linear Creative.videoClicks.clickThrough missing value property!");
                                                            }
                                                        } else {
                                                            throw new Error("VPTP Linear Creative.videoClicks clickThrough property should be object but is " + Object.prototype.toString.call(currentCreative.linear.videoClicks.clickThrough));
                                                        }
                                                    }
                                                    else {
                                                        // Click through URL not required
                                                    }
                                                } else {
                                                    throw new Error("VPTP Linear Creative.videoClicks should be Object but is " + Object.prototype.toString.call(currentCreative.linear.videoClicks));
                                                }

                                            } else {
                                                //Top level creatives don't have videoClicks:
                                                //throw new Error("VPTP Linear Creative missing videoClicks property!");
                                            }


                                            if (hasOwnPropertyWithValidKey(currentCreative.linear, "trackingEvents")) {
                                                if (Object.prototype.toString.call(currentCreative.linear.trackingEvents) === "[object Object]") {
                                                    if (hasOwnPropertyWithValidKey(currentCreative.linear.trackingEvents, "tracking")) {
                                                        if (Object.prototype.toString.call(currentCreative.linear.trackingEvents.tracking) === "[object Array]") {
                                                            if (currentCreative.linear.trackingEvents.tracking.length > 0) {
                                                                linearCreative.trackingEvents = parseAndAddTrackingEvents(linearCreative.trackingEvents, currentCreative.linear.trackingEvents.tracking);
                                                            } else if (previewMode) {
                                                                linearCreative.trackingEvents = [];
                                                            } else {
                                                                throw new Error("VPTP Linear Creative.trackingEvents.tracking array is empty!");
                                                            }
                                                        } else {
                                                            throw new Error("VPTP Linear Creative.trackingEvents.tracking should be Array but is " + Object.prototype.toString.call(currentCreative.linear.trackingEvents.tracking));
                                                        }
                                                    } else {
                                                        throw new Error("VPTP Linear Creative missing trackingEvents.tracking property!");
                                                    }
                                                } else {
                                                    throw new Error("VPTP Linear Creative.trackingEvents should be Object but is " + Object.prototype.toString.call(currentCreative.linear.trackingEvents));
                                                }


                                            } else {
                                                //Top level creatives don't have trackingEvents:
                                                //throw new Error("VPTP Linear Creative missing trackingEvents property!");
                                            }

                                            // skipOffset is changed to skipoffset in Ooyala Pulse in order to follow the vast specification.
                                            // skipOffset should be removed in future, make sure to switch clients on static version of adplayer.
                                            // We cannot use hasOwnPropertyWithValidKey here, since it will throw error for misspelled properties!
                                            if(currentCreative.linear.hasOwnProperty("skipOffset") || currentCreative.linear.hasOwnProperty("skipoffset"))
                                            {
                                                var offsetInSeconds;
                                                var skipoffset = (currentCreative.linear.hasOwnProperty("skipoffset")? currentCreative.linear.skipoffset : currentCreative.linear.skipOffset);
                                                if(skipoffset.indexOf("%") > -1) {
                                                    var percentage = parseFloat( String(skipoffset).substring(0, skipoffset.indexOf("%")) );
                                                    offsetInSeconds = (linearCreative.duration || 0) * (percentage/100);
                                                } else {
                                                    offsetInSeconds = vastTimeToSeconds(skipoffset);
                                                }

                                                linearCreative.skipOffset = offsetInSeconds;
                                            }

                                            ad.creatives.push(linearCreative);


                                            // Parse adParameters (can contain 'wrapped' ads)
                                            // We have already validated and thrown errors for these properties when accessing adParameters for determining passbacks, so we don't do it again.
                                            if (hasOwnPropertyWithValidKey(currentCreative.linear, "adParameters")) {
                                                if (Object.prototype.toString.call(currentCreative.linear.adParameters) === "[object Object]") {
                                                    if (hasOwnPropertyWithValidKey(currentCreative.linear.adParameters, "value")) {
                                                        if (Object.prototype.toString.call(currentCreative.linear.adParameters.value) === "[object Object]") {
                                                            if (hasOwnPropertyWithValidKey(currentCreative.linear.adParameters.value, "ad")) {

                                                                if (Object.prototype.toString.call(currentCreative.linear.adParameters.value.ad) === "[object Array]") {
                                                                    if (currentCreative.linear.adParameters.value.ad.length > 0) {
                                                                        var innerAdsData = currentCreative.linear.adParameters.value.ad;
                                                                        var innerAdsCount = innerAdsData.length;

                                                                        for (var n = 0; n < innerAdsCount; n++) {
                                                                            var innerAd = createAd(innerAdsData[n], slot, previewMode, n + 1); // @TODO: Should this be changed? Should the inner ads have the 'top' ad as parent instead?

                                                                            if (innerAd) {
                                                                                // make passbacks lazy if it has lazy loaded third parties. (passbacks don't get that property in the ticket)
                                                                                if (hasOwnPropertyWithValidKey(innerAd, "lazyPrepared")) {
                                                                                    ad.ready = false;
                                                                                }

                                                                                ad.ads.push(innerAd);
                                                                            }
                                                                        }
                                                                    } else {
                                                                        throw new Error("VPTP Linear Creative adParameters.value.ad is empty!");
                                                                    }
                                                                } else {
                                                                    throw new Error("VPTP Linear Creative adParameters.value.ad should be Array but is " + Object.prototype.toString.call(currentCreative.linear.adParameters.value.ad));
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        } else if(hasOwnPropertyWithValidKey(currentCreative, "nonLinearAds")) {
                                            if(hasOwnPropertyWithValidKey(currentCreative.nonLinearAds, "nonLinear")) {
                                                parseNonLinearCreatives(ad, currentCreative.nonLinearAds, creativeSequence, currentCreative.id, previewMode);
                                            }
                                        } else if(hasOwnPropertyWithValidKey(currentCreative, "companionAds")) {
                                            // Parse companion banners
                                            if(hasOwnPropertyWithValidKey(currentCreative.companionAds, "companion")) {
                                                var requiredRule = videoplaza.adresponse.Companion.RequiredRule.NO;

                                                if(hasOwnPropertyWithValidKey(currentCreative.companionAds, 'required')) {
                                                    switch(currentCreative.companionAds.required) {
                                                        case 'all':
                                                            requiredRule = videoplaza.adresponse.Companion.RequiredRule.YES;
                                                            break;
                                                        case 'any':
                                                            requiredRule = videoplaza.adresponse.Companion.RequiredRule.AT_LEAST_ONE_FOR_THIS_SEQUENCE;
                                                            break;
                                                        case 'none':
                                                            requiredRule = videoplaza.adresponse.Companion.RequiredRule.NO;
                                                            break;
                                                    }
                                                }

                                                parseCompanionAds(ad, currentCreative.companionAds.companion, creativeSequence, requiredRule);
                                            }

                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    // This is a dummy ad (it contains no creatives)
                    ad.type = "inventory";
                    ad.trackingEvents.error = ad.trackingEvents.impression;
                    ad.trackingEvents.impression = {
                                                    urls:[],
                                                    blocked:false
                                                    };
                }
                ad = parseAdInfo(ad, adData);
            }

            // Sort media files by bitrate
            for(var i = 0; i < ad.creatives.length; ++i) {
                var creative = ad.creatives[i];
                if(!(creative instanceof videoplaza.adresponse.LinearCreative)) {
                    continue;
                }

                creative.mediaFiles.sort(function(a, b) {
                    if(!a.bitRate) {
                        return 1;
                    }

                    if(!b.bitRate) {
                        return -1;
                    }

                    if(a.bitRate < b.bitRate) {
                        return 1;
                    }

                    if(b.bitRate < a.bitRate) {
                        return -1;
                    }

                    return 0;
                });
            }

            return ad;
        }

        function parseCompanionAds(ad, companionList, sequence, requiredRule) {
            var companionElement, // will store each entry in companionList
                companion;        // will store each new Companion instance

            for(var i = 0; i < companionList.length; ++i) {
                companionElement = companionList[i];
                companion = new videoplaza.adresponse.Companion();

                companion.parentAd = ad;
                companion.sequence = sequence;
                companion.required = requiredRule;

                if(hasOwnPropertyWithValidKey(companionElement, 'width')) {
                    companion.width = parseInt(companionElement.width);

                    if(isNaN(companion.width)) {
                        throw new Error('VPTP Companion width is not a number');
                    }
                } else {
                    throw new Error('VPTP Companion missing required attribute width');
                }

                if(hasOwnPropertyWithValidKey(companionElement, 'height')) {
                    companion.height = parseInt(companionElement.height);

                    if(isNaN(companion.height)) {
                        throw new Error('VPTP Companion height is not a number');
                    }
                } else {
                    throw new Error('VPTP Companion missing required attribute height');
                }

                if(hasOwnPropertyWithValidKey(companionElement, 'id')) {
                    companion.id = companionElement.id;
                }

                /*
                    Resource type parsing
                */

                parseResources(companionElement, companion, true);

                /*
                    Parse trackingEvents
                */

                if (hasOwnPropertyWithValidKey(companionElement, "trackingEvents")) {
                    if (Object.prototype.toString.call(companionElement.trackingEvents) === "[object Object]") {
                        if (hasOwnPropertyWithValidKey(companionElement.trackingEvents, "tracking")) {
                            if (Object.prototype.toString.call(companionElement.trackingEvents.tracking) === "[object Array]") {
                                if (companionElement.trackingEvents.tracking.length > 0) {
                                        companion.trackingEvents = parseAndAddTrackingEvents(companion.trackingEvents, companionElement.trackingEvents.tracking);
                                } else {
                                    throw new Error("VPTP Linear Companion.trackingEvents.tracking array is empty!");
                                }
                            } else {
                                throw new Error("VPTP Linear Companion.trackingEvents.tracking should be Array but is " + Object.prototype.toString.call(companionElement.trackingEvents.tracking));
                            }
                        } else {
                            throw new Error("VPTP Linear Companion missing trackingEvents.tracking property!");
                        }
                    } else {
                        throw new Error("VPTP Linear Companion.trackingEvents should be Object but is " + Object.prototype.toString.call(companionElement.trackingEvents));
                    }
                } else {
                    // no trackingEvents object on the companion node, error?
                }

                if(hasOwnPropertyWithValidKey(companionElement, 'companionClickTracking')) {
                    if(!hasOwnPropertyWithValidKey(companion.trackingEvents, 'clickThrough')) {
                        companion.trackingEvents.clickThrough = {
                            urls: [],
                            blocked: false
                        };
                    }

                    var trackingElement, urlObject;

                    for(var i = 0; i < companionElement.companionClickTracking.length; ++i) {
                        trackingElement = companionElement.companionClickTracking[i];

                        if(!hasOwnPropertyWithValidKey(trackingElement, 'value')) {
                            throw new Error('Companion has ClickTracking with no URL value');
                        }

                        urlObject = {
                            url: trackingElement.value,
                            thirdPartyURL: true
                        };

                        if(!hasOwnPropertyWithValidKey(trackingElement, 'id')) {
                            urlObject.id = trackingElement.id;
                        }

                        companion.trackingEvents.clickThrough.urls.push(urlObject);
                    }
                }

                ad.companions.push(companion);
            }
        }

        function parseNonLinearCreatives(ad, nonLinearAds, sequence, type, previewMode) {
            var nonLinearElement, // will store each entry in nonLinearAds.nonLinear array
                nonLinear;        // will store each new NonLinearCreative instance

            for(var i = 0; i < nonLinearAds.nonLinear.length; ++i) {
                nonLinearElement = nonLinearAds.nonLinear[i];

                nonLinear = new videoplaza.adresponse.NonLinearCreative();

                nonLinear.parentAd = ad;
                nonLinear.sequence = sequence;

                if(hasOwnPropertyWithValidKey(nonLinearElement, 'minSuggestedDuration')) {
                    if (typeof(nonLinearElement.minSuggestedDuration) === 'string') {
                        nonLinear.duration = vastTimeToSeconds(nonLinearElement.minSuggestedDuration);
                    } else if (typeof(nonLinearElement.minSuggestedDuration) === 'number') {
                        nonLinear.duration = nonLinearElement.minSuggestedDuration;
                    }

                    if(isNaN(nonLinear.duration)) {
                        throw new Error('VPTP NonLinearCreative duration is not a number');
                    }
                }

                if(hasOwnPropertyWithValidKey(nonLinearElement, 'width')) {
                    nonLinear.width = parseInt(nonLinearElement.width);

                    if(isNaN(nonLinear.width)) {
                        throw new Error('VPTP NonLinearCreative width is not a number');
                    }
                } else {
//                    throw new Error('VPTP NonLinearCreative missing required attribute width');
                }

                if(hasOwnPropertyWithValidKey(nonLinearElement, 'height')) {
                    nonLinear.height = parseInt(nonLinearElement.height);

                    if(isNaN(nonLinear.height)) {
                        throw new Error('VPTP NonLinearCreative height is not a number');
                    }
                } else {
//                    throw new Error('VPTP NonLinearCreative missing required attribute height');
                }

                // Passed from current creative in createAd()
                if(type) {
                    nonLinear.type = type;
                }

                /*
                    Resource type parsing
                */

                parseResources(nonLinearElement, nonLinear, false);

                /*
                    Parse trackingEvents
                */

                if (hasOwnPropertyWithValidKey(nonLinearAds, "trackingEvents")) {
                    if (Object.prototype.toString.call(nonLinearAds.trackingEvents) === "[object Object]") {
                        if (hasOwnPropertyWithValidKey(nonLinearAds.trackingEvents, "tracking")) {
                            if (Object.prototype.toString.call(nonLinearAds.trackingEvents.tracking) === "[object Array]") {
                                if (nonLinearAds.trackingEvents.tracking.length > 0) {
                                        nonLinear.trackingEvents = parseAndAddTrackingEvents(nonLinear.trackingEvents, nonLinearAds.trackingEvents.tracking);
                                } else if (previewMode) {
                                    nonLinear.trackingEvents = [];
                                } else {
                                    throw new Error("VPTP nonLinearAds trackingEvents.tracking array is empty!");
                                }
                            } else {
                                throw new Error("VPTP nonLinearAds trackingEvents.tracking should be Array but is " + Object.prototype.toString.call(nonLinearAds.trackingEvents.tracking));
                            }
                        } else {
                            throw new Error("VPTP nonLinearAds missing trackingEvents.tracking property!");
                        }
                    } else {
                        throw new Error("VPTP nonLinearAds trackingEvents should be Object but is " + Object.prototype.toString.call(nonLinearAds.trackingEvents));
                    }
                } else {
                    // no trackingEvents object on the creative node, error?
                }

                if(hasOwnPropertyWithValidKey(nonLinearElement, 'nonLinearClickTracking')) {
                    if(!hasOwnPropertyWithValidKey(nonLinear.trackingEvents, 'clickThrough')) {
                        nonLinear.trackingEvents.clickThrough = {
                            urls: [],
                            blocked: false
                        };
                    }

                    var trackingElement, urlObject;

                    for(var i = 0; i < nonLinearElement.nonLinearClickTracking.length; ++i) {
                        trackingElement = nonLinearElement.nonLinearClickTracking[i];

                        if(!hasOwnPropertyWithValidKey(trackingElement, 'value')) {
                            throw new Error('NonLinearCreative has ClickTracking with no URL value');
                        }

                        urlObject = {
                            url: trackingElement.value,
                            thirdPartyURL: true
                        };

                        if(!hasOwnPropertyWithValidKey(trackingElement, 'id')) {
                            urlObject.id = trackingElement.id;
                        }

                        nonLinear.trackingEvents.clickThrough.urls.push(urlObject);
                    }
                }

                ad.creatives.push(nonLinear);
            }
        }

        // Parses resources for Companions and NonLinearCreatives
        function parseResources(sourceElement, target, isCompanion) {
            var resource;
            var logLabel = isCompanion ? 'Companion' : 'NonLinearCreative';

            if(hasOwnPropertyWithValidKey(sourceElement, 'staticResource')) {
                if(!hasOwnPropertyWithValidKey(sourceElement.staticResource, 'value')) {
                    throw new Error('VPTP ' + logLabel + ' has StaticResource with no URL value');
                }

                resource = new videoplaza.adresponse.StaticResource();

                resource.url = sourceElement.staticResource.value;

                if(hasOwnPropertyWithValidKey(sourceElement.staticResource, 'creativeType')) {
                    resource.mimeType = sourceElement.staticResource.creativeType;
                }

                if(hasOwnPropertyWithValidKey(sourceElement, 'apiFramework')) {
                    resource.apiFramework = sourceElement.apiFramework;
                }

                if(hasOwnPropertyWithValidKey(sourceElement, 'adParameters')) {
                    if(hasOwnPropertyWithValidKey(sourceElement.adParameters, 'value')) {
                        resource.adParameters = sourceElement.adParameters.value;

                        if(hasOwnPropertyWithValidKey(sourceElement.adParameters, 'xmlEncoded')) {
                            if(typeof sourceElement.adParameters.xmlEncoded !== 'boolean') {
                                throw new Error('VPTP ' + logLabel + ' has adParameters.xmlEncoded with invalid type');
                            }

                            resource.adParametersXmlEncoded = sourceElement.adParameters.xmlEncoded;
                        }
                    }
                }

                /*
                    Optional fields taken from Companion/NonLinearCreative
                */

                if(isCompanion) {
                    if(hasOwnPropertyWithValidKey(sourceElement, 'companionClickThrough')) {
                        resource.clickThroughUrl = sourceElement.companionClickThrough;
                    }
                } else {
                    if(hasOwnPropertyWithValidKey(sourceElement, 'nonLinearClickThrough')) {
                        resource.clickThroughUrl = sourceElement.nonLinearClickThrough;
                    }
                }

                if(hasOwnPropertyWithValidKey(sourceElement, 'assetWidth')) {
                    resource.assetWidth = parseInt(sourceElement.assetWidth);

                    if(isNaN(resource.assetWidth)) {
                        throw new Error('VPTP ' + logLabel + ' assetWidth is not a number');
                    }
                }

                if(hasOwnPropertyWithValidKey(sourceElement, 'assetHeight')) {
                    resource.assetHeight = parseInt(sourceElement.assetHeight);

                    if(isNaN(resource.assetHeight)) {
                        throw new Error('VPTP ' + logLabel + ' assetHeight is not a number');
                    }
                }

                if(hasOwnPropertyWithValidKey(sourceElement, 'expandedWidth')) {
                    resource.expandedWidth = parseInt(sourceElement.expandedWidth);

                    if(isNaN(resource.expandedWidth)) {
                        throw new Error('VPTP ' + logLabel + ' expandedWidth is not a number');
                    }
                }

                if(hasOwnPropertyWithValidKey(sourceElement, 'expandedHeight')) {
                    resource.expandedHeight = parseInt(sourceElement.expandedHeight);

                    if(isNaN(resource.expandedWidth)) {
                        throw new Error('VPTP ' + logLabel + ' expandedHeight is not a number');
                    }
                }

                target.resources.push(resource);
            }

            if(hasOwnPropertyWithValidKey(sourceElement, 'iframeResource')) {
                resource = new videoplaza.adresponse.IFrameResource();
                resource.url = sourceElement.iframeResource;
                target.resources.push(resource);
            }

            if(sourceElement.hasOwnProperty('htmlResource')) {
                resource = new videoplaza.adresponse.HtmlResource();
                resource.source = sourceElement.htmlResource.value;
                target.resources.push(resource);
            } else if(sourceElement.hasOwnProperty('htmlresource')) {
                resource = new videoplaza.adresponse.HtmlResource();
                resource.source = sourceElement.htmlresource.value;
                target.resources.push(resource);
            }
        }

        function parseAndAddTrackingEvents(currentTrackingObject, trackingDataArray) {

            if(!currentTrackingObject)
            {
                currentTrackingObject = {};
            }

            for(var i = 0; i < trackingDataArray.length; i++) {
                var trackingItem = trackingDataArray[i];

                if(hasOwnPropertyWithValidKey(trackingItem,"value")) {
                    if(hasOwnPropertyWithValidKey(trackingItem,"event")) {
                        var eventName = "";

                        switch(trackingItem.event)
                        {
                            case "3":
                            case "4":
                            case "91":
                                //TODO: Exclude VP specific internal events from ad tracking object:
                                eventName = "";
                                break;

                            case "10":
                                eventName = "interaction";
                                break;
                            case "100":
                                eventName = "timeSpent";
                                break;

                            default:
                                eventName = trackingItem.event;
                        }

                        // Special cases: acceptInvitationLinear, closeLinear:
                        if(eventName.toLowerCase() === "acceptinvitationlinear") {
                            eventName = videoplaza.tracking.Tracker.CreativeEventType.ACCEPT_INVITATION;
                        } else if(eventName.toLowerCase() === "closelinear") {
                            eventName = videoplaza.tracking.Tracker.CreativeEventType.CLOSE;
                        }

                        if(eventName.length > 0) {
                            if(!hasOwnPropertyWithValidKey(currentTrackingObject,eventName))
                            {
                                currentTrackingObject[eventName] = {
                                    urls:[],
                                    blocked: false
                                };
                            }

                            currentTrackingObject[eventName].urls.push({url:trackingItem.value.toString()});
                        }
                    } else {
                        throw new Error("VPTP Tracking object missing event property!");
                    }
                } else {
                    throw new Error("VPTP Tracking object missing value property!");
                }
            }

            return currentTrackingObject;
        }


        function parseAdInfo(ad, adData) {
            // Fields taken from AdInfo, but should really be on a Creative level
            var lastCompletion = undefined;

            var inlineOrWrapper = null;

            if (hasOwnPropertyWithValidKey(adData,"inLine")){
                inlineOrWrapper = adData.inLine;
            }else if (hasOwnPropertyWithValidKey(adData, "wrapper")){
                inlineOrWrapper = adData.wrapper;
            }else{
                return ad;
            }


            var adInfo = null;

            // Loop through extensions
            if(hasOwnPropertyWithValidKey(inlineOrWrapper, "extensions")) {
                if(hasOwnPropertyWithValidKey(inlineOrWrapper.extensions, "extension")) {
                    if(Object.prototype.toString.call(inlineOrWrapper.extensions.extension) === "[object Array]") {
                        if(inlineOrWrapper.extensions.extension.length > 0) {
                            var extensionData = inlineOrWrapper.extensions.extension;
                            var extensionCount = extensionData.length;

                            for(var j = 0; j < extensionCount; j++)
                            {
                                var currentExtension = extensionData[j];

                                // Look for the adInfo object
                                if(hasOwnPropertyWithValidKey(currentExtension,"adInfo")) {
                                    adInfo = currentExtension.adInfo;
                                } else {
                                    //THROW ERROR ???
                                }
                            }
                        } else {
                            // Inner ads don't have extensions.
                            //throw new Error("VPTP Extension array is empty!");
                        }
                    } else {
                        throw new Error ("VPTP Extensions.extension should be array but is " + Object.prototype.toString.call(inlineOrWrapper.extensions.extension) );
                    }
                } else {
                    throw new Error("VPTP Extensions missing extension property!");
                }
            } else {
                // THROW ERROR ???
            }

            if(!ad || !adInfo)
            {
                return ad;
            }

            // Look for the report URL
            if(hasOwnPropertyWithValidKey(adInfo, "report"))
            {
                if (!hasOwnPropertyWithValidKey(ad.trackingEvents, "report")) {
                    ad.trackingEvents.report = {
                        urls: [],
                        blocked: false
                    };
                }

                // Replace PASSBACK_INDEX macro in the report URL
                var candidateMacroRegex = /\[PASSBACK_INDEX\]|%5BPASSBACK_INDEX%5D/g;
                var replacedMacroUrl = adInfo.report.replace(candidateMacroRegex, encodeURIComponent(ad.candidate));

                // Allow for only one 'report' URL per ad/candidate.
                ad.trackingEvents.report.urls = [{url:replacedMacroUrl, thirdParty:false}];
            }

            if(hasOwnPropertyWithValidKey(adInfo,"format")) {
                ad.type = adInfo.format;
            }

            if(hasOwnPropertyWithValidKey(adInfo,"requestType") && (adInfo.requestType === "lazy") && ad.thirdPartyURL !== null) {
                ad.lazyPrepared = true;
            }

            if(hasOwnPropertyWithValidKey(adInfo,"timeout")) {
                ad.maximumPreparationTime = vastTimeToSeconds(adInfo.timeout);
            // Only due to Ooyala Pulse bug
            } else if(videoplaza.adresponse.Ad.hasPassback(ad)) {
                throw new Error('VPTP Extensions missing timeout value');
            }

            if(hasOwnPropertyWithValidKey(adInfo,"startAdTimeout")) {
                ad.startTimeout = vastTimeToSeconds(adInfo.startAdTimeout);
            }

            if(hasOwnPropertyWithValidKey(adInfo,"variant")) {
                ad.variant = !adInfo.variant || adInfo.variant.toLowerCase() === "normal" ? "normal" : "sponsor";
            } else {
                // For third party ads that do not have variant data in the ticket
                ad.variant = "normal";
            }

            if(hasOwnPropertyWithValidKey(adInfo,"gid")) {
                ad.goalId = adInfo.gid;
            }

            if(hasOwnPropertyWithValidKey(adInfo,"cid")) {
                ad.campaignId = adInfo.cid;
            }

            if(hasOwnPropertyWithValidKey(adInfo,"customaid")) {
                ad.customId = adInfo.customaid;
            }

            if(hasOwnPropertyWithValidKey(adInfo,"customgid")) {
                ad.customGoalId = adInfo.customgid;
            }

            if(hasOwnPropertyWithValidKey(adInfo,"customcid")) {
                ad.customCampaignId = adInfo.customcid;
            }

            if(hasOwnPropertyWithValidKey(adInfo,"allowLinearModeChange")) {
                ad.allowLinearModeChange = adInfo.allowLinearModeChange == "true" || adInfo.allowLinearModeChange == "TRUE";
            }

            if(hasOwnPropertyWithValidKey(adInfo,"countdown")) {
                ad.showCountdown = adInfo.countdown == "true" || adInfo.countdown == "TRUE";
            }

            if(hasOwnPropertyWithValidKey(adInfo,"exclusive")) {
                ad.partOfExclusiveCampaign = adInfo.exclusive == "true" || adInfo.exclusive == "TRUE";
            }
                  //TODO: What about these properties?
//            if(hasOwnPropertyWithValidKey(adInfo,"caption")) {
//                if(!ad.labels) {
//                    ad.labels = new Object();
//                }
//
//                ad.labels["caption"] = adInfo.caption;
//            }
//
           if(adInfo.hasOwnProperty("labels")
           && adInfo.labels.hasOwnProperty("label")
           && Object.prototype.toString.call(adInfo.labels.label) === "[object Array]"
           && adInfo.labels.label.length > 0)
           {
               for(var i = 0; i < adInfo.labels.label.length; i++) {
                   var currentLabel = adInfo.labels.label[i];

                   if(currentLabel.hasOwnProperty("name") && currentLabel.hasOwnProperty("value")) {
                       ad.labels[currentLabel.name] = currentLabel.value;
                   }
               }
           }


            if(hasOwnPropertyWithValidKey(adInfo,"lastImpression")) {
                lastCompletion = Number(adInfo.lastImpression); // Legacy: Last impression is the value we assign to lastCompletion.
            }

            if(hasOwnPropertyWithValidKey(adInfo,"lastCompletion")) {
                lastCompletion = Number(adInfo.lastCompletion); // If this value exists, we should use this instead.
            }

            var linears = ad.creatives.filter(
                function(o, index, array)
                {
                    return (o instanceof videoplaza.adresponse.LinearCreative || o instanceof videoplaza.adresponse.NonLinearCreative);
                }
            );

            for (var p = 0; p < linears.length; p++)
            {
                var linear = linears[p];

                if(hasOwnPropertyWithValidKey(adInfo,"showSkipButton")) {
                    if(adInfo.showSkipButton === videoplaza.adresponse.LinearCreative.SkipButtonMode.ALWAYS) {
                        linear.skipButtonMode = videoplaza.adresponse.LinearCreative.SkipButtonMode.ALWAYS;
                    } else if(adInfo.showSkipButton === videoplaza.adresponse.LinearCreative.SkipButtonMode.NEVER) {
                        linear.skipButtonMode = videoplaza.adresponse.LinearCreative.SkipButtonMode.NEVER;
                    } else if(adInfo.showSkipButton === videoplaza.adresponse.LinearCreative.SkipButtonMode.AFTER_FIRST_COMPLETION) {
                        linear.skipButtonMode = videoplaza.adresponse.LinearCreative.SkipButtonMode.AFTER_FIRST_COMPLETION;
                    }

                    // translate after_first_impression from backend
                    if(adInfo.showSkipButton === 'after_first_impression') {
                        linear.skipButtonMode = videoplaza.adresponse.LinearCreative.SkipButtonMode.AFTER_FIRST_COMPLETION;
                    }
                }


                if(adInfo.hasOwnProperty("skipOffset") || adInfo.hasOwnProperty("skipoffset"))
                {
                    var offsetInSeconds;
                    var skipoffset = (adInfo.hasOwnProperty("skipoffset")? adInfo.skipoffset : adInfo.skipOffset);



                    if(skipoffset.indexOf("%") > -1 && ad && ad.creatives && ad.creatives[0] &&  ad.creatives[0].duration ) {
                        var percentage = parseFloat( String(skipoffset).substring(0, skipoffset.indexOf("%")) );
                        offsetInSeconds = (ad.creatives[0].duration || 0) * (percentage/100);
                    } else {
                        offsetInSeconds = vastTimeToSeconds(skipoffset);

                    }

                    linear.skipOffset = offsetInSeconds;
                }


                if(hasOwnPropertyWithValidKey(adInfo, 'skipReset')) {
                    linear.skipResetTime = vastTimeToSeconds(adInfo.skipReset);
                }

                // Currently provided by Ooyala Pulse on ad level
                linear.lastCompletion = lastCompletion;
            }

            // Additional info for companions:
            if(hasOwnPropertyWithValidKey(adInfo, 'companions')) {
                if(hasOwnPropertyWithValidKey(adInfo.companions, 'companion')) {
                    var companionsAdInfo = adInfo.companions.companion;

                    for(var i = 0; i < companionsAdInfo.length; ++i) {
                        parseCompanionAdInfo(ad, companionsAdInfo[i]);
                    }
                }
            }

            return ad;
        }

        function parseCompanionAdInfo(ad, companionInfo) {
            var companion = null;

            if(!hasOwnPropertyWithValidKey(companionInfo, 'id')) {
                // Throw or ignore?
                throw new Error('VPTP Companion AdInfo is missing id');
            }

            // Find companion with matching id
            for(var i = 0; i < ad.companions.length; ++i) {
                if(ad.companions[i].id === companionInfo.id) {
                    companion = ad.companions[i];
                    break;
                }
            }

            if(companion === null) {
                // Throw or ignore?
                return;
            }

            if(hasOwnPropertyWithValidKey(companionInfo, 'customaid')) {
                companion.customId = companionInfo.customaid;
            } else {
                // Throw or ignore? some test tickets are missing this value
                //throw new Error('VPTP Companion AdInfo is missing custom id');
            }

            if(hasOwnPropertyWithValidKey(companionInfo, 'zone')) {
                companion.zone = companionInfo.zone;
            } else {
                throw new Error('VPTP Companion AdInfo is missing zone');
            }
        }

        function createInventoryAd(ad) {
            var inventoryAd = new videoplaza.adresponse.Ad();
            inventoryAd.type = videoplaza.adresponse.Ad.AdType.INVENTORY;

            if(ad.type == videoplaza.adresponse.Ad.AdType.SPOT_SELECTOR) {
                inventoryAd.trackingEvents.error = ad.ads[0].trackingEvents.error;
            } else {
                inventoryAd.trackingEvents.error = ad.trackingEvents.error;
            }

            inventoryAd.parentSlot = ad.parentSlot;
            return inventoryAd;
        }

        function parseConditions(conditions)
        {
            var result = [];

            if (Object.prototype.toString.call(conditions) === "[object Array]") {

                for(var i = 0; i < conditions.length; i++) {

                    var conditionData = conditions[i];
                    var condition;

                    if(hasOwnPropertyWithValidKey(conditionData,"type"))
                    {
                        if(typeof(conditionData.type) === "string") {
                            if(conditionData.type === 'EVENT') {
                                condition = new videoplaza.adresponse.EventCondition();
                            } else if(conditionData.type === 'PROPERTY') {
                                condition = new videoplaza.adresponse.PropertyCondition();
                            } else {
                                throw new Error('VPTP condition with unknown type: ' + conditionData.type);
                            }
                        } else {
                            throw new Error("VPTP condition type property should be string but is " + typeof(conditionData.type));
                        }
                    } else {
                        throw new Error("VPTP condition is missing type property!");
                    }

                    //TODO: Is this required or optional?
                    if(hasOwnPropertyWithValidKey(conditionData,"name"))
                    {
                        if(typeof(conditionData.name) === "string"){
                            // Store whatever's in the ticket, with first letter lowercased
                            condition.type = conditionData.name.toLowerCase().substr(0,1) + conditionData.name.substr(1);
                        } else {
                            throw new Error("VPTP condition name property should be string but is " + typeof(conditionData.name));
                        }

                    } else {
                        throw new Error("VPTP condition is missing name property!");
                    }

                    if(condition instanceof videoplaza.adresponse.PropertyCondition) {
                        //TODO: Is this required or optional?
                        if(hasOwnPropertyWithValidKey(conditionData,"value"))
                        {
                            if(typeof(conditionData.value) === "string") {
                                condition.value = vastTimeToSeconds(conditionData.value);
                            } else {
                                throw new Error("VPTP condition value property should be string but is " + typeof(conditionData.value));
                            }

                        }

                        //TODO: Is this required or optional?
                        if(hasOwnPropertyWithValidKey(conditionData,"operator"))
                        {
                            if(typeof(conditionData.operator) === "string"){
                                condition.operator = conditionData.operator.toLowerCase();
                            } else {
                                throw new Error("VPTP condition operator property should be string but is " + typeof(conditionData.operator));
                            }
                        }
                    }

                    //TODO: Is this required or optional?
                    if(hasOwnPropertyWithValidKey(conditionData,"condition"))
                    {
                        if (Object.prototype.toString.call(conditionData.condition) === "[object Array]") {
                            condition.conditions = parseConditions(conditionData.condition);
                        } else {
                            throw new Error("VPTP condition condition property should be Array but is " + Object.prototype.toString.call(conditionData.condition));
                        }

                    }

                    result.push(condition);

                }
            } else {
                throw new Error("VPTP Ticket conditions should be array but is " + Object.prototype.toString.call(conditions));
            }

            return result;

        }

        function vastTimeToSeconds(time) {
            if(!time)
            {
                return Number.NaN;
            }

            var tempArray = time.split(":");
            if(!tempArray || tempArray.length === 0)
            {
                return Number.NaN;
            }

            var secondsFromString = 0;
            if(tempArray.length >= 1 && isNaN(parseFloat(tempArray[tempArray.length - 1])) === false)
            {
                secondsFromString = parseFloat(tempArray[tempArray.length - 1]);
            }

            var minutesFromString = 0;
            if(tempArray.length >= 2 && isNaN(parseFloat(tempArray[tempArray.length - 2])) === false)
            {
                minutesFromString = parseInt(tempArray[tempArray.length - 2]);
            }

            var hoursFromString = 0;
            if(tempArray.length >= 3 && isNaN(parseFloat(tempArray[tempArray.length - 3])) === false)
            {
                hoursFromString = parseInt(tempArray[tempArray.length - 3]);
            }

            return secondsFromString + (minutesFromString * 60) + (hoursFromString * 3600);

        }

        function hasOwnPropertyWithValidKey(obj, key){
            var list = [];
            for (var k in obj) {
                list.push({actual: k, lowerCase: k.toLowerCase()});
            }

            for (var i = 0; i < list.length; i++){
                if(list[i].lowerCase === key.toLowerCase() ){
                    if(list[i].actual === key){
                        return true;
                    }else{
                        throw new Error("Invalid object property key! Expected: " + key + " but was: " + list[i].actual);
                    }
                }
            }
            return false;
        }


        return VPTP3Parser;
    })();
})(videoplaza);
(function(videoplaza){
    /**
     * The Tracker is used to make tracking calls to Ooyala when your video player
     * fires certain events.
     *
     * @constructor videoplaza.tracking.Tracker
     */
    videoplaza.tracking.Tracker = (function (){
        var Tracker = function(){
            if(!(this instanceof videoplaza.tracking.Tracker)){
                return new Tracker();
            }

            this._logCallbacks = [];
            this.previewMode = false;
        };

        var interactiveEvent = {
                "MUTE": "mute",
                "UNMUTE": "unmute",
                "PAUSE": "pause",
                "REWIND": "rewind",
                "RESUME": "resume",
                "ACCEPT_INVITATION": "acceptinvitation",
                "EXPAND": "expand",
                "FULLSCREEN": "fullscreen",
                "COLLAPSE": "collapse",
                "EXIT_FULLSCREEN": "exitfullscreen",
                "CLICKTHROUGH": "clickthrough",
                "CLOSE": "close"
        };

        var errorCodes = {
            "xmlParsingError": 100,
            "vastValidationError": 101,
            "vastResponseError": 102,
            "adTypeNotSupportedError": 200,
            "adLinearityError": 201,
            "wrapperError": 300,
            "wrapperTimeoutError": 301,
            "noVASTResponseError": 303,

            "generalLinearError": 400,
            "linearMediaFileNotFoundError": 401,
            "mediaFileTimeoutError": 402,
            "noSupportedMediaFileFoundError": 403,
            "mediaFileDisplayError": 405,

            "generalNonlinearError": 500,
            "nonlinearMediaFileNotFoundError": 502,
            "noSupportedNonLinearResourceFoundError": 503,

            "undefinedError": 900
        };

        var quartileEvents = [
            'complete',
            'thirdQuartile',
            'midpoint',
            'firstQuartile',
            'start'
        ];

        // Events that are only supposed to be tracked once per ad-view
        var cappedEvents = {
            startcontent: 'startcontent',
            impression: 'impression',
            complete: 'complete',
            thirdquartile: 'thirdquartile',
            midpoint: 'midpoint',
            firstquartile: 'firstquartile',
            start: 'start',
            interaction: 'interaction',
            creativeview: 'creativeview'
        };

        Tracker.prototype.reportPulseError = function(ad, errorCode) {

            var getReportURLs = function(item){
                var result = [];
                if( item &&
                    item instanceof videoplaza.adresponse.Ad &&
                    item.trackingEvents.hasOwnProperty("report") &&
                    !item.trackingEvents.report.blocked &&
                    item.trackingEvents["report"].urls.length > 0 )
                {
                    item.trackingEvents["report"].blocked = true;
                    result.push(item.trackingEvents["report"].urls.pop());
                }

                return result;
            };

            var reportURLs = getReportURLs(ad);

            if( reportURLs.length > 0 )
            {
                // Support Pulse Error tracking in SvM integrations
                for(var i = 0; i < reportURLs.length; i++) {
                    var item = reportURLs[i].url;
                    if(item && item.indexOf("PULSE_ERROR") === -1 && item.indexOf("PASSBACK_INDEX") === -1){

                        // Append these two macros to the Pulse error tracking URL(s) since they will not contain the original macros when going through SvM,
                        // these macros will then be handled by the AAB code (read, remove & POST to SvM).
                        item += (item.indexOf("?") > -1 ? "&" : "?") + "[AAB_PULSE_ERROR]=" + errorCode + "&[AAB_PASSBACK_INDEX]=" + ad.candidate;

                        reportURLs[i].url = item;
                    }
                }

                trackURL(getSessionSecureFromTrackable(ad), reportURLs, errorCode || 900, true);
            }
        };

        /**
         * 
         */
        Tracker.prototype.reportError = function(trackable, error) {
            var errorCode = Tracker.resolveErrorCode(trackable, error);

            //Do not do anything in preview mode
            if (this.previewMode){
                return;
            }

            if(trackable instanceof videoplaza.adresponse.Ad || trackable instanceof videoplaza.adresponse.LinearCreative || trackable instanceof videoplaza.adresponse.NonLinearCreative) {
                trackError.apply(this, [trackable, error, errorCode]);
            } else if(trackable instanceof videoplaza.adresponse.Companion) {
                var logItem = new videoplaza.LogItem();

                logItem.source = videoplaza.LogItem.SourceType.TRACKER;
                logItem.event = videoplaza.LogItem.EventType.INVALID_ARGUMENT;
                logItem.message = "Cannot report errors on Companion ads.";

                log(this, logItem);
            } else {
                var logItem = new videoplaza.LogItem();

                logItem.source = videoplaza.LogItem.SourceType.TRACKER;
                logItem.event = videoplaza.LogItem.EventType.INVALID_ARGUMENT;
                logItem.message = "Not a trackable object.";

                log(this, logItem);
            }
        };

        /**
         * Track event for a trackable object.
         * @param {(videoplaza.adresponse.Ad|videoplaza.adresponse.LinearCreative|videoplaza.adresponse.NonLinearCreative)} trackable The trackable object to which the event to be tracked relates.
         * @param {(videoplaza.tracking.Tracker.SessionEventType|videoplaza.tracking.Tracker.AdEventType|videoplaza.tracking.Tracker.CreativeEventType|string)} event The event to be tracked. Either one of the predefined standard events, or a custom tracking event defined in Ooyala Pulse.
         * @param {string} trackingParameter Specifies which variation of certain events is to be tracked; currently represents the 'offset' parameter when tracking {@link videoplaza.tracking.Tracker.CreativeEventType.PROGRESS}.
         *
         * @method trackEvent
         * @memberOf videoplaza.tracking.Tracker
         * @instance
         */
        Tracker.prototype.trackEvent = function(trackable, event, trackingParameter){

            //Do not do anything in preview mode
            if (this.previewMode){
                return;
            }

            if(!event || event === ''){
                var logItem = new videoplaza.LogItem();

                logItem.source = videoplaza.LogItem.SourceType.TRACKER;
                logItem.event = videoplaza.LogItem.EventType.INVALID_ARGUMENT;
                logItem.message = 'Event passed can not be an empty string.';

                log(this, logItem);

                return;
            }

            if(event === 'error') {
                var logItem = new videoplaza.LogItem();

                logItem.source = videoplaza.LogItem.SourceType.TRACKER;
                logItem.event = videoplaza.LogItem.EventType.INVALID_ARGUMENT;
                logItem.message = '"error" must be tracked using reportError()';

                log(this, logItem);

                return;
            }

            if(trackable instanceof videoplaza.adresponse.Session)
            {
                try{
                    trackSession.apply(this, [ trackable, event ]);
                } catch(e) {
                    // Just stop execution
                }
            }
            else if(trackable instanceof videoplaza.adresponse.Ad)
            {
                if(hasTrackedEvent('error', trackable) === true) {
                    var logItem = new videoplaza.LogItem();

                    logItem.source = videoplaza.LogItem.SourceType.TRACKER;
                    logItem.event = videoplaza.LogItem.EventType.ILLEGAL_OPERATION;
                    logItem.message = "Can not track any more events after reporting error on the passed Ad Object.";

                    log(this, logItem);
                } else {
                    try {
                        trackSlotStart.apply(this, [ trackable ]);
                        track.apply(this, [ trackable, event ]);
                    } catch(e) {
                        // Just stop execution
                    }
                }
            }
            else if(trackable instanceof videoplaza.adresponse.LinearCreative || trackable instanceof videoplaza.adresponse.NonLinearCreative || trackable instanceof videoplaza.adresponse.Companion) {
                if(trackable.parentAd != null && hasTrackedEvent('error', trackable.parentAd) === true) {
                    var logItem = new videoplaza.LogItem();

                    logItem.source = videoplaza.LogItem.SourceType.TRACKER;
                    logItem.event = videoplaza.LogItem.EventType.ILLEGAL_OPERATION;
                    logItem.message = "Can not track any more events after reporting error on the passed Ad Object.";

                    log(this, logItem);
                } else {
                    try {
                        track.apply(this, [ trackable, event, 0 /* no error code */, trackingParameter ]);
                    } catch(e) {
                        // Just stop execution
                    }
                }
            } else {
                var logItem = new videoplaza.LogItem();

                logItem.source = videoplaza.LogItem.SourceType.TRACKER;
                logItem.event = videoplaza.LogItem.EventType.INVALID_ARGUMENT;
                logItem.message = "Invalid object passed. Can not track event '"+event+"'. Object passed should be of type Session, Ad, Creative or Companion.";

                log(this, logItem);
            }
        };

        /**
         * Register a callback function to log tracker events.
         * @param {videoplaza.LogItem~logItemCallback} logCallback A callback which will receive logging information.
         *
         * @method addLogListener
         * @memberOf videoplaza.tracking.Tracker
         * @instance
         */
        Tracker.prototype.addLogListener = function(logCallback)
        {
            if(logCallback && typeof logCallback === "function") {
                this._logCallbacks.push(logCallback);
            }
            // else: exception or ignore?
        };

        // Blocks all tracking events contained in the ad
        function blockAllTracking(ad) {
            var creative;

            // Ad-level tracking
            for(var key in ad.trackingEvents) {
                ad.trackingEvents[key].blocked = true;
            }

            // Creative-level tracking
            for(var i = 0; i < ad.creatives.length; ++i) {
                creative = ad.creatives[i];

                for(var key in creative.trackingEvents) {
                    if(key === 'progress') {
                        for(var offset in creative.trackingEvents.progress) {
                            creative.trackingEvents.progress[offset].blocked = true;
                        }
                    } else {
                        creative.trackingEvents[key].blocked = true;                        
                    }
                }
            }
        }

        function trackSession(session, event){
            if(session.hasOwnProperty("trackingEvents")){
                if(session.trackingEvents.hasOwnProperty(event))
                {
                    if(!session.trackingEvents[event].blocked){

                        session.trackingEvents[event].blocked = true;
                        trackURL.apply(this, [session.secure, session.trackingEvents[event].urls ]);

                    } else {
                        var logItem = new videoplaza.LogItem();
                                    
                        logItem.source = videoplaza.LogItem.SourceType.TRACKER;
                        logItem.event = videoplaza.LogItem.EventType.ILLEGAL_OPERATION;
                        logItem.message = "Can not track '" + event + "' more than once on the passed Session Object.";

                        log(this, logItem);
                        throw new Error('Abort execution');
                    }

                }else{
                    var logItem = new videoplaza.LogItem();
                                    
                    logItem.source = videoplaza.LogItem.SourceType.TRACKER;
                    logItem.event = videoplaza.LogItem.EventType.REQUEST_FAILED;
                    logItem.message = "Event '" + event + "' does not exist on the passed Session Object.";

                    log(this, logItem);
                    throw new Error('Abort execution');
                }
            }else{
                  var logItem = new videoplaza.LogItem();
                                    
                    logItem.source = videoplaza.LogItem.SourceType.TRACKER;
                    logItem.event = videoplaza.LogItem.EventType.INVALID_ARGUMENT;
                    logItem.message = "Missing trackingEvents property on the passed Session Object. Can not track event '"+event+"'.";

                    log(this, logItem);
                    throw new Error('Abort execution');
            }
        }

        function getUrlFailureCallback(urlObject, noLog) {
            return function(error) {
                if(!noLog) {
                    var logItem = new videoplaza.LogItem();

                    logItem.source = videoplaza.LogItem.SourceType.TRACKER;
                    logItem.event = videoplaza.LogItem.EventType.REQUEST_FAILED;

                    logItem.message = error + ". Failed to track URL : " + urlObject.url;
                    log(this, logItem);
                }
            };
        }

        // No need to allocate this for every call
        var errorMacroRegex = /\[ERRORCODE\]|%5BERRORCODE%5D/g;
        var pulseErrorMacroRegex = /\[PULSE_ERROR\]|%5BPULSE_ERROR%5D/g;
        var timeSpentMacroRegex = /\[c\]|%5Bc%5D/g;
        var cachebustingMacroRegex = /\[CACHEBUSTING\]|%5BCACHEBUSTING%5D/g;

        function trackURL(secure, urls, errorCode, noLog) {
            // Required since onFail() will have its own 'this'
            var self = this;
            var httpsOnly = typeof secure !== 'undefined'? secure : false;
            var httpRequester = new videoplaza.HTTPRequester(httpsOnly);

            for(var i = 0; i < urls.length; i++) {
                var urlObject = urls[i];
                if(urlObject) {
                    var onFail = getUrlFailureCallback(urlObject, noLog).bind(self);
                    
                    // Replace error code macro
                    var replacedMacrosUrl = urlObject.url.replace(errorMacroRegex, encodeURIComponent(errorCode));

                    // Replace pulse error code macro
                    replacedMacrosUrl = replacedMacrosUrl.replace(pulseErrorMacroRegex, encodeURIComponent(errorCode));

                    // Replace cachebusting macro
                    replacedMacrosUrl = replacedMacrosUrl.replace(cachebustingMacroRegex, Math.floor(Math.random()*10000000000000000));

                    // Go
                    httpRequester.imgRequest(replacedMacrosUrl, onFail);
                }
            }
        }

        // Tracks quartile events automatically from the starting index
        function trackQuartileEvents(startIndex, obj, errorCode) {
            for(var i = startIndex; i < quartileEvents.length; ++i) {
                trackVastEvent.apply(this, [ obj, quartileEvents[i], errorCode, true ]);
            }
        }

        // Does not throw new error on already tracked event if 'noThrow' is true
        // (for automatic quartile tracking)
        function trackVastEvent(obj, event, errorCode, noThrow) {
            var originalObject = obj;
            var sessionSecure = getSessionSecureFromTrackable(obj);


            // Special case: if we're tracking error and the user passed
            // a *Creative, remember that it's a creative but track on the parentAd
            // (for accurate logging purposes)
            if(event === 'error' && (obj instanceof videoplaza.adresponse.LinearCreative || obj instanceof videoplaza.adresponse.NonLinearCreative)) {
                obj = obj.parentAd;
            }


            var keys = Object.keys(obj.trackingEvents);
            var tracked = false;

            for(var i=0; i<keys.length; i++) {
                if(keys[i].toLowerCase() === event.toLowerCase()) {
                    if(!obj.trackingEvents[keys[i]].blocked) {

                        if(cappedEvents[event.toLowerCase()]) {
                            obj.trackingEvents[keys[i]].blocked = true;
                        }

                        trackURL.apply(this, [sessionSecure, obj.trackingEvents[keys[i]].urls, errorCode, noThrow ]);
                        tracked = true;
                    } else if(!noThrow) {
                        var logItem = new videoplaza.LogItem();
                                    
                        logItem.source = videoplaza.LogItem.SourceType.TRACKER;
                        logItem.event = videoplaza.LogItem.EventType.ILLEGAL_OPERATION;
                        logItem.message = "Can not track '" + event + "' more than once" + logMessageEnding(originalObject);

                        log(this, logItem);
                        throw new Error('Abort execution');
                    }
                }
            }

            if(!tracked && !noThrow) {
                var logItem = new videoplaza.LogItem();

                logItem.source = videoplaza.LogItem.SourceType.TRACKER;
                logItem.event = videoplaza.LogItem.EventType.WARNING;
                logItem.message = "Event '" + event + "' does not exist" + logMessageEnding(originalObject);

                log(this, logItem);
            }
        }

        /*
            Track 'progress' event with offset attribute argument
        */
        function trackVastProgress(obj, progressOffset) {
            var tracked = false;
            var trackingObject;
            var sessionSecure = false;

            if(obj.trackingEvents.hasOwnProperty('progress') && obj.trackingEvents.progress.hasOwnProperty(progressOffset))
            {
                trackingObject = obj.trackingEvents.progress[progressOffset];

                sessionSecure = getSessionSecureFromTrackable(obj);

                if(!trackingObject.blocked) {
                    trackingObject.blocked = true;
                    trackURL.apply(this, [sessionSecure, trackingObject.urls, 0 ]);
                    tracked = true;
                } else {
                    var logItem = new videoplaza.LogItem();

                    logItem.source = videoplaza.LogItem.SourceType.TRACKER;
                    logItem.event = videoplaza.LogItem.EventType.ILLEGAL_OPERATION;
                    logItem.message = "Can not track progress \'" + progressOffset +  "\' more than once" + logMessageEnding(obj);

                    log(this, logItem);
                    throw new Error('Abort execution');                    
                }
            }

            if(!tracked) {
                var logItem = new videoplaza.LogItem();
                                    
                logItem.source = videoplaza.LogItem.SourceType.TRACKER;
                logItem.event = videoplaza.LogItem.EventType.WARNING;
                logItem.message = "Event 'progress' does not exist or offset is invalid" + logMessageEnding(obj);

                log(this, logItem);
            }
        }

        function getSessionFromAd(ad){
            var session = null;

            try{
                //We can get back to the session object following the ad's family tree :)
                session = ad.parentSlot.parentInsertionPoint.parentSession;
            } catch (error){
                //The ad was probably created without using the SDK session request method
            }

            return session;
        }


        function getSessionSecureFromTrackable(obj){
            var sessionSecure = false;
            var adSession = null;

            if(obj instanceof videoplaza.adresponse.Ad) {
                adSession = getSessionFromAd(obj);
            }else if(obj instanceof  videoplaza.adresponse.LinearCreative ||
                obj instanceof  videoplaza.adresponse.NonLinearCreative){
                adSession = getSessionFromAd(obj.parentAd);
            }

            if(adSession){
                sessionSecure = adSession.secure;
            }

            return sessionSecure;
        }

        // Throw Error on fail
        function track(obj, event, errorCode, trackingParameter, noLog){
           var sessionSecure = getSessionSecureFromTrackable(obj);

            if(obj.hasOwnProperty("trackingEvents")){

                if(isInteractiveEvent(event)){ //Check is it one of interactive event.
                    // Pass noLog since we no longer catch error here
                    track.apply(this, [ obj, "interaction", undefined, undefined, true ]);
                }
                
                // Check if it is a standard VAST event
                if (isVASTEvent(event) || event === 'error') {
                    if(event.toLowerCase() === 'progress') {
                        trackVastProgress.apply(this, [ obj, trackingParameter ]);
                    } else {
                        trackVastEvent.apply(this, [ obj, event, errorCode ]);
                    }

                    // Automatic quartile tracking
                    var nextQuartileEventIndex;

                    switch(event.toLowerCase()) {
                        case 'complete':
                            nextQuartileEventIndex = 1; break;
                        case 'thirdquartile':
                            nextQuartileEventIndex = 2; break;
                        case 'midpoint':
                            nextQuartileEventIndex = 3; break;
                        case 'firstquartile':
                            nextQuartileEventIndex = 4; break;
                        default:
                            nextQuartileEventIndex = 999; break;
                    }

                    if(nextQuartileEventIndex < quartileEvents.length) {
                        trackQuartileEvents.apply(this, [ nextQuartileEventIndex, obj, errorCode ]);
                    }
                }else{ //For non standard Events
                    if(obj.trackingEvents.hasOwnProperty(event))
                    {
                        // Check if the event should be capped
                        if(cappedEvents[event]){
                            if(!obj.trackingEvents[event].blocked){

                                obj.trackingEvents[event].blocked = true;
                                trackURL.apply(this, [sessionSecure, obj.trackingEvents[event].urls, errorCode ]);
                            } else if(event !== 'interaction' && !noLog) {
                                var logItem = new videoplaza.LogItem();
                                    
                                logItem.source = videoplaza.LogItem.SourceType.TRACKER;
                                logItem.event = videoplaza.LogItem.EventType.ILLEGAL_OPERATION;
                                logItem.message = "Can not track '" + event + "' more than once" + logMessageEnding(obj);

                                log(this, logItem);
                                throw Error('Abort execution');
                            }
                        }else{
                            trackURL.apply(this, [sessionSecure, obj.trackingEvents[event].urls, errorCode ]);
                        }


                    } else {
                        if(!noLog) {
                            var logItem = new videoplaza.LogItem();
                                        
                            logItem.source = videoplaza.LogItem.SourceType.TRACKER;
                            logItem.event = videoplaza.LogItem.EventType.INVALID_ARGUMENT;
                            logItem.message = "Custom tracking event '" + event + "' does not exist" + logMessageEnding(obj);

                            log(this, logItem);
                            throw Error('Abort execution');
                        }
                    }
                }
            }else{
                var logItem = new videoplaza.LogItem();
                                    
                logItem.source = videoplaza.LogItem.SourceType.TRACKER;
                logItem.event = videoplaza.LogItem.EventType.INVALID_ARGUMENT;
                logItem.message = "Missing trackingEvents property. Can not track event '"+event+"'" + logMessageEnding(obj);

                log(this, logItem);
                throw Error('Abort execution');
            }
        }

        function toTimeInterval(timestamp) {
            var components = timestamp.split(':'),
                seconds = 0;


            if(components.length > 0) {
                for (var i = 0; i < components.length; i++) {
                    seconds += Number(components[components.length - i - 1] * (i ? Math.pow(60, i) : 1));
                }                
            }

            return seconds;
        }

        /**
         * Track that ad playback has progressed to a given point.
         * @param {number} progressAmount The progress, specified in seconds.
         * @param {videoplaza.adresponse.LinearCreative} creative The linear creative for which to track progress.
         *
         * @method trackProgress
         * @memberOf videoplaza.tracking.Tracker
         * @instance
         */
        Tracker.prototype.trackProgress = function(creative, progressAmount) {
            if(!(creative instanceof videoplaza.adresponse.LinearCreative)) {
                var logItem = new videoplaza.LogItem();

                logItem.source = videoplaza.LogItem.SourceType.TRACKER;
                logItem.event = videoplaza.LogItem.EventType.INVALID_ARGUMENT;
                logItem.message = "Progress can only be tracked on LinearCreative objects.";

                log(this, logItem);
                return;                
            }

            if(!creative.trackingEvents.progress) {
                return;
            }

            var offsetsToTrack = [];
            var offsetInSeconds;
            for(var offset in creative.trackingEvents.progress) {
                offsetInSeconds = null;

                if(offset.indexOf("%") > -1 && creative.duration > 0) {
                    var percentage = parseFloat(String(offset).substring(0, offset.indexOf("%")));

                    if(isNaN(percentage)) {
                        offsetInSeconds = null;
                    } else {
                        offsetInSeconds = creative.duration * (percentage / 100);
                    }
                }
                else {
                    offsetInSeconds = toTimeInterval(offset);
                }

                if(offsetInSeconds !== null && offsetInSeconds <= progressAmount) {
                    offsetsToTrack.push(offset);
                }
            }

            for(var i = 0; i < offsetsToTrack.length; ++i) {
                if(!creative.trackingEvents.progress[offsetsToTrack[i]].blocked) {
                    try {
                        trackVastProgress.call(this, creative, offsetsToTrack[i]);                        
                    } catch(e) {
                        // ignore
                    }
                }
            }
        }

        function isVASTEvent(event) {
            // Check Ad events
            for(var key in videoplaza.tracking.Tracker.AdEventType) {
                if(videoplaza.tracking.Tracker.AdEventType[key].toLowerCase() === event.toLowerCase()){
                    return true;
                }
            }

            // Check Creative events
            for(var key in videoplaza.tracking.Tracker.CreativeEventType) {
                if(videoplaza.tracking.Tracker.CreativeEventType[key].toLowerCase() === event.toLowerCase()){
                    return true;
                }
            }

            return false;
        }

        function isInteractiveEvent(event){
            for(var key in interactiveEvent) {
                if(interactiveEvent[key].toLowerCase() === event.toLowerCase()){
                    return true;
                }
            }
            return false;
        }

        function trackSlotStart(ad){
            var sessionSecure = getSessionSecureFromTrackable(ad);

            if(ad.hasOwnProperty("parentSlot") &&
                    ad.parentSlot instanceof videoplaza.adresponse.Slot &&
                    ad.parentSlot.hasOwnProperty("trackingEvents") &&
                    ad.parentSlot.trackingEvents.hasOwnProperty("slotStart") &&
                    !ad.parentSlot.trackingEvents["slotStart"].blocked) {
                ad.parentSlot.trackingEvents["slotStart"].blocked = true;
                trackURL.apply(this, [sessionSecure, ad.parentSlot.trackingEvents["slotStart"].urls ]);
            }
        }

        function trackError(obj, error, errorCode) {
            var trackable = obj;
            var hasParent = false;
            if(obj instanceof videoplaza.adresponse.LinearCreative || obj instanceof videoplaza.adresponse.NonLinearCreative) {
                hasParent = true;
                trackable = obj.parentAd;
            }

            if(!errorCode){
                if(Tracker.resolveErrorCode(new videoplaza.adresponse.Ad(), error) ||
                        Tracker.resolveErrorCode(new videoplaza.adresponse.LinearCreative(), error) ||
                        Tracker.resolveErrorCode(new videoplaza.adresponse.NonLinearCreative(), error)) {
                    var logItem = new videoplaza.LogItem();

                    logItem.source = videoplaza.LogItem.SourceType.TRACKER;
                    logItem.event = videoplaza.LogItem.EventType.INVALID_ARGUMENT;
                    logItem.message = "Error type not supported for " + className(obj) + ".";

                    log(this, logItem);
                } else {
                    var logItem = new videoplaza.LogItem();

                    logItem.source = videoplaza.LogItem.SourceType.TRACKER;
                    logItem.event = videoplaza.LogItem.EventType.INVALID_ARGUMENT;
                    logItem.message = "Error type not supported.";

                    log(this, logItem);
                }

                return;
            }

            if(hasTrackedEvent('error', trackable) === true) {
                var logItem = new videoplaza.LogItem();

                logItem.source = videoplaza.LogItem.SourceType.TRACKER;
                logItem.event = videoplaza.LogItem.EventType.ILLEGAL_OPERATION;
                logItem.message = "Can not track 'error' more than once" + logMessageEnding(obj);
                if(hasParent) {
                    logItem.message = logItem.message.substring(0, logItem.message.length - 1) +  "'s parent ad.";
                }

                log(this, logItem);
            } else if(hasTrackedEvent('impression', trackable) === true) {
                var logItem = new videoplaza.LogItem();

                logItem.source = videoplaza.LogItem.SourceType.TRACKER;
                logItem.event = videoplaza.LogItem.EventType.ILLEGAL_OPERATION;
                logItem.message = "Can't track error since 'impression' has already been tracked for this item.";

                log(this, logItem);
            } else {
                trackSlotStart.apply(this, [ trackable ]);
                track.apply(this, [ obj, "error", errorCode ]);
                blockAllTracking(trackable);
            }

        }

        Tracker.resolveErrorCode = function(trackable, error)
        {
            var errorCode;

            if(trackable instanceof videoplaza.adresponse.Ad) {
                switch(error)
                {
                    case videoplaza.tracking.Tracker.AdError.TYPE_NOT_SUPPORTED:
                        errorCode = errorCodes['adTypeNotSupportedError'];
                        break;

                    case videoplaza.tracking.Tracker.AdError.NO_AD:
                        errorCode = errorCodes['noVASTResponseError'];
                        break;

                    case videoplaza.tracking.Tracker.AdError.GENERAL_ERROR:
                        errorCode = errorCodes['generalLinearError'];
                        break;
                }
            } else if (trackable instanceof videoplaza.adresponse.LinearCreative) {
                switch(error) {
                    case videoplaza.tracking.Tracker.CreativeError.MEDIA_FILE_NOT_FOUND:
                        errorCode = errorCodes['linearMediaFileNotFoundError'];
                        break;
                    case videoplaza.tracking.Tracker.CreativeError.MEDIA_FILE_TIMEOUT: 
                        errorCode = errorCodes['mediaFileTimeoutError'];
                        break;
                    case videoplaza.tracking.Tracker.CreativeError.NO_SUPPORTED_MEDIA_FILE_FOUND:
                        errorCode = errorCodes['noSupportedMediaFileFoundError'];
                        break;
                    case videoplaza.tracking.Tracker.CreativeError.MEDIA_FILE_DISPLAY_ERROR:
                        errorCode = errorCodes['mediaFileDisplayError'];
                        break;
                }
            } else if(trackable instanceof videoplaza.adresponse.NonLinearCreative) {
                switch(error) {
                    case videoplaza.tracking.Tracker.CreativeError.MEDIA_FILE_NOT_FOUND:
                        errorCode = errorCodes['nonlinearMediaFileNotFoundError'];
                        break;
                    case videoplaza.tracking.Tracker.CreativeError.MEDIA_FILE_TIMEOUT: 
                        errorCode = errorCodes['mediaFileTimeoutError'];
                        break;
                    case videoplaza.tracking.Tracker.CreativeError.NO_SUPPORTED_MEDIA_FILE_FOUND:
                        errorCode = errorCodes['noSupportedNonLinearResourceFoundError'];
                        break;
                    case videoplaza.tracking.Tracker.CreativeError.MEDIA_FILE_DISPLAY_ERROR:
                        errorCode = errorCodes['mediaFileDisplayError'];
                        break;
                }
            }

            return errorCode;
        };

        function hasTrackedEvent(event, ad) {
            return (ad &&
                ad.hasOwnProperty("trackingEvents") &&
                ad.trackingEvents.hasOwnProperty(event) &&
                ad.trackingEvents[event].hasOwnProperty("blocked") &&
                ad.trackingEvents[event].blocked === true);
        }

        /*
            Log 'logItem' on Tracker instance 'tracker'
        */
        function log(tracker, logItem) {
            for(var i = 0; i < tracker._logCallbacks.length; ++i) {
                tracker._logCallbacks[i](logItem);
            }
        }

        function className(item) {
            if(item instanceof videoplaza.adresponse.Ad) {
                return 'Ad';
            } else if(item instanceof videoplaza.adresponse.LinearCreative) {
                return 'LinearCreative';
            } else if(item instanceof videoplaza.adresponse.NonLinearCreative) {
                return 'NonLinearCreative';
            } else if(item instanceof videoplaza.adresponse.Companion) {
                return 'Companion';
            }
            return '';
        }

        /*
            Determine what message ending to append to mimic earlier log style
        */
        function logMessageEnding(item) {
            if(item instanceof videoplaza.adresponse.Ad) {
                return ' on the passed Ad Object.';
            } else if(item instanceof videoplaza.adresponse.LinearCreative) {
                return ' on the passed LinearCreative Object.';
            } else if(item instanceof videoplaza.adresponse.NonLinearCreative) {
                return ' on the passed NonLinearCreative Object.';
            } else if(item instanceof videoplaza.adresponse.Companion) {
                return ' on the passed Companion Object.';
            }

            return '';
        }

        /*
            timeSpent tracking functionality
        */

        /**
         * Track the time in seconds that a user spent watching a creative.
         * @param {number} timeSpentInSeconds The time, specified in seconds.
         * @param {videoplaza.adresponse.LinearCreative|videoplaza.adresponse.NonLinearCreative} creative The creative for which to track the time spent.
         *
         * @method trackTimeSpent
         * @memberOf videoplaza.tracking.Tracker
         * @instance
         */
        Tracker.prototype.trackTimeSpent = function(timeSpentInSeconds, creative) {
            if(!(creative instanceof videoplaza.adresponse.LinearCreative || creative instanceof videoplaza.adresponse.NonLinearCreative)) {
                var logItem = new videoplaza.LogItem();

                logItem.source = videoplaza.LogItem.SourceType.TRACKER;
                logItem.event = videoplaza.LogItem.EventType.INVALID_ARGUMENT;
                logItem.message = "'timeSpent' can only be tracked on LinearCreative and NonLinearCreative objects.";

                log(this, logItem);
                return;                
            }

            if(hasTrackedEvent('error', creative) === true) {
                var logItem = new videoplaza.LogItem();

                logItem.source = videoplaza.LogItem.SourceType.TRACKER;
                logItem.event = videoplaza.LogItem.EventType.ILLEGAL_OPERATION;
                logItem.message = "Can not track any more events after reporting error on the passed creative.";

                log(this, logItem);
                return;
            }

            if(!creative.trackingEvents.hasOwnProperty('timeSpent')) {
                var logItem = new videoplaza.LogItem();

                logItem.source = videoplaza.LogItem.SourceType.TRACKER;
                logItem.event = videoplaza.LogItem.EventType.INVALID_ARGUMENT;
                logItem.message = "Event 'timeSpent' does not exist on the passed object.";

                log(this, logItem);
                return;
            }

            if(isNaN(timeSpentInSeconds) || !isFinite(timeSpentInSeconds) || timeSpentInSeconds < 0) {
                var logItem = new videoplaza.LogItem();

                logItem.source = videoplaza.LogItem.SourceType.TRACKER;
                logItem.event = videoplaza.LogItem.EventType.INVALID_ARGUMENT;
                logItem.message = "'timeSpent' must be tracked with a positive number.";

                log(this, logItem);
                return;
            }

            var url = creative.trackingEvents.timeSpent.urls[0].url;
            var integerTimeSpent = Math.floor(timeSpentInSeconds);
            var valueUrl = url.replace(timeSpentMacroRegex, integerTimeSpent);

            valueUrl = valueUrl.replace(cachebustingMacroRegex, Math.floor(Math.random()*10000000000000000));

            var sessionSecure = getSessionSecureFromTrackable(creative);
            if(integerTimeSpent > 0){
                trackURL.call(this, sessionSecure, [ { url: valueUrl } ], undefined, true);
            }

        }

        return Tracker;
    })();

    /**
     * Session-level tracking events; passed to {@link videoplaza.tracking.Tracker.trackEvent} when tracking Session events.
     *
     * @enum {string}
     * @memberOf videoplaza.tracking.Tracker
     */
    videoplaza.tracking.Tracker.SessionEventType = {
        /** Indicates that the video content has started playback. */
        CONTENT_START: 'contentStart'
    };

    /**
     * Ad-level tracking events; passed to {@link videoplaza.tracking.Tracker.trackEvent} when tracking Ad events.
     *
     * @enum {string}
     * @memberOf videoplaza.tracking.Tracker
     */
    videoplaza.tracking.Tracker.AdEventType = {
        /** Impression */
        IMPRESSION: 'impression'
    };

    /**
     * Creative-level tracking events; passed to {@link videoplaza.tracking.Tracker.trackEvent} when tracking LinearCreative or NonLinearCreative events.
     *
     * @enum {string}
     * @memberOf videoplaza.tracking.Tracker
     */
    videoplaza.tracking.Tracker.CreativeEventType = {
            CREATIVE_VIEW: 'creativeview',
            /** Indicates that a creative has begun playing */
            START: 'start',
            /** Indicates that a creative has played for at least 25% of its duration */
            FIRST_QUARTILE: 'firstquartile',
            /** Indicates that a creative has played for at least 50% of its duration */
            MIDPOINT: 'midpoint',
            /** Indicates that a creative has played for at least 75% of its duration */
            THIRD_QUARTILE: 'thirdquartile',
            /** Indicates that a creative has played until completion */
            COMPLETE: 'complete',
            /** Indicates that a creative has played for a certain duration of time, determined by the trackingParameter argument to trackEvent() */
            PROGRESS: 'progress',

            /** Indicates that the user clicked a creative and loaded its associated landing page */
            CLICKTHROUGH: 'clickthrough',
            /** Indicates that the user muted a creative */
            MUTE: 'mute',
            /** Indicates that the user unmuted a creative */
            UNMUTE: 'unmute',
            /** Indicates that the user paused a creative */
            PAUSE: 'pause',
            /** Indicates that the user paused playback of a creative */
            REWIND: 'rewind',
            /** Indicates that the user resumed playback of a creative after having previously paused or stopped it */
            RESUME: 'resume',
            /** Indicates that the user entered fullscreen mode for a creative */
            FULLSCREEN: 'fullscreen',
            /** Indicates that the user exited fullscreen mode for a creative */
            EXIT_FULLSCREEN: 'exitfullscreen',
            /** Indicates that the user expanded a creative  */
            EXPAND: 'expand',
            /** Indicates that the user collapsed an expanded creative */
            COLLAPSE: 'collapse',
            /** Indicates that the user chose one ad out of several, or chose to move to an additional portion of a creative */
            ACCEPT_INVITATION: 'acceptinvitation',
            /** Indicates that the user closed the video player or player page */
            CLOSE: 'close',
            /** Indicates that the user chose to skip a creative */
            SKIP: 'skip'
    };

    /**
     * Ad errors. Passed to {@link videoplaza.tracking.Tracker.reportError} and {@link videoplaza.adrequest.AdRequester.requestPassback}
     * to describe an error that has occurred.
     *
     * @enum {string}
     * @memberOf videoplaza.tracking.Tracker
     */
    videoplaza.tracking.Tracker.AdError = {
        /** Indicates that an unsupported ad type was received */
        TYPE_NOT_SUPPORTED: 'adTypeNotSupportedError',
        /** Indicates that an ad response without an ad, or an inventory response, was received */
        NO_AD: 'noAdError',
        /** Indicates that an unspecified error occured with the ad or ad request */
        GENERAL_ERROR: 'generalAdError'
    };

    /**
     * Creative errors. Passed to {@link videoplaza.tracking.Tracker.reportError} and {@link videoplaza.adrequest.AdRequester.requestPassback}
     * to describe an error that has occurred.
     *
     * @enum {string}
     * @memberOf videoplaza.tracking.Tracker
     */
    videoplaza.tracking.Tracker.CreativeError = {
        /** Indicates that a request for the given media file or resource file resulted in a 404 response */
        MEDIA_FILE_NOT_FOUND: "mediaFileNotFoundError",
        /** Indicates that a request for the given media file or resource timed out before completing */
        MEDIA_FILE_TIMEOUT: "mediaFileTimeoutError",
        /** Indicates that no media file or resource supported by the player could be found */
        NO_SUPPORTED_MEDIA_FILE_FOUND: "noSupportedMediaFileFoundError",
        /** Indicates that the media file loaded could not be displayed */
        MEDIA_FILE_DISPLAY_ERROR: "mediaFileDisplayError"
    };

    videoplaza.tracking.Tracker.PulseError = {
        START_AD_TIMEOUT_ERROR: 1,
        PASSBACK_TIMEOUT_ERROR: 2,

        XML_PARSING_ERROR: 100,
        VAST_VALIDATION_ERROR: 101,
        VAST_RESPONSE_ERROR: 102,

        AD_TYPE_NOT_SUPPORTED_ERROR: 200,
        AD_LINEARITY_ERROR: 201,

        WRAPPER_ERROR: 300,
        WRAPPER_TIMEOUT_ERROR: 301,
        NO_VAST_RESPONSE_ERROR: 303,

        GENERAL_LINEAR_ERROR: 400,
        LINEAR_MEDIA_FILE_NOT_FOUND_ERROR: 401,
        MEDIA_FILE_TIMEOUT_ERROR: 402,
        NO_SUPPORTED_MEDIA_FILE_FOUND_ERROR: 403,
        MEDIA_FILE_DISPLAY_ERROR: 405,

        UNDEFINED_ERROR: 900
    };

})(videoplaza);
(function(videoplaza) {
    /**
     * Object passed to callbacks registered with {@link videoplaza.adrequest.AdRequester.addLogListener} and
     * {@link videoplaza.tracking.Tracker.addLogListener} when errors occur.
     * @constructor
     */
    videoplaza.LogItem = (function() {

        var LogItem = function (obj) {
            if(!(this instanceof videoplaza.LogItem))
            {
                return new LogItem();
            }

            /**
             * Describes the source of the LogItem. Depending on the source, not all fields might be set.
             * See {@link videoplaza.LogItem.SourceType} for which sources will set which fields.
             *
             * @type {videoplaza.LogItem.SourceType}
             *
             * @member source
             * @memberOf videoplaza.LogItem
             * @instance
             */
            this.source = '';

            /**
             * Describes what type of event has occurred.
             *
             * @type {videoplaza.LogItem.EventType}
             *
             * @member event
             * @memberOf videoplaza.LogItem
             * @instance
             */
            this.event = videoplaza.LogItem.EventType.GENERAL_ERROR;

            /**
             * If available, the relevant VAST error code for this log item.
             *
             * @type {videoplaza.LogItem.EventType}
             *
             * @member errorCode
             * @memberOf videoplaza.LogItem
             * @instance
             */
            this.errorCode = null;

            /**
             * Detailed information about the error.
             * @type {string}
             *
             * @member message
             * @memberOf videoplaza.LogItem
             * @instance
             */
            this.message = '';

            /**
             * The path of third party ads fetched until an error occurred; only assigned when type is AD_ERROR.
             * @type {array}
             *
             * @member thirdPartySourceURLs
             * @memberOf videoplaza.LogItem
             * @instance
             */
            this.thirdPartySourceURLs = [];
        };

        /**
         * @callback videoplaza.LogItem~logItemCallback
         * @param {videoplaza.LogItem} logItem Item containing logging information.
        **/
        return LogItem;
    })();

    /**
     * Indicates the origin of a LogItem.
     *
     * @enum {string}
     * @memberOf videoplaza.LogItem
     */
    videoplaza.LogItem.SourceType = {
        /** Indicates that the LogItem relates to an ad request. */
        AD: "ad",
        /** Indicates that the LogItem relates to a session request. */
        SESSION: "session",
        /** Indicates that the LogItem relates to a tracking request. */
        TRACKER: "tracker"        
    };

    /**
     * Indicates which type of event a LogItem instance relates to.
     *
     * @enum {string}
     * @memberOf videoplaza.LogItem
     */
    videoplaza.LogItem.EventType = {
        /** Blank or inventory ad response received. Only dispatched during ad requests. */
        NO_AD_RESPONSE: 'noAd',

        /** Unaccepted or missing arguments. Only dispatched during session and tracker requests. */
        INVALID_ARGUMENT: 'invalidArgument',
        /** A request received an empty or malformed response. Potentially dispatched during all types of requests. */
        INVALID_RESPONSE: 'invalidResponse',

        /** Error with no dedicated event type. Potentially dispatched during all types of requests. */
        GENERAL_ERROR: 'generalError',
        /** HTTP request failed. Potentially dispatched during all types of requests. */
        REQUEST_FAILED: 'requestFailed',
        /** HTTP request timed out. Potentially dispatched during all types of requests. */
        REQUEST_TIMEOUT: 'requestTimeout',
        /** SDK user canceled request. Only dispatched during ad requests. */
        REQUEST_CANCELED: 'requestCanceled',

        /** Non-fatal warning message. Potentially dispatched during all types of requests. */
        WARNING: 'warning',
        /** The user tried to perform an operation not allowed in the current state. Only dispatched during tracker requests. */
        ILLEGAL_OPERATION: 'illegalOperation'
    };

})(videoplaza);
(function(videoplaza) {
    videoplaza.HTML5HTTPRequester = (function() {


        var HTTPRequester = function (options) {
            if(!(this instanceof videoplaza.HTML5HTTPRequester)){
                return new HTTPRequester(options);
            }
            
            options = options || { };
            this._withoutCredentials = options.withoutCredentials || false;
        };



        HTTPRequester.prototype.request = function(uri, onSuccess, onError, timeout) {
            var xhr,
                method = 'GET', // TODO: Refactor this variable into a parameter so this can be used by the bucket.
                isRequestCancelled;

            timeout = timeout || 12000;

            if (!onSuccess) {
                onSuccess = function() {}; // TODO: Clean up!!!
            }

            if (!onError) {
                onError = function() {};  // TODO: Clean up!!!
            }


            if (window.XMLHttpRequest) {
                xhr = new window.XMLHttpRequest();

                if ('withCredentials' in xhr) {
                    if(this._withoutCredentials !== true) {                    
                        try {
                            xhr.withCredentials = true;
                        } catch (e) {
                            //means we can't modify withCredentials, so we use fallback of storing pid in localstorage
                            //instead of cookies.
                        }
                    }

                    try {
                        xhr.open(method, uri, true);
                        xhr.timeout = timeout;
                        isRequestCancelled = false;
                    } catch (e) {
                        onError(videoplaza.httpErrorCodeTranslation[0]);
                        return;
                    }

                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === 4) {
                            if (xhr.status === 200) {
                                onSuccess(xhr.responseText);
                            } else {
                                if (!isRequestCancelled) {
                                    onError(videoplaza.httpErrorCodeTranslation[xhr.status] || 'unknownError');
                                }
                            }
                        }
                    };

                    try{
                        xhr.send();
                    } catch (e){
                        onError('unknownError');
                    }


                } else if (window.XDomainRequest) {  // IE CORS for IE9
                    xhr = new window.XDomainRequest();

                    xhr.onload = function() {
                        onSuccess(xhr.responseText);
                    };

                    xhr.onerror = function() {
                        onError(videoplaza.httpErrorCodeTranslation.ieError || 'unknownError');
                    };

                    //we need to set all handler, if not the call be aborted. That is why we set a empty function.
                    xhr.onprogress = function() {};

                    xhr.ontimeout = function() {};

                    try {
                        xhr.open(method, uri);
                        xhr.timeout = timeout; // in milliseconds
                        xhr.send();
                    } catch(e) {
                        //we remove line endings
                        onError(videoplaza.httpErrorCodeTranslation.ieError || 'unknownError');
                    }
                } else {
                    onError('corsNotSupportedInBrowser');
                }
            }

            var cancel = function(cancelMessage) {
                isRequestCancelled = true;
                xhr.abort();
                xhr = null;
                onSuccess = function(){};
                onError( cancelMessage );
            };

            return cancel;
        };

        HTTPRequester.prototype.postRequest = function(uri, data, onSuccess, onError, timeout) {
            var xhr,
                method = 'POST',
                isRequestCancelled;

            timeout = timeout || 12000;

            if (!onSuccess) {
                onSuccess = function() {};
            }

            if (!onError) {
                onError = function() {};
            }


            var formData = [ ];

            for(var key in data) {
                formData.push(key + '=' + data[key]);
            }

            formData = formData.join('&');

            if (window.XMLHttpRequest) {
                xhr = new window.XMLHttpRequest();

                if ('withCredentials' in xhr) {
                    try {
                        xhr.withCredentials = true;
                    } catch (e) { }

                    try {
                        xhr.open(method, uri, true);
                        xhr.timeout = timeout;
                        isRequestCancelled = false;
                    } catch (e) {
                        onError(videoplaza.httpErrorCodeTranslation[0]);
                        return;
                    }

                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === 4) {
                            if (xhr.status === 200) {
                                onSuccess(xhr.responseText);
                            } else {
                                if (!isRequestCancelled) {
                                    onError(videoplaza.httpErrorCodeTranslation[xhr.status] || 'unknownError');
                                }
                            }
                        }
                    };

                    try{
                        xhr.send(formData);
                    } catch (e){
                        onError('unknownError');
                    }

                } else if (window.XDomainRequest) {  // IE CORS for IE9
                    xhr = new window.XDomainRequest();

                    xhr.onload = function() {
                        onSuccess(xhr.responseText);
                    };

                    xhr.onerror = function() {
                        onError(videoplaza.httpErrorCodeTranslation.ieError || 'unknownError');
                    };

                    // we need to set all handler, if not the call be aborted. That is why we set a empty function.
                    xhr.onprogress = function() { };
                    xhr.ontimeout = function() { };

                    try {
                        xhr.open(method, uri);
                        xhr.timeout = timeout;

                        xhr.send(formData);
                    } catch(e) {
                        //we remove line endings
                        onError(videoplaza.httpErrorCodeTranslation.ieError || 'unknownError');
                    }
                } else {
                    onError('corsNotSupportedInBrowser');
                }
            }

            var cancel = function(cancelMessage) {
                isRequestCancelled = true;
                xhr.abort();
                xhr = null;
                onSuccess = function() { };
                onError(cancelMessage);
            };

            return cancel;
        };



        return HTTPRequester;
    }());
})(videoplaza);
/**
 * Created by apesant on 07/04/16.
 */
(function(videoplaza, OO){
    videoplaza.HTTPRequester = (function(){

        videoplaza.httpErrorCodeTranslation = {
            503: 'Service unavailable',
            500: 'Internal server error',
            404: 'The requested resource could not be found',
            400: 'Bad request',
            0: 'Request could not be sent to the server',
            ieError: 'Request failed',
            secureError :'The request could not be sent as the SDK has been configured to only allow requests over HTTPS'
        };

        var imgRequests = [ ];
        function deleteImgRequest(imgRequest) {
            for(var i = 0; i < imgRequests.length; ++i) {
                if(imgRequests[i] === imgRequest) {
                    imgRequests.splice(i, 1);
                    return;
                }
            }
        }

        function isFlashAvailable(){
            if(OO && OO.Pulse){
                return OO.Pulse.Utils.isFlashAvailable();
            } else {
                return false;
            }
        }

        function requesterIsOverridden(functionName){
            return OO && OO.Pulse && OO.Pulse.HTTPRequesterOverride && OO.Pulse.HTTPRequesterOverride.hasOwnProperty(functionName);
        }

        //Helper to check when a request should be allowed or not
        var _isNotAllowed = function(uri){
            return (this._secure && (uri.toLowerCase().indexOf("http:") === 0));
        };

        var HTTPRequester = function(enableSecure, withoutCredentials) {
            if(!(this instanceof videoplaza.HTTPRequester)){
                return new HTTPRequester(enableSecure);
            }

            this._secure = typeof enableSecure !== 'undefined' ? enableSecure : false;
            this._HTMLrequester = new videoplaza.HTML5HTTPRequester({ withoutCredentials: withoutCredentials });

            if (isFlashAvailable()) {
                this._flashRequester = new OO.Pulse.Flash.FlashHTTPRequester();
            }
        };

        HTTPRequester.prototype.request = function(uri, onSuccess, onError, timeout) {
            var htmlCancel, flashCancel;

            //Before doing anything, we check if we are using a non secure URL
            if (_isNotAllowed.call(this, uri)) {
                onError(videoplaza.httpErrorCodeTranslation.secureError || 'unknownError');
                return;
            }

            if(requesterIsOverridden("request")) {
                htmlCancel = OO.Pulse.HTTPRequesterOverride.request(uri, onSuccess, onError, timeout);
            } else {
                htmlCancel = this._HTMLrequester.request(uri, onSuccess,
                    function (error) {
                        if (!isFlashAvailable()) {
                            // Before we fail check if the request method has been overridden and in that case try the request again.
                            if(requesterIsOverridden("request")){
                                OO.Pulse.HTTPRequesterOverride.request(uri, onSuccess, onError, timeout);
                            } else {
                                onError(error);
                            }
                        }
                        else if (error === "corsNotSupportedInBrowser" || error === videoplaza.httpErrorCodeTranslation[0]) {
                            if(error === "corsNotSupportedInBrowser") {
                                error = 'CORS does not appear to be correctly configured on the server.'
                            }
                            try {
                                flashCancel = this._flashRequester.request(uri, onSuccess, onError, timeout);
                            } catch (e) {
                                onError(error);
                            }
                        } else {
                            onError(error);
                        }
                    }.bind(this),
                    timeout);
            }

            var cancel = function(message){
                if(flashCancel){
                    flashCancel(message);
                } else {
                    htmlCancel(message);
                }
            };

            return cancel;
        };

        HTTPRequester.prototype.postRequest = function(uri, data, onSuccess, onError, timeout) {
            var htmlCancel, flashCancel;

            //Before doing anything, we check if we are using a non secure URL
            if(_isNotAllowed.call(this,uri)){
                onError(videoplaza.httpErrorCodeTranslation.secureError || 'unknownError');
                return;
            }

            if(requesterIsOverridden("postRequest")) {

                htmlCancel = OO.Pulse.HTTPRequesterOverride.postRequest(uri, onSuccess, onError, timeout);

            } else {

                htmlCancel = this._HTMLrequester.request(uri, onSuccess,
                    function(error){
                        if(!isFlashAvailable()) {
                            onError(error);
                        }
                        else if (error === "corsNotSupportedInBrowser" || error === videoplaza.httpErrorCodeTranslation[0]) {
                            if(error === "corsNotSupportedInBrowser") {
                                error = 'CORS does not appear to be correctly configured on the server.'
                            }
                            try {
                                flashCancel = this._flashRequester.postRequest(uri,data, onSuccess, onError, timeout);
                            } catch (e) {
                                onError(error);
                            }
                        } else {
                            onError(error);
                        }
                    }.bind(this),
                    timeout);
            }


            var cancel = function(message){

                if(flashCancel){
                    flashCancel(message);
                } else {
                    htmlCancel(message);
                }
            };

            return cancel;
        };

        // Request a URL by creating an img tag with the given url as its src attribute
        // onError is only used for logging when HTTP URLs are requested from an HTTPS session
        HTTPRequester.prototype.imgRequest = function(url, onError) {
            // Before doing anything, we check if we are using a non-secure URL
            if(_isNotAllowed.call(this, url)) {
                onError(videoplaza.httpErrorCodeTranslation.secureError || 'unknownError');
                return;
            }

            if(requesterIsOverridden("imgRequest")){

                OO.Pulse.HTTPRequesterOverride.imgRequest(url, onError);

            } else {
                var img = document.createElement('img');
                imgRequests.push(img);
                var deleteFunction = function () {
                    deleteImgRequest(img);
                };
                img.onload = deleteFunction;
                img.onerror = deleteFunction;
                img.setAttribute('src', url);
            }
        };

        return HTTPRequester;
    }());
})(videoplaza, OO);


    window.videoplaza = videoplaza;
    window.videoplaza.buildDate = "20170831";
    window.videoplaza.versionNumber = "2.0.17.17.0";
    window.OO = OO;
    //Fire a DOM event to say the SDK is ready
    var readyEvent = document.createEvent('Event');
    readyEvent.initEvent('pulseready', true, true);
    document.dispatchEvent(readyEvent);
})(window);

//# sourceURL=Pulse_SDK.js